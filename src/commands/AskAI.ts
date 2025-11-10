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

      const MAX_EMBED_LENGTH = 4096;
      
      if (response.length <= MAX_EMBED_LENGTH) {
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
      } else {
        const chunks: string[] = [];
        let currentChunk = "";
        
        const paragraphs = response.split("\n");
        
        for (const paragraph of paragraphs) {
          if ((currentChunk + paragraph + "\n").length > MAX_EMBED_LENGTH) {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
              currentChunk = paragraph + "\n";
            } else {
              chunks.push(paragraph.substring(0, MAX_EMBED_LENGTH));
              currentChunk = paragraph.substring(MAX_EMBED_LENGTH) + "\n";
            }
          } else {
            currentChunk += paragraph + "\n";
          }
        }
        
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }

        const firstEmbed = new EmbedBuilder()
          .setColor("Blue")
          .setAuthor({
            name: "AI Response",
            iconURL: interaction.client.user.displayAvatarURL(),
          })
          .setDescription(chunks[0])
          .setFooter({ 
            text: `Asked by ${interaction.user.tag} | Part 1/${chunks.length}`,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setTimestamp();

        await interaction.editReply({ embeds: [firstEmbed] });

        for (let i = 1; i < chunks.length; i++) {
          const followUpEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(chunks[i])
            .setFooter({ 
              text: `Asked by ${interaction.user.tag} | Part ${i + 1}/${chunks.length}`,
              iconURL: interaction.user.displayAvatarURL()
            });

          await interaction.followUp({ embeds: [followUpEmbed] });
        }
      }

    } catch (error) {
      console.error("AI Error:", error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ | Sorry, I had trouble generating a response. Please try again later.");

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
}