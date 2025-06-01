import { createContext } from 'react';
import { EventManager } from './EventManager';
import { TreeNodeType } from './TreeType'

export const YwIContext = createContext(Object.create(null));

export const YwIContextData = {
    navigationTree: new Array<TreeNodeType>(),
    // navigationTree: data,

    sessionData: null,
    eventManager: new EventManager(),

    parentView: null,
    plugin: null
}

export const YWISessionGlobalProvider = {
    data: null
}