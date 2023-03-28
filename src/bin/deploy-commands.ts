import * as dotenv from 'dotenv';

import { REST, Routes } from 'discord.js';

import { commands } from '../commands';
import type { Command } from '../data-types/command';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const token = process.env.BOT_TOKEN!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const clientId = process.env.BOT_CLIENT_ID!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const guildId = process.env.GUILD_ID!;

const cmds = commands.map((command: Command) => ({
  description: command.description,
  name: command.name,
  options: command.options
}));


const rest = new REST({ version: '10' }).setToken(token);


rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: cmds })
  .then(() => { console.log('Successfully registered application commands.'); })
  .catch(console.error);

rest.put(Routes.applicationCommands(clientId), { body: [] })
  .then(() => { console.log('Successfully registered global commands.'); })
  .catch(console.error);
