import { PrismaClient } from "@prisma/client";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Guild,
  ChannelType,
  Permissions,
  ColorResolvable,
  Colors,
  CategoryChannel,
  GuildChannel,
  Role,
  Snowflake,
} from "discord.js";
import CommandModel from "../command.model"; // Adjust the path as necessary

const prisma = new PrismaClient();

async function createAndLogRole(
  guild: Guild,
  roleName: string,
  courtRoomId: number,
  color: ColorResolvable
): Promise<Role> {
  let role = guild.roles.cache.find((r) => r.name === roleName);
  if (!role) {
    role = await guild.roles.create({
      name: roleName,
      color: color,
      permissions: [],
    });
    await prisma.role.create({
      data: {
        name: role.name,
        roleId: role.id,
        courtRoomId,
      },
    });
  }
  return role;
}

async function createCourtRoom(guild: Guild): Promise<string> {
  let existingCategory = guild.channels.cache.find(
    (channel): channel is CategoryChannel =>
      channel.type === ChannelType.GuildCategory && channel.name === "[Court]"
  );

  if (!existingCategory) {
    existingCategory = (await guild.channels.create({
      name: "[Court]",
      type: ChannelType.GuildCategory,
    })) as CategoryChannel;
  }

  const courtRoomRecord = await prisma.courtRoom.upsert({
    where: { categoryId: existingCategory.id.toString() },
    update: {},
    create: {
      name: "[Court]",
      categoryId: existingCategory.id.toString(),
    },
  });

  const roles = ["Judge", "Juror", "Attorney", "Prosecutor", "Defense"];
  for (const roleName of roles) {
    await createAndLogRole(guild, roleName, courtRoomRecord.id, Colors.Blue);
  }

  const channelNames = ["Courtroom", "Prosecution", "Defense", "Jurors"];
  for (const channelName of channelNames) {
    let channel = existingCategory.children.cache.find(
      (c: GuildChannel) => c.name === channelName
    );
    if (!channel) {
      channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice,
        parent: existingCategory,
      });
      await prisma.channel.create({
        data: {
          name: channel.name,
          channelId: channel.id,
          courtRoomId: courtRoomRecord.id,
        },
      });
    }
  }

  return "Courtroom setup completed successfully.";
}

async function handleCourtCommand(
  interaction: CommandInteraction
): Promise<void> {
  if (!interaction.guild) {
    await interaction.reply("This command can only be used in a guild.");
    return;
  }

  await interaction.deferReply(); // Acknowledge the interaction immediately

  const subcommand = interaction.options.data[0].name;
  if (subcommand === "init") {
    try {
      const resultMessage = await createCourtRoom(interaction.guild);
      await interaction.editReply(resultMessage); // Follow-up after processing
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "There was an error processing your command."
      );
    }
  }
}

const courtCommand = new SlashCommandBuilder();
courtCommand
  .setName("court")
  .setDescription("Courtroom management commands.")
  .addSubcommand((subcommand) =>
    subcommand.setName("init").setDescription("Initialize a courtroom setup.")
  );

export default new CommandModel("court", courtCommand, handleCourtCommand);
