import type {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  MessageComponentInteraction
} from 'discord.js';


export interface Command extends ChatInputApplicationCommandData {
  run: (
    interaction: ChatInputCommandInteraction,
  ) => Promise<void>
  click?: (
    interaction: MessageComponentInteraction,
  ) => Promise<void>
}
