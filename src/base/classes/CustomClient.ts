import { Client, Collection, GatewayIntentBits } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import IConfig from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { connect } from "mongoose";
import * as fs from "fs";

export default class CustomClient extends Client implements ICustomClient {
  handler: Handler;
  config: IConfig;
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;
  developmentMode: boolean;

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
    this.config = this.loadConfig();
    this.handler = new Handler(this);
    this.commands = new Collection();
    this.subCommands = new Collection();
    this.cooldowns = new Collection();
    this.developmentMode = process.argv.slice(2).includes("--development");
  }

  private loadConfig(): IConfig {
    const configPath = `${process.cwd()}/data/config.json`;
    let configContent = fs.readFileSync(configPath, 'utf-8');
    
    // Replace environment variable placeholders with actual values
    configContent = configContent.replace(/\$\{(\w+)\}/g, (match, envVar) => {
      return process.env[envVar] || '';
    });
    
    return JSON.parse(configContent);
  }

  init(): void {
    console.log(
      `Bot is starting in ${
        this.developmentMode ? "development" : "production"
      } mode.`
    );
    this.loadHandlers();

    this.login(
      this.developmentMode ? this.config.devToken : this.config.token
    ).catch((err) => {
      console.error("Error logging in:", err);
    });
    connect(
      this.developmentMode ? this.config.devMongoUrl : this.config.mongoUrl
    )
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  }

  loadHandlers(): void {
    this.handler.LoadEvents();
    this.handler.LoadCommands();
  }
}
