import { GuildMember } from "discord.js";
import { PrismaClient } from "@prisma/client"; // Import Prisma client
import ConfigService from "../system/configService";
import ClientService from "../discordjs/clientService";

const prisma = new PrismaClient(); // Initialize Prisma client

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

  async ensureMember(
    discordId: string,
    username: string,
    guildName: string
  ): Promise<void> {
    try {
      let member = await prisma.member.findUnique({
        where: { discordId },
      });

      if (!member) {
        await prisma.member.create({
          data: {
            discordId: discordId,
            username: username, // Assuming this is a required field
            guildName: guildName, // Assuming this is a required field
            // Set default values for other fields if necessary
            // e.g., karmaPoints: 0
          },
        });
        console.log(`New member added to database: ${discordId}`);
      }
    } catch (error) {
      console.error("Error ensuring member in database:", error);
      throw error;
    }
  }
  async ensureAllGuildMembers(): Promise<void> {
    try {
      const guilds = this.clientService.Client.guilds.cache;
      for (const guild of guilds.values()) {
        const members = await guild.members.fetch();
        for (const member of members.values()) {
          await this.ensureMember(member.id, member.user.username, guild.name);
        }
      }
    } catch (error) {
      console.error("Error ensuring all guild members:", error);
    }
  }
}

export default MemberService;
