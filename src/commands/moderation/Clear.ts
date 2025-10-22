import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  Collection,
  EmbedBuilder,
  GuildMember,
  Message,
  NewsChannel,
  PermissionFlagsBits,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class clear extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "clear",
      description: "Clear channel or user messages",
      category: Category.Moderation,
      default_member_permissions: PermissionFlagsBits.ManageMessages,
      options: [
        {
          name: "ammount",
          description: "The ammount of messages to clear - Max 100",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: "target",
          description:
            "Select a user to delete messages from - Default is all users",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
        {
          name: "channel",
          description:
            "Select a channel to clear messages from - Default is the current channel",
          type: ApplicationCommandOptionType.Channel,
          required: false,
          channel_types: [ChannelType.GuildText],
        },
        {
          name: "silent",
          description: "Don't send a message to the channel",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
      cooldown: 5,
      dm_permission: false,
      dev: false,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    let ammount = interaction.options.getInteger("ammount")!;
    const channel = (interaction.options.getChannel("channel") ||
      interaction.channel) as TextChannel;
    const target = interaction.options.getMember("target") as GuildMember;
    const silent = interaction.options.getBoolean("silent");

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (ammount < 1 || ammount > 100) {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ | Please provide a valid ammount between 1 and 100"
          ),
        ],
        ephemeral: true,
      });
    }

    const messages: Collection<
      string,
      Message<true>
    > = await channel.messages.fetch({ limit: 100 });

    var filterMessages = target
      ? messages.filter((m) => m.author.id === target.id)
      : messages;
    let deleted = 0;

    try {
      deleted = (
        await channel.bulkDelete(
          Array.from(filterMessages.keys()).slice(0, ammount),
          true
        )
      ).size;
    } catch {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            "❌ | an error occured while trying to clear messages"
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
            `✅ | **Deleted** \`${deleted}\` messages ${
              target ? `from ${target}` : ""
            } in ${channel}`
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
                .setAuthor({ name: `🧹 Clear | ${channel.name}` })
                .setDescription(`**Deleted:**: ${deleted} messages`)
                .setTimestamp()
                .setThumbnail(target ? target.user.displayAvatarURL({ size: 128 }) : interaction.guild?.iconURL({ size: 128 }) || null)
                .setFooter({
                    text: `Messages: ${target ? target.user.tag : "All"} Messages in ${channel.name}`,
                })
            ]})
          .then(async (msg) => await msg.react("🧹"));
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
            .setColor("Orange")
            .setAuthor({ name: `🧹 Clear` })
            .setThumbnail(target ? target.user.displayAvatarURL({ size: 128 }) : interaction.guild?.iconURL({ size: 128 }) || null)
            .setDescription(
              `**Channel:** ${channel} - \`${channel.id}\`
            **Messages:** ${target ? target : "All"}
            **Ammount:** \`${deleted}\``
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
