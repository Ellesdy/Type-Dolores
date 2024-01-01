import { CommandInteraction, GuildMember } from "discord.js";
import ConfigService from "../system/config.service";

class VerifyService {
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  async verify(interaction: CommandInteraction): Promise<void> {
    if (!(interaction.member instanceof GuildMember) || !interaction.guild) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    // Check if the sender has the required roles
    const hasVerifyRole = interaction.member.roles.cache.has(
      this.configService.Role.Verify
    );

    if (!hasVerifyRole) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    // Extract the user mentioned in the command
    const userToVerify = interaction.options.getUser("user");

    if (!userToVerify) {
      await interaction.reply({
        content: "Please mention a user to verify.",
        ephemeral: true,
      });
      return;
    }

    const memberToVerify = await interaction.guild.members.fetch(
      userToVerify.id
    );

    // Check if memberToVerify is a valid GuildMember object with a user property
    if (!memberToVerify || !memberToVerify.user) {
      await interaction.reply({
        content: "Unable to verify the user.",
        ephemeral: true,
      });
      return;
    }

    // Remove the "Unverified" role and add the "Verified" role
    await memberToVerify.roles.remove(this.configService.Role.Unverified);
    await memberToVerify.roles.add(this.configService.Role.Verified);

    await interaction.reply({
      content: `${memberToVerify.user.username} has been verified!`,
      ephemeral: true,
    });
  }
}

export default VerifyService;
