import { convertHeaders } from '../../Authtorization/authtorize'
import { requestUrl, Vault, TFile, RequestUrlResponse, TAbstractFile, Notice } from "obsidian";
import { v4 as uuid } from 'uuid'

import { TreeNodeType } from "../TreeType";
import { IYWIPlugin } from 'src/Main/IYWIPlugin';
import { YWISettings } from 'src/Main/Settings/Settings'
import { transliterate } from './transliterate'

const formatFilter = (allowed: string[], cmp: string) => {
    return (allowed.includes(cmp))
}

const pathFilter = (path: string, cmp: string) => {
    if (path === "__path__") { return true }
    return cmp.startsWith(path)
}

async function createPage(session_data: any, slug: string, title: string) {
    const URL: string = "https://wiki.yandex.ru/.gateway/root/wiki/createPage"
    const method: string = "POST"

    const slugs: string[] = slug.split("/")
    slugs.pop()
    const parentSlug: string = slugs.join("/")

    const params: object = {
        pageType: "wysiwyg",
        parentSlug: parentSlug,
        slug: slug,
        subscribeMe: false,
        title: title,
    }

    const headers = convertHeaders(
        session_data,
        ['Accept', 'Content-Type', 'x-collab-org-id', 'x-csrf-token'],
        ['yc_session', 'Session_id']
    )

    const response = await requestUrl({
        url: URL,
        method: method,
        headers: headers,
        body: JSON.stringify(params)
    })
        .catch(err => { console.log("createPage error"); console.log(err) })

    if (!response) { throw new Error("createPage(...) error. No response") }
    return response
}

async function getPageDetails(session_data: any, slug: string) {
    const URL = 'https://wiki.yandex.ru/.gateway/root/wiki/getPageDetails'
    const method: string = "POST"

    const headers = convertHeaders(
        session_data,
        ['Accept', 'Content-Type', 'x-collab-org-id', 'x-csrf-token'],
        ['yc_session', 'Session_id']
    )

    const params = {
        slug: slug,
        raiseOnRedirect: true,
        settings: {
            lang: "ru",
            theme: "system"
        },
        fields: [
            "breadcrumbs",
            "content",
            "access",
            "last_revision_id",
            "authors",
            "bookmark",
            "cluster",
            "subscription",
            "user_permissions",
            "background",
            "redirect",
            "last_revision_id",
            "actuality",
            "attributes",
            "revision_draft",
            "unresolved_comments"
        ]
    }

    const response = await requestUrl({
        url: URL,
        method: method,
        headers: headers,
        body: JSON.stringify(params)
    })
        .catch(err => { console.log("getPageDetails error"); console.log(err) })

    if (!response) { throw new Error("getPageDetails(...) error. No response") }
    return response
}

async function updatePageDetails(
    session_data: any,
    pageId: number,
    lastRevisionId: number,
    content: string
) {
    const URL: string = "https://wiki.yandex.ru/.gateway/root/wiki/updatePageDetails"
    const method: string = "POST"
    const params: object = {
        content: content,
        fields: ["content", "last_revision_id", "attributes", "revision_draft", "background"],
        pageId: pageId,
        revision: lastRevisionId,
        settings: { lang: "ru", theme: "dark" }
    }

    const headers = convertHeaders(
        session_data,
        ['Accept', 'Content-Type', 'x-collab-org-id', 'x-csrf-token'],
        ['yc_session', 'Session_id']
    )

    const response = await requestUrl({
        url: URL,
        method: method,
        headers: headers,
        body: JSON.stringify(params)
    })
        .catch(err => console.log(err))

    if (!response) { throw new Error("updatePageDetails(...) error. No response") }
    return response
}

export async function upload(
    settings: YWISettings,
    session_data: any,
    slug: string,
    title: string,
    content: string
) {
    try {
        const createData = await createPage(session_data, slug, title)
        // const createDataJson = (await createData.json)
        settings.updateCSRF(createData.headers["x-csrf-token"])
    } catch (err) { }

    // МБ не надо. Хотя, я пытался...
    // ------------------------------------------------------------
    const detailsData = await getPageDetails(session_data, slug)
    settings.updateCSRF(detailsData.headers["x-csrf-token"])
    const detailsDataJson = (await detailsData.json)
    // ------------------------------------------------------------

    const last_revision_id = detailsDataJson.last_revision_id
    const page_id = detailsDataJson.id

    if (content.length > 0) {
        const updateData = await updatePageDetails(session_data, page_id, last_revision_id, content)
        settings.updateCSRF(updateData.headers["x-csrf-token"])
    }
}



import { TUploadTransaction } from './UploadTransaction'

export async function uploadFiles(
    settings: YWISettings,
    parentSlug: string,
    files: TFile[],
    fileContents: string[],
    baseSlug: string | undefined,
    transaction: TUploadTransaction
) {
    if (files.length !== fileContents.length) { throw new Error("Количество файлов должно совпадать с количеством содержимого") }

    const bytesAtAll = files.reduce((sum, current) => sum + current.stat.size, 0);

    let uploadedBytes = 0
    for (let i = 0; i < files.length; i++) {
        let fileSlug = files[i].path.slice(baseSlug ? baseSlug.length + 1 : 0).split(".")
        fileSlug.pop()
        fileSlug = transliterate(fileSlug.join("."))

        const slug = parentSlug + "/" + fileSlug
        const title = files[i].name

        transaction.fileName = title
        await upload(settings, settings.data.session, slug, title, fileContents[i])

        uploadedBytes += files[i].stat.size
        transaction.progress = uploadedBytes / bytesAtAll
    }

    transaction.fileName = ""
    transaction.progress = 0.0
}

export async function uploadFolders(
    settings: YWISettings,
    parentSlug: string,
    foldersSlug: string[],
    baseSlug: string | undefined,
    transaction: TUploadTransaction
) {

    for (let i = 0; i < foldersSlug.length; i++) {
        const slug = transliterate(foldersSlug[i].slice(baseSlug ? baseSlug.length + 1 : 0))
        const title = foldersSlug[i].split("/").pop()

        if (title === undefined) { return }

        if (typeof title === 'string') { transaction.fileName = title }

        await upload(settings, settings.data.session, parentSlug + "/" + slug, title, "")
    }

    transaction.fileName = ""
    transaction.progress = 0.0
}


export async function uploadFile(slug: string, file: TAbstractFile | null, plugin: IYWIPlugin) {
    const formats = plugin.settings.data.exportFormats
    const vault = plugin.app.vault

    const filePath = file ? file.path : ""
    const baseSlug = file ? file.parent?.path : ""

    const files = vault
        .getFiles()
        .filter(item => formatFilter(formats, item.extension))
        .filter(item => pathFilter(filePath, item.path))

    const read_tasks = files.map(file => vault.read(file))

    const folders = vault.getAllFolders(true)
        .filter(item => pathFilter(filePath, item.path))

    const bytes = files.reduce((sum, current) => sum + current.stat.size, 0);
    new Notice(`YWI: Начался экспорт. \nПапок для передачи: ${folders.length}\nФайлов для передачи: ${files.length}\nОбъём: ${bytes} байт`)

    await uploadFolders(plugin.settings, slug, folders.map(folder => folder.path), baseSlug, plugin.transaction)

    const files_data = await Promise.all(read_tasks)
    await uploadFiles(plugin.settings, slug, files, files_data, baseSlug, plugin.transaction)

    new Notice("YWI: Экспорт законичлся")
}

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
            "last_revision_id"
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

export async function getWholeTree(session_data: object): Promise<TreeNodeType[]> {
    let treeViewData: TreeNodeType[] = []
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