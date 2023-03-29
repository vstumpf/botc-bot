import {
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';

import type {
  MessageComponentInteraction
} from 'discord.js';

import type { Button } from '../../data-types/button';

import type { Game } from '.prisma/client';

import { logger } from '../../utils/logger';

const name = 'nighttime';

const builder: ButtonBuilder = new ButtonBuilder()
  .setCustomId(name)
  .setLabel('Nighttime!')
  .setEmoji('🌙')
  .setStyle(ButtonStyle.Primary);

const click = async (game: Game, interaction: MessageComponentInteraction): Promise<void> => {
  logger.info(`Clicked the ${name} button!`);
  await interaction.update({ content: `${interaction.customId} message Pressed!` });
};


export const nighttime: Button = {
  name,
  builder,
  click
};
