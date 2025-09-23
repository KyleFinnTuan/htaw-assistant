"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
class Timeout extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "timeout",
            description: "timeout a user",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.MuteMembers,
            dev: false,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "add",
                    description: "add a timeout to a user",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "the user to timeout",
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "length",
                            description: "the duration of the timeout",
                            type: discord_js_1.ApplicationCommandOptionType.String,
                            required: false,
                            choices: [
                                { name: "5 minutes", value: "5" },
                                { name: "10 minutes", value: "10" },
                                { name: "15 minutes", value: "15" },
                                { name: "30 minutes", value: "30" },
                                { name: "1 hour", value: "60" },
                                { name: "2 hours", value: "120" },
                                { name: "6 hours", value: "360" },
                                { name: "12 hours", value: "720" },
                                { name: "1 day", value: "1440" },
                                { name: "2 days", value: "2880" },
                                { name: "3 days", value: "4320" },
                                { name: "1 week", value: "10080" },
                                { name: "2 weeks", value: "20160" },
                                { name: "3 weeks", value: "30240" },
                                { name: "4 weeks", value: "40320" },
                            ],
                        },
                        {
                            name: "reason",
                            description: "the reason for the timeout",
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
                {
                    name: "remove",
                    description: "remove a timeout to a user",
                    type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "the user to remove the timeout from",
                            type: discord_js_1.ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "the reason for the untiming out the user",
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
exports.default = Timeout;
