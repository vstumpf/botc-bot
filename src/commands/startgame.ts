import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ChannelType,
} from 'discord.js';

import type {
  ButtonBuilder,
  ChatInputCommandInteraction,
  MessageComponentInteraction
} from 'discord.js';

import type { PrismaClient } from '@prisma/client';

import type { Button, Command } from '../data-types';

import { buttons } from './buttons';

import type { Game } from '.prisma/client';

export const startgame: Command = {
  description: 'Start interaction for a game.',
  name: 'startgame',
  options: [
    {
      description: 'Daytime Voice Channel to move users into',
      name: 'daytime',
      required: true,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildVoice],
    },
    {
      description: 'Nighttime Category to move users into',
      name: 'nighttime',
      required: true,
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildCategory],
    },
    {
      description: 'Role to use for current game',
      name: 'role',
      required: true,
      type: ApplicationCommandOptionType.Role,
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
  const daytimeChannel = interaction.options.getChannel('daytime');
  const nighttimeChannel = interaction.options.getChannel('nighttime');
  const playerRole = interaction.options.getRole('role');

  if (daytimeChannel === null || nighttimeChannel === null || playerRole === null) {
    throw new Error('bad channels or role');
  }

  await prisma.game.create({
    data: {
      role: playerRole.id,
      nighttime: nighttimeChannel.id,
      channelId: interaction.channelId,
      daytime: daytimeChannel.id,
    }
  });

  const msg = `Starting game for role ${playerRole.name} with ${daytimeChannel.name ?? 'na'} | ${nighttimeChannel.name ?? 'na'}`;

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      ...buttons.map((btn: Button) => { return btn.builder; })
    );

  await interaction.editReply({ content: msg, components: [row] });
};

const handleClick = async (interaction: MessageComponentInteraction, prisma: PrismaClient): Promise<void> => {
  const game = await findGame(prisma, interaction);

  // find the right button to dispatch
  const button: Button | undefined = buttons.find((btn: Button) => btn.name === interaction.customId);
  if (button == null) {
    await interaction.update({ content: `${interaction.customId} failed, does not exist?` });
    return;
  }

  if (button.click === undefined) {
    await interaction.update({ content: 'Button does not know how to click!?' });
    return;
  }

  await interaction.deferUpdate();

  await button.click(game, interaction);
};

const findOwnedGame = async (prisma: PrismaClient, interaction: MessageComponentInteraction): Promise<Game | null> => {
  return await prisma.game.findFirst({
    where: {
      messageId: interaction.message.id,
    },
  });
};

const findUnownedGame = async (prisma: PrismaClient, interaction: MessageComponentInteraction): Promise<Game> => {
  const games = await prisma.game.findMany({
    where: {
      messageId: null,
      channelId: interaction.channelId,
    },
    orderBy: [
      { id: 'desc' }
    ]
  });

  if (games.length === 0) {
    // we need to error here, no games!?
    throw new Error('There\'s no game that matches the channel id');
  }

  if (games.length > 1) {
    // clean up
    await prisma.game.deleteMany({
      where: {
        id: { in: games.map((game: Game) => { return game.id; }) }
      }
    });
  }

  return await prisma.game.update({
    data: {
      messageId: interaction.message.id,
    },
    where: {
      id: games[0].id,
    }
  });
};

const findGame = async (prisma: PrismaClient, interaction: MessageComponentInteraction): Promise<Game> => {
  return await findOwnedGame(prisma, interaction) ?? await findUnownedGame(prisma, interaction);
};
