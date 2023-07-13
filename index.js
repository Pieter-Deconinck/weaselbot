import dotenv from "dotenv";
import { ChatGPTAPI } from "chatgpt";
import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";
import readline from "readline";

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

let prompts = [];

// Read file and parse the prompts
const readInterface = readline.createInterface({
  input: fs.createReadStream("prompts.csv"),
  console: false,
});

readInterface.on("line", function (line) {
  prompts = line.split(",");
});

// login to discord bot
client.login(process.env.DISCORD_TOKEN);

// listen to messages for .sorry
client.on("messageCreate", async (message) => {
  if (message.content == ".sorry") {
    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
      completionParams: {
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        top_p: 0.8,
      },
    });

    // get randomprompt from prompts array and insert it into chatgpt
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    const res = await api.sendMessage(`you're making a joke about ${randomPrompt} start the joke with: I'm sorry I cant make it because`);

    // send joke back to discord
    message.channel.send(res.text);
  }
});

console.log(`bot is up`);
