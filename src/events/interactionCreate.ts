import type { ChatInputCommandInteraction, Client, Interaction } from 'discord.js';

import { commands } from '../commands';

import type { Command } from '../data-types/command';
import { logger } from '../utils/logger';

export const interactionCreate = (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    // logger.info(interaction);
    if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction);
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

  try {
    await slashCommand.run(interaction);
  } catch (err) {
    logger.error({ err }, 'Error while handling slash command');
    await interaction.editReply({ content: 'Unknown error' });
  }
};
