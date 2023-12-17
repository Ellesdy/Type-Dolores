import { Client } from "discord.js";
import ConfigService from "../system/configService"; // Update the path as needed

class ClientService {
  private client: Client;
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
    this.client = this.createClient();
  }

  private createClient(): Client {
    return new Client({ intents: 32767 });
  }

  get Client(): Client {
    return this.client;
  }

  async login(): Promise<void> {
    try {
      const botToken = this.configService.Client.botToken;
      await this.client.login(botToken);
    } catch (error) {
      console.error("Error connecting to Discord:", error);
    }
  }
}

export default ClientService;
