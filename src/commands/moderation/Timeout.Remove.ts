import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  NewsChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import ms from "ms";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class TimeoutRemove extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "timeout.remove",
    });
  }
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("target") as GuildMember;
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (!target) {
      errorEmbed.setDescription("❌ | User not found");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (!target.moderatable) {
      errorEmbed.setDescription("❌ | I cannot remove timeout this user");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (
      target.roles.highest.position >=
      (interaction.member as GuildMember).roles.highest.position
    ) {
      errorEmbed.setDescription("❌ | You cannot remove timeout this user");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (target.id === interaction.user.id) {
      errorEmbed.setDescription(
        "❌ | You cannot remove a timeout from yourself"
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (target.communicationDisabledUntil == null) {
      errorEmbed.setDescription(`❌ | ${target} is not timed out.`);
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (reason.length > 512) {
      errorEmbed.setDescription(
        "❌ | Reason must be less than 512 characters."
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    try {
      await target.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setTitle(
              `⌛ | You timeout in ${interaction.guild?.name} was removed.`
            )
            .addFields(
              { name: "Reason", value: `${reason}` },
              {
                name: "Moderator",
                value: `${interaction.user.tag} | ${interaction.user.id}`,
              },
            )
            .setDescription(
              `Please read the rules and try to follow them.`
            )
            .setTimestamp()
            .setFooter({
              text: silent
                ? "This was a silent timeout removal."
                : "This timeout removal was publicly announced.",
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
      await target.timeout(null, reason);
    } catch {
      errorEmbed.setDescription(
        "❌ | An error occurred while removing timeout from user."
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `✅ | Successfully removed timed out from ${target}.`
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
                .setColor("Blue")
                .setAuthor({ name: `✅ Timeout Removed | ${target.user.tag}` })
                .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
                .setDescription(`**Reason:** ${reason}`),
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
            .setAuthor({ name: `✅ Timeout removed | ${target.user.tag}` })
            .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
            .setDescription(
              `**User:** ${target.user.tag} | ${target.id}
            **Reason:** ${reason}`
            )
            .setTimestamp()
            .setFooter({
              text: `Unmuted by ${interaction.user.tag} | ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({}),
            }),
        ],
      });
  }
}
