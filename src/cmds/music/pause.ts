import { SlashCommandBuilder } from "discord.js";
import { Command } from "../Command.js";
import { musicService } from "../../services/music.js";
import { guildOnly, voiceChannelOnly, musicPlayingOnly } from "../filters.js";

export default new Command({
  builder: new SlashCommandBuilder().setName("pause").setDescription("Pause the current song"),

  run: async (ctx) => {
    musicService.pause(ctx.guildId as string);

    ctx.ephemeralReply("Paused!");
  },

  filters: [guildOnly, voiceChannelOnly, musicPlayingOnly],
});
