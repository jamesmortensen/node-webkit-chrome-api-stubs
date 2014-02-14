node-webkit-chrome-api-stubs
============================

The Chrome API Stubs help make it easier to port an existing Chromium App to node-webkit by making sure commonly-used Chrome APIs have basic implementations or at least are declared so they won't throw errors.

##Setup

Add the [chrome-api-stubs.js](https://github.com/jamesmortensen/node-webkit-chrome-api-stubs/blob/master/chrome-api-stubs.js) file in all of your Chromium application HTML pages. 

When running as a Chrome app, your app uses the regular, default Chrome APIs, and your app should run as it normally does.
But when running your app using node-webkit, since the Chrome APIs are not available, the Chrome API stubs will substitute them, either showing a warning for APIs not implemented, or acting as an interface, wrapping equivalent node-webkit or node.js functionality. 

##Demos

To demo the stubs and see the API's in action, first run this demo app using node-webkit. Afterwards, load it in Chrome as an unpacked extension. No code changes are required to run this app on both platforms. There is both a package.json, for node-webkit, and a manifest.json, for Chromium.

##Node Webkit Notifications

As of node-webkit 0.9.1, webkitNotifications are unimplemented. However, the Chrome API Stubs wraps the [nw-desktop-notifications library](https://github.com/robrighter/nw-desktop-notifications) by overriding the webkitNotifications API. 

To override webkitNotifications in the demo, download the nw-desktop-notifications code and place it in /common/nw-desktop-notifications. Then uncomment the `<script type="text/javascript" src="common/nw-desktop-notifications/nw-desktop-notifications.js"></script>` line in the [test.html](https://github.com/jamesmortensen/node-webkit-chrome-api-stubs/blob/master/test.html) page.

When you download the nw-desktop-notifications library, you'll need to apply the included patch, which ensures the notification window has an absolute path:

```
$ cd common/nw-desktop-notifications             # make sure you're in the nw-desktop-notifications folder
$ patch -p0 < ../../nw-notifications.patch       # apply the patch
```

To override the webkitNotifications in your own app, add the script tag to all your HTML windows that use notifications. Be sure to include the stubs as well. 

See the [test.js](https://github.com/jamesmortensen/node-webkit-chrome-api-stubs/blob/master/test.js) file for an example of how to use the notifications.
