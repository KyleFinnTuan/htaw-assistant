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
class Kick extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "kick",
            description: "Kick a member from the guild",
            category: Category_1.default.Moderation,
            default_member_permissions: discord_js_1.PermissionFlagsBits.KickMembers,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: [
                {
                    name: "target",
                    description: "The user to kick",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "reason",
                    description: "The reason for the kick",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Whether to kick the user silently (no notification)",
                    type: discord_js_1.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const target = interaction.options.getMember("target");
            const reason = interaction.options.getString("reason") || "No reason provided";
            const silent = interaction.options.getBoolean("silent") || false;
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (!target)
                return interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ | User not found.")],
                    ephemeral: true,
                });
            if (target.id === interaction.user.id)
                return interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ | You cannot kick yourself.")],
                    ephemeral: true,
                });
            if (target.roles.highest.position >=
                ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.roles).highest.position) {
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | You cannot kick a member with an equal or higher role."),
                    ],
                    ephemeral: true,
                });
            }
            if (!target.kickable) {
                errorEmbed.setDescription("❌ | I cannot kick this user.");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            if (reason.length > 512) {
                errorEmbed.setDescription("❌ | Reason cannot exceed 512 characters.");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            try {
                yield target.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Orange")
                            .setTitle(`👢 | You have been kicked from ${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name}`)
                            .addFields({ name: "Reason", value: reason }, { name: "Moderator",
                            value: `${interaction.user.tag} | ${interaction.user.id}`
                        })
                            .setTimestamp()
                            .setFooter({
                            text: silent
                                ? "This was a silent kick."
                                : "This kick was publicly announced.",
                        })
                            .setImage(((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.bannerURL({ size: 2048 })) ||
                            ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.iconURL({ size: 2048 })) ||
                            ""),
                    ],
                });
            }
            catch (_l) {
                // do nothing
            }
            try {
                yield target.kick(reason);
            }
            catch (_m) {
                errorEmbed.setDescription("❌ | An error occurred while trying to kick this user.");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Orange")
                        .setDescription(`✅ | Successfully kicked ${target} with id ${target.id}${silent ? " silently" : ""}.`),
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
                                .setThumbnail(target.displayAvatarURL({ size: 64 }))
                                .setAuthor({ name: `👢 kicked | ${target.user.tag}` })
                                .setDescription(`**Reason:** ${reason}`)
                                .setTimestamp()
                                .setFooter({ text: `ID: ${target.id}` }),
                        ],
                    })
                        .then((x) => __awaiter(this, void 0, void 0, function* () { return yield x.react("👢"); }));
                }
            }
            const guild = yield GuildConfig_1.default.findOne({
                guildId: interaction.guildId,
            });
            if (guild &&
                ((_f = (_e = guild.logs) === null || _e === void 0 ? void 0 : _e.moderation) === null || _f === void 0 ? void 0 : _f.enabled) &&
                ((_h = (_g = guild.logs) === null || _g === void 0 ? void 0 : _g.moderation) === null || _h === void 0 ? void 0 : _h.channelId))
                (_k = ((yield ((_j = interaction.guild) === null || _j === void 0 ? void 0 : _j.channels.fetch(guild.logs.moderation.channelId))))) === null || _k === void 0 ? void 0 : _k.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Orange")
                            .setAuthor({ name: `👢 Kicked | ${target.user.tag}` })
                            .setThumbnail(target.displayAvatarURL({ size: 128 }))
                            .setDescription(`**User:** ${target === null || target === void 0 ? void 0 : target.user.tag} | ${target.id} 
                  **Reason:** ${reason}`)
                            .setTimestamp()
                            .setFooter({
                            text: `Kicked by ${interaction.user.tag} | ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({}),
                        }),
                    ],
                });
        });
    }
}
exports.default = Kick;
