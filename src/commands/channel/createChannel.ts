import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ChannelType } from "discord.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName("createchannel")
    .setDescription("Create a personal voice channel"),

  async execute(interaction: CommandInteraction) {
    // Guild check
    if (!interaction.guild) {
      await interaction.reply({
        content: "This command can only be used in a guild.",
        ephemeral: true,
      });
      return;
    }

    const channelName = `${interaction.user.username}'s Channel`;

    try {
      await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice,
      });
      await interaction.reply(
        `Voice channel ${channelName} created successfully.`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while creating the channel.",
        ephemeral: true,
      });
    }
  },
};
