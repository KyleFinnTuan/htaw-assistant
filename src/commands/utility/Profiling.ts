import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionsBitField,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import { Profile } from "discord-arts";

export default class Profiling extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "profile",
      description: "View your profile",
      category: Category.Utilities,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: true,
      cooldown: 3,
      options: [
        {
          name: "target",
          description: "The user to view the profile of",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
      dev: false,
    });
  }
  async execute(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser("target") || interaction.user;
  const member = interaction.guild?.members.cache.get(user.id);

  await interaction.deferReply({ ephemeral: false }); // must be false for image

  const buffer = await Profile(user.id, {
    borderColor: ["#841821", "#005b58"],
    badgesFrame: true,
    removeAvatarFrame: false,
    presenceStatus: member?.presence?.status || "offline",
    customDate: user.createdAt,
  });

  const attachment = new AttachmentBuilder(buffer).setName(
    `${user.username}_profile.png`
  );

  const fetchedUser = await user.fetch();
  const colour = fetchedUser.accentColor ?? 0x00ff00;

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(colour)
        .setDescription(`**${user.username}'s profile**`)
        .setImage(`attachment://${user.username}_profile.png`),
    ],
    files: [attachment],
  });
}

}
