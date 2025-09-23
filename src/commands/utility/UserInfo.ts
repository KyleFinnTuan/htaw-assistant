import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class UserInfo extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "userinfo",
      description: "Get info about a user",
      category: Category.Utilities,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      options: [
        {
          name: "user",
          description: "The user to get info about",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
      cooldown: 3,
      dev: false,
      dm_permission: false,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const target = (interaction.options.getMember("user") ||
      interaction.member) as GuildMember;
    await interaction.deferReply({ ephemeral: true });

    const fetchedMember = await target.fetch();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(fetchedMember.user.accentColor || "Green")
          .setAuthor({
            name: `${fetchedMember.user.tag} profile`,
            iconURL: fetchedMember.displayAvatarURL(),
          })
          .setDescription(
            `
                __**User Info**__
                > **ID:** ${fetchedMember.user.id}
                > **Bot:** \`${fetchedMember.user.bot ? "Yes" : "No"}\`
                > **Account Created:** 📅 <t:${(
                  fetchedMember.user.createdTimestamp / 1000
                ).toFixed(0)}:D>
                 
                __**Member Info**__
                > **Nickname:** ${
                  fetchedMember.nickname || fetchedMember.user.username
                }
                > **Roles:(${fetchedMember.roles.cache.size - 1}):** ${
              fetchedMember.roles.cache
                .map((role) => role)
                .join(", ")
                .replace("@everyone", "") || "None"
            }
                > **Admin:** \`${fetchedMember.permissions.has(
                  PermissionFlagsBits.Administrator
                )}\`
                > **Joined Server:** 📅 <t:${(
                  fetchedMember.joinedTimestamp! / 1000
                ).toFixed(0)}:D>
                > **Boosted:** ${
                  fetchedMember.premiumSince
                    ? `<t:${fetchedMember.premiumSince.getTime() / 1000}:R>`
                    : "No"
                }
                > **Join Position:** \`#${
                  this.GetJoinPosition(interaction, fetchedMember)! + 1
                } / #${interaction.guild?.memberCount}\``
          ),
      ],
    });
  }

  GetJoinPosition(
    interaction: ChatInputCommandInteraction,
    target: GuildMember
  ) {
    let pos = null;
    const joinPosition = interaction.guild?.members.cache.sort(
      (a, b) => a.joinedTimestamp! - b.joinedTimestamp!
    );
    Array.from(joinPosition!).find((member, index) => {
      if (member[0] === target.user.id) pos = index;
    });
    return pos;
  }
}
