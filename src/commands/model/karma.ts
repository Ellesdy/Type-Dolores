import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import CommandModel from "../command.model"; // Adjust the path as necessary
import KarmaService from "../../services/features/karma.service";

async function handleKarmaCommand(
  interaction: CommandInteraction
): Promise<void> {
  const subcommand = interaction.options.data[0].name.toLowerCase();
  const targetUser = interaction.options.getUser("user");
  if (!targetUser) {
    await interaction.reply("User not found.");
    return;
  }

  switch (subcommand) {
    case "check":
      const karmaPoints = await KarmaService.checkKarma(targetUser.id);
      await interaction.reply(
        `${targetUser.username} has ${karmaPoints} karma points.`
      );
      break;
    case "award":
      const pointsOption = interaction.options.get("points");
      if (!pointsOption || typeof pointsOption.value !== "number") {
        await interaction.reply("Error: Points value not provided or invalid.");
        return;
      }
      const pointsToAward = pointsOption.value;
      await KarmaService.updateKarma(targetUser.id, pointsToAward);
      await interaction.reply(
        `Awarded ${pointsToAward} karma points to ${targetUser.username}.`
      );
      break;

    case "deduct":
      const deductPointsOption = interaction.options.get("points");
      if (!deductPointsOption || typeof deductPointsOption.value !== "number") {
        await interaction.reply("Error: Points value not provided or invalid.");
        return;
      }
      const pointsToDeduct = deductPointsOption.value;
      await KarmaService.updateKarma(targetUser.id, -pointsToDeduct);
      await interaction.reply(
        `Deducted ${pointsToDeduct} karma points from ${targetUser.username}.`
      );
      break;
  }
}

const name = "karma";
const KarmaBuilder: SlashCommandBuilder = new SlashCommandBuilder();
KarmaBuilder.setName("karma")
  .setDescription("Manage karma points for users")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("check")
      .setDescription("Check a user's karma points")
      .addUserOption((option) =>
        option.setName("user").setDescription("The user").setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("award")
      .setDescription("Award karma points to a user")
      .addUserOption((option) =>
        option.setName("user").setDescription("The user").setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("points")
          .setDescription("Points to award")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("deduct")
      .setDescription("Deduct karma points from a user")
      .addUserOption((option) =>
        option.setName("user").setDescription("The user").setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("points")
          .setDescription("Points to deduct")
          .setRequired(true)
      )
  );

const karmaCommand = new CommandModel(name, KarmaBuilder, handleKarmaCommand);

export default karmaCommand;
