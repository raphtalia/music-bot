import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../Command.js";
import { musicService } from "../../services/music.js";
import { guildOnly, voiceChannelOnly } from "../filters.js";

export default new Command({
  builder: new SlashCommandBuilder().setName("queue").setDescription("List the songs in the queue"),

  run: async (ctx) => {
    const guildId = ctx.guildId as string;
    const playing = musicService.getPlaying(guildId);
    const queue = musicService.getQueue(guildId);

    ctx.ephemeralReply("", {
      embeds: [
        new EmbedBuilder().addFields([
          {
            name: "Now Playing",
            value: `${playing!.details.channel?.name} - ${playing!.details.title}`,
          },
          {
            name: "Queue",
            value:
              queue.length > 0
                ? queue
                    .map(
                      ({ details }, i) => `${i + 1}. ${details.channel?.name} - ${details.title}`
                    )
                    .join("\n")
                : "empty",
          },
        ]),
      ],
    });
  },

  filters: [guildOnly, voiceChannelOnly],
});
