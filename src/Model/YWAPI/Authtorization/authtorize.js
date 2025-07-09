
const puppeteer = require('puppeteer')
// const puppeteer = require('puppeteer-core')
const obsidian = require('obsidian')

const sync_fetch = require('sync-fetch')

const fs = require('fs');
const { promisify } = require('util')
const fileStat = promisify(fs.lstat)
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile);

const FILE_IO_PERMISSION = false;


import { requestUrl } from "obsidian";

const SESSION_FILENAME = './session.json'

function decodeCSRF(str) {
    return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}

function convertCookieObject(cookie_object) {
    return Object.keys(cookie_object).reduce(
        (acc, key) => acc += `;${key}=${cookie_object[key]}`, ""
    ).substring(1)
}

function project(obj, projection) {
    return projection.reduce(
        (acc, key) => Object.assign(acc, key in obj ? { [key]: obj[key] } : {}), {}
    )
}

async function getCollabOrgId(headers, cookies) {
    const URL = 'https://wiki.yandex.ru/.gateway/root/iam/getUserAccountSettings'

    let cookies_ = project(cookies, ['yc_session', 'Session_id'])
    let headers_ = project(headers, ['Accept', 'Content-Type', 'x-org-id', 'x-csrf-token'])
    headers_['cookie'] = convertCookieObject(cookies_)

    return requestUrl({
        url: URL,
        method: 'POST',
        headers: headers_,
        body: JSON.stringify({ parentSlug: "internal" })
    })
        .then(async (response) => {
            return (await response.json)['userSettings']['collabOrgId']
        })
}


export function convertHeaders(session_data, headers_prj, cookies_prj) {
    const headers = session_data.headers
    const cookies = session_data.cookies

    let cookies_ = cookies_prj === 'all' ? cookies : project(cookies, cookies_prj)
    let headers_ = headers_prj === 'all' ? headers : project(headers, headers_prj)
    headers_['cookie'] = convertCookieObject(cookies_)

    return headers_
}

export async function check_session(session_data) {
    const URL = 'https://wiki.yandex.ru/.gateway/root/wiki/openNavigationTree'
    const headers = session_data.headers
    const cookies = session_data.cookies

    let cookies_ = project(cookies, ['yc_session', 'Session_id'])
    let headers_ = project(headers, ['Accept', 'Content-Type', 'x-collab-org-id', 'x-csrf-token'])
    headers_['cookie'] = convertCookieObject(cookies_)

    return requestUrl({
        url: URL,
        method: 'POST',
        headers: headers_,
        body: JSON.stringify({ parentSlug: "internal" })
    })
        .then(async (response) => {
            return (await response.json) //['userSettings']['collabOrgId']
        })
}

async function deserialize_session(session_src) {
    if (!FILE_IO_PERMISSION) { return null }

    const file_is_here = await fileStat(session_src)
        .then(data => data.isFile() ? true : false)
        .catch(err => false)

    if (!file_is_here) { return null; }

    const session_data = await readFileAsync(session_src, { encoding: 'utf8' })
        .then(contents => {
            return JSON.parse(contents)
        })
        .catch(error => {
            throw console.log(error.name, error)
        })

    if (check_session(session_data)) { return session_data }

    return null
}

async function serialize_session(headers, cookies) {
    if (!FILE_IO_PERMISSION) { return null }

    await writeFileAsync(
        SESSION_FILENAME,
        JSON.stringify(
            {
                "headers": headers,
                "cookies": cookies
            }
        ),
        'utf8'
    ).catch(
        err => { throw err }
    );
}


export async function authtorize(safe = false, forced = false, stored_session = undefined, pathToBrowser = undefined) {
    if (false) { //!forced
        let stored_session = await deserialize_session(SESSION_FILENAME)
        if (stored_session != null) { return stored_session }
    }

    try {
        valid = await check_session(stored_session)
        if (valid) {
            return stored_session
        }
    } catch (err) { }

    const SAFE_WORKER = 'networkidle0'
    const UNSAFE_WORKER = 'networkidle2'
    const AUTH_PAGE = 'https://wiki.yandex.ru/'

    const LISTEN_INTERVAL = 100
    const TIMEOUT = 1000 * 60 * 2   // Две минуты и потом пизда
    const NEED_COOKIES = ['yc_session', 'csrf-token', 'session_id']

    let collab_org_id


    
    // try {
    //     brws = await puppeteer.launch({
    //         executablePath: 'C:/Program Files/Google/Chrome/Application/chrome',
    //         headless: false,
    //         args: ["--no-sandbox"],
    //         ignoreDefaultArgs: ['--mute-audio'],
    //     });
    // } catch {
    //     try {
    //         brws = await puppeteer.launch({
    //             product: "chrome",
    //             headless: false,
    //             args: ["--no-sandbox"],
    //             ignoreDefaultArgs: ['--mute-audio'],
    //         });
    //     } catch {
    //         brws = await puppeteer.launch({
    //             product: "firefox",
    //             headless: false,
    //             args: ["--no-sandbox"],
    //             ignoreDefaultArgs: ['--mute-audio'],
    //         });
    //     }
    // }
    
    
    // 'C:/Program Files/Google/Chrome/Application/chrome.exe'

    let brws;
    try{
        brws = await puppeteer.launch({
            executablePath: pathToBrowser,
            headless: false,
            args: ["--no-sandbox"],
            ignoreDefaultArgs: ['--mute-audio'],
        });
    } catch (err){
        if(!pathToBrowser){
            new obsidian.Notice("Установите путь до браузера в настройках. Поле 'pathToBrowser'")
        }else {
            new obsidian.Notice(`Пусть до браузера ${pathToBrowser} возможно не корректен. \nНужен полный путь. Например, 'C/.../chrome.exe'`)
        }
    }

    // const browser = await puppeteer.launch({
    //     headless: false,
    //     args: ["--no-sandbox"],
    //     ignoreDefaultArgs: ['--mute-audio'],
    // });
    const browser = brws
    const page = await browser.newPage();


    page.on('request', request => {
        if ('x-collab-org-id' in request.headers()) {
            collab_org_id = request.headers()['x-collab-org-id']
        }
    });


    await page.setDefaultNavigationTimeout(0)
    await page.goto(AUTH_PAGE, { waitUntil: safe ? SAFE_WORKER : UNSAFE_WORKER });

    let listen_promise = new Promise(async (resolve, reject) => {
        let timerId;
        timerId = setInterval(async function () {
            if (page.isClosed()) {
                clearInterval(timerId);
                reject()
            }

            let cookie_names = await page.cookies().then(res => res.map(x => x.name.toLowerCase()));
            const is_exit = NEED_COOKIES.every(cookie => cookie_names.includes(cookie)) && collab_org_id !== undefined;

            if (is_exit) {
                let cookies = structuredClone(await page.cookies());
                resolve(cookies);
                clearInterval(timerId);
            }
        }, LISTEN_INTERVAL);

        setTimeout(() => {
            clearInterval(timerId);
            browser.close();
            reject(new Error("Time is up"));
        }, TIMEOUT);
    })

    let cookies = await listen_promise.then((res) => res);

    browser.close();

    cookies = cookies.reduce((obj, item) => Object.assign(obj, { [item.name]: item.value }), {});
    cookies['CSRF-TOKEN'] = decodeCSRF(cookies['CSRF-TOKEN'])

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "x-csrf-token": cookies['CSRF-TOKEN'],
        "x-collab-org-id": collab_org_id,
    }

    serialize_session(headers, cookies)

    // return [headers, cookies]

    return {
        headers: headers,
        cookies: cookies
    }
}