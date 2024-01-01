import { Client, CommandInteraction, Message } from "discord.js";

// Assuming these are types you have defined elsewhere
import ClientService from "../discordjs/clientService";
import CommandService from "../discordjs/commandService";
import ConversationHelperService from "../helpers/conversation.helper.service";
import ChatGPTService from "../features/chatGPTService";
import MessageService from "../system/messageService";
import CommandModel from "../../commands/command.model";
import AuthHelperService from "./auth.helper.service";
import MessageFilterHelperService from "./message-filter.helper.service";
import LoggerService from "../system/loggerService";

class LifecycleHelperService {
  private clientService: ClientService;
  private commandService: CommandService;
  private chatGPTService: ChatGPTService;
  private messageService: MessageService;

  constructor(
    clientService: ClientService,
    commandService: CommandService,
    chatGPTService: ChatGPTService,
    messageService: MessageService,
    private loggerService: LoggerService
  ) {
    this.clientService = clientService;
    this.commandService = commandService;
    this.chatGPTService = chatGPTService;
    this.messageService = messageService;
  }

  async setupListeners(): Promise<void> {
    this.clientService.Client.on("ready", async () => {
      const clientUser = this.clientService.Client.user;
      if (clientUser) {
        this.loggerService.logSystem(`Logged in as ${clientUser.tag}!`);
        await this.commandService.registerCommands();
      }
    });

    this.clientService.Client.on("messageCreate", async (message: Message) => {
      if (MessageFilterHelperService.isBotOrEveryone(message)) {
        return;
      }

      //? Would clientService.Client.user ever be undefined here?
      if (
        this.clientService.Client.user &&
        message.mentions.has(this.clientService.Client.user)
      ) {
        await message.channel.sendTyping();

        const userId = message.author.id;
        const content = message.content;

        const response = await this.chatGPTService.handleMessage(
          userId,
          content
        );

        if (Array.isArray(response) && response.length > 0) {
          // Handle the case where response is an array
          for (const res of response) {
            if (res.content && res.content.trim() !== "") {
              // Use res.content here
            }
          }
        } else if (typeof response === "string") {
          // Handle the case where response is a string
          await this.messageService.sendDiscordMessage(
            message.channel,
            response
          );
        }
      }
    });

    // Event listener for interactions
    this.clientService.Client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      // Find the command
      const command: any = this.commandService
        .getCommands()
        .find((cmd) => cmd.name === interaction.commandName);

      if (!command) return;

      try {
        // Execute the command
        command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      }
    });

    this.clientService.Client.on("voiceStateUpdate", (oldMember, newState) => {
      try {
      let newUserChannel = newState.channelId;
   
      if(newUserChannel === "1186434000890380369" || "1189457054700687400" || "1190569963837202543") {
        try {
          newState.member!.roles.add("1190743996117565481");
        } catch {}
      }

      console.log(newState.member!.user + " joined " + newUserChannel);
    } catch {}
   })
  }
}

export default LifecycleHelperService;
