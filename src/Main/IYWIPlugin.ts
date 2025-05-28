import { Plugin } from "obsidian";
import { YWISettings } from './Settings/Settings'

export interface IYWIPlugin extends Plugin {
    settings: YWISettings
}