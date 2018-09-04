const puppeteer = require('puppeteer');

let browser;
let page;

const comingSoonURL = 'http://movietowne.com/cinemas/comingsoon/';
const nowShowingURL = 'http://movietowne.com/cinemas/nowshowing/';

const locationStrings = {
    pos: 'port-of-spain',
    vipPos: 'vip-platinum-pos',
    chag: 'chaguanas',
    sando: 'san-fernando',
    vipSando: 'platinum-san-fernando',
    bago: 'tobago'
}

let nowShowingMovies = [];
let comingSoonMovies = [];

async function populateNowShowing(nowShowingMoviesArray){
    const thumbnailSelector = 'div.movie_thumbnail';
    await page.goto(`${nowShowingURL}${locationStrings.pos}`);
    await page.waitForSelector(thumbnailSelector);
    nowShowingMovies = await page.evaluate(() => Array.from(document.querySelectorAll('div.movie_thumbnail')).map( el => el.children[1].textContent));
}

async function populateComingSoon(){
    const thumbnailSelector = 'div.movie_thumbnail';
    await page.goto(`${comingSoonURL}${locationStrings.pos}`);
    await page.waitForSelector(thumbnailSelector);
    comingSoonMovies = await page.evaluate(() => Array.from(document.querySelectorAll('div.movie_thumbnail')).map( el => {
        return `${el.children[1].textContent} - ${el.children[2].textContent}`
    }));
}

async function init(){
    browser = await puppeteer.launch();
    page = await browser.newPage();
}

async function end(){
    await browser.close();
}

async function run(){
    await init();
    await populateNowShowing();
    await populateComingSoon();
    await end();

    console.log('Now Showing');
    sortList(nowShowingMovies).forEach(el => console.log(el));
    console.log('');
    console.log('Coming Soon');
    sortList(comingSoonMovies).forEach(el => console.log(el));
}

// Removes duplicates and sorts list
const sortList = (list) => [...new Set(list)].sort();

run();