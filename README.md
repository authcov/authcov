# AuthCov

**Install**
```bash
$ git clone
$ npm install
```

Start headless chrome browser:
```bash
$ google-chrome --remote-debugging-port=9222 --disable-web-security --user-data-dir=/home/evan/.chrome --headless
```

**Run an example**
Start the example app (see integration tests).
```bash
$ node examples/crawl_example.js
$ node examples/intrude_example.js
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
