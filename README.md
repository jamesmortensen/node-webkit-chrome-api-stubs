node-webkit-chrome-api-stubs
============================

The Chrome API Stubs help make it easier to port an existing Chromium App to node-webkit by making sure commonly-used Chrome APIs have basic implementations or at least are declared so they won't throw errors.

Add the [chrome-api-stubs.js](https://github.com/jamesmortensen/node-webkit-chrome-api-stubs/blob/master/chrome-api-stubs.js) file in all of your Chromium application HTML pages. When running as a Chrome app, your app uses the regular, default Chrome APIs, and your app should run as it normally does. 

But when running your app using node-webkit, since the Chrome APIs are not available, the Chrome API stubs will substitute them, either showing a warning for APIs not implemented, or acting as an interface, wrapping equivalent node-webkit or node.js functionality. 

To demo the stubs and see the API's in action, first run this demo app using node-webkit. Afterwards, load it in Chrome as an unpacked extension. No code changes are required to run this app on both platforms.
