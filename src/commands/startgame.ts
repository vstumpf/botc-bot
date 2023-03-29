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

import type { Command } from '../data-types/command';


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
  run: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    await runCommand(interaction);
  },
  click: async (interaction: MessageComponentInteraction): Promise<void> => {
    await handleClick(interaction);
  }
};

const runCommand = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const daytime = interaction.options.getChannel('daytime');
  const nighttime = interaction.options.getChannel('nighttime');

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

const handleClick = async (interaction: MessageComponentInteraction): Promise<void> => {
  await interaction.update({ content: `${interaction.customId} message Pressed!` });
};
