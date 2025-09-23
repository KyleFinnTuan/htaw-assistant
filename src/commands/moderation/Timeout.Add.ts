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

export default class TimeoutAdd extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "timeout.add",
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("target") as GuildMember;
    const length = parseInt(interaction.options.getString("length") || "5", 10);
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const silent = interaction.options.getBoolean("silent") || false;
    const msLength = Math.min(Math.max(length * 60 * 1000, 60000), 2419200000);

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (!target) {
      errorEmbed.setDescription("❌ | User not found");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (!target.moderatable) {
      errorEmbed.setDescription("❌ | I cannot timeout this user");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (
      target.roles.highest.position >=
      (interaction.member as GuildMember).roles.highest.position
    ) {
      errorEmbed.setDescription("❌ | You cannot timeout this user");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (target.id === interaction.user.id) {
      errorEmbed.setDescription("❌ | You cannot timeout yourself");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (
      target.communicationDisabledUntil !== null &&
      target.communicationDisabledUntil > new Date()
    ) {
      errorEmbed.setDescription(
        `❌ | ${target} is already timed out until <t:${Math.floor(
          target.communicationDisabledUntil.getTime() / 1000
        )}:F>`
      );
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
    if (isNaN(msLength) || msLength < 60000 || msLength > 2419200000) {
      errorEmbed.setDescription(
        "❌ | Duration must be between 1 minute and 28 days"
      );
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
            .setTitle(`⌛ | You have been timed out in ${interaction.guild?.name}.`)
            .addFields(
              { name: "Reason", value: `${reason}` },
              {
                name: "Moderator",
                value: `${interaction.user.tag} | ${interaction.user.id}`,
              },
              { name: "until", value: `<t:${Math.floor(
                  (Date.now() + msLength) /
                    1000
                )}:F>` },
            )
            .setDescription(
              `If you think this is a mistake or if you have any questions please contact the server staff.`
            )
            .setTimestamp()
            .setFooter({
              text: silent
                ? "This was a silent timeout."
                : "This timeout was publicly announced.",
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
      await target.timeout(msLength, reason);
    } catch {
      errorEmbed.setDescription("❌ | I was unable to timeout this user");
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder().setColor("Green").setDescription(
          `✅ | Successfully timed out ${target} for ${ms(msLength, {
            long: true,
          })}.`
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
                .setAuthor({ name: ` ⌛ Timeout | ${target.user.tag}` })
                .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
                .setDescription(
                  `**Reason:** ${reason}
                        this user will be timed out for ${ms(msLength, {
                          long: true,
                        })}.`
                ),
            ],
          })
          .then(async (msg) => await msg.react("⌛"));
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
            .setColor("Blue")
            .setAuthor({ name: `⌛ Timeout | ${target.user.tag}` })
            .setThumbnail(target.user.displayAvatarURL({ size: 128 }))
            .setDescription(
              `**User:** ${target.user.tag} | ${target.id}
              **Reason:** ${reason}
              this user will be timed out for ${ms(msLength, { long: true })}.`
            )
            .setTimestamp()
            .setFooter({
              text: `muted by ${interaction.user.tag} | ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({}),
            }),
        ],
      });
  }
}
