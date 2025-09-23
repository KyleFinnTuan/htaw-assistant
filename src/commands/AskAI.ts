import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";

export default class AskAI extends Command {
  private genAI: GoogleGenerativeAI;

  constructor(client: CustomClient) {
    super(client, {
      name: "ask",
      description: "Ask the AI a question",
      category: Category.Utilities,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      dm_permission: true,
      cooldown: 5,
      options: [
        {
          name: "question",
          description: "What would you like to ask?",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      dev: false,
    });

    this.genAI = new GoogleGenerativeAI(this.client.config.geminiApiKey);
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString("question", true);

    await interaction.deferReply();

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(question);
      const response = result.response.text();

      if (!response || response.length === 0) {
        throw new Error("Empty response received");
      }

      const embed = new EmbedBuilder()
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

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("AI Error:", error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ | Sorry, I had trouble generating a response. Please try again later.");

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}