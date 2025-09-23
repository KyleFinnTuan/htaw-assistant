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
const Category_1 = __importDefault(require("../../base/enums/Category"));
const Command_1 = __importDefault(require("../../base/classes/Command"));
const { version, dependencies } = require(`${process.cwd()}/package.json`);
const ms_1 = __importDefault(require("ms"));
const os_1 = __importDefault(require("os"));
class botInfo extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "botinfo",
            description: "Shows information about the bot.",
            category: Category_1.default.Utilities,
            default_member_permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            options: [],
            dm_permission: false,
            cooldown: 3,
            dev: false,
        });
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setThumbnail(this.client.user.displayAvatarURL())
                        .setColor("Random")
                        .setDescription(`__**Bot Info**__
                    > **User:** \'${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.tag}\' - \`${(_b = this.client.user) === null || _b === void 0 ? void 0 : _b.id}\`
                    > **Account Created:** 📅 <t:${(this.client.user.createdTimestamp / 1000).toFixed(0)}:D>
                    > **Commands:** \`${this.client.commands.size}\`
                    > **Version:** \`${version}\`
                    > **NodeJS Version:** \`${process.version}\`
                    > **Dependencies ${Object.keys(dependencies).length}:** \`${Object.keys(dependencies).map((p) => (`${p}-@${dependencies[p]}`).replace(/\^/g, "")).join(", ")}\`
                    > **Uptime:** \`${(0, ms_1.default)(this.client.uptime, {
                        long: false,
                    })}\`\

                    __**Guild Info**__
                    > **Total Guilds:** \`${(yield this.client.guilds.fetch()).size}\`

                    __**System Info**__
                    > **Operating System:** \`${process.platform}\`
                    > **CPU:** \`${os_1.default.cpus()[0].model.trim()}\`
                    > **Memory:** \`${this.formatBytes(process.memoryUsage().heapUsed)}\`/\`${this.formatBytes(os_1.default.totalmem())}\`

                    __**Development Team:**__
                    > **Creator/owner:** \`KyleFinnTuan\`
                    > **Developer:** \`KyleFinnTuan\`
                    `),
                ],
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                        .setLabel("Invite Me")
                        .setStyle(discord_js_1.ButtonStyle.Link)
                        .setURL("https://discord.com/oauth2/authorize?client_id=1179965231498268793&permissions=8&integration_type=0&scope=bot+applications.commands"), new discord_js_1.ButtonBuilder()
                        .setLabel("Support Server")
                        .setStyle(discord_js_1.ButtonStyle.Link)
                        .setURL("https://discord.com/oauth2/authorize?client_id=1179965231498268793&permissions=8&integration_type=0&scope=bot+applications.commands"), new discord_js_1.ButtonBuilder()
                        .setLabel("Website")
                        .setStyle(discord_js_1.ButtonStyle.Link)
                        .setURL("https://discord.com/oauth2/authorize?client_id=1179965231498268793&permissions=8&integration_type=0&scope=bot+applications.commands")),
                ],
            });
        });
    }
    formatBytes(bytes) {
        if (bytes == 0)
            return "0";
        const size = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${size[i]}`;
    }
}
exports.default = botInfo;
