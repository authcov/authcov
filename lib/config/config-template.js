const config = {
  /*
   * BaseUrl: The base URL of the site. This is where the crawler will start from.
   */
  "baseUrl": "<BASEURL>",

  /*
   * CrawlUser: The user to crawl the site under
   */
  "crawlUser": {"username": "<USER1>", "password": "<PASSWORD>"},

  /*
   * Intruders: The users who will intrude on the api endpoints and pages discovered during the
   *            crawling phase. Generally these will be users the same or less privilege than the
   *            crawlUser. To intrude as a not-logged-in user, add a user with the username "Public"
   *            and password null.
   */
  "intruders": [
    {"username": "<USER2>", "password": "<PASSWORD>"},
    {"username": "Public", "password": null}
  ],

  /*
   * Type: Is this a single-page-application (i.e. javascript frontend which queries an API backend)
   *       or a more "traditional" multi-page-application. (Choose "mpa" or "spa")
   */
  "type": "mpa",

  /*
   * AuthenticationType: Does the site authenticate users by using the cookies sent by the browser,
   *                     or by a token sent in a request header? For an MPA this will almost always
   *                     be set to "cookie". In an SPA this could be either "cookie" or "token".
   *                     (Choose "cookie" or "token")
   */
  "authenticationType": "cookie",

  /*
   * authorisationHeaders: Which request headers are needed to be sent in order to authenticate a user?
   *                       If authenticationType=cookie, then this should be set to ["cookie"].
   *                       If authenticationType=token, then this will be something like: ["X-Auth-Token"]
   *
   */
  "authorisationHeaders": ["cookie"],

  /*
   * MaxDepth: The maximum depth with which to crawl the site. Recommend starting at 1 and then try
   *           crawling at higher depths to make sure the crawler is able to finish fast enough.
   */
  "maxDepth": 1,

  /*
   * VerboseOutput: Log at a verbose level, useful for debugging.
   */
  "verboseOutput": false,

  /*
   * SaveResponses: Save the response bodies from API endpoints so you can view them in the report.
   */
  "saveResponses": true,

  /*
   * SaveScreenshots: Save browser screenshots for the pages crawled so you can view them in the report.
   */
  "saveScreenshots": true,

  /*
   * ClickButtons: (Experimental feature) on each page crawled, click all the buttons on that page
   *               and record any API requests made. Can be useful on sites which have lots of user
   *               interactions through modals, popups ec.
   */
  "clickButtons": false,

  /*
   * XhrTimeout: How long to wait for XHR requests to complete while crawling each page. (seconds)
   */
  "xhrTimeout": 5,

  /*
   * PageTimeout: How long to wait for page to load while crawling. (seconds)
   */
  "pageTimeout": 30,

  /*
   * Headless: Set this to false for the crawler to open a chrome browser so you can see the
   *           crawling happening live.
   */
  "headless": true,

  /*
   * UnAuthorizedStatusCodes: The HTTP response status codes that decide whether or not an API endpoint
   *                          or page are authorized for the user requesting it. Optionally define
   *                          a function responseIsAuthorised(status, headers, body) below to
   *                          determine if a request was authorized. (Example in comments below)
   */
  "unAuthorizedStatusCodes" : [302, 401, 403, 404],

  /*
   * ignoreLinksIncluding: Do not crawl URLs containing any strings in this array. For
   *                       example, if set to ["/logout"] then the url: http://localhost:3000/logout
   *                       will not be crawled. Optionally define a function ignoreLink(url) below
   *                       to determine if a URL should be crawled or not. (Example in comments below)
   */
  "ignoreLinksIncluding": ["/logout"],

  /*
   * ignoreAPIrequestsIncluding: Do not record API records made to URLs which contain any of the
   *                             the strings in this array. Optionally define a function
   *                             ignoreApiRequest(url) to determine if a request should be recorded
   *                             or not. (Example in comments below)
   */
  "ignoreAPIrequestsIncluding": ["google.com"],

  /*
   * ignoreButtonsIncluding: If clickButtons set to true, then do not click buttons who's outer HTML
   *                         contains any of the strings in this array. Optionally define a function
   *                         ignoreButton(url) below. (Example in comments below)
   */
  "ignoreButtonsIncluding": ["submit", "Save"],

  /*
   * loginConfig: Configure how the browser will login to your web app. To see how these values
   *              are used see loginFunction() in lib/config/base-config.js. Optionally define
   *              an async function loginFunction(page, username, password) below. (Example below).
   */
  "loginConfig": {
    "url": "http://localhost/login",
    "usernameXpath": "input[name=email]",
    "passwordXpath": "input[name=password]",
    "submitXpath": "#login-button"
  },

  /*
   * CookiesTriggeringPage: (optional) when authenticationType=cookie, this will set a page so that
   *                        the intruder will browse to this page and then capture the cookies from
   *                        the browser. This can be useful if the site sets the path field on cookies.
   *                        Defaults to options.baseUrl.
   */
  // "cookiesTriggeringPage": "http://",

  /*
   * TokenTriggeringPage: (optional) when authenticationType=token, this will set a page so that the
   *                      the intruder will browse to this page and then capture the authorisationHeaders
   *                      from the intercepted API requests. This can be useful if the site's baseUrl
   *                      does not make any API requests and so cannot capture the auth headers from
   *                      that page.
   *                      Defaults to options.baseUrl.
   */
  // "tokenTriggeringPage": "http://"

  /**
   * Use puppeteer to login as a user.
   *
   * @param {object}   page       The puppeteer page object.
   * @param {string}   username  The username to login under.
   * @param {string}   password  The password to login under.
   */
/*
  "loginFunction": async function(page, username, password){
    await page.goto('http://localhost:3001/users/sign_in');
    await page.waitForSelector('input[type=email]');
    await page.waitForSelector('input[type=password]');

    await page.type('input[type=email]', username);
    await page.type('input[type=password]', password);

    await page.tap('input[type=submit]');
    await page.waitFor(500);

    return;
  },
*/

  /**
   * Decide if an HTTP request+response is authorised to the user who requested it.
   *
   * @param {integer}   status  The HTTP response status code.
   * @param {object}   headers  The HTTP response headers object.
   * @param {string}   body     The body of the response.
   *
   * @return {boolean} true if the response is authorised.
   */
/*
  "responseIsAuthorised": function(status, headers, body) {
    // If its redirecting to the login page
    if(status == 302 && headers.location.includes('/users/sign_in')) {
      return false;
    }

    if(status == 401) {
      return false;
    }

    return true;
  },
*/

  /**
   * Decide if a link should be crawled or not.
   *
   * @param {string}   url  The url of the link.
   *
   * @return {boolean} true if the link should be ignored by the crawler.
   */
/*
  "ignoreLink": function(url) {
    if(url.includes('/users/sign_out')) {
      return true;
    }

    return false;
  },
*/

  /**
   * Decide if an API request should be recorded or not while crawling.
   *
   * @param {string}   url  The url of the request.
   * @param {string}   url  The HTTP method verb of the request, i.e. "GET" or "POST".
   *
   * @return {boolean} true if the API request should not be recorded.
   */
/*
  "ignoreApiRequest": function(url, method) {
    if(url.includes('http://localhost:3001/sockjs-node')){
      return true;
    }

    return false;
  },
*/

  /**
   * Decide if a button should be clicked or not while crawling with clickButtons set to true.
   *
   * @param {string}   url  The outer HTML of the button, i.e. <button type="submit">Save</button>.
   *
   * @return {boolean} true if the button should not be clicked.
   */
/*
  "ignoreButton": function(outerHTML) {
    if(outerHTML.includes('Logout') || outerHTML.includes('submit') || outerHTML.includes('Save')) {
      return true;
    }

    return false;
  }
*/
};

module.exports = config;
