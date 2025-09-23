import {
  Application,
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class Slowmode extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "slowmode",
      description: "Sets the slowmode for a channel.",
      category: Category.Moderation,
      default_member_permissions: PermissionFlagsBits.ManageChannels,
      options: [
        {
          name: "rate",
          description: "Select the slowmode message rate.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          choices: [
            { name: "none", value: 0 },
            { name: "5 seconds", value: 5 },
            { name: "10 seconds", value: 10 },
            { name: "15 seconds", value: 15 },
            { name: "30 seconds", value: 30 },
            { name: "1 minute", value: 60 },
            { name: "2 minutes", value: 120 },
            { name: "5 minutes", value: 300 },
            { name: "10 minutes", value: 600 },
            { name: "15 minutes", value: 900 },
            { name: "30 minutes", value: 1800 },
            { name: "1 hour", value: 3600 },
            { name: "2 hours", value: 7200 },
            { name: "3 hours", value: 10800 },
            { name: "4 hours", value: 14400 },
            { name: "5 hours", value: 18000 },
            { name: "6 hours", value: 21600 },
          ],
        },
        {
          name: "channel",
          description:
            "Select the channel to set the slowmode for - Default is the current channel",
          type: ApplicationCommandOptionType.Channel,
          required: false,
          channel_types: [ChannelType.GuildText],
        },
        {
          name: "reason",
          description: "Reason for the slowmode change - Default is no reason",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "silent",
          description: "Silently set the slowmode - Default is false",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
      cooldown: 3,
      dm_permission: false,
      dev: false,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const messageRate = interaction.options.getInteger("rate")!;
    const channel = (interaction.options.getChannel("channel") ||
      interaction.channel) as TextChannel;
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (messageRate < 0 || messageRate > 21600)
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ | You can only set the slowmode between 0 and 6 hours (21600 seconds)"
          ),
        ],
        ephemeral: true,
      });

    try {
      channel.setRateLimitPerUser(messageRate, reason);
    } catch (err) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ | an error occurred while setting the slowmode."
          ),
        ],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `✅ | Slowmode set to ${messageRate} seconds in ${channel.name}`
          ),
      ],
      ephemeral: true,
    });

    if (!silent) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `⏲️ Slowmode | ${channel.name}` })
            .setDescription(
              `**Reason:** ${reason}
              Slowmode set to ${messageRate} seconds`
            )
            .setTimestamp()
            .setFooter({ text: `Channel ID: ${channel.id}` }),
        ],
      })
      .then(async (msg) => await msg.react("⏲️"));
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
                .setAuthor({ name: `⏲️ Slowmode Clear` })
                .setThumbnail(`${interaction.guild?.iconURL({ size: 128 })}`)
                .setDescription(
                  `**Channel:** ${channel} - \`${channel.id}\`
                **Reason:** ${reason}
                **Slowmode:** \`${messageRate}\` seconds`
                )
                .setTimestamp()
                .setFooter({
                  text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                  iconURL: interaction.user.displayAvatarURL({}),
                }),
            ],
          });
  }
}
