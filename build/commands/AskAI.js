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
const generative_ai_1 = require("@google/generative-ai");
const Command_1 = __importDefault(require("../base/classes/Command"));
const Category_1 = __importDefault(require("../base/enums/Category"));
class AskAI extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "ask",
            description: "Ask the AI a question",
            category: Category_1.default.Utilities,
            default_member_permissions: discord_js_1.PermissionFlagsBits.UseApplicationCommands,
            dm_permission: true,
            cooldown: 5,
            options: [
                {
                    name: "question",
                    description: "What would you like to ask?",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
            dev: false,
        });
        this.genAI = new generative_ai_1.GoogleGenerativeAI(this.client.config.geminiApiKey);
    }
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = interaction.options.getString("question", true);
            yield interaction.deferReply();
            try {
                const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const result = yield model.generateContent(question);
                const response = result.response.text();
                if (!response || response.length === 0) {
                    throw new Error("Empty response received");
                }
                const embed = new discord_js_1.EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({
                    name: "AI Response",
                    iconURL: interaction.client.user.displayAvatarURL(),
                })
                    .setDescription(response)
                    .setFooter({
                    text: `Asked by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                    .setTimestamp();
                yield interaction.editReply({ embeds: [embed] });
            }
            catch (error) {
                console.error("AI Error:", error);
                const errorEmbed = new discord_js_1.EmbedBuilder()
                    .setColor("Red")
                    .setDescription("❌ | Sorry, I had trouble generating a response. Please try again later.");
                yield interaction.editReply({ embeds: [errorEmbed] });
            }
        });
    }
}
exports.default = AskAI;
