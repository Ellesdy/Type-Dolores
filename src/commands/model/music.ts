import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import CommandModel from "../command.model"; // Adjust the path as necessary
import MusicService from "../../services/features/musicService"; // Adjust the path as necessary

const musicService = new MusicService();

async function handlePlayCommand(
  interaction: CommandInteraction
): Promise<void> {
  if (!interaction.guildId)
    await interaction.reply("This command can only be used in a guild.");

  const song = interaction.options.data[0].value as string;
  console.log("song");
  if (!song) await interaction.reply("Please provide a song name or URL.");

  try {
    await musicService.play(interaction, song);
    await interaction.reply(`Now playing: ${song}`);
  } catch (error) {
    console.error(error);
    await interaction.reply("There was an error trying to play the music.");
  }
}

const playCommand = new SlashCommandBuilder();
playCommand
  .setName("play")
  .setDescription("Plays music in your voice channel.")
  .addStringOption((option) =>
    option
      .setName("song")
      .setDescription("The URL or name of the song to play")
      .setRequired(true)
  );

export default new CommandModel("play", playCommand, handlePlayCommand);
