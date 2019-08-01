# AuthCov

**Install**
```bash
$ git clone git@github.com:authcov/authcov.git && cd authcov
$ npm install
```

Start headless chrome browser:
```bash
$ google-chrome --remote-debugging-port=9222 --disable-web-security --user-data-dir=/home/evan/.chrome --headless
```

**Run an example**

Start the example app (see integration tests).
```bash
$ node scripts/crawl.js ../examples/example-spa-config.js
$ node scripts/intrude.js ../examples/example-spa-config.js
```

**Unit Tests**

Unit tests:
```bash
$ npm test test/unit
```

**Integration tests:**

First download and run the [example app](https://github.com/evanrolfe/example_app). Then run the tests:
```bash
$ npm test test/integration
```
