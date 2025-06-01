import { useState, createContext } from 'react';
import { ItemView, Plugin } from 'obsidian';

import { LoginButton } from './LoginButton';
import { LazyTreeView } from "./LazyTreeView"
import { YwIContext, YwIContextData } from "../Model/YWIContext"

import { IYWIPlugin } from '../Main/IYWIPlugin'

import { YWINavHeader } from './YWINavHeader'

// const YwIContext = createContext(Object.create(null));

//  | View | <=> | ViewModel | <=> | Model |

class DataComponent {
    constructor(obj: any) {

    }

    private AddObjectHooks(obj: any): any {
        for (let item in Object.keys(obj)) {
            [obj.item, obj[`set${item}`]] = useState(obj.item);
        }

        return obj;
    }

    private CreateObjectFromArray(arr: Array<string>) {
        let obj = Object.create(null);

        for (let item in arr) {
            [obj.item, obj[`set${item}`]] = useState(obj.item);
        }

        return obj;
    }
}

class ViewModel {
    Context: React.Context<any>;

    constructor(init_object: any) {
        this.Context = createContext(Object.create(null));

        for (let item in Object.keys(init_object)) {

        }
    }

    private AddObjectHooks(obj: any): any {
        for (let item in Object.keys(obj)) {

        }
    }

    getContext() {
        return this.Context;
    }
}



type YWIPannelType = {
    plugin: IYWIPlugin,
    parentView: ItemView
}

export const YWPannel = ({ plugin, parentView }: YWIPannelType) => {
    // setting context
    // -----------------------------------------------
    const [theme, setTheme] = useState('dark');

    const [navigationTree, setNavigationTree] = useState(YwIContextData.navigationTree)
    const [eventManager, setEventManager] = useState(YwIContextData.eventManager)
    const [sessionData, setSessionData] = useState(YwIContextData.sessionData)

    const [uploadProgress, setUploadProgress] = useState(YwIContextData.sessionData)


    // YwIContextData.parentView = parentView
    // setNavigationTree(navigationTree)

    const value = {
        navigationTree, setNavigationTree,
        eventManager, setEventManager,
        sessionData, setSessionData,

        parentView,
        plugin
    };

    return (
        <YwIContext.Provider value={value}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "150px",
                maxHeight: "100%",
                // border: "1px solid red"
            }}>
                <YWINavHeader />
                <LazyTreeView />
            </div>
        </YwIContext.Provider>
    )
}

