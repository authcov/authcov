# AuthCov

Web app authorization coverage scanning.

## Introduction

AuthCov crawls your web application using a Chrome headless browser while logged in as a pre-defined user. It intercepts and logs API requests as well as pages loaded during the crawling phase. In the next phase it logs in under a different user account, the "intruder", and attempts to access each of one of the API requests or pages discovered previously. It repeats this step for each intruder user defined. Finally it generates a detailed report listing the resources discovered and whether or not they are accessible to the intruder users. 

[![](https://raw.githubusercontent.com/authcov/authcov/master/docs/example_report_screenshot.png)](https://authcov.github.io/example_report/index.html)

## Features

## Installation

## Usage

## License

## Contributing

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
