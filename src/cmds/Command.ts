import type {
  ChatInputCommandInteraction,
  GuildMember,
  InteractionResponse,
  BaseMessageOptions,
  SlashCommandBuilder,
} from "discord.js";

export type CommandFilter = (ctx: CommandContext) => boolean;

export interface CommandOptions {
  builder: SlashCommandBuilder;

  args?: (builder: SlashCommandBuilder) => any;

  run: (ctx: CommandContext) => Promise<void>;

  filters?: CommandFilter[];

  dev?: boolean;
}

export class CommandContext {
  public readonly interaction: ChatInputCommandInteraction;

  private deferred: boolean = false;

  public get guildId(): string | null {
    return this.interaction.guildId;
  }

  public get channelId(): string {
    return this.interaction.channelId;
  }

  public get member(): GuildMember {
    return this.interaction.member as GuildMember;
  }

  constructor(interaction: ChatInputCommandInteraction) {
    this.interaction = interaction;
  }

  public async reply(msg: string, opts?: Pick<BaseMessageOptions, "components" | "embeds">) {
    try {
      if (!this.deferred) {
        await this.interaction.reply({
          ...opts,
          content: msg,
        });
      } else {
        await this.interaction.followUp({
          ...opts,
          content: msg,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async ephemeralReply(
    msg: string,
    opts?: Pick<BaseMessageOptions, "components" | "embeds">
  ) {
    try {
      if (!this.deferred) {
        await this.interaction.reply({
          ...opts,
          content: msg,
          ephemeral: true,
        });
      } else {
        await this.interaction.followUp({
          ...opts,
          content: msg,
          ephemeral: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async deferReply() {
    try {
      this.deferred = true;
      await this.interaction.deferReply();
    } catch (e) {
      console.error(e);
    }
  }

  public async deferEphemeralReply() {
    try {
      this.deferred = true;
      await this.interaction.deferReply();
    } catch (e) {
      console.error(e);
    }
  }

  // Utils for basic options
  public getBooleanOption(name: string): boolean | null {
    return this.interaction.options.getBoolean(name);
  }

  public getStringOption(name: string): string | null {
    return this.interaction.options.getString(name);
  }

  public getIntegerOption(name: string): number | null {
    return this.interaction.options.getInteger(name);
  }

  public getNumberOption(name: string): number | null {
    return this.interaction.options.getNumber(name);
  }

  public mustGetBooleanOption(name: string): boolean {
    return this.interaction.options.getBoolean(name) as boolean;
  }

  public mustGetStringOption(name: string): string {
    return this.interaction.options.getString(name) as string;
  }

  public mustGetIntegerOption(name: string): number {
    return this.interaction.options.getInteger(name) as number;
  }

  public mustGetNumberOption(name: string): number {
    return this.interaction.options.getNumber(name) as number;
  }
}

export class Command {
  public readonly builder: SlashCommandBuilder;
  public readonly dev: boolean;

  public get name(): string {
    return this.builder.name;
  }

  public get desc(): string {
    return this.builder.description;
  }

  private readonly run: (ctx: CommandContext) => Promise<void>;
  private readonly filters: CommandFilter[];

  constructor(options: CommandOptions) {
    if (options.args) options.args(options.builder);

    this.builder = options.builder;
    this.dev = options.dev ?? false;
    this.run = options.run;
    this.filters = options.filters ?? [];
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    const ctx = new CommandContext(interaction);

    if (!this.filters.every((filter) => filter(ctx))) return;

    try {
      await this.run(ctx);
    } catch (e) {
      console.error(e);
      await ctx.ephemeralReply("An error occurred!");
    }
  }
}
