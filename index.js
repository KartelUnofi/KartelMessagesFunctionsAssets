import { Client, GatewayIntentBits } from 'discord.js';
import config from './config.json' assert { type: 'json' };
import { randomMessage } from './messages.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  setInterval(sendRandomToAllGuilds, config.sendIntervalMinutes * 60 * 1000);
});

async function sendRandomToAllGuilds() {
  for (const guild of client.guilds.cache.values()) {
    const channel = guild.channels.cache.find(
      ch => ch.isTextBased() && ch.permissionsFor(guild.members.me).has('SendMessages')
    );
    if (!channel) continue;
    try {
      await channel.send(randomMessage());
    } catch (e) {
      console.error('Failed to send message:', e.message);
    }
  }
}

client.login(config.token);
