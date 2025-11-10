"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const CustomClient_1 = __importDefault(require("./base/classes/CustomClient"));
(0, dotenv_1.config)();
new CustomClient_1.default().init();
