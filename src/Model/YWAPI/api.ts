
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



export async function testPage() {

    console.log("req")
    return requestUrl({
        url: "https://wiki.yandex.ru/.gateway/root/wiki/getPageDetails",
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-collab-org-id": "c16fe7d1-e7fd-4ee9-ac85-f045c5d33a64",
            "x-csrf-token": "c98ba02397d7c3fdfc52d3e3e1dec45156e227a0:1748261114",
            // "cookie": "is_gdpr=0; is_gdpr_b=CPeNKxDMwgIoAg==; i=Sejovl3ZhmLmw97HyeJc0cWAt1Rh0Tj4s1TJrdYchq9LvEEMJkUoTw8ZBNo2alAi+cza4huS0bmjSL51EwaHIWxLKZY=; yandexuid=6976519031748252971; yashr=5176086591748252971; yuidss=6976519031748252971; ymex=2063612974.yrts.1748252974; yclid_src=yabs.yandex.ru/resource/spacer.gif:5298760901816483839:6976519031748252971; gdpr=0; _ym_uid=1748252974566627094; _ym_d=1748252974; my=YwA=; _ym_isad=2; Session_id=3:1748253055.5.0.1748253055530:Fck_Ag:589b.1.2:1|777835964.0.2.3:1748253055|3:10308027.973530.zj6GZ0ALaXHpAYGsheKJsQOFPug; sessar=1.1202.CiAHOZTxo0zRXPxsa-rM9gu3pAIhh8bHYKSVuKkh_Sbohw.jY3OPFMHTpwO6hEwGhutzvo1gwMeby-TT1SrN09xbro; sessionid2=3:1748253055.5.0.1748253055530:Fck_Ag:589b.1.2:1|777835964.0.2.3:1748253055|3:10308027.973530.fakesign0000000000000000000; yp=1749116973.dlp.2#1750931373.hdrc.0#2063612972.pcs.0#1779788973.swntab.0#1764020982.szm.1_25:1536x864:442x731#2063613055.udn.cDpBbm90aGVyU2ltcGxlVXNlcg%3D%3D; L=BXVcZ15jUgp2RW8CY2J8VwAFSl5cSGF2MzolBwMJFioMDjgEUDsxCQY=.1748253055.16163.366069.a555da8e1b2ef44c9f621df9b9c00a9b; yandex_login=AnotherSimpleUser; ys=udn.cDpBbm90aGVyU2ltcGxlVXNlcg%3D%3D#c_chck.2939616431; yc_session=c1.9euelZrLmpmSk8-dzJnPnZKOmoyblO3rnpWaxpmWl8vKkY2TloqZmsmYksrl8_d7DC8--e9jXCJS_N3z93tyED3572NcIlL81ej18oac0ZCeiouX0YiWlJbt-ZCPmpGWm83X9dudx8nMnMiZztKamcbI0suey5vSxsaem9KencnPxsvNmpydx8zv_sXrnpWalpXLkc3HjJSKkpaPm86JmcqF_w.40_WBxE66mW8yhDMl_-i4mcOOeWq20cCejPtcVeW6_wcfrCwOl_t12fW8az7ekdAuluGh8i_H9Ig2dbsOLNvCg; _yasc=pbqNP27Jf6rdNtTDyxmasqhrplTbFmCo+VJE8/ufJC/pkkZrdFRYsZNFnCGOcCbsP3wHjtDE4kE4; bh=EkIiQ2hyb21pdW0iO3Y9IjEzNiIsICJNaWNyb3NvZnQgRWRnZSI7dj0iMTM2IiwgIk5vdC5BL0JyYW5kIjt2PSI5OSIaA3g4NiINMTM2LjAuMzI0MC43NioCPzAyAiIiOgkiV2luZG93cyJCBjEwLjAuMEoCNjRSWyJDaHJvbWl1bSI7dj0iMTM2LjAuNzEwMy4xMTMiLCJNaWNyb3NvZnQgRWRnZSI7dj0iMTM2LjAuMzI0MC43NiIsIk5vdC5BL0JyYW5kIjt2PSI5OS4wLjAuMCJaAj8wYNGx0cEGaiHcyuH/CJLYobEDn8/h6gP7+vDnDev//fYPwaPNhwjg1wM=; CSRF-TOKEN=c98ba02397d7c3fdfc52d3e3e1dec45156e227a0%3A1748261114",
            // "cookie": "Session_id=3:1748253055.5.0.1748253055530:Fck_Ag:589b.1.2:1|777835964.0.2.3:1748253055|3:10308027.973530.zj6GZ0ALaXHpAYGsheKJsQOFPug; sessar=1.1202.CiAHOZTxo0zRXPxsa-rM9gu3pAIhh8bHYKSVuKkh_Sbohw.jY3OPFMHTpwO6hEwGhutzvo1gwMeby-TT1SrN09xbro; sessionid2=3:1748253055.5.0.1748253055530:Fck_Ag:589b.1.2:1|777835964.0.2.3:1748253055|3:10308027.973530.fakesign0000000000000000000; yp=1749116973.dlp.2#1750931373.hdrc.0#2063612972.pcs.0#1779788973.swntab.0#1764020982.szm.1_25:1536x864:442x731#2063613055.udn.cDpBbm90aGVyU2ltcGxlVXNlcg%3D%3D; L=BXVcZ15jUgp2RW8CY2J8VwAFSl5cSGF2MzolBwMJFioMDjgEUDsxCQY=.1748253055.16163.366069.a555da8e1b2ef44c9f621df9b9c00a9b; yandex_login=AnotherSimpleUser; ys=udn.cDpBbm90aGVyU2ltcGxlVXNlcg%3D%3D#c_chck.2939616431; yc_session=c1.9euelZrLmpmSk8-dzJnPnZKOmoyblO3rnpWaxpmWl8vKkY2TloqZmsmYksrl8_d7DC8--e9jXCJS_N3z93tyED3572NcIlL81ej18oac0ZCeiouX0YiWlJbt-ZCPmpGWm83X9dudx8nMnMiZztKamcbI0suey5vSxsaem9KencnPxsvNmpydx8zv_sXrnpWalpXLkc3HjJSKkpaPm86JmcqF_w.40_WBxE66mW8yhDMl_-i4mcOOeWq20cCejPtcVeW6_wcfrCwOl_t12fW8az7ekdAuluGh8i_H9Ig2dbsOLNvCg; _yasc=pbqNP27Jf6rdNtTDyxmasqhrplTbFmCo+VJE8/ufJC/pkkZrdFRYsZNFnCGOcCbsP3wHjtDE4kE4; bh=EkIiQ2hyb21pdW0iO3Y9IjEzNiIsICJNaWNyb3NvZnQgRWRnZSI7dj0iMTM2IiwgIk5vdC5BL0JyYW5kIjt2PSI5OSIaA3g4NiINMTM2LjAuMzI0MC43NioCPzAyAiIiOgkiV2luZG93cyJCBjEwLjAuMEoCNjRSWyJDaHJvbWl1bSI7dj0iMTM2LjAuNzEwMy4xMTMiLCJNaWNyb3NvZnQgRWRnZSI7dj0iMTM2LjAuMzI0MC43NiIsIk5vdC5BL0JyYW5kIjt2PSI5OS4wLjAuMCJaAj8wYNGx0cEGaiHcyuH/CJLYobEDn8/h6gP7+vDnDev//fYPwaPNhwjg1wM=; CSRF-TOKEN=c98ba02397d7c3fdfc52d3e3e1dec45156e227a0%3A1748261114",
            "cookie": "Session_id=3:1748253055.5.0.1748253055530:Fck_Ag:589b.1.2:1|777835964.0.2.3:1748253055|3:10308027.973530.zj6GZ0ALaXHpAYGsheKJsQOFPug; yc_session=c1.9euelZrLmpmSk8-dzJnPnZKOmoyblO3rnpWaxpmWl8vKkY2TloqZmsmYksrl8_d7DC8--e9jXCJS_N3z93tyED3572NcIlL81ej18oac0ZCeiouX0YiWlJbt-ZCPmpGWm83X9dudx8nMnMiZztKamcbI0suey5vSxsaem9KencnPxsvNmpydx8zv_sXrnpWalpXLkc3HjJSKkpaPm86JmcqF_w.40_WBxE66mW8yhDMl_-i4mcOOeWq20cCejPtcVeW6_wcfrCwOl_t12fW8az7ekdAuluGh8i_H9Ig2dbsOLNvCg",
        },
        body: "{\"slug\":\"aaa/yhnnhsmbtest/spisokrabotiartefaktov\",\"fields\":[\"content\"]}"
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