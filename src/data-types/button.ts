import type {
  ButtonBuilder,
  MessageComponentInteraction,
} from 'discord.js';

import type { Game } from '.prisma/client';

export interface Button {
  name: string
  builder: ButtonBuilder
  click: (
    game: Game,
    interaction: MessageComponentInteraction,
  ) => Promise<void>
};
