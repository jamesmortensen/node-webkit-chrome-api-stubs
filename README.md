node-webkit-chrome-api-stubs
============================

The Chrome API Stubs help make it easier to port an existing Chromium App to node-webkit by making sure commonly-used Chrome APIs have basic implementations or at least are declared so they won't throw errors.

Include the [chrome-api-stubs.js](https://github.com/jamesmortensen/node-webkit-chrome-api-stubs/blob/master/chrome-api-stubs.js) file in all of your application HTML pages, and if the Chrome API's do not exist natively, then this script provides wrapped implementations and stubs to help bridge compatibility between the two platforms.

To demo the stubs and see the API's in action, first run this demo app using node-webkit. Afterwards, load it in Chrome as an unpacked extension. No code changes are required to run this app on both platforms.