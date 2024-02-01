import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMember,
  PermissionsBitField,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import CommandModel from "../command.model"; // Adjust the path as necessary

async function handleSitCommand(
  interaction: CommandInteraction
): Promise<void> {
  const subcommand = interaction.options.data[0].name;

  switch (subcommand) {
    case "pull":
      // Logic to pull specified users into the quarantine channel
      break;
    case "release":
      // Logic to release specified users from the quarantine channel
      break;
  }
}

const name = "sit";
const SitBuilder = new SlashCommandBuilder();
SitBuilder.setName("sit")
  .setDescription("Manages the sit process for users.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("pull")
      .setDescription("Pull specified users into quarantine.")
      // Repeat for multiple users or handle dynamically in execution logic
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user to pull into quarantine.")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("release")
      .setDescription("Release specified users from quarantine.")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user to release from quarantine.")
          .setRequired(true)
      )
  );

const sitCommand = new CommandModel(name, SitBuilder, handleSitCommand);

export default sitCommand;
