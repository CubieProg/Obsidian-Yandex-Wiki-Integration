

import { v4 as uuid } from 'uuid'
import { TreeNodeType } from "src/Model/TreeType"

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
                width: '0.5px',
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
    onClick?: Function
}

export const NavArrowView = ({ empty, open, onClick }: NavArrowType) => {
    if (empty === true) {
        return <div
            style={{
                width: 24,
                height: 24,
                float: "left",
            }}
        ></div>
    }

    return <div
        className='treeNavArrow'
        style={{
            width: 24,
            height: 24,
            float: "left",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}
        onClick={() => {
            if (onClick instanceof Function) {
                onClick()
            }
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
            navName: "test"
        }
    )
}

import { useRef, useState, useLayoutEffect, useEffect } from "react"
import { YwIContext } from 'src/Model/YWIContext'

import { getNavTreeNode, getYWPage } from '../Model/YWAPI/api'
// import { motion, AnimatePresence } from 'framer-motion';

type TreeNodeViewType = {
    node: TreeNodeType
}

// const findNodeById()

// findNodeBy

const addChilds = (tree: TreeNodeType[], slug: string[] | undefined, data: TreeNodeType[]) => {
    if (typeof slug === 'undefined') {
        return
    }

    console.log("Searching on tree")

    let branch: TreeNodeType[] | undefined = tree
    let pointer = undefined

    for (const step of slug) {
        if (branch === undefined) {
            return
        }

        pointer = branch.find((node) => node.navName === step)
        branch = pointer?.children
    }

    if (pointer === undefined) {
        return
    }

    pointer.children = data
}

// export const NodeView = ({ id, name, children }: TreeNodeType) => {
export const NodeView = ({ node }: TreeNodeViewType) => {
    const { open, dispatch } = useContext(TreeViewContext)
    const { navigationTree, setNavigationTree, sessionData, plugin } = useContext(YwIContext)

    const isOpen = open.get(node.id)

    const [navLineHeight, setNavLineHeight] = useState(0);
    const ref = useRef(null);

    const childrensView = <div ref={ref}>
        {node.children?.length && isOpen && (
            <div>
                <NavLineView navLineHeight={navLineHeight} />
                <ul style={{ paddingLeft: 17 }}>
                    {node.children.map(node => (
                        <NodeView node={node} key={node.id} />
                    ))}
                </ul>
            </div>
        )}
    </div>

    const unwrapCallback = async () => {
        const type = isOpen ? TreeViewActionTypes.CLOSE : TreeViewActionTypes.OPEN

        if (type === TreeViewActionTypes.OPEN && node.has_children) {
            const parentSlug: String | undefined = node.slug?.join("/") // нужно что-то добавлять

            if (typeof parentSlug === 'string') {
                const childrensData = await getNavTreeNode(sessionData, parentSlug)
                const childrenNodes = [...childrensData.tree[0].children.results]
                    .map(node =>
                    ({
                        id: uuid(),
                        name: node.title,
                        slug: node.slug.split("/"),
                        navName: node.slug.split("/")[node.slug.split("/").length - 1],
                        has_children: node.has_children
                    }))

                addChilds(navigationTree, node.slug, childrenNodes)
                setNavigationTree(navigationTree)
            }
        }

        dispatch({ id: node.id, type: type })
    }

    useLayoutEffect(() => {
        const current: any = ref?.current           // так он не ругается
        setNavLineHeight(current?.offsetHeight - 4);    // <= вот тут изначально был ```ref?.current?.offsetHeight```
    }, [childrensView]);

    return <li style={{ listStyleType: "none" }}>
        <div
            style={{
                margin: 0,
                // paddingTop: 5,
                // paddingBottom: 5,
                width: "max-content",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // display: "inline-block",
            }}

            // className='treeNodeContainer'

            onClick={async () => {
                const parentSlug: String | undefined = node.slug?.join("/") // нужно что-то добавлять

                if (typeof parentSlug === 'string') {
                    console.log("get page puk-sren`k")
                    const page_data = await getYWPage(sessionData, parentSlug)
                    console.log(page_data)

                    // plugin.app.vault.trigger("yandex-wiki-integration:get-wiki-page", page_data.content)
                    plugin.app.vault.trigger("yandex-wiki-integration:get-wiki-page", page_data.html)
                }
            }}
        >
            <NavArrowView empty={!node.has_children} open={isOpen} onClick={unwrapCallback} />

            <div
                className='treeNodeContainer'
                style={{
                    // width: 1111,//"max-content",
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 5,
                    paddingBottom: 5,
                    // display: "inline-block",
                    // height: "100%",
                    // float: "left",
                }}
            >{node.name}</div>
            {/* <div></div> */}
            {/* {node.name} */}
        </div>

        {node.children?.length && isOpen &&
            childrensView
        }

    </li>
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

// AnotherSimpleUser@yandex.ru

export const LazyTreeView = () => {
    const [open, dispatch] = useReducer(
        treeViewReducer,
        new Map<string, boolean>(),
    )
    const [value, onChange] = useState<string | null>(null)


    const { navigationTree } = useContext(YwIContext)

    return <TreeViewContext.Provider
        value={{
            open,
            dispatch,
            selectedId: value,
            selectId: onChange,
        }}
    >
        <div style={{ marginLeft: -8 }}>
            <ul style={{ fontSize: 13, color: "currentColor", opacity: 0.85, paddingLeft: 8 }}>
                {navigationTree.map((node: any) => (
                    <NodeView node={node} key={node.id} />
                ))}
            </ul>
        </div>
    </TreeViewContext.Provider>
}
