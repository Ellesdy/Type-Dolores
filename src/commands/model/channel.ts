import {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  SlashCommandChannelOption,
} from "@discordjs/builders";
import {
  CommandInteraction,
  ApplicationCommandOptionType,
  Guild,
  VoiceChannel,
  GuildChannelCreateOptions,
  ChannelType,
  PermissionsBitField,
} from "discord.js";

const channelName = "channel";
const slashCommand = new SlashCommandBuilder()
  .setName(channelName)
  .setDescription("Manage voice channels")
  .addSubcommand((subcommand) =>
    subcommand.setName("create").setDescription("Create a new voice channel")
  )
  .addSubcommand((subcommand) =>
    subcommand.setName("delete").setDescription("Delete a voice channel")
  )
  .addSubcommand((subcommand) =>
    subcommand.addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("Set the user limit for the channel")
    )
  );

const channelCommand = {
  name: channelName,
  data: slashCommand,
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

    // give channel manage permissions to user

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
  if (!interaction.guild) {
    await interaction.reply("This command can only be used in a guild.");
    return;
  }

  // if user has  ManageChannels permission in THIS channel

  const guild: Guild = interaction.guild;
  const channel = (await guild.channels.fetch(
    interaction.channelId
  )) as VoiceChannel;

  //check if user has manage permissions in channel
  const permissions = channel.permissionsFor(interaction.user);
  if (!permissions?.has(PermissionsBitField.Flags.ManageChannels)) {
    await interaction.reply(
      "You do not have the required permissions to delete this channel."
    );
    return;
  }

  if (!(interaction.channel!.type.toString() === "GUILD_VOICE")) {
    await interaction.reply(
      "This command can only be used in a voice channel."
    );
    return;
  }
  try {
    const channel = (await interaction.guild.channels.fetch(
      interaction.channelId
    )) as VoiceChannel;

    await channel.delete();

    await interaction.reply(`Voice channel "${channelName}" deleted!`);
  } catch (error) {
    console.error("Error deleting channel:", error);
    await interaction.reply("There was an error while deleting the channel.");
  }
}

async function setUserLimit(interaction: CommandInteraction): Promise<void> {
  if (!interaction.guild) {
    await interaction.reply("This command can only be used in a guild.");
    return;
  }
  if (!(interaction.channel!.type.toString() === "GUILD_VOICE")) {
    await interaction.reply(
      "This command can only be used in a voice channel."
    );
    return;
  }
  const guild: Guild = interaction.guild;
  const channel = (await guild.channels.fetch(
    interaction.channelId
  )) as VoiceChannel;

  if (!channel.name.includes(interaction.user.username)) {
    await interaction.reply(
      "You can only set the user limit for channels you own."
    );
    return;
  }
  try {
    const limit = interaction.options.get("limit")?.value as number;
    channel.setUserLimit(limit);
    await interaction.reply(`User limit set to ${limit}`);
  } catch {}
  return;
}

export default channelCommand;
