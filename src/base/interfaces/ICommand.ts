import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import CustomClient from "../classes/CustomClient";
import Category from "../enums/Category";

export default interface ICommand {
  client: CustomClient;
  name: string;
  description: string;
  category: Category;
  options: object;
  default_member_permissions: BigInt;
  dm_permission: boolean;
  cooldown: number;
  dev: boolean;

  execute(interaction: ChatInputCommandInteraction): void;
  autocomplete(interaction: AutocompleteInteraction): void;
}
