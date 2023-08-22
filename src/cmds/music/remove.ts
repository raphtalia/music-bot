import { SlashCommandBuilder } from "discord.js";
import { Command } from "../Command.js";
import { musicService } from "../../services/music.js";
import { guildOnly, voiceChannelOnly, nonEmptyMusicQueue } from "../filters.js";

export default new Command({
  builder: new SlashCommandBuilder().setName("remove").setDescription("Remove a song in the queue"),

  args: (builder) =>
    builder.addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("Position of the song in the queue")
        .setMinValue(1)
        .setRequired(true)
    ),

  run: async (ctx) => {
    const pos = ctx.mustGetIntegerOption("position") - 1;
    const queueSize = musicService.getQueue(ctx.guildId as string).length;

    if (pos >= queueSize) {
      ctx.ephemeralReply("Position is out of range!");
      return;
    }

    musicService.remove(ctx.guildId as string, pos);

    ctx.ephemeralReply("Removed!");
  },

  filters: [guildOnly, voiceChannelOnly, nonEmptyMusicQueue],
});
