import { PrismaClient } from "@prisma/client";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  GuildMember,
  Permissions,
  Client,
  VoiceState,
} from "discord.js";
import CommandModel from "../command.model"; // Adjust the path as necessary

const prisma = new PrismaClient();

class NoContactService {
  client: Client;

  constructor(client: Client) {
    this.client = client;
    this.client.on("voiceStateUpdate", this.handleVoiceStateUpdate.bind(this));
  }

  async handleNoContactCommand(interaction: CommandInteraction): Promise<void> {
    const targetUser = interaction.options.getUser("target", true);
    const issuerId = interaction.user.id; // Assuming you have a way to map this to your Member model's ID

    // Verify if both members exist in the database
    const issuerMember = await prisma.member.findUnique({
      where: { discordId: issuerId },
    });
    const targetMember = await prisma.member.findUnique({
      where: { discordId: targetUser.id },
    });

    if (!issuerMember || !targetMember) {
      await interaction.reply("One or both users not found in the database.");
      return;
    }

    // Check if there's an existing no-contact entry for the issuer
    const existingEntry = await prisma.noContactRelation.findUnique({
      where: {
        noContactCombo: {
          blockerId: issuerId,
          blockedId: targetUser.id,
        },
      },
    });

    if (existingEntry) {
      await interaction.reply(
        `${targetUser.username} is already in your no-contact list.`
      );
      return;
    }

    // Assuming you have a way to convert Discord IDs to your Member model IDs
    // Add the target user to the no-contact list
    await prisma.noContactRelation.create({
      data: {
        blockerId: issuerId,
        blockedId: targetUser.id,
      },
    });

    await interaction.reply(
      `${targetUser.username} has been added to your no-contact list.`
    );
  }

  async handleLiftNoContactCommand(
    interaction: CommandInteraction
  ): Promise<void> {
    const targetUser = interaction.options.getUser("target", true);
    const issuerId = interaction.user.id;

    // Check and delete the no-contact entry if it exists
    const deleteResult = await prisma.noContactRelation.deleteMany({
      where: {
        blockerId: issuerId,
        blockedId: targetUser.id,
      },
    });

    if (deleteResult.count > 0) {
      await interaction.reply(
        `${targetUser.username} has been removed from your no-contact list.`
      );
    } else {
      await interaction.reply(
        `No no-contact restriction found for ${targetUser.username}.`
      );
    }
  }

  async handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    // Implementation similar to the provided example
  }
}

async function handleNoContactCommand(
  interaction: CommandInteraction
): Promise<void> {
  // This would be similar to the handleCourtCommand logic
  if (!interaction.guild) {
    await interaction.reply("This command can only be used in a guild.");
    return;
  }

  await interaction.deferReply(); // Acknowledge the interaction immediately

  // You can implement your logic here based on the subcommand
  const subcommand = interaction.options.data[0].name.toLowerCase();
  const noContactService = new NoContactService(interaction.client);

  switch (subcommand) {
    case "add":
      await noContactService.handleNoContactCommand(interaction);
      break;
    case "remove":
      await noContactService.handleLiftNoContactCommand(interaction);
      break;
    default:
      await interaction.reply("Invalid subcommand");
  }
}

const noContactCommand = new SlashCommandBuilder();
noContactCommand
  .setName("nocontact")
  .setDescription("Manage your no-contact list")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("add")
      .setDescription("Add a user to your no-contact list")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user to add")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("remove")
      .setDescription("Remove a user from your no-contact list")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user to remove")
          .setRequired(true)
      )
  );

export default new CommandModel(
  "nocontact",
  noContactCommand,
  handleNoContactCommand
);
