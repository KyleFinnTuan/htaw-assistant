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
class clear extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "clear",
            description: "Clear channel or user messages",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.ManageMessages,
            options: [
                {
                    name: "ammount",
                    description: "The ammount of messages to clear - Max 100",
                    type: discord_js_1.ApplicationCommandOptionType.Integer,
                    required: true,
                },
                {
                    name: "target",
                    description: "Select a user to delete messages from - Default is all users",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: false,
                },
                {
                    name: "channel",
                    description: "Select a channel to clear messages from - Default is the current channel",
                    type: discord_js_1.ApplicationCommandOptionType.Channel,
                    required: false,
                    channel_types: [discord_js_1.ChannelType.GuildText],
                },
                {
                    name: "silent",
                    description: "Don't send a message to the channel",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
            cooldown: 5,
            dm_permission: false,
            dev: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            let ammount = interaction.options.getInteger("ammount");
            const channel = (interaction.options.getChannel("channel") ||
                interaction.channel);
            const target = interaction.options.getMember("target");
            const silent = interaction.options.getBoolean("silent");
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (ammount < 1 || ammount > 100) {
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | Please provide a valid ammount between 1 and 100"),
                    ],
                    ephemeral: true,
                });
            }
            const messages = yield channel.messages.fetch({ limit: 100 });
            var filterMessages = target
                ? messages.filter((m) => m.author.id === target.id)
                : messages;
            let deleted = 0;
            try {
                deleted = (yield channel.bulkDelete(Array.from(filterMessages.keys()).slice(0, ammount), true)).size;
            }
            catch (_j) {
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | an error occured while trying to clear messages"),
                    ],
                    ephemeral: true,
                });
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`✅ | **Deleted** \`${deleted}\` messages ${target ? `from ${target}` : ""} in ${channel}`),
                ],
                ephemeral: true,
            });
            if (!silent && interaction.channel) {
                if (interaction.channel instanceof discord_js_1.TextChannel ||
                    interaction.channel instanceof discord_js_1.NewsChannel ||
                    interaction.channel instanceof discord_js_1.ThreadChannel) {
                    interaction.channel
                        .send({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("Orange")
                                .setAuthor({ name: `🧹 Clear | ${channel.name}` })
                                .setDescription(`**Deleted:**: ${deleted} messages`)
                                .setTimestamp()
                                .setThumbnail(target ? target.user.displayAvatarURL({ size: 128 }) : ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.iconURL({ size: 128 })) || null)
                                .setFooter({
                                text: `Messages: ${target ? target.user.tag : "All"} Messages in ${channel.name}`,
                            })
                        ]
                    })
                        .then((msg) => __awaiter(this, void 0, void 0, function* () { return yield msg.react("🧹"); }));
                }
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            if (guild &&
                ((_c = (_b = guild.logs) === null || _b === void 0 ? void 0 : _b.moderation) === null || _c === void 0 ? void 0 : _c.enabled) &&
                ((_e = (_d = guild.logs) === null || _d === void 0 ? void 0 : _d.moderation) === null || _e === void 0 ? void 0 : _e.channelId))
                (_g = ((yield ((_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.channels.fetch(guild.logs.moderation.channelId))))) === null || _g === void 0 ? void 0 : _g.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Orange")
                            .setAuthor({ name: `🧹 Clear` })
                            .setThumbnail(target ? target.user.displayAvatarURL({ size: 128 }) : ((_h = interaction.guild) === null || _h === void 0 ? void 0 : _h.iconURL({ size: 128 })) || null)
                            .setDescription(`**Channel:** ${channel} - \`${channel.id}\`
            **Messages:** ${target ? target : "All"}
            **Ammount:** \`${deleted}\``)
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
exports.default = clear;
