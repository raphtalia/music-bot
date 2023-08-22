import { SlashCommandBuilder } from "discord.js";
import { Command } from "../Command.js";
import { guildOnly, voiceChannelOnly } from "../filters.js";
import { musicService } from "../../services/music.js";

export default new Command({
  builder: new SlashCommandBuilder().setName("skip").setDescription("Skip the current song"),

  run: async (ctx) => {
    musicService.skip(ctx.guildId as string);

    ctx.ephemeralReply("Skipped!");
  },

  filters: [guildOnly, voiceChannelOnly],
});
