import {
  ApplicationCommandOptionType,
  ChannelType,
  CommandInteraction,
  Guild,
  PermissionsBitField,
  VoiceBasedChannel,
  VoiceChannel,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import SaveService from "../../services/helpers/save.service";
import CommandModel from "../command.model";
import InteractionService from "../../services/discordjs/interaction.service";

const channelName = "channel";
let channelOwners: any;
const builder = new SlashCommandBuilder();

const channelCommand = {
  name: channelName,
  data: builder,
  async execute(interaction: CommandInteraction) {
    const subcommand = interaction.options.data.find(
      (option) => option.type === ApplicationCommandOptionType.Subcommand
    )?.name;

    if (subcommand === "create") {
      await createChannel(interaction);
    } else if (subcommand === "delete") {
      await deleteChannel(interaction);
    } else if (subcommand === "limit") {
      await setUserLimit(interaction);
    } else {
      await interaction.reply("Unknown subcommand");
    }
  },
};

const refreshChannelOwners = () => {
  channelOwners = JSON.parse(SaveService.loadChannelOwners());
};

const createVoiceChannel = async (
  interaction: CommandInteraction
): Promise<VoiceChannel> => {
  return (await interaction.guild!.channels.create({
    name: channelName,
    type: ChannelType.GuildVoice, // Ensure this is a voice channel
    // Additional options like permissions, bitrate, user limit, etc.
  })) as VoiceChannel;
};

const getVoiceChannel = async (interaction: CommandInteraction) => {
  return (await interaction.guild!.channels.fetch(
    interaction.channelId
  )) as VoiceChannel;
};

const isCurrentChannelOwner = async (
  interaction: CommandInteraction,
  channel: VoiceBasedChannel
): Promise<Boolean> => {
  return channelOwners[interaction.user.id] == channel.id;
};

const isVoiceChannel = async (
  interaction: CommandInteraction
): Promise<Boolean> => {
  return interaction.channel!.type == ChannelType.GuildVoice;
};

const registerChannelOwner = async (
  interaction: CommandInteraction,
  channel: VoiceBasedChannel
) => {
  channelOwners[interaction.user.id] = channel.id;
  SaveService.saveChannelOwners(JSON.stringify(channelOwners));
};

const deregisterChannelOwner = async (interaction: CommandInteraction) => {
  await interaction.channel!.delete();
  delete channelOwners[interaction.user.id];
  SaveService.saveChannelOwners(JSON.stringify(channelOwners));
};

const hasChannel = async (
  interaction: CommandInteraction
): Promise<Boolean> => {
  return channelOwners[interaction.user.id] != undefined;
};

async function createChannel(interaction: CommandInteraction): Promise<void> {
  refreshChannelOwners();

  if (await hasChannel(interaction)) {
    interaction.reply("You already have a channel.");
    return;
  }

  try {
    const channelName = `Channel-${interaction.user.username}`; // Customize as needed

    const channel = await createVoiceChannel(interaction);
    registerChannelOwner(interaction, channel);

    console.log(channelOwners);

    channel.setParent("1176317517984178307"); // Set the category

    await channel.permissionOverwrites.create(interaction.user, {
      ManageChannels: true,
    });

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
  refreshChannelOwners();

  const channel = await getVoiceChannel(interaction);

  if (!(await isVoiceChannel(interaction))) {
    await interaction.reply(
      "This command can only be used in a voice channel."
    );
    return;
  }

  if (!isCurrentChannelOwner(interaction, channel)) {
    await interaction.reply("You do not own this channel.");
    return;
  }
  try {
    deregisterChannelOwner(interaction);
  } catch (error) {
    console.error("Error deleting channel:", error);
    await interaction.reply("There was an error while deleting the channel.");
  }
}

async function setUserLimit(interaction: CommandInteraction): Promise<void> {
  refreshChannelOwners();

  if (await isVoiceChannel(interaction)) {
    await interaction.reply(
      "This command can only be used in a voice channel."
    );
    return;
  }
  //Get Voice Channel
  const channel = await getVoiceChannel(interaction);

  //Validate limit is between 0 and 25
  const limit = InteractionService.getNumberOption(interaction, "limit");
  if (limit! > 25 || limit! < 0) {
    await interaction.reply("Limit must be between 0 and 25.");
    return;
  }

  //Validate user owns channel
  if (await isCurrentChannelOwner(interaction, channel)) {
    await interaction.reply(
      "You can only set the user limit for channels you own."
    );
    return;
  }

  // Set the limit
  try {
    channel.setUserLimit(limit);
    await interaction.reply(`User limit set to ${limit}`);
  } catch {
    await interaction.reply("There was an error setting the user limit.");
  }
}

builder
  .setName(channelName)
  .setDescription("Manage voice channels")
  .addSubcommand((subcommand) =>
    subcommand.setName("create").setDescription("Create a new voice channel")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("delete").setDescription("Delete a voice channel")
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("limit")
      .setDescription("Set the user limit for the channel")
      .addIntegerOption((option) =>
        option
          .setName("limit")
          .setDescription("The user limit for the channel")
          .setRequired(true)
      )
  );
export default new CommandModel(
  channelCommand.name,
  channelCommand.data,
  channelCommand.execute
);
