

export async function TestYW(session_data: any) {



    // Add file with unexisted slug

    // -----------------------------------------------------------------------------------------------------------------------
    // // Файл добавляется, но он "типо" невидим
    // // Вытащил папки. Дерево нахуй не нужно

    // const URL: string = "https://wiki.yandex.ru/.gateway/root/wiki/createPage"
    // const method: string = "POST"
    // const params: object = {
    //     pageType: "wysiwyg",
    //     parentSlug: "nottest/",      // parentSlug: getParentSlug(file),
    //     slug: "nottest/Pisun",     // slug: getSlug(file),
    //     subscribeMe: false,
    //     title: "testUESlugFile",    // title: file.name.split('.')[0]
    // }

    // // Рабочий
    // // {
    // //     pageType: "wysiwyg",
    // //     parentSlug: "nottest/",      // parentSlug: getParentSlug(file),
    // //     slug: "nottest/testUESlugFile",     // slug: getSlug(file),
    // //     subscribeMe: false,
    // //     title: "testUESlugFile",    // title: file.name.split('.')[0]
    // // }

    // const headers = convertHeaders(
    //     session_data,
    //     ['Accept', 'Content-Type', 'x-collab-org-id', 'x-csrf-token'],
    //     ['yc_session', 'Session_id']
    // )

    // console.log(headers)
    // console.log(JSON.stringify(params))

    // let response = await requestUrl({
    //     url: URL,
    //     method: method,
    //     headers: headers,
    //     body: JSON.stringify(params)
    // })
    //     .then(async (response) => {
    //         return (await response.json)
    //     })
    //     .catch(err => console.log(err)) // Падает с ошибкой (Нет)

    // console.log(response)
    // // const response_data = { "response": response.json, "x-csrf-token": response.headers.get('x-csrf-token') }
    // // console.log(response_data)
    // -----------------------------------------------------------------------------------------------------------------------



    // Find existed file && Find unexisted file
    // -----------------------------------------------------------------------------------------------------------------------

    // const exist_data = await getYWPage(session_data, 'nottest')
    // console.log(exist_data)

    // const unexist_data = await getYWPage(session_data, 'nenottest') // 404
    // console.log(unexist_data)

    // -----------------------------------------------------------------------------------------------------------------------


    // Rewrite file
    // -----------------------------------------------------------------------------------------------------------------------
    // // Содержание перезаписывается полностью
    // // Обязательно нужен актуальный last_revision_id подставить в revision

    // const URL: string = "https://wiki.yandex.ru/.gateway/root/wiki/updatePageDetails"
    // const method: string = "POST"
    // const params: object = {
    //     content: "TestContent",
    //     fields: ["content", "last_revision_id", "attributes", "revision_draft", "background"],
    //     pageId: 47852860, // nottest
    //     revision: 63016996,
    //     settings: { lang: "ru", theme: "dark" }
    // }

    // const headers = convertHeaders(
    //     session_data,
    //     ['Accept', 'Content-Type', 'x-collab-org-id', 'x-csrf-token'],
    //     ['yc_session', 'Session_id']
    // )


    // // csrf token ниже
    // let response = await requestUrl({
    //     url: URL,
    //     method: method,
    //     headers: headers,
    //     body: JSON.stringify(params)
    // })
    //     // .then(async (response) => {
    //     //     return (await response.json)
    //     // })
    //     .catch(err => console.log(err))

    // console.log(response)

    // if (response) {
    //     console.log(response?.headers["x-csrf-token"])
    //     console.log(await response.json)
    // }
    // -----------------------------------------------------------------------------------------------------------------------

}