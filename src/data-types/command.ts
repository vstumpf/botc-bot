import {
  type ChatInputApplicationCommandData,
  type ChatInputCommandInteraction
} from 'discord.js';


export interface Command extends ChatInputApplicationCommandData {
  run: (
    interaction: ChatInputCommandInteraction,
  ) => Promise<void>
}
