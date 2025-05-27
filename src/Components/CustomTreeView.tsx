

import { v4 as uuid } from 'uuid'
import { TreeNodeType } from "src/Model/TreeType"
import { data } from "./data23"

import {
    createContext,
    Dispatch,
    ReactNode,
    useContext,
    useReducer,
} from 'react'

export type TreeViewState = Map<string, boolean>

export enum TreeViewActionTypes {
    OPEN = 'OPEN',
    CLOSE = 'CLOSE',
}

export type TreeViewActions =
    | {
        type: TreeViewActionTypes.OPEN
        id: string
    }
    | {
        type: TreeViewActionTypes.CLOSE
        id: string
    }

export type TreeViewContextType = {
    open: TreeViewState
    dispatch: Dispatch<TreeViewActions>
    selectedId: string | null
    selectId: (id: string) => void
}

export const TreeViewContext = createContext<TreeViewContextType>({
    open: new Map<string, boolean>(),
    dispatch: () => { },
    selectedId: null,
    selectId: () => { },
})






function padding(a: number, b: number, c: number, d: number) {
    return {
        paddingTop: a,
        paddingRight: b !== undefined ? b : a,
        paddingBottom: c !== undefined ? c : a,
        paddingLeft: d !== undefined ? d : (b !== undefined ? b : a)
    }
}



type NavLineType = {
    navLineHeight: number
}

export const NavLineView = ({ navLineHeight }: NavLineType) => {
    return <div
        style={{
            width: 15,
            height: navLineHeight,
            float: "left",
        }}
    >
        <div
            style={{
                width: 1,
                height: navLineHeight,
                background: "currentColor",
                opacity: 0.2,
                margin: "auto"
            }}
        >
        </div>
    </div>
}



type NavArrowType = {
    empty?: boolean
    open?: boolean
}

export const NavArrowView = ({ empty, open }: NavArrowType) => {
    if (empty === true) {
        return <div
            style={{
                width: 16,
                height: 16,
                float: "left"
            }}
        ></div>
    }

    return <div
        style={{
            width: 16,
            height: 16,
            float: "left"
        }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="12px"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            opacity={0.35}
            transform={open ? 'rotate(90)' : ''}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
        </svg>

    </div>
}


export const addSome = (children: TreeNodeType[]) => {
    const id_ = uuid()

    children.push(
        {
            id: id_,
            name: `someNode ${id_}`,
        }
    )
}

import { useRef, useState, useLayoutEffect, useEffect } from "react"
// import { motion, AnimatePresence } from 'framer-motion';

export const NodeView = ({ id, name, children }: TreeNodeType) => {
    const { open, dispatch } = useContext(TreeViewContext)
    const isOpen = open.get(id)

    const [navLineHeight, setNavLineHeight] = useState(0);
    const ref = useRef(null);

    const childrensView = <div ref={ref}>
        {children?.length && isOpen && (
            <div>
                <NavLineView navLineHeight={navLineHeight} />
                <ul style={{ paddingLeft: 16 }}>
                    {children.map(node => (
                        <NodeView key={node.id} id={node.id} name={node.name} children={node.children} navLine={true} />
                    ))}
                </ul>
            </div>
        )}
    </div>

    useLayoutEffect(() => {
        const current: any = ref?.current           // так он не ругается
        setNavLineHeight(current?.offsetHeight);    // <= вот тут изначально был ```ref?.current?.offsetHeight```
    }, [childrensView]);
    
    return <div>
        <li style={{ listStyleType: "none" }}>
            <div
                style={{
                    margin: 0,
                    paddingTop: 5,
                    paddingBottom: 5,
                    width: "max-content",
                }}

                onClick={() => {
                    const type = isOpen ? TreeViewActionTypes.CLOSE : TreeViewActionTypes.OPEN

                    if (type === TreeViewActionTypes.OPEN && children) {
                        addSome(children)
                    }

                    dispatch({ id: id, type: type })
                }}
            >
                <NavArrowView empty={!children?.length} open={isOpen} />
                {name}
            </div>

            {children?.length && isOpen &&
                childrensView
            }

        </li>
    </div>
}



// https://conf-prfn.org/app?bc09793126d2b573b13447840fafbf13

// conf-prfn@yandex.ru s

export function treeViewReducer(
    state: TreeViewState,
    action: TreeViewActions,
): TreeViewState {
    switch (action.type) {
        case TreeViewActionTypes.OPEN:
            return new Map(state).set(action.id, true)

        case TreeViewActionTypes.CLOSE:
            return new Map(state).set(action.id, false)

        default:
            throw new Error(`Tree View Reducer received an unknown action ${action}`)
    }
}

export const CustomTree = () => {
    const [open, dispatch] = useReducer(
        treeViewReducer,
        new Map<string, boolean>(),
    )
    const [value, onChange] = useState<string | null>(null)


    return <TreeViewContext.Provider
        value={{
            open,
            dispatch,
            selectedId: value,
            selectId: onChange,
        }}
    >
        <div>
            <ul style={{ fontSize: 13, color: "currentColor", opacity: 0.85, paddingLeft: 8 }}>
                {data.map((node: any) => (
                    <NodeView key={node.id} id={node.id} name={node.name} children={node.children} navLine={false} />
                ))}
            </ul>
        </div>
    </TreeViewContext.Provider>
}
