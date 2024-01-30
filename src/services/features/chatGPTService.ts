import { CommandInteraction } from "discord.js";

import axios from "axios";

// Assuming ConversationService is a type you have defined elsewhere
import ConversationService from "../helpers/conversation.helper.service";
import ConfigService from "../system/configService";
import ClientService from "../discordjs/clientService";
import MessageFilterHelperService from "../helpers/message-filter.helper.service";
import MessageService from "../system/messageService";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

class ChatGPTService {
  private conversationService: ConversationService;
  private configService: ConfigService;
  private apiKey: string;

  constructor(
    conversationService: ConversationService,
    private clientService: ClientService,
    private messageService: MessageService
  ) {
    this.conversationService = conversationService;
    this.configService = new ConfigService();
    this.apiKey = this.configService.System.openAIKey;
  }

  async getResponse(conversation: Message[], userId: string): Promise<string> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    const messages: Message[] = [
      {
        role: "system",
        content:
          "As a servant to the users of the Discord server, my mission is to provide a seamless and efficient experience by understanding their needs and taking appropriate actions. I am designed to understand natural language input and efficiently execute tasks such as creating channels, setting limits, allowing or kicking users, and verifying members. Additionally, I engage in friendly conversations and provide relevant information when needed. My goal is to enhance the user experience by catering to their requirements in a user-friendly and intuitive manner, making their time on the server enjoyable and productive.",
      },
      ...conversation.map((message) => ({
        role: message.role,
        content: message.content
          ? message.content.replace(/<@!?(\d+)>/g, "")
          : "",
      })),
    ];

    const data = {
      model: "gpt-4",
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7,
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        { headers: headers }
      );

      const gptResponse = response.data.choices[0].message.content.trim();
      await this.conversationService.updateConversation(userId, {
        role: "assistant",
        content: gptResponse,
      });
      return gptResponse;
    } catch (error) {
      console.error("Error getting ChatGPT response:", error);
      return "I'm sorry, but I couldn't process your message.";
    }
  }

  async handleMessage(userId: string, content: string): Promise<string> {
    const conversation =
      (await this.conversationService.getConversation(userId)) || [];
    const response = await this.getResponse(conversation, userId);

    await this.conversationService.updateConversation(userId, {
      role: "assistant",
      content: response,
    });

    return response;
  }

  async handleQuery(message: any) {
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

      const response = await this.handleMessage(userId, content);

      if (Array.isArray(response) && response.length > 0) {
        // Handle the case where response is an array
        for (const res of response) {
          if (res.content && res.content.trim() !== "") {
            // Use res.content here
          }
        }
      } else if (typeof response === "string") {
        // Handle the case where response is a string
        await this.messageService.sendDiscordMessage(message.channel, response);
      }
    }
  }
}

export default ChatGPTService;
