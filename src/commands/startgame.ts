import type {
  ChatInputCommandInteraction
} from 'discord.js';

import type { Command } from '../data-types/command';


export const startgame: Command = {
  description: 'Start interaction for a game.',
  name: 'startgame',
  run: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    await runCommand(interaction);
  }
};

const runCommand = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  await interaction.reply('Pong!');
};
