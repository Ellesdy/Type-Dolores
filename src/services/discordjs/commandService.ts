import { Client, Collection, CommandInteraction } from "discord.js";
import * as fs from "fs";
import path from "path";
import ConfigService from "../system/configService";
import ChannelService from "./channelService";

export class CommandService {
  private client: Client;
  private configService: ConfigService;
  private channelService: ChannelService;
  private commands: Collection<string, any>;

  constructor(
    client: Client,
    configService: ConfigService,
    channelService: ChannelService
  ) {
    this.client = client;
    this.configService = configService;
    this.channelService = channelService;

    this.commands = new Collection();
    this.loadCommands();
  }

  private loadCommands() {
    const commandsPath = path.join(__dirname, "../../commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const command = require(`../../commands${file}`);
      this.commands.set(command.data.name, command);
    }
  }

  public async registerCommands(): Promise<void> {
    try {
      const commandData = this.commands.map((cmd) => cmd.data.toJSON());
      await this.client.application?.commands.set(commandData);
      console.log("Commands registered successfully.");
    } catch (error) {
      console.error("Error registering commands:", error);
    }
  }

  public setupListeners(): void {
    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      const command = this.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(
          `Error executing command ${interaction.commandName}:`,
          error
        );
        await interaction.reply({
          content: "An error occurred while executing the command.",
          ephemeral: true,
        });
      }
    });
  }
}

export default CommandService;
