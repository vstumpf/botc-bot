import { Client, GatewayIntentBits } from 'discord.js';

import { ready, interactionCreate } from './events';

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

  await client.login('MTA4OTcwNzA4NTg1NzU3NDkyMg.G3xvIJ.JaPJeqOczO6OODDQcI7ulMMrpp9BlXw5koJMFE');
};

void setup();
