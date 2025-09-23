import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  GuildMemberRoleManager,
  NewsChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class BanRemove extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "ban.remove",
    });
  }
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getString("target");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (reason.length > 512)
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription("❌ | Reason must be less than 512 characters."),
        ],
        ephemeral: true,
      });

    try {
      await interaction.guild?.bans.fetch(target!);
    } catch (err) {
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ | This user is not banned.")],
        ephemeral: true,
      });
    }

    try {
      await interaction.guild?.bans.remove(target!);
    } catch (err) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription("❌ | an error occurred while unbanning user."),
        ],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`🔨 | ${target} has been unbanned.`),
      ],
      ephemeral: true,
    });

    if (!silent && interaction.channel) {
      if (
        interaction.channel instanceof TextChannel ||
        interaction.channel instanceof NewsChannel ||
        interaction.channel instanceof ThreadChannel
      ) {
        interaction.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setAuthor({ name: `✅ Unban | ${target}` })
              .setDescription(
                `**Reason:** ${reason}`
              )
              .setFooter({ text: `id: ${target}` })
              .setTimestamp(),
          ],
        })
        .then(async (msg) => await msg.react("🙌"));
      }
    }

    const guild = await GuildConfig.findOne({ guildId: interaction.guildId });

    if (
      guild &&
      guild.logs?.moderation?.enabled &&
      guild.logs?.moderation?.channelId
    )
      (
        (await interaction.guild?.channels.fetch(
          guild.logs.moderation.channelId
        )) as TextChannel
      )?.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `✅ Unban | ${target}` })
            .setDescription(
              `**User:** ${target}
            **Reason:** ${reason}`
            )
            .setTimestamp()
            .setFooter({
              text: `Unbanned by ${interaction.user.tag} | ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({}),
            }),
        ],
      });
  }
}
