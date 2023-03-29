import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} from 'discord.js';

import type {
  ChatInputCommandInteraction,
  MessageComponentInteraction
} from 'discord.js';

import type { PrismaClient } from '@prisma/client';

import type { Command } from '../data-types/command';

import { logger } from '../utils/logger';


export const startgame: Command = {
  description: 'Start interaction for a game.',
  name: 'startgame',
  options: [
    {
      channel_types: [ChannelType.GuildVoice],
      description: 'Daytime Voice Channel to move users into',
      name: 'daytime',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    },
    {
      channel_types: [ChannelType.GuildCategory],
      description: 'Nighttime Category to move users into',
      name: 'nighttime',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    }
  ],
  run: async (interaction: ChatInputCommandInteraction, prisma: PrismaClient): Promise<void> => {
    await runCommand(interaction, prisma);
  },
  click: async (interaction: MessageComponentInteraction, prisma: PrismaClient): Promise<void> => {
    await handleClick(interaction, prisma);
  }
};

const runCommand = async (interaction: ChatInputCommandInteraction, prisma: PrismaClient): Promise<void> => {
  const daytime = interaction.options.getChannel('daytime');
  const nighttime = interaction.options.getChannel('nighttime');

  if (daytime === null || nighttime === null) {
    throw new Error('bad channels');
  }

  await prisma.games.create({
    data: {
      role: '1',
      nighttime: nighttime.id,
      channelId: interaction.channelId,
      daytime: daytime.id,
    }
  });

  const msg = `Pong ${daytime?.name ?? 'na'} ${nighttime?.name ?? 'na'}`;

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('daytime')
        .setLabel('Daytime!')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('nighttime')
        .setLabel('Nighttime!')
        .setStyle(ButtonStyle.Primary),
    );

  // await prisma.games.create({
  //   data: {
  //     message_id: interaction.
  //   }
  // })

  await interaction.editReply({ content: msg, components: [row] });
};

const handleClick = async (interaction: MessageComponentInteraction, prisma: PrismaClient): Promise<void> => {
  const games = await prisma.games.findMany({
    where: {
      messageId: null,
    },
    orderBy: [
      { id: 'desc' }
    ],
  });

  if (games.length === 0) {
    // we need to error here, no games!?
  }

  if (games.length > 1) {
    // clean up
  }

  logger.info(games);

  await interaction.update({ content: `${interaction.customId} message Pressed!` });
};
