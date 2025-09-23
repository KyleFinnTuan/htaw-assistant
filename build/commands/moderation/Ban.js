"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
class Ban extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Ban or unban a member from the server",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.BanMembers,
            dm_permission: false,
            dev: false,
            cooldown: 5,
            options: [
                {
                    name: "add",
                    description: "Ban a member from the server",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "The user to ban",
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for the ban",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "days",
                            description: "Delte the user's recent messages",
                            type: discord_js_1.ApplicationCommandOptionType.Integer,
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
                            type: discord_js_1.ApplicationCommandOptionType.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "unBan a member from the server",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "enter the user id to unban",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for the ban",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "silent",
                            description: "don't send a message to the channel",
                            type: discord_js_1.ApplicationCommandOptionType.Boolean,
                            required: false,
                        },
                    ],
                },
            ],
        });
    }
}
exports.default = Ban;
