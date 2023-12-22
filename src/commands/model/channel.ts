import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  ApplicationCommandOptionType,
  Guild,
  VoiceChannel,
  GuildChannelCreateOptions,
  ChannelType,
} from "discord.js";

const channelName = "channel";
const channelCommand = {
  name: channelName,
  data: new SlashCommandBuilder()
    .setName(channelName)
    .setDescription("Manage voice channels")
    .addSubcommand((subcommand) =>
      subcommand.setName("create").setDescription("Create a new voice channel")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("delete").setDescription("Delete a voice channel")
    ),
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.data.find(
      (option) => option.type === ApplicationCommandOptionType.Subcommand
    )?.name;

    if (subcommand === "create") {
      await createChannel(interaction);
    } else if (subcommand === "delete") {
      await deleteChannel(interaction);
    } else {
      await interaction.reply("Unknown subcommand");
    }
  },
};

async function createChannel(interaction: CommandInteraction): Promise<void> {
  if (!interaction.guild) {
    await interaction.reply("This command can only be used in a guild.");
    return;
  }

  try {
    const guild: Guild = interaction.guild;
    const channelName = `Channel-${interaction.user.username}`; // Customize as needed

    const channel = (await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildVoice, // Ensure this is a voice channel
      // Additional options like permissions, bitrate, user limit, etc.
    })) as VoiceChannel;

    // Example of setting user limit and bitrate
    channel.setUserLimit(10); // Set a user limit if needed
    channel.bitrate = 64000; // Set bitrate if needed

    await interaction.reply(`Voice channel "${channelName}" created!`);
  } catch (error) {
    console.error("Error creating channel:", error);
    await interaction.reply("There was an error while creating the channel.");
  }
}

async function deleteChannel(interaction: CommandInteraction): Promise<void> {
  // Logic for deleting a channel
  // This will depend on how you're managing channels and might require additional logic
  await interaction.reply("Channel deletion logic not implemented yet.");
}

export default channelCommand;
