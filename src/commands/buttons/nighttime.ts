import {
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} from 'discord.js';

import type {
  Collection,
  MessageComponentInteraction,
  VoiceChannel,
} from 'discord.js';

import type { Button } from '../../data-types/button';

import type { Game } from '.prisma/client';

import { logger } from '../../utils/logger';

import { isGuildMemberConnectedToVoice } from '../../utils/helper';

const name = 'nighttime';

const builder: ButtonBuilder = new ButtonBuilder()
  .setCustomId(name)
  .setLabel('Nighttime!')
  .setEmoji('🌙')
  .setStyle(ButtonStyle.Primary);

const click = async (game: Game, interaction: MessageComponentInteraction): Promise<void> => {
  const role = await interaction.guild?.roles?.fetch(game.role);

  if (role == null) {
    // no role!?
    throw new Error('No role exists with id ' + game.role);
  }

  if (interaction.guild == null) {
    throw new Error('No guild!?');
  }

  const category = await interaction.guild.channels.fetch(game.nighttime);

  if (category == null) {
    throw new Error('Catgeory does not exist');
  }

  if (category.type !== ChannelType.GuildCategory) {
    throw new Error('Channel is not a cagetory');
  }

  const channels = category.children.cache.filter(chn => { return chn.type === ChannelType.GuildVoice; }) as Collection<string, VoiceChannel>;

  const members = role.members
    .filter(m => isGuildMemberConnectedToVoice(m));

  try {
    members.forEach((member) => {
      // move each member to the right channel
      const chn = channels.firstKey() ?? '';
      const chnn = channels.get(chn) ?? null;
      logger.info('sending to channel');
      member.voice.setChannel(chnn).then().catch((err) => {
        logger.error('Error found while moving user: ', err);
      });
      channels.delete(chn);
    });
  } catch (err) {
    logger.error('Error moving user:', err);
  }

  logger.info(`Clicked the ${name} button!`);
  await interaction.editReply({ content: `${interaction.customId} message Pressed!` });
};


export const nighttime: Button = {
  name,
  builder,
  click
};
