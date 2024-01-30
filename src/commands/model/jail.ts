// jail.ts
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  PermissionsBitField,
  Guild,
  ChannelType,
  VoiceChannel,
} from "discord.js";
import CommandModel from "../command.model"; // Adjust the path as necessary

import ConfigService from "../../services/system/configService";
// Function to jail a user
async function jailUser(interaction: CommandInteraction): Promise<void> {
  // Add the implementation for jailing a user here
  // ...
}

async function addJailChannel(
  interaction: CommandInteraction,
  configService: ConfigService
): Promise<void> {
  const selectedChannel = interaction.options.data[0].channel;
  const guild = interaction.guild;

  if (!guild) {
    await interaction.reply("Error: Command not executed within a guild.");
    return;
  }

  try {
    let jailChannel: VoiceChannel;

    if (selectedChannel && selectedChannel.type === ChannelType.GuildVoice) {
      jailChannel = selectedChannel as VoiceChannel;
    } else {
      // No valid voice channel selected, create a new voice channel
      jailChannel = (await guild.channels.create({
        name: "jail-voice",
        type: ChannelType.GuildVoice,
        // Optionally specify a parent category if needed
        // parent: "CATEGORY_ID",
      })) as VoiceChannel;
    }

    // Set permissions for the jail channel
    await jailChannel.permissionOverwrites.set([
      {
        id: guild.roles.everyone.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: configService.Role.Jailed,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ]);

    await interaction.reply(
      `Jail voice channel '${jailChannel.name}' set up successfully.`
    );
  } catch (error) {
    console.error("Error in addJailChannel:", error);
    await interaction.reply(
      "There was an error while setting up the jail voice channel."
    );
  }
}

// Function to delete a jail channel
async function deleteJailChannel(
  interaction: CommandInteraction
): Promise<void> {
  // Add the implementation for deleting a jail channel here
  // ...
}

// Builder for the jail command
const jailCommandBuilder = new SlashCommandBuilder()
  .setName("jail")
  .setDescription("Manage jail settings and users")
  .addSubcommand(
    (subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Jail a user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to jail")
            .setRequired(true)
        )
    // Consider adding more options like duration and reason
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("add")
      .setDescription("Add a jail channel")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription(
            "Select an existing voice channel or leave blank to create a new one"
          )
          .addChannelTypes(ChannelType.GuildVoice) // Limit to voice channels
          .setRequired(false)
      )
  )

  .addSubcommand((subcommand) =>
    subcommand
      .setName("del")
      .setDescription("Remove a jail channel")
      .addStringOption((option) =>
        option
          .setName("channel")
          .setDescription("Name of the channel to remove")
          .setRequired(true)
      )
  );

// Jail command execution logic
async function executeJailCommand(
  interaction: CommandInteraction
): Promise<void> {
  const configServiceInstance = new ConfigService(); // Instantiate ConfigService
  const subcommand = interaction.options.data[0].name;

  switch (subcommand) {
    case "user":
      await jailUser(interaction); // Pass both interaction and configServiceInstance
      break;
    case "add":
      await addJailChannel(interaction, configServiceInstance); // Pass ConfigService
      break;
    case "del":
      await deleteJailChannel(interaction); // ConfigService may not be needed here
      break;
    default:
      await interaction.reply("Unknown subcommand");
  }
}

// Export the jail command as a new CommandModel instance
const JailCommand = new CommandModel(
  "jail",
  jailCommandBuilder as SlashCommandBuilder,
  executeJailCommand
);

export default JailCommand;
