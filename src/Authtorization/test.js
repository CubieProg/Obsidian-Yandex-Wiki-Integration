

// asdsimport 'node:puppeteer'


// import puppeteer from "@cloudflare/puppeteer";

const puppeteer = require('puppeteer')
// import { launch } from 'puppeteer';ss
// import chromium from "chrome-aws-lambda";

// import puppeteer from "puppeteer";
const sync_fetch = require('sync-fetch')

const fs = require('fs');
const { promisify } = require('util')
const fileStat = promisify(fs.lstat)
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile);


export async function sayHello(id, name, salary) {
    console.log("hello!!!")
    // write()
    // puppeteer.launch()
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox"],
        ignoreDefaultArgs: ['--mute-audio'],
    });
}