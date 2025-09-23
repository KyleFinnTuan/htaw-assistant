import { EmbedBuilder, Events, Guild } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class GuildCreate extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.GuildCreate,
      description: "Event when the bot joins a new guild",
      once: false,
    });
  }
  async execute(guild: Guild) {
    try {
      if (!(await GuildConfig.exists({ guildId: guild.id })))
        await GuildConfig.create({ guildId: guild.id });
    } catch (error) {
      console.error("Error deleting guild config:", error);
    }

    const owner = await guild.fetchOwner();
    owner?.send({ embeds:[ new EmbedBuilder()
        .setColor("Green")
        .setTitle(`Welcome to ${guild.name}!`)  
        
    ]})
    .catch();
  }
}
