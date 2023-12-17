import { TextBasedChannel } from "discord.js";
import ConfigService from "./configService";

// Define a type for Messages if you have a specific structure for them
// For example:
// type MessageConfig = { [key: string]: string };

class MessageService {
  public Messages: ConfigService["Message"]; // Replace 'any' with 'MessageConfig' if you defined it

  constructor() {
    // Assuming ConfigService can provide message configurations
    this.Messages = new ConfigService().Message;
  }

  async sendDiscordMessage(
    channel: TextBasedChannel,
    content: string
  ): Promise<void> {
    const maxLength = 2000;

    if (content.length <= maxLength) {
      await channel.send(content);
    } else {
      const messageParts: string[] = [];
      let message = content;

      while (message.length > 0) {
        if (message.length <= maxLength) {
          messageParts.push(message);
          message = "";
        } else {
          let subMessage = message.substring(0, maxLength);
          const index = subMessage.lastIndexOf(" ");
          if (index >= subMessage.length - 10 && index !== -1) {
            subMessage = subMessage.substring(0, index);
          }

          if (subMessage.charAt(subMessage.length - 1) === " ") {
            subMessage = subMessage.substring(0, subMessage.length - 1);
          }

          messageParts.push(subMessage);
          message = message.substring(subMessage.length).trim();
        }
      }

      for (const part of messageParts) {
        await channel.send(part);
      }
    }
  }
}

export default MessageService;
