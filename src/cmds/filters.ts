import { musicService } from "../services/music.js";
import type { CommandContext } from "./Command.js";

export function guildOnly(ctx: CommandContext) {
  if (!ctx.guildId) {
    ctx.ephemeralReply("You must be in a server to use this command");
    return false;
  }

  return true;
}

export function voiceChannelOnly(ctx: CommandContext) {
  if (!ctx.member.voice.channelId) {
    ctx.ephemeralReply("You must be in a voice channel to use this command");
    return false;
  }

  return true;
}

export function nonEmptyMusicQueue(ctx: CommandContext) {
  const queueSize = musicService.getQueue(ctx.guildId as string).length;

  if (queueSize === 0) {
    ctx.ephemeralReply("The queue is empty!");
    return false;
  }

  return true;
}

export function musicPlayingOnly(ctx: CommandContext) {
  const playing = musicService.getPlaying(ctx.guildId as string);

  if (!playing) {
    ctx.ephemeralReply("Nothing is playing!");
    return false;
  }

  return true;
}
