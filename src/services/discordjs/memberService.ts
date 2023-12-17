import { GuildMember } from "discord.js";

// Assuming ConfigService and ClientService are types you have defined elsewhere
import ConfigService from "../system/configService";
import ClientService from "../discordjs/clientService";

class MemberService {
  private configService: ConfigService;
  private clientService: ClientService;

  constructor(configService: ConfigService, clientService: ClientService) {
    this.configService = configService;
    this.clientService = clientService;
  }

  getMemberFromUser(userID: string): GuildMember | undefined {
    return this.clientService.Client.guilds.cache
      .get(this.configService.Client.guildID)
      ?.members.cache.get(userID);
  }
}

export default MemberService;
