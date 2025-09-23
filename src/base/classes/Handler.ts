import Ihandler from "../interfaces/IHandler.js";
import path from "path";
import { glob } from "glob";
import CustomClient from "./CustomClient.js";
import Event from "./Event";
import Command from "./Command.js";
import SubCommand from "./SubCommand.js";

export default class Handler implements Ihandler {
  client: CustomClient;
  constructor(client: CustomClient) {
    this.client = client;
  }
  async LoadEvents() {
    const files = (await glob("build/events/**/*.js")).map((filePath) =>
      path.resolve(filePath)
    );

    files.map(async (file: string) => {
      const event: Event = new (await import(file)).default(this.client);

      if (!event.name)
        return (
          delete require.cache[require.resolve(file)] &&
          console.warn(`Event at ${file} is missing a name.`)
        );

      const execute = (...args: any[]) => event.execute(...args);

      // @ts-ignore
      if (event.once) this.client.once(event.name, execute);
      // @ts-ignore
      else this.client.on(event.name, execute);

      return delete require.cache[require.resolve(file)];
    });
  }
  async LoadCommands() {
    const files = (await glob("build/commands/**/*.js")).map((filePath) =>
      path.resolve(filePath)
    );

    files.map(async (file: string) => {
      const command: Command | SubCommand = new (await import(file)).default(
        this.client
      );

      if (!command.name)
        return (
          delete require.cache[require.resolve(file)] &&
          console.warn(`Event at ${file} is missing a name.`)
        );

      if (file.split("/").pop()?.split(".")[2])
        return this.client.subCommands.set(command.name, command);

      this.client.commands.set(command.name, command as Command);

      return delete require.cache[require.resolve(file)];
    });
  }
}
