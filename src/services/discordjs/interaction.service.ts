import { CommandInteraction, Interaction } from "discord.js";

export default class InteractionService {
    static getNumberOption(interaction: CommandInteraction, parameter: string ): number {
        return interaction.options.get(parameter)?.value as number;
    }
}