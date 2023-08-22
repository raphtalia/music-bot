import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../Command.js";
import { musicService } from "../../services/music.js";
import { guildOnly, voiceChannelOnly, musicPlayingOnly } from "../filters.js";

export default new Command({
  builder: new SlashCommandBuilder().setName("playing").setDescription("Show the current song"),

  run: async (ctx) => {
    const playing = musicService.getPlaying(ctx.guildId as string);

    ctx.ephemeralReply("", {
      embeds: [
        new EmbedBuilder().addFields([
          {
            name: "Now Playing",
            value: `${playing!.details.channel?.name} - ${playing!.details.title}`,
          },
        ]),
      ],
    });
  },

  filters: [guildOnly, voiceChannelOnly, musicPlayingOnly],
});
