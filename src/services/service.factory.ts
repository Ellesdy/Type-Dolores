import MessageService from "./system/message.service";
import LoggerService from "./system/logger.service";
import ConfigService from "./system/config.service";
import ClientService from "./discordjs/client.service";
import GuildService from "./discordjs/guild.service";
import ChannelService from "./discordjs/channel.service";
import CommandService from "./discordjs/command.service";
import ChatGPTService from "./features/chat-gpt.service";
import LifecycleHelperService from "./helpers/lifecycle.helper.service";
import StartupService from "./system/startupService";
import ValidationHelperService from "./helpers/validation.helper.service";
import VCManagerService from "./features/vc-manager.service";
import VerifyService from "./features/verify.service";
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
