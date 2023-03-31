import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';

import { ready, interactionCreate } from './events';

const DEBUG = process.env.NODE_ENV !== 'production';

if (DEBUG) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const setup = async (): Promise<void> => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
    ]
  });

  // client.on('ready', () => {
  //   console.log(`logged in as ${client.user?.tag ?? 'not found'}!`);
  // });

  ready(client);
  interactionCreate(client);

  await client.login(process.env.BOT_TOKEN);
};

void setup();
