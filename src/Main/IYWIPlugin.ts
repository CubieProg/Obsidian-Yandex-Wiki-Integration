import { Plugin } from "obsidian";
import { YWISettings } from './Settings/Settings'
import { TUploadTransaction } from '../Model/YWAPI/UploadTransaction'

export interface IYWIPlugin extends Plugin {
    transaction: TUploadTransaction
    settings: YWISettings
}