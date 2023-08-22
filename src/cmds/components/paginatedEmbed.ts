import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { APIEmbed } from "discord.js";
import type { CommandContext } from "../Command";

export function paginatedEmbed(
  ctx: CommandContext,
  callbackfn: (index: number) => APIEmbed,
  ephemeral: boolean = false
) {
  ctx.interaction.reply({
    ephemeral,
    embeds: [callbackfn(0)],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("back")
          .setEmoji("arrow_left")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("next")
          .setEmoji("arrow_right")
          .setStyle(ButtonStyle.Primary)
      ),
    ],
  });
}
