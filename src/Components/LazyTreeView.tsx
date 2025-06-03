

import { v4 as uuid } from 'uuid'
import { TreeNodeType } from "src/Model/TreeType"

import { HomeIcon, PathHomeIcon } from './HomeIcon'

import {
    createContext,
    Dispatch,
    ReactNode,
    useContext,
    useReducer,
    MouseEvent,
} from 'react'

import { Menu, Notice, } from 'obsidian';

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
            // marginLeft: 4,
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
import { rgba } from 'framer-motion'
import { Plugin } from 'obsidian'
import { IYWIPlugin } from 'src/Main/IYWIPlugin'
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

const isVaultSlugPart = (plugin: IYWIPlugin, node: TreeNodeType) => {
    // console.log()
    return node.slug?.every((slug, index) => slug === plugin.settings.data.vaultSlug.split("/")[index])
}

const isVaultSlug = (plugin: IYWIPlugin, node: TreeNodeType) => {
    return node.slug?.length === plugin.settings.data.vaultSlug.split("/").length && isVaultSlugPart(plugin, node)
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
        const current: any = ref?.current               // так он не ругается
        const height = current?.offsetHeight - 4        // <= вот тут изначально был ```ref?.current?.offsetHeight```

        if (height > 0) {
            setNavLineHeight(height);
        }

    }, [childrensView]);

    const handleMouseEvent = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        // console.log(e)


        // Do something
    };

    let pathHomeIcon



    // (isVaultSlugPart(plugin, node) ? <HomeIcon exactSlug={isVaultSlug(plugin, node)}
    if (isVaultSlug(plugin, node) && isVaultSlugPart(plugin, node)) {
        pathHomeIcon = <HomeIcon />
    } else if (isVaultSlugPart(plugin, node)) {
        pathHomeIcon = <PathHomeIcon />
    } else {
        pathHomeIcon = undefined
    }

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

            onContextMenu={async (e: MouseEvent<HTMLDivElement>) => {
                e.preventDefault();
                const menu = new Menu();

                menu.addItem((item) =>
                    item
                        .setTitle('Установить как рабочую директорию')
                        .setIcon('lucide-home')
                        .onClick(() => {

                            // plugin.settings.setHomeSlug()
                            plugin.app.vault.trigger("yandex-wiki-integration:set-home-slug", node.slug)
                            // new Notice('Home Slug setted');
                        })
                );

                menu.addItem((item) =>
                    item
                        .setTitle('Экспортировать хранилище сюда')
                        .setIcon('lucide-import')
                        .onClick(() => {
                            plugin.app.vault.trigger("yandex-wiki-integration:upload", node.slug)
                        })
                );

                menu.showAtPosition({ x: e.screenX, y: e.screenY })
            }}

            onClick={async () => {
                const parentSlug: String | undefined = node.slug?.join("/")

                if (typeof parentSlug === 'string') {
                    const page_data = await getYWPage(sessionData, parentSlug)
                    plugin.app.vault.trigger("yandex-wiki-integration:get-wiki-page", page_data)
                }
            }}
        >
            <NavArrowView empty={!node.has_children} open={isOpen} onClick={unwrapCallback} />

            <div
                // className={'treeNodeContainer' + (isVaultSlugPart(plugin, node) ? " slugTreeNodeContainer" : "")}
                className='treeNodeContainer'

                style={{
                    // width: 1111,//"max-content",
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 4,
                    paddingBottom: 4,
                    // borderColor: 'transparent transparent rgb(120, 82, 238) transparent ',
                    borderColor: 'rgba(120, 82, 238, 0.5)',
                    borderWidth: 1

                    // display: "inline-block",
                    // height: "100%",
                    // float: "left",
                    // color: 'rgb(120, 82, 238)'


                    // background: isVaultSlugPart(plugin, node) ? "rgba(149, 113, 242, 0.4)" : "",
                    // borderRadius: 4,
                    // borderColor: "red",
                    // borderWidth: 2

                    // textDecoration: isVaultSlugPart(plugin, node) ? "underline rgb(120, 82, 238)" : ""
                }}
            >{node.name} {pathHomeIcon}
                {/* <div
                    style={{
                        width: "100%",
                        height: 2.5,
                        background: isVaultSlugPart(plugin, node) ? "rgba(149, 113, 242, 0.4)" : "",
                    }}
                ></div> */}
            </div>

            {/* <div></div> */}
            {/* {node.name} */}
        </div>
        {node.children?.length && isOpen &&
            childrensView
        }

    </li>
}

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
        <div
            style={{
                marginLeft: -8,
                // overflowY: "scroll",
                // height: "calc(100%)",
                overflowY: "scroll",
                flexGrow: 1,
                marginRight: -12,
                marginBottom: -32
            }}
        >
            <ul style={{ fontSize: 13, color: "currentColor", opacity: 0.85, paddingLeft: 8 }}>
                {navigationTree.map((node: any) => (
                    <NodeView node={node} key={node.id} />
                ))}
            </ul>
        </div>
    </TreeViewContext.Provider >
}
