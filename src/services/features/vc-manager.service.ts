import {
  PermissionsBitField,
  EmbedBuilder,
  CommandInteraction,
  VoiceChannel,
  GuildMember,
  ChannelType,
  OverwriteType,
} from "discord.js";

class VCManagerService {
  constructor() {}

  async create(
    interaction: CommandInteraction,
    name: string,
    limit: number
  ): Promise<VoiceChannel> {
    if (!interaction.guild) {
      throw new Error("This command can only be used in a server.");
    }

    const channel = (await interaction.guild.channels.create({
      name: name,
      type: ChannelType.GuildVoice,
      userLimit: limit,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
          type: OverwriteType.Role,
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.ViewChannel,
          ],
          type: OverwriteType.Member,
        },
      ],
    })) as VoiceChannel;

    return channel;
  }

  async limit(
    interaction: CommandInteraction,
    channel: VoiceChannel,
    limit: number
  ): Promise<void> {
    if (!interaction.member || !(interaction.member instanceof GuildMember)) {
      throw new Error("Invalid member.");
    }

    const permissions = channel.permissionsFor(interaction.member);
    if (
      !permissions ||
      !permissions.has(PermissionsBitField.Flags.ManageChannels)
    ) {
      throw new Error("You do not have permission to change the user limit.");
    }

    await channel.edit({ userLimit: limit });

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`Successfully updated user limit to ${limit}!`);
    await interaction.reply({ embeds: [embed] });
  }

  async allow(
    interaction: CommandInteraction,
    channel: VoiceChannel,
    user: GuildMember
  ): Promise<void> {
    if (!interaction.member || !(interaction.member instanceof GuildMember)) {
      throw new Error("Invalid member.");
    }

    const permissions = channel.permissionsFor(interaction.member);
    if (
      !permissions ||
      !permissions.has(PermissionsBitField.Flags.ManageChannels)
    ) {
      throw new Error("You do not have permission to manage the channel.");
    }

    await channel.permissionOverwrites.edit(user, {
      Connect: true,
      ViewChannel: true,
    });

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(
        `Successfully allowed ${user.user.tag} to join the channel.`
      );
    await interaction.reply({ embeds: [embed] });
  }

  async kick(
    interaction: CommandInteraction,
    channel: VoiceChannel,
    user: GuildMember
  ): Promise<void> {
    if (!interaction.member || !(interaction.member instanceof GuildMember)) {
      throw new Error("Invalid member.");
    }

    const permissions = channel.permissionsFor(interaction.member);
    if (
      !permissions ||
      !permissions.has(PermissionsBitField.Flags.ManageChannels)
    ) {
      throw new Error("You do not have permission to manage the channel.");
    }

    if (user.voice.channelId !== channel.id) {
      throw new Error(`${user.user.tag} is not in the specified channel.`);
    }

    await user.voice.setChannel(null);

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setDescription(`Successfully kicked ${user.user.tag} from the channel.`);
    await interaction.reply({ embeds: [embed] });
  }
}

export default VCManagerService;
