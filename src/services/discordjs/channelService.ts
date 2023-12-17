import { Client, GuildChannel, Snowflake } from "discord.js";

import LoggerService from "../system/loggerService";
import MessageService from "../system/messageService";
import ConfigService from "../system/configService";

class ChannelService {
  private Logger: LoggerService;
  private Message: MessageService;
  private Client: Client;
  private Config: ConfigService;

  constructor(
    logger: LoggerService,
    message: MessageService,
    client: Client,
    config: ConfigService
  ) {
    this.Logger = logger;
    this.Message = message;
    this.Client = client;
    this.Config = config;
  }

  Validate(): void {
    this.Logger.logSystem(this.Message.Messages.system.startup.channel.start);
    this.GetSystemChannels().forEach((option) => {
      const channel = this.GetChannel(option[1]);
      if (channel) {
        this.Logger.logSuccess(
          `${this.Message.Messages.system.startup.channel.success}${option[0]} [${channel.name}]`
        );
      } else {
        this.Logger.logError(
          new Error(`${this.Message.Messages.error}${option[0]}`)
        );
      }
    });
    this.Logger.logSystem(this.Message.Messages.system.startup.channel.done);
  }

  GetChannel(channelID: string): GuildChannel | undefined {
    return this.Client.channels.cache.get(channelID) as GuildChannel;
  }

  GetSystemChannel(channelIndex: string): GuildChannel | undefined {
    const channelPair = this.GetSystemChannels().find(
      (channel) => channel[0] === channelIndex
    );
    return channelPair ? this.GetChannel(channelPair[1]) : undefined;
  }

  GetSystemChannels(): [string, string][] {
    const channelConfig = Object(this.Config.Channel);
    return Object.keys(channelConfig)
      .filter((option) => option !== "Name")
      .map((channel) => [channel, channelConfig[channel]]);
  }
}

export default ChannelService;
