import type { Client } from 'discord.js';

import { commands } from '../commands';
import { logger } from '../utils/logger';

export const ready = (client: Client): void => {
  client.on('ready', async () => {
    if ((client.user == null) || (client.application == null)) {
      return;
    }

    // await client.application.commands.set();
    await client.application.commands.set(commands);

    logger.info(`${client.user.username} is online - ShardId: (${(client.shard?.ids ?? [0]).toString()})`);
  });
};
