import { v4 as uuid } from 'uuid'

import { TreeNodeType } from "./TreeType";

export const data: TreeNodeType[] = [
    {
        id: uuid(),
        name: 'Доки по YWI',
    },
    {
        id: uuid(),
        name: 'components',
        children: [
            {
                id: uuid(),
                name: 'toggle-group',
                children: [
                    {
                        id: uuid(),
                        name: 'index.ts',
                    },
                    {
                        id: uuid(),
                        name: 'toggle-group.tsx',
                    },
                ],
            },
            {
                id: uuid(),
                name: 'treeview',
                children: [
                    {
                        id: uuid(),
                        name: 'icons.tsx',
                    },
                    {
                        id: uuid(),
                        name: 'index.tsx',
                    },
                    {
                        id: uuid(),
                        name: 'treeview.tsx',
                    },
                ],
            },
            {
                id: uuid(),
                name: 'long-component-folder-name-that-overflows',
                children: [
                    {
                        id: uuid(),
                        name: 'index.tsx',
                    },
                    {
                        id: uuid(),
                        name: 'long-component.tsx',
                    },
                ],
            },
            {
                id: uuid(),
                name: 'index.tsx',
            },
            {
                id: uuid(),
                name: 'long-util-file-name-that-overflows.tsx',
            },
            {
                id: uuid(),
                name: 'roving-tabindex.tsx',
            },
        ],
    },
    {
        id: uuid(),
        name: 'lib',
        children: [
            {
                id: uuid(),
                name: 'treeview',
                children: [
                    {
                        id: uuid(),
                        name: 'index.ts',
                    },
                    {
                        id: uuid(),
                        name: 'initialValue.ts',
                    },
                    {
                        id: uuid(),
                        name: 'tree-state.tsx',
                    },
                    {
                        id: uuid(),
                        name: 'useTreeNode.tsx',
                    },
                ],
            },
            {
                id: uuid(),
                name: 'utils',
                children: [
                    {
                        id: uuid(),
                        name: 'chainable-map.ts',
                    },
                    {
                        id: uuid(),
                        name: 'index.ts',
                    },
                ],
            },
        ],
    },
    {
        id: uuid(),
        name: 'pages',
        children: [
            {
                id: uuid(),
                name: '_app.tsx',
            },
            {
                id: uuid(),
                name: '_document.tsx',
            },
            {
                id: uuid(),
                name: 'index.tsx',
            },
            {
                id: uuid(),
                name: 'toggle-group.tsx',
            },
            {
                id: uuid(),
                name: 'treeview.tsx',
            },
        ],
    },
    {
        id: uuid(),
        name: 'public',
        children: [
            {
                id: uuid(),
                name: 'favicon.ico',
            },
            {
                id: uuid(),
                name: 'file.png',
            },
            {
                id: uuid(),
                name: 'folder.png',
            },
            {
                id: uuid(),
                name: 'next.svg',
            },
            {
                id: uuid(),
                name: 'thirteen.svg',
            },
            {
                id: uuid(),
                name: 'vercel.svg',
            },
        ],
    },
    {
        id: uuid(),
        name: 'styles',
        children: [
            {
                id: uuid(),
                name: 'global.css',
            },
        ],
    },
    {
        id: uuid(),
        name: '.eslintrc.json',
    },
    {
        id: uuid(),
        name: '.gitignore',
    },
    {
        id: uuid(),
        name: '.prettierrc.js',
    },
    {
        id: uuid(),
        name: 'next-env.d.ts',
    },
    {
        id: uuid(),
        name: 'next.config.js',
    },
    {
        id: uuid(),
        name: 'package.json',
    },
    {
        id: uuid(),
        name: 'postcss.config.js',
    },
    {
        id: uuid(),
        name: 'README.md',
    },
    {
        id: uuid(),
        name: 'tailwind.config.js',
    },
    {
        id: uuid(),
        name: 'tsconfig.json',
    },
    {
        id: uuid(),
        name: 'yarn.lock',
    },
]
