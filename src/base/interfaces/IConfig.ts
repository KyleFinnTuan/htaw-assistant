export default interface IConfig {
    token: string;
    discordClientId: string;
    mongoUrl: string;
    geminiApiKey: string;
    
    devToken: string;
    devDiscordClientId: string;
    devGuildId: string;
    devMongoUrl: string;
    
    developerUserId: string[];
}