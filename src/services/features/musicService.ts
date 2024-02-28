// Assuming you've created a youtube-search-api.d.ts file for the module declaration
import { GetListByKeyword } from "youtube-search-api";
import { CommandInteraction, GuildMember } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import ytdl from "ytdl-core";

export default class MusicService {
  private audioPlayer = createAudioPlayer();

  constructor() {
    this.audioPlayer.on(AudioPlayerStatus.Idle, () =>
      console.log("Playback finished.")
    );
  }

  async getYoutubeVideoUrl(searchTerm: string): Promise<string> {
    const result = await GetListByKeyword(searchTerm, true);
    if (result && result.items.length > 0) {
      const videoId = result.items[0].id;
      return `https://www.youtube.com/watch?v=${videoId}`;
    } else {
      throw new Error("No results found for your query.");
    }
  }

  async play(
    interaction: CommandInteraction,
    searchTerm: string
  ): Promise<void> {
    if (
      !interaction.guild ||
      !interaction.member ||
      !(interaction.member instanceof GuildMember) ||
      !interaction.member.voice.channel
    ) {
      await interaction.reply(
        "You need to be in a voice channel to play music."
      );
      return;
    }

    const voiceChannel = interaction.member.voice.channel;

    let songUrl = searchTerm;
    if (!songUrl.startsWith("http")) {
      try {
        songUrl = await this.getYoutubeVideoUrl(searchTerm);
      } catch (error) {
        console.error("Error finding video:", error);
        await interaction.reply(
          "Could not find a video for the provided search term."
        );
        return;
      }
    }

    const stream = ytdl(songUrl, { filter: "audioonly" });
    const resource = createAudioResource(stream);

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guildId!,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    this.audioPlayer.play(resource);
    connection.subscribe(this.audioPlayer);

    await interaction.reply(`Now playing: ${searchTerm}`);
  }
}
