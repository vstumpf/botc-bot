import type {
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  MessageComponentInteraction
} from 'discord.js';

import type { PrismaClient } from '@prisma/client';

export interface Command extends ChatInputApplicationCommandData {
  run: (
    interaction: ChatInputCommandInteraction,
    dbclient: PrismaClient,
  ) => Promise<void>
  click?: (
    interaction: MessageComponentInteraction,
    dbclient: PrismaClient,
  ) => Promise<void>
}
