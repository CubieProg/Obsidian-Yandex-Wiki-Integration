
// import { Subscriber } from '../EventManager'


export class Session {

}


import { check_session, convertHeaders } from '../../Authtorization/authtorize'
import { requestUrl } from "obsidian";




export async function getNavTreeRoot(session_data: object) {
    const URL: string = "https://wiki.yandex.ru/.gateway/root/wiki/openNavigationTree"
    const method: string = "POST"
    const params: object = {
        "parentSlug": "",
        "breadcrumbsBranchSlug": "homepage"
    }

    const headers = convertHeaders(
        session_data,
        ['Accept', 'Content-Type', 'x-collab-org-id', 'x-csrf-token'],
        ['yc_session', 'Session_id']
    )

    return requestUrl({
        url: URL,
        method: method,
        headers: headers,
        body: JSON.stringify(params)
    })
        .then(async (response) => {
            return (await response.json)
        })
        .catch(err => console.log(err))
}


// request = "https://wiki.yandex.ru/.gateway/root/wiki/openNavigationTreeNode"

export async function getNavTreeNode(session_data: object, parentSlug: string) {
    const URL: string = "https://wiki.yandex.ru/.gateway/root/wiki/openNavigationTreeNode"
    const method: string = "POST"
    const params: object = {
        "parentSlug": parentSlug,
    }

    const headers = convertHeaders(
        session_data,
        ['Accept', 'Content-Type', 'x-collab-org-id', 'x-csrf-token'],
        ['yc_session', 'Session_id']
    )

    return requestUrl({
        url: URL,
        method: method,
        headers: headers,
        body: JSON.stringify(params)
    })
        .then(async (response) => {
            return (await response.json)
        })
        .catch(err => console.log(err))
}




export async function getYWPage(session_data: object, parentSlug: string) {
    const URL: string = "https://wiki.yandex.ru/.gateway/root/wiki/getPageDetails"
    const method: string = "POST"

    const params: object = {
        slug: parentSlug,
        fields: [
            "content",
        ]
    }

    const headers = convertHeaders(
        session_data,
        ['Content-Type', 'x-collab-org-id', 'x-csrf-token'],
        ['yc_session', 'Session_id']
    )

    return requestUrl({
        url: URL,
        method: method,
        headers: headers,
        body: JSON.stringify(params)
    })
        .then(async (response) => {
            return (await response.json)
        })
        .catch(err => console.log(err))
}


// console.log(await getNavTreeRoot(session))


// async function getSubtree(session, slug: string) {

// }

import { v4 as uuid } from 'uuid'
import { TreeNodeType } from "../TreeType";



export async function getWholeTree(session_data: object): Promise<TreeNodeType[]> {
    // let treeViewData: TreeNodeType[] = []

    // const root = await getNavTreeRoot(session_data)

    // console.log("root")
    // console.log(root)
    // console.log(root.tree)
    // console.log(root.tree[0])

    // let tasks = [...root.tree[0].children.results].filter(treeNode => treeNode.has_children);

    // let tasks = [{"root", pointer}]


    // const root = await getNavTreeRoot(session_data)

    let treeViewData: TreeNodeType[] = []

    // let tasks: any[] = []
    let needRoot: boolean = true


    let new_tasks: any[] = []

    while (new_tasks.length > 0 || needRoot) {


        let task = needRoot ? null : new_tasks.shift()
        const result = needRoot ? await getNavTreeRoot(session_data) : await getNavTreeNode(session_data, task.slug)


        const result_nodes = [...result.tree[0].children.results]
            .map(node =>
            ({
                id: uuid(),
                name: node.title,
                navName: node.slug.split("/")[node.slug.split("/").length - 1],
                slug: node.slug,
                has_children: node.has_children
            }))

        new_tasks = [
            ...new_tasks,
            ...result_nodes.filter(node => node.has_children)
        ]

        if (needRoot) {
            treeViewData = result_nodes
        } else {
            task.children = result_nodes
        }


        if (needRoot) { needRoot = false }
    }
    return treeViewData
}

// let example = {
//     "tree": [
//         {
//             "id": null,
//             "slug": "",
//             "title": "Nekii N. & Co",
//             "type": "root",
//             "page_type": null,
//             "has_children": true,
//             "is_fixed": null,
//             "children": {
//                 "results": [],
//                 "next_cursor": null,
//                 "prev_cursor": null,
//                 "has_next": false,
//                 "page_id": 1
//             }
//         },
//         {
//             "id": null,
//             "slug": "internal",
//             "title": "internal",
//             "type": "gap",
//             "page_type": null,
//             "has_children": false,
//             "is_fixed": false,
//             "children": {
//                 "results": [],
//                 "next_cursor": null,
//                 "prev_cursor": null,
//                 "has_next": false,
//                 "page_id": 1
//             }
//         }
//     ]
// }


// let request: any = "https://wiki.yandex.ru/.gateway/root/wiki/openNavigationTree"

// let params: any = {
//     "parentSlug": "",
//     "breadcrumbsBranchSlug": "homepage"
// }

// let response: any = {
//     "tree": [
//         {
//             "id": null,
//             "slug": "",
//             "title": "Nekii N. & Co",
//             "type": "root",
//             "page_type": null,
//             "has_children": true,
//             "is_fixed": null,
//             "children": {
//                 "results": [
//                     {
//                         "id": -100,
//                         "slug": "homepage",
//                         "title": "Главная страница",
//                         "type": "copy_on_write",
//                         "page_type": "wysiwyg",
//                         "has_children": true,
//                         "is_fixed": true
//                     },
//                     {
//                         "id": -101,
//                         "slug": "users",
//                         "title": "Личные разделы пользователей",
//                         "type": "copy_on_write",
//                         "page_type": "wysiwyg",
//                         "has_children": false,
//                         "is_fixed": true
//                     },
//                     {
//                         "id": 47854246,
//                         "slug": "aaa",
//                         "title": "aaa",
//                         "type": "page",
//                         "page_type": "wysiwyg",
//                         "has_children": true,
//                         "is_fixed": false
//                     },
//                     {
//                         "id": 47852860,
//                         "slug": "nottest",
//                         "title": "nottest",
//                         "type": "page",
//                         "page_type": "wysiwyg",
//                         "has_children": true,
//                         "is_fixed": false
//                     },
//                     {
//                         "id": 47849383,
//                         "slug": "trash",
//                         "title": "trash",
//                         "type": "page",
//                         "page_type": "wysiwyg",
//                         "has_children": false,
//                         "is_fixed": false
//                     }
//                 ],
//                 "next_cursor": null,
//                 "prev_cursor": null,
//                 "has_next": false,
//                 "page_id": 1
//             }
//         },
//         {
//             "id": -100,
//             "slug": "homepage",
//             "title": "Главная страница",
//             "type": "copy_on_write",
//             "page_type": "wysiwyg",
//             "has_children": true,
//             "is_fixed": true,
//             "children": []
//         }
//     ]
// }


// request = "https://wiki.yandex.ru/.gateway/root/wiki/openNavigationTreeNode"

// params = {
//     "parentSlug": "nottest"
// }

// response = {
//     "tree": [
//         {
//             "id": null,
//             "slug": "",
//             "title": "Nekii N. & Co",
//             "type": "root",
//             "page_type": null,
//             "has_children": true,
//             "is_fixed": null,
//             "children": {
//                 "results": [
//                     {
//                         "id": 47854245,
//                         "slug": "nottest/tttt",
//                         "title": "tttt",
//                         "type": "page",
//                         "page_type": "wysiwyg",
//                         "has_children": false,
//                         "is_fixed": false
//                     }
//                 ],
//                 "next_cursor": null,
//                 "prev_cursor": null,
//                 "has_next": false,
//                 "page_id": 1
//             }
//         }
//     ],
//     "children": {
//         "results": [
//             {
//                 "id": 47854245,
//                 "slug": "nottest/tttt",
//                 "title": "tttt",
//                 "type": "page",
//                 "page_type": "wysiwyg",
//                 "has_children": false,
//                 "is_fixed": false
//             }
//         ],
//         "next_cursor": null,
//         "prev_cursor": null,
//         "has_next": false,
//         "page_id": 1
//     },
//     "breadcrumbs_branch": null
// }

// request = "https://wiki.yandex.ru/.gateway/root/wiki/openNavigationTreeNode"

// params = {
//     "parentSlug": "homepage"
// }

// response = {
//     "tree": [
//         {
//             "id": null,
//             "slug": "",
//             "title": "Nekii N. & Co",
//             "type": "root",
//             "page_type": null,
//             "has_children": true,
//             "is_fixed": null,
//             "children": {
//                 "results": [
//                     {
//                         "id": 47327186,
//                         "slug": "homepage/nauka",
//                         "title": "Наука",
//                         "type": "page",
//                         "page_type": "wysiwyg",
//                         "has_children": true,
//                         "is_fixed": false
//                     },
//                     {
//                         "id": 47259484,
//                         "slug": "homepage/testtable",
//                         "title": "testtable",
//                         "type": "page",
//                         "page_type": "wysiwyg",
//                         "has_children": true,
//                         "is_fixed": false
//                     }
//                 ],
//                 "next_cursor": null,
//                 "prev_cursor": null,
//                 "has_next": false,
//                 "page_id": 1
//             }
//         }
//     ],
//     "children": {
//         "results": [
//             {
//                 "id": 47327186,
//                 "slug": "homepage/nauka",
//                 "title": "Наука",
//                 "type": "page",
//                 "page_type": "wysiwyg",
//                 "has_children": true,
//                 "is_fixed": false
//             },
//             {
//                 "id": 47259484,
//                 "slug": "homepage/testtable",
//                 "title": "testtable",
//                 "type": "page",
//                 "page_type": "wysiwyg",
//                 "has_children": true,
//                 "is_fixed": false
//             }
//         ],
//         "next_cursor": null,
//         "prev_cursor": null,
//         "has_next": false,
//         "page_id": 1
//     },
//     "breadcrumbs_branch": null
// }


// request = "https://wiki.yandex.ru/.gateway/root/wiki/openNavigationTreeNode"

// params = {
//     "parentSlug": "homepage/nauka"
// }

// response = {
//     "tree": [
//         {
//             "id": null,
//             "slug": "",
//             "title": "Nekii N. & Co",
//             "type": "root",
//             "page_type": null,
//             "has_children": true,
//             "is_fixed": null,
//             "children": {
//                 "results": [
//                     {
//                         "id": 47349351,
//                         "slug": "homepage/nauka/servisy",
//                         "title": "Сервисы",
//                         "type": "page",
//                         "page_type": "wysiwyg",
//                         "has_children": false,
//                         "is_fixed": false
//                     },
//                     {
//                         "id": 47333957,
//                         "slug": "homepage/nauka/tex",
//                         "title": "Тех",
//                         "type": "page",
//                         "page_type": "wysiwyg",
//                         "has_children": false,
//                         "is_fixed": false
//                     },
//                     {
//                         "id": 47327187,
//                         "slug": "homepage/nauka/skreshhennye-pi-al",
//                         "title": "Скрещенные Pi-алгебры",
//                         "type": "page",
//                         "page_type": "wysiwyg",
//                         "has_children": true,
//                         "is_fixed": false
//                     }
//                 ],
//                 "next_cursor": null,
//                 "prev_cursor": null,
//                 "has_next": false,
//                 "page_id": 1
//             }
//         }
//     ],
//     "children": {
//         "results": [
//             {
//                 "id": 47349351,
//                 "slug": "homepage/nauka/servisy",
//                 "title": "Сервисы",
//                 "type": "page",
//                 "page_type": "wysiwyg",
//                 "has_children": false,
//                 "is_fixed": false
//             },
//             {
//                 "id": 47333957,
//                 "slug": "homepage/nauka/tex",
//                 "title": "Тех",
//                 "type": "page",
//                 "page_type": "wysiwyg",
//                 "has_children": false,
//                 "is_fixed": false
//             },
//             {
//                 "id": 47327187,
//                 "slug": "homepage/nauka/skreshhennye-pi-al",
//                 "title": "Скрещенные Pi-алгебры",
//                 "type": "page",
//                 "page_type": "wysiwyg",
//                 "has_children": true,
//                 "is_fixed": false
//             }
//         ],
//         "next_cursor": null,
//         "prev_cursor": null,
//         "has_next": false,
//         "page_id": 1
//     },
//     "breadcrumbs_branch": null
// }