import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import ConfigService from "../../services/system/configService";
import CommandModel from "../command.model";
import AuthHelperService from "../../services/helpers/auth.helper.service";

const configService = new ConfigService(); // Configure as needed

const verifyName = "verify";
const builder = new SlashCommandBuilder();
const execute = async (interaction: CommandInteraction) => {
  if (!(interaction.member instanceof GuildMember) || !interaction.guild) {
    await interaction.reply({
      content: "This command can only be used in a server.",
      ephemeral: true,
    });
    return;
  }

  if (!AuthHelperService.hasManageRolesPermission(interaction.member)) {
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

  const memberToVerify = await interaction.guild.members.fetch(userToVerify.id);
  if (!memberToVerify || !memberToVerify.user) {
    await interaction.reply({
      content: "Unable to verify the user.",
      ephemeral: true,
    });
    return;
  }

  if (!memberToVerify.roles.cache.has(configService.Role.Verified)) {
    if (memberToVerify.roles.cache.has(configService.Role.Unverified)) {
      await memberToVerify.roles.remove(configService.Role.Unverified);
    }
    await memberToVerify.roles.add(configService.Role.Verified);
  } else {
    await interaction.reply({
      content: `${memberToVerify.user.username} is already verified!`,
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({
    content: `${memberToVerify.user.username} has been verified!`,
    ephemeral: true,
  });
};

builder
  .setName(verifyName)
  .setDescription("Verifies a user.")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to verify")
      .setRequired(true)
  );

const verifyCommand = new CommandModel(verifyName, builder, execute);

export default verifyCommand;
