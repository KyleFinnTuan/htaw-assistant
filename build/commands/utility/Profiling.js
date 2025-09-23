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
const discord_arts_1 = require("discord-arts");
class Profiling extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "profile",
            description: "View your profile",
            category: Category_1.default.Utilities,
            default_member_permissions: discord_js_1.PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: true,
            cooldown: 3,
            options: [
                {
                    name: "target",
                    description: "The user to view the profile of",
                    type: discord_js_1.ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
            dev: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const user = interaction.options.getUser("target") || interaction.user;
            const member = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(user.id);
            yield interaction.deferReply({ ephemeral: false }); // must be false for image
            const buffer = yield (0, discord_arts_1.Profile)(user.id, {
                borderColor: ["#841821", "#005b58"],
                badgesFrame: true,
                removeAvatarFrame: false,
                presenceStatus: ((_b = member === null || member === void 0 ? void 0 : member.presence) === null || _b === void 0 ? void 0 : _b.status) || "offline",
                customDate: user.createdAt,
            });
            const attachment = new discord_js_1.AttachmentBuilder(buffer).setName(`${user.username}_profile.png`);
            const fetchedUser = yield user.fetch();
            const colour = (_c = fetchedUser.accentColor) !== null && _c !== void 0 ? _c : 0x00ff00;
            yield interaction.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor(colour)
                        .setDescription(`**${user.username}'s profile**`)
                        .setImage(`attachment://${user.username}_profile.png`),
                ],
                files: [attachment],
            });
        });
    }
}
exports.default = Profiling;
