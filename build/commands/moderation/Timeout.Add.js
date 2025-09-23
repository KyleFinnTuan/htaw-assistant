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
const ms_1 = __importDefault(require("ms"));
const GuildConfig_1 = __importDefault(require("../../base/schemas/GuildConfig"));
class TimeoutAdd extends SubCommand_1.default {
    constructor(client) {
        super(client, {
            name: "timeout.add",
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const target = interaction.options.getMember("target");
            const length = parseInt(interaction.options.getString("length") || "5", 10);
            const reason = interaction.options.getString("reason") || "No reason provided";
            const silent = interaction.options.getBoolean("silent") || false;
            const msLength = Math.min(Math.max(length * 60 * 1000, 60000), 2419200000);
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (!target) {
                errorEmbed.setDescription("❌ | User not found");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            if (!target.moderatable) {
                errorEmbed.setDescription("❌ | I cannot timeout this user");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            if (target.roles.highest.position >=
                interaction.member.roles.highest.position) {
                errorEmbed.setDescription("❌ | You cannot timeout this user");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            if (target.id === interaction.user.id) {
                errorEmbed.setDescription("❌ | You cannot timeout yourself");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            if (target.communicationDisabledUntil !== null &&
                target.communicationDisabledUntil > new Date()) {
                errorEmbed.setDescription(`❌ | ${target} is already timed out until <t:${Math.floor(target.communicationDisabledUntil.getTime() / 1000)}:F>`);
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            if (isNaN(msLength) || msLength < 60000 || msLength > 2419200000) {
                errorEmbed.setDescription("❌ | Duration must be between 1 minute and 28 days");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            if (reason.length > 512) {
                errorEmbed.setDescription("❌ | Reason must be less than 512 characters.");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            try {
                yield target.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Blue")
                            .setTitle(`⌛ | You have been timed out in ${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.name}.`)
                            .addFields({ name: "Reason", value: `${reason}` }, {
                            name: "Moderator",
                            value: `${interaction.user.tag} | ${interaction.user.id}`,
                        }, { name: "until", value: `<t:${Math.floor((Date.now() + msLength) /
                                1000)}:F>` })
                            .setDescription(`If you think this is a mistake or if you have any questions please contact the server staff.`)
                            .setTimestamp()
                            .setFooter({
                            text: silent
                                ? "This was a silent timeout."
                                : "This timeout was publicly announced.",
                        })
                            .setImage(((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.bannerURL({ size: 2048 })) ||
                            ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.iconURL({ size: 2048 })) ||
                            ""),
                    ],
                });
            }
            catch (_k) {
                // do nothing
            }
            try {
                yield target.timeout(msLength, reason);
            }
            catch (_l) {
                errorEmbed.setDescription("❌ | I was unable to timeout this user");
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("Green").setDescription(`✅ | Successfully timed out ${target} for ${(0, ms_1.default)(msLength, {
                        long: true,
                    })}.`),
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
                                .setColor("Blue")
                                .setAuthor({ name: ` ⌛ Timeout | ${target.user.tag}` })
                                .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
                                .setDescription(`**Reason:** ${reason}
                        this user will be timed out for ${(0, ms_1.default)(msLength, {
                                long: true,
                            })}.`),
                        ],
                    })
                        .then((msg) => __awaiter(this, void 0, void 0, function* () { return yield msg.react("⌛"); }));
                }
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            if (guild &&
                ((_e = (_d = guild.logs) === null || _d === void 0 ? void 0 : _d.moderation) === null || _e === void 0 ? void 0 : _e.enabled) &&
                ((_g = (_f = guild.logs) === null || _f === void 0 ? void 0 : _f.moderation) === null || _g === void 0 ? void 0 : _g.channelId))
                (_j = ((yield ((_h = interaction.guild) === null || _h === void 0 ? void 0 : _h.channels.fetch(guild.logs.moderation.channelId))))) === null || _j === void 0 ? void 0 : _j.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Blue")
                            .setAuthor({ name: `⌛ Timeout | ${target.user.tag}` })
                            .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
                            .setDescription(`**User:** ${target.user.tag} | ${target.id}
              **Reason:** ${reason}
              this user will be timed out for ${(0, ms_1.default)(msLength, { long: true })}.`)
                            .setTimestamp()
                            .setFooter({
                            text: `muted by ${interaction.user.tag} | ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({}),
                        }),
                    ],
                });
        });
    }
}
exports.default = TimeoutAdd;
