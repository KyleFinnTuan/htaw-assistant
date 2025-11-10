import { config } from "dotenv";
import CustomClient from "./base/classes/CustomClient";

config();

new CustomClient().init();