import MessageService from "./system/messageService";
import LoggerService from "./system/loggerService";
import ConfigService from "./system/configService";
import ClientService from "./discordjs/clientService";
import GuildService from "./discordjs/guildService";
import ChannelService from "./discordjs/channelService";
import CommandService from "./discordjs/commandService";
import ChatGPTService from "./features/chatGPTService";
import LifecycleHelperService from "./helpers/lifecycle.helper.service";
import StartupService from "./system/startupService";
import ValidationHelperService from "./helpers/validation.helper.service";
import VCManagerService from "./features/VCManagerService";
import VerifyService from "./features/verifyService";
import ConversationHelperService from "./helpers/conversation.helper.service";
import MemberService from "./discordjs/memberService";
import { Client } from "discord.js";

class ServiceFactory {
  static createServices(): Record<string, any> {
    // Replace 'any' with the actual service types if available
    const messageService = new MessageService();
    const loggerService = new LoggerService(messageService);
    const configService = new ConfigService();
    const clientService = new ClientService(configService);

    const guildService = new GuildService(clientService, configService);
    const memberService = new MemberService(configService, clientService);
    const vcManagerService = new VCManagerService();
    const validationHelperService = new ValidationHelperService(
      loggerService,
      configService
    );
    const verifyService = new VerifyService(configService);
    const channelService = new ChannelService(
      loggerService,
      messageService,
      clientService.Client, // Adjusted to use a getClient() method or similar
      configService
    );
    const commandService = new CommandService();
    const conversationService = new ConversationHelperService();
    const chatGPTService = new ChatGPTService(conversationService);
    const lifecycleHelperService = new LifecycleHelperService(
      clientService,
      commandService,
      chatGPTService,
      messageService,
      loggerService
    );
    const startupService = new StartupService(
      clientService,
      lifecycleHelperService,
      validationHelperService,
      commandService
    );

    return {
      clientService,
      guildService,
      commandService,
      channelService,
      chatGPTService,
      lifecycleHelperService,
      startupService,
      messageService,
      loggerService,
      configService,
      vcManagerService,
      validationHelperService,
      verifyService,
      memberService,
    };
  }
}

export default ServiceFactory;
