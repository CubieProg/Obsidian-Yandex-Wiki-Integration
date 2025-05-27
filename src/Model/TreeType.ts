import {
    ReactNode,
} from 'react'


export type TreeNodeType = {
    id: string
    name: String
    children?: TreeNodeType[]
    icon?: ReactNode
    navLine?: boolean
    
    
    navName: string,
    slug?: string[]
    parent?: TreeNodeType
    has_children?: boolean
}