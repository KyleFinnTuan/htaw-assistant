import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import SubCommand from "../base/classes/SubCommand";

export default class TestOne extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
        name: "test.one",
    });
  }

    execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({ content: "test one command works!", ephemeral: true});
    }
}