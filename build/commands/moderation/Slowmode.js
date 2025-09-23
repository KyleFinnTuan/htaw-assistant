"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../../base/classes/Command"));
const Category_1 = __importDefault(require("../../base/enums/Category"));
const GuildConfig_1 = __importDefault(require("../../base/schemas/GuildConfig"));
class Slowmode extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "slowmode",
            description: "Sets the slowmode for a channel.",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.ManageChannels,
            options: [
                {
                    name: "rate",
                    description: "Select the slowmode message rate.",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        { name: "none", value: 0 },
                        { name: "5 seconds", value: 5 },
                        { name: "10 seconds", value: 10 },
                        { name: "15 seconds", value: 15 },
                        { name: "30 seconds", value: 30 },
                        { name: "1 minute", value: 60 },
                        { name: "2 minutes", value: 120 },
                        { name: "5 minutes", value: 300 },
                        { name: "10 minutes", value: 600 },
                        { name: "15 minutes", value: 900 },
                        { name: "30 minutes", value: 1800 },
                        { name: "1 hour", value: 3600 },
                        { name: "2 hours", value: 7200 },
                        { name: "3 hours", value: 10800 },
                        { name: "4 hours", value: 14400 },
                        { name: "5 hours", value: 18000 },
                        { name: "6 hours", value: 21600 },
                    ],
                },
                {
                    name: "channel",
                    description: "Select the channel to set the slowmode for - Default is the current channel",
                    type: discord_js_1.ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_types: [discord_js_1.ChannelType.GuildText],
                },
                {
                    name: "reason",
                    description: "Reason for the slowmode change - Default is no reason",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Silently set the slowmode - Default is false",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
            cooldown: 3,
            dm_permission: false,
            dev: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const messageRate = interaction.options.getInteger("rate");
            const channel = (interaction.options.getChannel("channel") ||
                interaction.channel);
            const reason = interaction.options.getString("reason") || "No reason provided";
            const silent = interaction.options.getBoolean("silent") || false;
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (messageRate < 0 || messageRate > 21600)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | You can only set the slowmode between 0 and 6 hours (21600 seconds)"),
                    ],
                    ephemeral: true,
                });
            try {
                channel.setRateLimitPerUser(messageRate, reason);
            }
            catch (err) {
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | an error occurred while setting the slowmode."),
                    ],
                    ephemeral: true,
                });
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`✅ | Slowmode set to ${messageRate} seconds in ${channel.name}`),
                ],
                ephemeral: true,
            });
            if (!silent) {
                channel.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setAuthor({ name: `⏲️ Slowmode | ${channel.name}` })
                            .setDescription(`**Reason:** ${reason}
              Slowmode set to ${messageRate} seconds`)
                            .setTimestamp()
                            .setFooter({ text: `Channel ID: ${channel.id}` }),
                    ],
                })
                    .then((msg) => __awaiter(this, void 0, void 0, function* () { return yield msg.react("⏲️"); }));
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            if (guild &&
                ((_b = (_a = guild.logs) === null || _a === void 0 ? void 0 : _a.moderation) === null || _b === void 0 ? void 0 : _b.enabled) &&
                ((_d = (_c = guild.logs) === null || _c === void 0 ? void 0 : _c.moderation) === null || _d === void 0 ? void 0 : _d.channelId))
                (_f = ((yield ((_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.channels.fetch(guild.logs.moderation.channelId))))) === null || _f === void 0 ? void 0 : _f.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setAuthor({ name: `⏲️ Slowmode Clear` })
                            .setThumbnail(`${(_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.iconURL({ size: 128 })}`)
                            .setDescription(`**Channel:** ${channel} - \`${channel.id}\`
                **Reason:** ${reason}
                **Slowmode:** \`${messageRate}\` seconds`)
                            .setTimestamp()
                            .setFooter({
                            text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({}),
                        }),
                    ],
                });
        });
    }
}
exports.default = Slowmode;
