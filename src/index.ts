import { Client, IntentsBitField, Events, ChatInputCommandInteraction } from "discord.js";

import { processInteraction, reloadCommands } from "./cmds/index.js";
import { BOT_TOKEN } from "./config.js";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildIntegrations,
    IntentsBitField.Flags.GuildWebhooks,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildMessageTyping,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.DirectMessageTyping,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildScheduledEvents,
    IntentsBitField.Flags.AutoModerationConfiguration,
    IntentsBitField.Flags.AutoModerationExecution,
  ],
});

client.once(Events.ClientReady, () => {
  reloadCommands();

  console.log("Ready!");
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isCommand()) return;

  processInteraction(interaction as ChatInputCommandInteraction);
});

client.login(BOT_TOKEN);
