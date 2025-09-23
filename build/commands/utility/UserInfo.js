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
class UserInfo extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "userinfo",
            description: "Get info about a user",
            category: Category_1.default.Utilities,
            default_member_permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            options: [
                {
                    name: "user",
                    description: "The user to get info about",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
            cooldown: 3,
            dev: false,
            dm_permission: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const target = (interaction.options.getMember("user") ||
                interaction.member);
            yield interaction.deferReply({ ephemeral: true });
            const fetchedMember = yield target.fetch();
            return interaction.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(fetchedMember.user.accentColor || "Green")
                        .setAuthor({
                        name: `${fetchedMember.user.tag} profile`,
                        iconURL: fetchedMember.displayAvatarURL(),
                    })
                        .setDescription(`
                __**User Info**__
                > **ID:** ${fetchedMember.user.id}
                > **Bot:** \`${fetchedMember.user.bot ? "Yes" : "No"}\`
                > **Account Created:** 📅 <t:${(fetchedMember.user.createdTimestamp / 1000).toFixed(0)}:D>
                 
                __**Member Info**__
                > **Nickname:** ${fetchedMember.nickname || fetchedMember.user.username}
                > **Roles:(${fetchedMember.roles.cache.size - 1}):** ${fetchedMember.roles.cache
                        .map((role) => role)
                        .join(", ")
                        .replace("@everyone", "") || "None"}
                > **Admin:** \`${fetchedMember.permissions.has(discord_js_1.PermissionFlagsBits.Administrator)}\`
                > **Joined Server:** 📅 <t:${(fetchedMember.joinedTimestamp / 1000).toFixed(0)}:D>
                > **Boosted:** ${fetchedMember.premiumSince
                        ? `<t:${fetchedMember.premiumSince.getTime() / 1000}:R>`
                        : "No"}
                > **Join Position:** \`#${this.GetJoinPosition(interaction, fetchedMember) + 1} / #${(_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.memberCount}\``),
                ],
            });
        });
    }
    GetJoinPosition(interaction, target) {
        var _a;
        let pos = null;
        const joinPosition = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
        Array.from(joinPosition).find((member, index) => {
            if (member[0] === target.user.id)
                pos = index;
        });
        return pos;
    }
}
exports.default = UserInfo;
