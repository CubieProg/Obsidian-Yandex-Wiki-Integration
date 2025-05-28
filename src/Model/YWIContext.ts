import { createContext, useContext } from 'react';
import { data } from "./data"
import { EventManager } from './EventManager';
import { v4 as uuid } from 'uuid'

import { TreeNodeType } from './TreeType'
import { Plugin } from 'obsidian';

export const YwIContext = createContext(Object.create(null));

export const YwIContextData = {
    navigationTree: new Array<TreeNodeType>(),
    // navigationTree: data,

    sessionData: null,
    eventManager: new EventManager(),

    plugin: null
}

export const YWISessionGlobalProvider = {
    data: null
}