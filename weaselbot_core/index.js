import dotenv from "dotenv";
import { ChatGPTAPI } from "chatgpt";
import { Client, GatewayIntentBits } from "discord.js";
import fs from "fs";

// Read Discord & Chatgpt API tokens
dotenv.config();

// Initiate Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

try {
  // Read prompts & put them in array
  const data = fs.readFileSync("prompts.csv", "utf8");
  const prompts = data.split(",");

  // login to discord bot
  client.login(process.env.DISCORD_TOKEN);

  // listen to messages for .sorry
  client.on("messageCreate", async (message) => {
    try {
      if (message.content == ".sorry" || message.content == "!sorry" || message.content == "-sorry" || message.content == "/sorry") {
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
    } catch (error) {
      const errorMoment = new Date().toString();
      console.error(errorMoment);
      console.error(`Something went wrong in the messageCreate event handler`);
      console.error(error);
    }
  });
  const update = new Date().toString();
  console.log(update);
  console.log(`bot is up`);
} catch (error) {
  const errorMoment = new Date().toString();
  console.error(errorMoment);
  console.error(`Something went wrong in the main setup`);
  console.error(error);
}
