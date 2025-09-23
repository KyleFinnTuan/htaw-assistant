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

export default class BanAdd extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "ban.add",
    });
  }
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("target") as GuildMember;
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const days = interaction.options.getInteger("days") || 0;
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

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
          errorEmbed.setDescription(
            "❌ | You silly goose 🪿, you cannot ban yourself."
          ),
        ],
        ephemeral: true,
      });

    if (
      target.roles.highest.position >=
      (interaction.member?.roles as GuildMemberRoleManager).highest.position
    )
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ | You cannot ban user with higher or same role as you."
          ),
        ],
        ephemeral: true,
      });
    if (!target.bannable)
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ | I cannot ban this user. They might have a higher role than me, or I don't have ban permissions."
          ),
        ],
        ephemeral: true,
      });
    if (reason.length > 512)
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ | Reason must be less than 512 characters."
          ),
        ],
        ephemeral: true,
      });

    await target
      ?.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle(`🔨 | You have been banned from ${interaction.guild?.name}`)
            .addFields(
              { name: "Reason", value: `${reason}` },
              {
                name: "Moderator",
                value: `${interaction.user.tag} | ${interaction.user.id}`,
              }
            )
            .setDescription(
              `If you think this is a mistake or if you have any questions please contact the server staff.`
            )
            .setTimestamp()
            .setFooter({
              text: silent
                ? "This was a silent ban."
                : "This ban was publicly announced.",
            })
            .setImage(
              interaction.guild?.bannerURL({ size: 2048 }) ||
                interaction.guild?.iconURL({ size: 2048 }) ||
                ""
            ),
        ],
      })
      .catch();

    try {
      await target?.ban({
        deleteMessageSeconds: days,
        reason: reason,
      });
    } catch (error) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❌ | Failed to ban ${target.user.tag}.`),
        ],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `✅ | User ${target.user.tag} with ID ${target.id} has been banned.`
          ),
      ],
      ephemeral: true,
    });

    if (!silent && interaction.channel) {
      if (
        interaction.channel instanceof TextChannel ||
        interaction.channel instanceof NewsChannel ||
        interaction.channel instanceof ThreadChannel
      ) {
        interaction.channel
          .send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `🔨 Ban | ${target.user.tag}` })
                .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
                .setDescription(
                  `**Reason:** ${reason}
                  this user will have their messages deleted from the last ${
                    days / 86400
                  } days.`
                )
                .setFooter({ text: `id: ${target.id}` })
                .setTimestamp(),
            ],
          })
          .then(async (msg) => await msg.react("🔨"));
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
            .setColor("Red")
            .setAuthor({ name: `🔨 Ban | ${target.user.tag}` })
            .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
            .setDescription(
              `**User:** ${target.user.tag} | ${target.id}
            **Reason:** ${reason}
            this user will have their messages deleted from the last **${days}** days.`
            )
            .setTimestamp()
            .setFooter({
              text: `Banned by ${interaction.user.tag} | ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({}),
            }),
        ],
      });
  }
}
