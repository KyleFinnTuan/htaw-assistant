import { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Logs extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "logs",
      description: "Configure the logs for your server",
      category: Category.Administrator,
      default_member_permissions: PermissionFlagsBits.Administrator,
      dm_permission: false,
      dev: false,
      cooldown: 5,
      options: [
        {
          name: "toggle",
          description: "Toggle a logs for your server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "log-type",
              description: "The type of log to toggle",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [{ name: "Moderation Logs", value: "moderation" }],
            },
            {
              name: "toggle",
              description: "toggle the log",
              type: ApplicationCommandOptionType.Boolean,
              required: true,
            },
          ],
        },
        {
          name: "set",
          description: "TSet the logs channel for your server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "log-type",
              description: "The type of log to set",
              type: ApplicationCommandOptionType.String,
              required: true,
              choices: [{ name: "Moderation Logs", value: "moderation" }],
            },
            {
              name: "channel",
              description: "The channel to set the log to",
              type: ApplicationCommandOptionType.Channel,
              required: true,
              channel_types: [ChannelType.GuildText]
            },
          ],
        },
      ],
    });
  }
}
