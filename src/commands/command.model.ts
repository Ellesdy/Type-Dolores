import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default class CommandModel {
  name: string;
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<any>;

  constructor(
    name: string,
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => Promise<any>
  ) {
    this.name = name;
    this.data = data;
    this.execute = execute;
  }
}
