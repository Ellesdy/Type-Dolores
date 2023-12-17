import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("deletechannel")
    .setDescription("Delete a channel"),
  // Add necessary options
  async execute(interaction: CommandInteraction) {
    // Logic to delete a channel
  },
};
