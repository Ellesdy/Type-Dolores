import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import ConfigService from "../services/system/configService";

const configService = new ConfigService(); // Configure as needed

export const command = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verifies a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to verify")
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    if (!(interaction.member instanceof GuildMember) || !interaction.guild) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        ephemeral: true,
      });
      return;
    }

    if (!interaction.member.roles.cache.has(configService.Role.Verify)) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }

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
    if (!memberToVerify || !memberToVerify.user) {
      await interaction.reply({
        content: "Unable to verify the user.",
        ephemeral: true,
      });
      return;
    }

    await memberToVerify.roles.remove(configService.Role.Unverified);
    await memberToVerify.roles.add(configService.Role.Verified);

    await interaction.reply({
      content: `${memberToVerify.user.username} has been verified!`,
      ephemeral: true,
    });
  },
};
