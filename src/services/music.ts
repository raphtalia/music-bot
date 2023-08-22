import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} from "@discordjs/voice";
import { video_basic_info, stream } from "play-dl";

import type { VoiceState } from "discord.js";
import type { AudioPlayer, AudioResource, VoiceConnection } from "@discordjs/voice";
import type { YouTubeVideo } from "play-dl";

export interface DetailedMusicResource {
  details: YouTubeVideo;
  resource: AudioResource;
}

interface GuildMusicServiceState {
  voiceState: VoiceState;
  player: AudioPlayer;
  connection: VoiceConnection;
  queue: DetailedMusicResource[];
  playing: DetailedMusicResource;
}

export interface PlayingStatus extends DetailedMusicResource {
  playbackDuration: number;
  totalDuration: number;
}

class MusicService {
  private static guildStates = new Map<string, GuildMusicServiceState>();

  private getState(guildId: string) {
    return MusicService.guildStates.get(guildId);
  }

  private forcePlay(state: GuildMusicServiceState, detailedResource: DetailedMusicResource) {
    state.playing = detailedResource;
    state.player.play(detailedResource.resource);
  }

  public async getAudioResource(url: string) {
    const pdlStream = await stream(url);

    return {
      details: (await video_basic_info(url)).video_details,
      resource: createAudioResource(pdlStream.stream, {
        inputType: pdlStream.type,
      }),
    };
  }

  public getQueue(guildId: string) {
    return this.getState(guildId)?.queue ?? [];
  }

  public getPlaying(guildId: string): PlayingStatus | undefined {
    const state = this.getState(guildId);
    if (!state) {
      return;
    }

    return {
      ...state.playing,
      // Seconds
      playbackDuration: state.playing.resource.playbackDuration / 1000,
      totalDuration: state.playing.details.durationInSec,
    };
  }

  // Returns true if song is played immediately, and false if it was added to queue
  public play(vs: VoiceState, detailedResource: DetailedMusicResource): boolean {
    const guildId = vs.guild.id;

    const state = this.getState(guildId);
    if (state) {
      state.queue.push(detailedResource);
      return false;
    }

    const connection = joinVoiceChannel({
      channelId: vs.channelId as string,
      guildId,
      adapterCreator: vs.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    connection.subscribe(player);

    player.on("stateChange", (oldState, newState) => {
      if (
        oldState.status === AudioPlayerStatus.Playing &&
        newState.status === AudioPlayerStatus.Idle
      ) {
        const state = this.getState(guildId);
        if (!state) {
          player.removeAllListeners();
          return;
        }

        const nextSong = state.queue.shift();
        if (!nextSong) {
          player.removeAllListeners();
          state.connection.disconnect();
          MusicService.guildStates.delete(guildId);
          return;
        }

        this.forcePlay(state, nextSong);
      }
    });

    player.play(detailedResource.resource);

    MusicService.guildStates.set(guildId, {
      voiceState: vs,
      player,
      connection,
      queue: [],
      playing: detailedResource,
    });

    return true;
  }

  public stop(guildId: string) {
    const state = this.getState(guildId);
    if (!state) {
      throw new Error("No guild state");
    }

    state.player.stop();
  }

  public remove(guildId: string, pos: number) {
    const state = this.getState(guildId);
    if (!state) {
      throw new Error("No guild state");
    }

    const queue = state.queue;
    if (pos < 0 || pos >= queue.length) {
      throw new Error("Invalid position");
    }

    queue.splice(pos, 1);
  }

  public pause(guildId: string) {
    const state = this.getState(guildId);
    if (!state) {
      throw new Error("No guild state");
    }

    state.player.pause();
  }

  public resume(guildId: string) {
    const state = this.getState(guildId);
    if (!state) {
      throw new Error("No guild state");
    }

    state.player.unpause();
  }

  public skip(guildId: string) {
    const state = this.getState(guildId);
    if (!state) {
      throw new Error("No guild state");
    }

    const queue = state.queue;
    if (queue.length === 0) {
      this.stop(guildId);
      return;
    }

    this.forcePlay(state, queue.shift()!);
  }

  public jump(guildId: string, pos: number) {
    const state = this.getState(guildId);
    if (!state) {
      throw new Error("No guild state");
    }

    const queue = state.queue;
    if (pos < 0 || pos >= queue.length) {
      throw new Error("Invalid position");
    }

    this.forcePlay(state, queue.splice(pos, 1)[0]);
  }

  public shuffle(guildId: string) {
    const state = this.getState(guildId);
    if (!state) {
      throw new Error("No guild state");
    }

    const queue = state.queue;
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }
}

export const musicService = new MusicService();
