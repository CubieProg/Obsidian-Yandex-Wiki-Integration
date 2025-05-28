import { useState, createContext } from 'react';
import { Plugin } from 'obsidian';

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
    plugin: IYWIPlugin
}

export const YWPannel = ({ plugin }: YWIPannelType) => {
    // setting context
    // -----------------------------------------------
    const [theme, setTheme] = useState('dark');

    const [navigationTree, setNavigationTree] = useState(YwIContextData.navigationTree)
    const [eventManager, setEventManager] = useState(YwIContextData.eventManager)
    const [sessionData, setSessionData] = useState(YwIContextData.sessionData)
    // setNavigationTree(navigationTree)

    const value = {
        navigationTree, setNavigationTree,
        eventManager, setEventManager,
        sessionData, setSessionData,

        plugin
    };


    const plugin_ref = plugin

    // console.log(YwIContext.Provider)

    // plugin.app.vault.trigger("session-fetch", 321)



    // return (
    //     <div style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         minHeight: "150px",
    //         maxHeight: "100%",
    //         border: "1px solid red"
    //     }}>
    //         <div style={{
    //             height: "15px",
    //             backgroundColor: "yellow"
    //         }}></div>
    //         <div style={{
    //             flexGrow: 1,
    //             backgroundColor: "green",
    //             overflowY: "scroll"
    //         }}>
    //             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error officia, perferendis sed ipsam quae illo voluptas voluptate, obcaecati pariatuLorem ipsum dolor sit amet, consectetur adipisicing elit.
    //             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error officia, perferendis sed ipsam quae illo voluptas voluptate, obcaecati pariatuLorem ipsum dolor sit amet, consectetur adipisicing elit.
    //             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error officia, perferendis sed ipsam quae illo voluptas voluptate, obcaecati pariatuLorem ipsum dolor sit amet, consectetur adipisicing elit.
    //             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error officia, perferendis sed ipsam quae illo voluptas voluptate, obcaecati pariatuLorem ipsum dolor sit amet, consectetur adipisicing elit.
    //             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error officia, perferendis sed ipsam quae illo voluptas voluptate, obcaecati pariatuLorem ipsum dolor sit amet, consectetur adipisicing elit.
    //             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error officia, perferendis sed ipsam quae illo voluptas voluptate, obcaecati pariatuLorem ipsum dolor sit amet, consectetur adipisicing elit.
    //         </div>
    //     </div >
    // )



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

