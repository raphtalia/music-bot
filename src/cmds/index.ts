import { ChatInputCommandInteraction, REST, Routes, SlashCommandBuilder } from "discord.js";

import { BOT_ID, BOT_TOKEN, IS_DEV, DEV_SERVER_ID } from "../config.js";

import type { Command } from "./Command.js";

// Commands
import jump from "./music/jump.js";
import pause from "./music/pause.js";
import play from "./music/play.js";
import playing from "./music/playing.js";
import queue from "./music/queue.js";
import remove from "./music/remove.js";
import resume from "./music/resume.js";
import shuffle from "./music/shuffle.js";
import skip from "./music/skip.js";

const commands: { [name: string]: Command } = {
  jump,
  pause,
  play,
  playing,
  queue,
  remove,
  resume,
  shuffle,
  skip,
};
const rest = new REST().setToken(BOT_TOKEN);

function getCommands(): SlashCommandBuilder[] {
  return Object.values(commands).map((command) => command.builder);
}

async function reloadGlobalCommands() {
  await rest.put(Routes.applicationCommands(BOT_ID), { body: getCommands() });
}

async function reloadGuildCommands(guildIds: string[]) {
  await Promise.all(
    guildIds.map(async (guildId) =>
      rest.put(Routes.applicationGuildCommands(BOT_ID, guildId), { body: getCommands() })
    )
  );
}

export async function reloadCommands() {
  if (IS_DEV) {
    reloadGuildCommands([DEV_SERVER_ID]);
  } else {
    reloadGlobalCommands();
  }
}

export function processInteraction(interaction: ChatInputCommandInteraction) {
  const cmd = commands[interaction.commandName];

  if (!cmd) {
    interaction.reply({
      content: "Unknown or deprecated command",
      ephemeral: true,
    });
    return;
  }

  cmd.execute(interaction);
}
