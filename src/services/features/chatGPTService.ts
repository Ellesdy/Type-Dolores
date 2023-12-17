import { CommandInteraction } from "discord.js";

import axios from "axios";

// Assuming ConversationService is a type you have defined elsewhere
import ConversationService from "../helpers/conversationHelperService";
import ConfigService from "../system/configService";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

class ChatGPTService {
  private conversationService: ConversationService;
  private configService: ConfigService;
  private apiKey: string;

  constructor(conversationService: ConversationService) {
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
}

export default ChatGPTService;
