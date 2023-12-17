import { Guild } from "discord.js";

// Assuming ClientService is a type you have defined elsewhere
import ClientService from "./clientService";
import ConfigService from "../system/configService";

class GuildService {
  private clientService: ClientService;
  private configService: ConfigService;

  constructor(clientService: ClientService, configService: ConfigService) {
    this.clientService = clientService;
    this.configService = configService;
  }

  getGuild(): Guild | undefined {
    const guildId = this.configService.get("guidId");
    return this.clientService.Client.guilds.cache.get(guildId);
  }
}

export default GuildService;
