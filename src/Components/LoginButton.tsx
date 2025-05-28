import { useState, useContext, createContext } from 'react';
import { read } from 'node:fs'
// import { authtorize } from '../Authtorization/authtorize' sss


// import puppeteer from "puppeteer";

// import { sayHello } from '../Authtorization/test'sad
import { authtorize, check_session } from '../Authtorization/authtorize'
// import { authtorize } from '../Authtorization/authtorize'

import { YwIContext } from "../Model/YWIContext"


// import { action, observable, makeObservable } from 'mobx';
// import { view, ViewModel } from '@yoskutik/react-vvm';



import { v4 as uuid } from 'uuid'


import { TreeNodeType } from '../Model/TreeType';


// import { Subscriber, EventManager, EventType, Event } from '../Model/EventManager'
import { Subscriber, EventManager, EventType, Event, EventManagerName } from '../Model/EventManager'


import { getNavTreeRoot } from '../Model/YWAPI/api'
import { Plugin } from 'obsidian';


type LoginButtonType = {
    plugin?: Plugin,
    onParentClick?: Function
    setOnParentClick?: Function
}


export const LoginButton = ({ onParentClick, setOnParentClick }: LoginButtonType) => {
    const [buttonText, setButtonText] = useState('Submit');
    const [isRun, setIsRun] = useState(false);
    const context = useContext(YwIContext);

    const [subId,] = useState("LoginButtonSub")
    const [convId,] = useState("TreeConverter")

    // this.getAlert = this.getAlert.bind(this);


    const foo = (ev: Event) => {
        console.log(`Callbacking an event: ${ev}`)
        console.log(this)
        const data = ev.data
        return new Event(uuid(), EventType.Any, data + "_after_sub")
    }

    const conv = (ev: Event) => {
        console.log(`Callbacking conv an event: ${ev}`)
        const data = ev.data

        const newNode: TreeNodeType =
        {
            id: uuid(),
            name: data + "_after_conv",
            navName: "test"
        }

        context.setNavigationTree(
            (oldData: TreeNodeType[]) => [...oldData, newNode]
        )

        return new Event(uuid(), EventType.Any, data + "_after_conv")
    }


    const f_call = (sub: Subscriber, ev: Event) => {
        // console.log(sub.name, "It calls from callback!")
        // console.log(ev)

        return new Event(uuid(), EventType.Any, ev.data + "_some_added")
    }

    const t_call = (sub: Subscriber, ev: Event) => {
        // console.log(sub.name, "It calls from callback!")
        // console.log(ev)

        return new Event(uuid(), EventType.Any, ev.data + "_some_added")
    }


    const [f_sub_id,] = useState("f_sub_id")
    const [s_sub_id,] = useState("s_sub_id")
    const [t_sub_id,] = useState("t_sub_id")

    const em: EventManager = context.eventManager

    const f_sub = em.useSubscriber(f_sub_id)
    const s_sub = em.useSubscriber(s_sub_id)
    const t_sub = f_sub.useSubscriber(t_sub_id)

    // f_sub.setCallback(f_call, [EventManagerName])

    s_sub.setSubscriber(t_sub)

    f_sub.setCallback(f_call, [EventManagerName])
    t_sub.setCallback(t_call, [f_sub_id])


    em.pushEvent(new Event(uuid(), EventType.Any, "data string"))


    // getNavTreeRoot

    // const subscriber = em.useSubscriber(subId, true)
    // // const subscriber = new Subscriber("LoginButtonSub")
    // subscriber.bindCallback(foo, null)

    // const converter = em.useSubscriber(convId, false)
    // // const converter = new Subscriber("TreeConverter")
    // converter.bindCallback(conv, null)
    // subscriber.useReciever(converter, EventType.All)

    // // em.addSubscriber(subscriber)
    // em.subscribe(subscriber, EventType.Authtorization)

    const handleClick = async () => {
        if (isRun) { return }
        setIsRun(true);

        let session;

        try {
            session = context.plugin.settings.data.session

            session = await authtorize(true, false, session);
            context.plugin.app.vault.trigger("yandex-wiki-integration:session-fetch", session)
            context.setSessionData(session)

            const treeNodes = await getNavTreeRoot(session)
            const treeViewData = [...treeNodes.tree[0].children.results]
                .map(node =>
                ({
                    id: uuid(),
                    name: node.title,
                    navName: node.slug.split("/")[node.slug.split("/").length - 1],
                    slug: node.slug.split("/"),
                    has_children: node.has_children
                }))

            context.setNavigationTree(treeViewData)

        } finally {
            setIsRun(false);
        }
    };

    return (// у button был стиль. Удалил её только по этому
        <svg
            className='widget-icon'
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            width="20px"
            viewBox="0 0 24 24"
            strokeWidth={0}
            stroke="currentColor"
            opacity={0.85}
            onClick={handleClick}
        >
            <path id="login_path"
                d="M 12.00,21.00
                    C 12.00,21.00 12.00,19.00 12.00,19.00
                        12.00,19.00 19.00,19.00 19.00,19.00
                        19.00,19.00 19.00,5.00 19.00,5.00
                        19.00,5.00 12.00,5.00 12.00,5.00
                        12.00,5.00 12.00,3.00 12.00,3.00
                        12.00,3.00 19.00,3.00 19.00,3.00
                        19.55,3.00 20.02,3.20 20.41,3.59
                        20.80,3.98 21.00,4.45 21.00,5.00
                        21.00,5.00 21.00,19.00 21.00,19.00
                        21.00,19.55 20.80,20.02 20.41,20.41
                        20.02,20.80 19.55,21.00 19.00,21.00
                        19.00,21.00 12.00,21.00 12.00,21.00 Z
                    M 10.00,17.00
                    C 10.00,17.00 8.62,15.55 8.62,15.55
                        8.62,15.55 11.18,13.00 11.18,13.00
                        11.18,13.00 3.00,13.00 3.00,13.00
                        3.00,13.00 3.00,11.00 3.00,11.00
                        3.00,11.00 11.18,11.00 11.18,11.00
                        11.18,11.00 8.62,8.45 8.62,8.45
                        8.62,8.45 10.00,7.00 10.00,7.00
                        10.00,7.00 15.00,12.00 15.00,12.00
                        15.00,12.00 10.00,17.00 10.00,17.00 Z" />
        </svg>
    );
}