import type {
  ChatInputCommandInteraction,
  Client,
  Interaction,
  MessageComponentInteraction
} from 'discord.js';

import { commands } from '../commands';

import type { Command } from '../data-types/command';
import { logger } from '../utils/logger';

import { createDBClient, destroyDBClient } from '../utils/db';

export const interactionCreate = (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    // console.dir(interaction, { depth: 2 });
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction);
    }

    if (interaction.isButton()) {
      await handleButtonClick(interaction);
    }
  });
};

const handleSlashCommand = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const slashCommand: Command | undefined = commands.find((command: Command) => command.name === interaction.commandName);

  if (slashCommand == null) {
    await interaction.followUp({ content: 'Unknown command' });
    logger.error({}, 'Unknown slash command sent: ' + interaction.commandName);
    return;
  }

  await interaction.deferReply();

  const prisma = createDBClient();

  try {
    await slashCommand.run(interaction, prisma);
  } catch (err) {
    logger.error({ err }, 'Error while handling slash command');
    await interaction.editReply({ content: 'Unknown error' });
    await destroyDBClient(prisma);
  }
};

const handleButtonClick = async (interaction: MessageComponentInteraction): Promise<void> => {
  const slashCommand: Command | undefined = commands.find((command: Command) => command.name === interaction.message.interaction?.commandName ?? '');

  if (slashCommand == null) {
    await interaction.followUp({ content: 'Unknown command' });
    return;
  }

  if (slashCommand.click === undefined) {
    await interaction.followUp({ content: 'Command does not know how to click!?' });
    return;
  }

  const prisma = createDBClient();

  try {
    await slashCommand.click(interaction, prisma);
  } catch (err) {
    logger.error({ err }, 'Error while handling slash command');
    await interaction.editReply({ content: 'Unknown error' });
    await destroyDBClient(prisma);
  }
};
