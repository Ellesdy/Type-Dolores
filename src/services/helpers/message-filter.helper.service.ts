import { Message } from "discord.js";

export default class MessageFilterHelperService {
  static isBotOrEveryone(message: Message) {
    if (
      message.author.bot ||
      message.content.toLowerCase().includes("@everyone") ||
      message.content.toLowerCase().includes("@here")
    ) {
      return true;
    }
  }
}
