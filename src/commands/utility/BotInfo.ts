import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import Category from "../../base/enums/Category";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
const { version, dependencies } = require(`${process.cwd()}/package.json`);
import ms from "ms";
import os from "os";

export default class botInfo extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "botinfo",
      description: "Shows information about the bot.",
      category: Category.Utilities,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      options: [],
      dm_permission: false,
      cooldown: 3,
      dev: false,
    });
  }

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setThumbnail(this.client.user!.displayAvatarURL())
          .setColor("Random")
          .setDescription(
            `__**Bot Info**__
                    > **User:** \'${this.client.user?.tag}\' - \`${
              this.client.user?.id
            }\`
                    > **Account Created:** 📅 <t:${(
                      this.client.user!.createdTimestamp / 1000
                    ).toFixed(0)}:D>
                    > **Commands:** \`${this.client.commands.size}\`
                    > **Version:** \`${version}\`
                    > **NodeJS Version:** \`${process.version}\`
                    > **Dependencies ${Object.keys(dependencies).length}:** \`${Object.keys(dependencies).map((p) => (`${p}-@${dependencies[p]}`).replace(/\^/g, "")).join(", ")}\`
                    > **Uptime:** \`${ms(this.client.uptime!, {
                      long: false,
                    })}\`\

                    __**Guild Info**__
                    > **Total Guilds:** \`${
                      (
                        await this.client.guilds.fetch()
                      ).size
                    }\`

                    __**System Info**__
                    > **Operating System:** \`${process.platform}\`
                    > **CPU:** \`${os.cpus()[0].model.trim()}\`
                    > **Memory:** \`${this.formatBytes(
                      process.memoryUsage().heapUsed
                    )}\`/\`${this.formatBytes(os.totalmem())}\`

                    __**Development Team:**__
                    > **Creator/owner:** \`KyleFinnTuan\`
                    > **Developer:** \`KyleFinnTuan\`
                    `
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Invite Me")
            .setStyle(ButtonStyle.Link)
            .setURL(
              "https://discord.com/oauth2/authorize?client_id=1179965231498268793&permissions=8&integration_type=0&scope=bot+applications.commands"
            ),
          new ButtonBuilder()
            .setLabel("Support Server")
            .setStyle(ButtonStyle.Link)
            .setURL(
              "https://discord.com/oauth2/authorize?client_id=1179965231498268793&permissions=8&integration_type=0&scope=bot+applications.commands"
            ),
          new ButtonBuilder()
            .setLabel("Website")
            .setStyle(ButtonStyle.Link)
            .setURL(
              "https://discord.com/oauth2/authorize?client_id=1179965231498268793&permissions=8&integration_type=0&scope=bot+applications.commands"
            )
        ),
      ],
    });
  }

  private formatBytes(bytes: number) {
    if (bytes == 0) return "0";

    const size = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${size[i]}`;
  }
}
