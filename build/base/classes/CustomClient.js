"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Handler_1 = __importDefault(require("./Handler"));
const mongoose_1 = require("mongoose");
const fs = __importStar(require("fs"));
class CustomClient extends discord_js_1.Client {
    constructor() {
        super({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
        this.config = this.loadConfig();
        this.handler = new Handler_1.default(this);
        this.commands = new discord_js_1.Collection();
        this.subCommands = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.developmentMode = process.argv.slice(2).includes("--development");
    }
    loadConfig() {
        const configPath = `${process.cwd()}/data/config.json`;
        let configContent = fs.readFileSync(configPath, 'utf-8');
        // Replace environment variable placeholders with actual values
        configContent = configContent.replace(/\$\{(\w+)\}/g, (match, envVar) => {
            return process.env[envVar] || '';
        });
        return JSON.parse(configContent);
    }
    init() {
        console.log(`Bot is starting in ${this.developmentMode ? "development" : "production"} mode.`);
        this.loadHandlers();
        this.login(this.developmentMode ? this.config.devToken : this.config.token).catch((err) => {
            console.error("Error logging in:", err);
        });
        (0, mongoose_1.connect)(this.developmentMode ? this.config.devMongoUrl : this.config.mongoUrl)
            .then(() => console.log("Connected to MongoDB"))
            .catch((err) => console.error("MongoDB connection error:", err));
    }
    loadHandlers() {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }
}
exports.default = CustomClient;
