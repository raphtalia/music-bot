import { SlashCommandBuilder } from "discord.js";
import { Command } from "../Command.js";
import { musicService } from "../../services/music.js";
import { guildOnly, voiceChannelOnly, musicPlayingOnly } from "../filters.js";

export default new Command({
  builder: new SlashCommandBuilder().setName("resume").setDescription("Resume the current song"),

  run: async (ctx) => {
    musicService.resume(ctx.guildId as string);

    ctx.ephemeralReply("Resumed!");
  },

  filters: [guildOnly, voiceChannelOnly, musicPlayingOnly],
});
