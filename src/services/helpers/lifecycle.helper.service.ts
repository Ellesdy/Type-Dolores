import { Client, CommandInteraction, Message } from "discord.js";

// Assuming these are types you have defined elsewhere
import ClientService from "../discordjs/client.service";
import CommandService from "../discordjs/command.service";
import ConversationHelperService from "../helpers/conversation.helper.service";
import ChatGPTService from "../features/chat-gpt.service";
import MessageService from "../system/message.service";
import CommandModel from "../../commands/command.model";
import AuthHelperService from "./auth.helper.service";
import MessageFilterHelperService from "./message-filter.helper.service";
import LoggerService from "../system/logger.service";

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
      this.chatGPTService.handleQuery(message);
    });

    // Event listener for interactions
    this.clientService.Client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      this.commandService.handleCommand(interaction);
    });

    this.clientService.Client.on("voiceStateUpdate", (oldMember, newState) => {
      try {
      let newUserChannel = newState.channelId;

      if(newUserChannel === "1186434000890380369" || "1189457054700687400" || "1190569963837202543") {

        try {
          newState.member!.roles.add("1190743996117565481");
        } catch {

        }
      }

      console.log(newState.member!.user + " joined " + newUserChannel);
    } catch {

    }
   })
  }
}

export default LifecycleHelperService;
