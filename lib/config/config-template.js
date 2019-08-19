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
   * ButtonXPath: Only used if clickButtons is set to true. The xpath that determines what
   *              constitutes a button.
   */
  "buttonXPath": "button",

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

  /*
   * UnAuthorizedStatusCodes: The HTTP response status codes that decide whether or not an API endpoint
   *                          or page are authorized for the user requesting it. Optionally define
   *                          a function responseIsAuthorised(status, headers, body) below to
   *                          determine if a request was authorized. (Example in comments below)
   */
  //"unAuthorizedStatusCodes" : [302, 401, 403, 404]

  "loginFunction": async function(tab, username, password){
    await tab.goto('http://localhost:3001/users/sign_in');
    await tab.waitForSelector('input[type=email]');
    await tab.waitForSelector('input[type=password]');

    await tab.type('input[type=email]', username);
    await tab.type('input[type=password]', password);

    await tab.tap('input[type=submit]');
    await tab.waitFor(500);

    return;
  },

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

  "ignoreLink": function(url) {
    if(url.includes('/users/sign_out')) {
      return true;
    }

    return false;
  },

  "ignoreApiRequest": function(url, method) {
    if(url.includes('http://localhost:3001/sockjs-node')){
      return true;
    }

    return false;
  },

  "ignoreButton": function(outerHTML) {
    if(outerHTML.includes('Logout') || outerHTML.includes('submit') || outerHTML.includes('Save')) {
      return true;
    }

    return false;
  }
};

module.exports = config;
