import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMember,
  PermissionsBitField,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import CommandModel from "../command.model"; // Adjust the path as necessary
import ConfigService from "../../services/system/configService";

// Placeholder for the map, should be scoped appropriately
const userOriginalChannels = new Map<string, string>();

const configService = new ConfigService();
const quarantineRoleId = configService.Role.Quarantine; // Assuming 'Quarantine' is the correct key

async function handleSitCommand(
  interaction: CommandInteraction
): Promise<void> {
  const subcommand = interaction.options.data[0].name;
  const commandRunnerChannel = (interaction.member as GuildMember).voice
    .channel;

  try {
    if (subcommand === "pull") {
      if (!commandRunnerChannel) {
        await interaction.reply(
          `You need to be in a voice channel to use this command.`
        );
        return;
      }

      const membersToPull: GuildMember[] = [];
      ["user1", "user2", "user3", "user4"].forEach((optionName) => {
        const memberOption = interaction.options.getMember(optionName);
        if (memberOption && memberOption instanceof GuildMember) {
          membersToPull.push(memberOption);
        }
      });

      for (const member of membersToPull) {
        userOriginalChannels.set(
          member.id,
          member.voice.channelId || "unknown"
        );
        await member.voice.setChannel(commandRunnerChannel);
        if (quarantineRoleId) {
          const quarantineRole =
            interaction.guild?.roles.cache.get(quarantineRoleId);
          if (quarantineRole) {
            await member.roles.add(quarantineRole);
          }
        }
        await interaction.reply(
          `${member.displayName} has been pulled into your current channel and assigned the quarantine role.`
        );
      }
    } else if (subcommand === "release") {
      // Implementation for release subcommand...
    }
  } catch (error) {
    console.error("Error handling sit command:", error);
    await interaction.reply("There was an error executing the command.");
  }
}

const SitBuilder = new SlashCommandBuilder();
SitBuilder.setName("sit")
  .setDescription("Manages the sit process for users.")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("pull")
      .setDescription("Pull specified users into quarantine.")
      .addUserOption((option) =>
        option
          .setName("user1")
          .setDescription("The first user to pull into quarantine.")
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName("user2")
          .setDescription("The second user to pull into quarantine.")
          .setRequired(false)
      )
      .addUserOption((option) =>
        option
          .setName("user3")
          .setDescription("The third user to pull into quarantine.")
          .setRequired(false)
      )
      .addUserOption((option) =>
        option
          .setName("user4")
          .setDescription("The fourth user to pull into quarantine.")
          .setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("release")
      .setDescription("Release specified users from quarantine.")
      // Assuming the release functionality will be adjusted similarly if needed
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user to release from quarantine.")
          .setRequired(true)
      )
  );

const sitCommand = new CommandModel("sit", SitBuilder, handleSitCommand);

export default sitCommand;
