import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Ban extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "ban",
      description: "Ban or unban a member from the server",
      category: Category.Moderation,
      default_member_permissions: PermissionFlagsBits.BanMembers,
      dm_permission: false,
      dev: false,
      cooldown: 5,
      options: [
        {
          name: "add",
          description: "Ban a member from the server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "target",
              description: "The user to ban",
              type: ApplicationCommandOptionType.User,
              required: true,
            },
            {
              name: "reason",
              description: "The reason for the ban",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: "days",
              description: "Delte the user's recent messages",
              type: ApplicationCommandOptionType.Integer,
              required: false,
              choices: [
                { name: "Don't delete any messages", value: "0" },
                { name: "Delete messages from the last 1 day", value: "86400" },
                { name: "Delete messages from the last 2 days", value: "172800" },
                { name: "Delete messages from the last 3 days", value: "259200" },
                { name: "Delete messages from the last 4 days", value: "345600" },
                { name: "Delete messages from the last 5 days", value: "432000" },
                { name: "Delete messages from the last 6 days", value: "518400" },
                { name: "Delete messages from the last 7 days", value: "604800" },
              ],
            },
            {
              name: "silent",
              description: "don't send a message to the channel",
              type: ApplicationCommandOptionType.Boolean,
              required: false,
            },
          ],
        },
        {
          name: "remove",
          description: "unBan a member from the server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "target",
              description: "enter the user id to unban",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: "reason",
              description: "The reason for the ban",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
            {
              name: "silent",
              description: "don't send a message to the channel",
              type: ApplicationCommandOptionType.Boolean,
              required: false,
            },
          ],
        },
      ],
    });
  }
}
