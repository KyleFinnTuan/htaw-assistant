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
const SubCommand_1 = __importDefault(require("../../base/classes/SubCommand"));
const GuildConfig_1 = __importDefault(require("../../base/schemas/GuildConfig"));
class BanAdd extends SubCommand_1.default {
    constructor(client) {
        super(client, {
            name: "ban.add",
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const target = interaction.options.getMember("target");
            const reason = interaction.options.getString("reason") || "No reason provided";
            const days = interaction.options.getInteger("days") || 0;
            const silent = interaction.options.getBoolean("silent") || false;
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (!target)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | Please provide a valid user to ban."),
                    ],
                    ephemeral: true,
                });
            if (target.id === interaction.user.id)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | You silly goose 🪿, you cannot ban yourself."),
                    ],
                    ephemeral: true,
                });
            if (target.roles.highest.position >=
                ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.roles).highest.position)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | You cannot ban user with higher or same role as you."),
                    ],
                    ephemeral: true,
                });
            if (!target.bannable)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | I cannot ban this user. They might have a higher role than me, or I don't have ban permissions."),
                    ],
                    ephemeral: true,
                });
            if (reason.length > 512)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | Reason must be less than 512 characters."),
                    ],
                    ephemeral: true,
                });
            yield (target === null || target === void 0 ? void 0 : target.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Red")
                        .setTitle(`🔨 | You have been banned from ${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.name}`)
                        .addFields({ name: "Reason", value: `${reason}` }, {
                        name: "Moderator",
                        value: `${interaction.user.tag} | ${interaction.user.id}`,
                    })
                        .setDescription(`If you think this is a mistake or if you have any questions please contact the server staff.`)
                        .setTimestamp()
                        .setFooter({
                        text: silent
                            ? "This was a silent ban."
                            : "This ban was publicly announced.",
                    })
                        .setImage(((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.bannerURL({ size: 2048 })) ||
                        ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.iconURL({ size: 2048 })) ||
                        ""),
                ],
            }).catch());
            try {
                yield (target === null || target === void 0 ? void 0 : target.ban({
                    deleteMessageSeconds: days,
                    reason: reason,
                }));
            }
            catch (error) {
                return interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`❌ | Failed to ban ${target.user.tag}.`),
                    ],
                    ephemeral: true,
                });
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`✅ | User ${target.user.tag} with ID ${target.id} has been banned.`),
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
                                .setColor("Red")
                                .setAuthor({ name: `🔨 Ban | ${target.user.tag}` })
                                .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
                                .setDescription(`**Reason:** ${reason}
                  this user will have their messages deleted from the last ${days / 86400} days.`)
                                .setFooter({ text: `id: ${target.id}` })
                                .setTimestamp(),
                        ],
                    })
                        .then((msg) => __awaiter(this, void 0, void 0, function* () { return yield msg.react("🔨"); }));
                }
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            if (guild &&
                ((_f = (_e = guild.logs) === null || _e === void 0 ? void 0 : _e.moderation) === null || _f === void 0 ? void 0 : _f.enabled) &&
                ((_h = (_g = guild.logs) === null || _g === void 0 ? void 0 : _g.moderation) === null || _h === void 0 ? void 0 : _h.channelId))
                (_k = ((yield ((_j = interaction.guild) === null || _j === void 0 ? void 0 : _j.channels.fetch(guild.logs.moderation.channelId))))) === null || _k === void 0 ? void 0 : _k.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: `🔨 Ban | ${target.user.tag}` })
                            .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
                            .setDescription(`**User:** ${target.user.tag} | ${target.id}
            **Reason:** ${reason}
            this user will have their messages deleted from the last **${days}** days.`)
                            .setTimestamp()
                            .setFooter({
                            text: `Banned by ${interaction.user.tag} | ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({}),
                        }),
                    ],
                });
        });
    }
}
exports.default = BanAdd;
