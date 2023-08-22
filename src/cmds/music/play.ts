import { URL } from "url";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../Command.js";
import { musicService } from "../../services/music.js";
import { guildOnly, voiceChannelOnly } from "../filters.js";
import { ALLOWED_HOSTS } from "../../config.js";

export default new Command({
  builder: new SlashCommandBuilder().setName("play").setDescription("Play a song"),

  args: (builder) =>
    builder.addStringOption((option) =>
      option.setName("url").setDescription("The URL of the song to play").setRequired(true)
    ),

  run: async (ctx) => {
    const vs = ctx.member.voice;

    const url = ctx.mustGetStringOption("url");

    if (!URL.canParse(url)) {
      ctx.ephemeralReply("Invalid URL");
      return;
    }

    let host = new URL(url).host;
    if (host.startsWith("www.")) {
      host = host.slice(4);
    }
    if (!ALLOWED_HOSTS.includes(host)) {
      ctx.ephemeralReply("Invalid URL");
      return;
    }

    ctx.deferEphemeralReply();

    const resource = await musicService.getAudioResource(url);
    const playedNow = musicService.play(vs, resource);

    ctx.reply("", {
      embeds: [
        new EmbedBuilder()
          .setTitle(playedNow ? "Now playing" : "Added to queue")
          .setDescription(`${resource!.details.channel?.name} - ${resource!.details.title}`),
      ],
    });
  },

  filters: [guildOnly, voiceChannelOnly],
});
