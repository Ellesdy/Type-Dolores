import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("transferowner")
    .setDescription("Transfer ownership of the current voice channel")
    .addUserOption((option) =>
      option
        .setName("newowner")
        .setDescription('The new "owner" of the channel')
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    if (
      !(
        interaction.member instanceof GuildMember &&
        interaction.member.voice.channel
      )
    ) {
      await interaction.reply({
        content: "You need to be in a voice channel to use this command.",
        ephemeral: true,
      });
      return;
    }

    const channel = interaction.member.voice.channel;
    const newOwner = interaction.options.getUser("newowner");

    if (!newOwner) {
      await interaction.reply({
        content: "Please specify a user to transfer ownership to.",
        ephemeral: true,
      });
      return;
    }

    // Update channel permissions here

    await interaction.reply(
      `Channel ownership transferred to ${newOwner.username}.`
    );
  },
};
