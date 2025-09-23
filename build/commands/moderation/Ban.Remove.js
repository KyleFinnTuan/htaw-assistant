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
class BanRemove extends SubCommand_1.default {
    constructor(client) {
        super(client, {
            name: "ban.remove",
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const target = interaction.options.getString("target");
            const reason = interaction.options.getString("reason") || "No reason provided";
            const silent = interaction.options.getBoolean("silent") || false;
            const errorEmbed = new discord_js_1.EmbedBuilder().setColor("Red");
            if (reason.length > 512)
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | Reason must be less than 512 characters."),
                    ],
                    ephemeral: true,
                });
            try {
                yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.bans.fetch(target));
            }
            catch (err) {
                return interaction.reply({
                    embeds: [errorEmbed.setDescription("❌ | This user is not banned.")],
                    ephemeral: true,
                });
            }
            try {
                yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.bans.remove(target));
            }
            catch (err) {
                return interaction.reply({
                    embeds: [
                        errorEmbed.setDescription("❌ | an error occurred while unbanning user."),
                    ],
                    ephemeral: true,
                });
            }
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`🔨 | ${target} has been unbanned.`),
                ],
                ephemeral: true,
            });
            if (!silent && interaction.channel) {
                if (interaction.channel instanceof discord_js_1.TextChannel ||
                    interaction.channel instanceof discord_js_1.NewsChannel ||
                    interaction.channel instanceof discord_js_1.ThreadChannel) {
                    interaction.channel.send({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("Green")
                                .setAuthor({ name: `✅ Unban | ${target}` })
                                .setDescription(`**Reason:** ${reason}`)
                                .setFooter({ text: `id: ${target}` })
                                .setTimestamp(),
                        ],
                    })
                        .then((msg) => __awaiter(this, void 0, void 0, function* () { return yield msg.react("🙌"); }));
                }
            }
            const guild = yield GuildConfig_1.default.findOne({ guildId: interaction.guildId });
            if (guild &&
                ((_d = (_c = guild.logs) === null || _c === void 0 ? void 0 : _c.moderation) === null || _d === void 0 ? void 0 : _d.enabled) &&
                ((_f = (_e = guild.logs) === null || _e === void 0 ? void 0 : _e.moderation) === null || _f === void 0 ? void 0 : _f.channelId))
                (_h = ((yield ((_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.channels.fetch(guild.logs.moderation.channelId))))) === null || _h === void 0 ? void 0 : _h.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Green")
                            .setAuthor({ name: `✅ Unban | ${target}` })
                            .setDescription(`**User:** ${target}
            **Reason:** ${reason}`)
                            .setTimestamp()
                            .setFooter({
                            text: `Unbanned by ${interaction.user.tag} | ${interaction.user.id}`,
                            iconURL: interaction.user.displayAvatarURL({}),
                        }),
                    ],
                });
        });
    }
}
exports.default = BanRemove;
