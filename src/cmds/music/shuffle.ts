import { SlashCommandBuilder } from "discord.js";
import { Command } from "../Command.js";
import { musicService } from "../../services/music.js";
import { guildOnly, voiceChannelOnly } from "../filters.js";

export default new Command({
  builder: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffle the queue"),

  run: async (ctx) => {
    musicService.shuffle(ctx.guildId as string);

    ctx.ephemeralReply("Shuffled!");
  },

  filters: [guildOnly, voiceChannelOnly],
});
