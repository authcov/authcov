const Crawler = require('./crawler/crawler.js');
const { openDB, deleteDB, wrap, unwrap } = require('idb');
const ScanModel = require('./scan-model.js');

const scan = new ScanModel();

const urlCrawledCallback = (url) => {
  $('#requests-list').append(`<li>${url}</li>`);
};

const apiRequestCallback = async (request, pageUrl) => {
  scan.apiRequests.push({
    url: request.url(),
    method: request.method(),
    headers: request.headers(),
    pageUrl: pageUrl
  });
};

const apiResponseCallback = async (response, pageUrl) => {
  const url = response.url();
};

const loginFunction = async (tab, username, password) => {
  await tab.goto('http://localhost:3000/');
  await tab.waitFor(1000);
  await tab.tap('#login-link')

  await tab.waitForSelector('input[name=password]');
  await tab.waitFor(1000);

  await tab.type('input[name=email]', username);
  await tab.type('input[name=password]', password);

  await tab.tap('.auth0-lock-submit')

  await tab.waitFor(1000);
  await tab.close();

  return;
};

const logoutFunction = async (tab) => {
  await tab.goto('http://localhost:3000/');

  try {
    await tab.waitForSelector('#logout-link', { timeout: 2000 })
    await tab.tap('#logout-link');
    await tab.waitForSelector('#login-link');

  } catch (error) {
    console.log('No logout link found');

  } finally {
    tab.close();
    return;
  }
};

async function crawlUrl(url) {
  const crawler = await Crawler.init({
    urlCrawledCallback: urlCrawledCallback,
    apiRequestCallback: apiRequestCallback,
    apiResponseCallback: apiResponseCallback,
    loginFunction: loginFunction,
    logoutFunction: logoutFunction
  });

  await crawler.login('evanrolfe@onescan.io', 'Password1');
  await crawler.fetchLinks(url)
  await crawler.onIdle();
  await crawler.close();

  console.log("Finished!");
  return;
};

$(function(){
  $('#scan-button').on('click', function(){
    let url = $('input[name=url]').val();
    crawlUrl(url);
  });
});
