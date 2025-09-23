"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubCommand_1 = __importDefault(require("../base/classes/SubCommand"));
class TestOne extends SubCommand_1.default {
    constructor(client) {
        super(client, {
            name: "test.one",
        });
    }
    execute(interaction) {
        interaction.reply({ content: "test one command works!", ephemeral: true });
    }
}
exports.default = TestOne;
