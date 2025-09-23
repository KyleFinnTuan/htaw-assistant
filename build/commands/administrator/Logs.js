"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
class Logs extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "logs",
            description: "Configure the logs for your server",
            category: Category_1.default.Administrator,
            default_member_permissions: discord_js_1.PermissionFlagsBits.Administrator,
            dm_permission: false,
            dev: false,
            cooldown: 5,
            options: [
                {
                    name: "toggle",
                    description: "Toggle a logs for your server",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "log-type",
                            description: "The type of log to toggle",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                            choices: [{ name: "Moderation Logs", value: "moderation" }],
                        },
                        {
                            name: "toggle",
                            description: "toggle the log",
                            type: discord_js_1.ApplicationCommandOptionType.Boolean,
                            required: true,
                        },
                    ],
                },
                {
                    name: "set",
                    description: "TSet the logs channel for your server",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "log-type",
                            description: "The type of log to set",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                            choices: [{ name: "Moderation Logs", value: "moderation" }],
                        },
                        {
                            name: "channel",
                            description: "The channel to set the log to",
                            type: discord_js_1.ApplicationCommandOptionType.Channel,
                            required: true,
                            channel_types: [discord_js_1.ChannelType.GuildText]
                        },
                    ],
                },
            ],
        });
    }
}
exports.default = Logs;
