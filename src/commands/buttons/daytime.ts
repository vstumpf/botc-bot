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
import { isGuildMemberConnectedToVoice, isGuildMemberInChannel } from '../../utils/helper';

const name = 'daytime';


const builder: ButtonBuilder = new ButtonBuilder()
  .setCustomId(name)
  .setLabel('Daytime!')
  .setEmoji('☀️')
  .setStyle(ButtonStyle.Primary);

const click = async (game: Game, interaction: MessageComponentInteraction): Promise<void> => {
  const role = await interaction.guild?.roles?.fetch(game.role);

  if (role == null) {
    // no role!?
    throw new Error('No role exists with id ' + game.role);
  }
  const members = role.members
    .filter(m => isGuildMemberConnectedToVoice(m) && !isGuildMemberInChannel(m, game.daytime));

  try {
    members.forEach((member) => {
      // move each member to the right channel
      member.voice.setChannel(game.daytime).catch((err) => {
        logger.error('Error found while moving user: ', err);
      });
    });
  } catch (err) {
    logger.error('Error moving user:', err);
  }

  logger.info(`Clicked the ${name} button!`);
  await interaction.update({ content: `${interaction.customId} message Pressed!` });
};


export const daytime: Button = {
  name,
  builder,
  click
};
