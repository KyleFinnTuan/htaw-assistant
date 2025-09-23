import {
  ApplicationCommandOptionType,
  CacheType,
  ChatInputCommandInteraction,
  Embed,
  EmbedBuilder,
  GuildMember,
  GuildMemberRoleManager,
  NewsChannel,
  PermissionFlagsBits,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class Kick extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "kick",
      description: "Kick a member from the guild",
      category: Category.Moderation,
      default_member_permissions: PermissionFlagsBits.KickMembers,
      dm_permission: false,
      cooldown: 3,
      dev: false,
      options: [
        {
          name: "target",
          description: "The user to kick",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "reason",
          description: "The reason for the kick",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "silent",
          description: "Whether to kick the user silently (no notification)",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("target") as GuildMember;
    const reason = interaction.options.getString("reason") || "No reason provided";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (!target)
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ | User not found.")],
        ephemeral: true,
      });

    if (target.id === interaction.user.id)
      return interaction.reply({
        embeds: [errorEmbed.setDescription("❌ | You cannot kick yourself.")],
        ephemeral: true,
      });

    if (
      target.roles.highest.position >=
      (interaction.member?.roles as GuildMemberRoleManager).highest.position
    ) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ | You cannot kick a member with an equal or higher role."
          ),
        ],
        ephemeral: true,
      });
    }

    if (!target.kickable) {
      errorEmbed.setDescription("❌ | I cannot kick this user.");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (reason.length > 512) {
      errorEmbed.setDescription("❌ | Reason cannot exceed 512 characters.");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await target.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setTitle(`👢 | You have been kicked from ${interaction.guild?.name}`)
            .addFields(
              { name: "Reason", value: reason },
              { name: "Moderator", 
                value: `${interaction.user.tag} | ${interaction.user.id}`
              }
            )
            .setTimestamp()
            .setFooter({
              text: silent
                ? "This was a silent kick."
                : "This kick was publicly announced.",
            })
            .setImage(
              interaction.guild?.bannerURL({ size: 2048 }) ||
                interaction.guild?.iconURL({ size: 2048 }) ||
                ""
            ),
        ],
      });
    } catch {
      // do nothing
    }

    try {
      await target.kick(reason);
    } catch {
      errorEmbed.setDescription(
        "❌ | An error occurred while trying to kick this user."
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Orange")
          .setDescription(
            `✅ | Successfully kicked ${target} with id ${target.id}${
              silent ? " silently" : ""
            }.`
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
                .setColor("Orange")
                .setThumbnail(target.displayAvatarURL({ size: 64 }))
                .setAuthor({ name: `👢 kicked | ${target.user.tag}` })
                .setDescription(`**Reason:** ${reason}`)
                .setTimestamp()
                .setFooter({ text: `ID: ${target.id}` }),
            ],
          })
          .then(async (x) => await x.react("👢"));
    }
  }
          const guild = await GuildConfig.findOne({
          guildId: interaction.guildId,
        });

        if (
          guild &&
          guild.logs?.moderation?.enabled &&
          guild.logs?.moderation?.channelId
        )
          (
            (await interaction.guild?.channels.fetch(
              guild.logs.moderation.channelId
            )) as TextChannel
          )
            ?.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("Orange")
                  .setAuthor({ name: `👢 Kicked | ${target.user.tag}` })
                  .setThumbnail(target.displayAvatarURL({ size: 128 }))
                  .setDescription(
                    `**User:** ${target?.user.tag} | ${target.id} 
                  **Reason:** ${reason}`
                  )
                  .setTimestamp()
                  .setFooter({
                    text: `Kicked by ${interaction.user.tag} | ${interaction.user.id}`,
                    iconURL: interaction.user.displayAvatarURL({}),
                  }),
              ],
            })
      }
}
