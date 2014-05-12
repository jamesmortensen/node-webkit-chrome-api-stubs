/*
Copyright (c) 2014, James Mortensen
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the organization nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 *
 * Chrome Platform API stubs. These either suppress, override, or implement functionality
 * from the Chrome API's for the purposes of more easily porting a Chromium App to the node-webkit
 * platform. The stubs are here to preserve interfaces in order to make the transition easier.
 *
 */

if(typeof(chrome) != "undefined" && chrome && chrome.app && chrome.app.runtime) {
    console.log("this is a packaged app, so we don't use the Chrome API Stubs.");
} else {
    console.log("not a packaged app, so use the Chrome API Stubs.");
    window.chrome = {
        alarms: {
            clear: function(name) {
                console.warn("not implemented.");
            },
            clearAll: function() {
                console.warn("not implemented.");
            },
            create: function(name, obj) {
                console.warn("not implemented.");
            },
            onAlarm: {
                addListener: function(callback) {
                    console.warn("not implemented.");
                    return;
                    var alarm = {
                        name: ""
                    };
                    callback();
                }
            }
        },
        app: {
            runtime: {
                onLaunched: {
                    addListener: function(callback) {
                        callback();
                    }
                },
                onRestarted: {
                    addListener: function(callback) {
                        console.warn("not implemented");return;
                        callback();
                    }
                }
            },
            window: {
                create: function(url, obj, callback) {
                    if(obj.width == undefined) {
                        obj.width = 1100;
                        obj.height = 800;
                    }
                    obj.width = parseInt(obj.width);
                    obj.height = parseInt(obj.height);
                    obj.frame = obj.frame !== undefined && obj.frame == "none" ? false : true;

                    var gui = require('nw.gui');

                    var win = gui.Window.open(url, {
                        "frame": obj.frame,
                        "toolbar": false,
                        "title":"",
                        "position":"mouse",
                        "height": obj.height,
                        "width": obj.width
                    });
                   

                    var appWindow = {
                        __proto__: {
                            closed: true
                        },
                        contentWindow: win,

                        hide: function() {
                            console.warn("chrome.app.window.create :: appWindow.hide() :: not implemented");
                        },
                        close: function() {
                            console.log("chrome.app.window.create :: appWindow.close() :: close window");
                            this.contentWindow.close();  
                        },
                        show: function() {
                            console.warn("chrome.app.window.create :: appWindow.show() :: not implemented");
                        },
                        resizeTo: function() {
                            console.warn("chrome.app.window.create :: appWindow.resizeTo() :: not implemented");  
                        }
                    };


                    /*
                     * Merge the appWindow object with the nw.gui win object so all properties 
                     * are exposed as when invoked using the chrome.app.window API.
                     *
                     */ 
                    for (var key in appWindow) {
                       console.debug("win['"+key+"'] = " + appWindow[key]);
                       if(win[key] === undefined) {
                           console.debug("window doesn't have " + key + " so add it from appWindow.");
                           win[key] = appWindow[key];
                        } else {
                            console.debug("don't override " + key);
                        }
                    }


                    /*
                     * Allow child windows to reference the parent, since nw.gui can't handle this internally.
                     *  Also make sure document property is available both off the window as well as
                     *   the contentWindow property.
                     */
                    win.on('loaded', (function(_appWindow) {
                        return function() {                            
                            console.log("window loaded.");
                            win.window.opener = window;
                            _appWindow.contentWindow = _appWindow.window;
                            _appWindow.contentWindow.closed = false;

                            _appWindow.contentWindow.document = _appWindow.contentWindow.window.document;
                            if(callback)
                                callback(_appWindow);
                        }
                        
                    })(win));

                    /*
                     * Mark the window as closed.
                     *
                     */
                    win.on('closed', (function(_appWindow) {
                        return function() {
                            console.log("window closed.");
                            _appWindow.contentWindow.closed = true;
                            _appWindow.__proto__.closed = true;
                            _appWindow = null;
                            win = null;
                        }
                    })(win));
                },
                current: function() {
                    return {
                        contentWindow: window,
                        focus: function() {
                            console.warn("not implemented");
                        },
                        minimize: function() {
                            require('nw.gui').Window.get().minimize();
                        }
                    }
                }
            }
        },
        contextMenus: (function() {

            return {
                menu: null,
                menuIds: [],
                utils: { 
                    getIndexFromArray: function(text, arr) {
                        if(arr === undefined || text === undefined) return -1;
                        var index = -1;
                        for(var i = 0; i < arr.length; i++) {
                            if(arr[i].id == text) {
                                index = i;
                                break;
                            }
                        }
                        return index;
                    }
                },

                /**
                 * type
                 * title
                 * context
                 * id
                 *
                 */
                create: function(obj) {
                    var gui = require('nw.gui');
                    

                    // initialize the menus if they don't exist
                    if(this.menu == null) {
                        // Create an empty menu
                        var _menu = new gui.Menu();
                        this.menu = _menu;

                        // Popup as context menu
                        document.body.addEventListener('contextmenu', (function(_this) {
                            return function(ev) { 
                              ev.preventDefault();
                              // Popup at place you click
                              _this.menu.popup(ev.x, ev.y);
                              return false;
                            }
                        })(this), false);
                    }

                    var index = this.utils.getIndexFromArray(obj.parentId, this.menuIds);
                    if(index == -1) {

                        if(obj.type == 'separator') {
                            // add separator
                            this.menu.append(new gui.MenuItem({ 
                                type: 'separator',
                            }));
                        } else {

                            // Add menu item
                            this.menu.append(new gui.MenuItem({ 
                                label: obj.title,
                            }));
                        }
                        this.menu.items[this.menu.items.length-1].text_id = obj.id;

                        this.menuIds.push({id: obj.id, sub: []});

                    } else {

                        // submenus
                        if(this.menu.items[index].submenu == null) {
                            var sub1 = new gui.Menu();
                            sub1.append(new gui.MenuItem({label: obj.title}));
                            sub1.items[sub1.items.length-1].text_id = obj.id;
                            this.menuIds[index].sub.push({id: obj.id, sub:[]});
                            
                            this.menu.items[index].submenu = sub1;

                            if(process.platform == "win32" || process.platform == "win64") {
                                // On Windows you have to refresh the menus after modifying...
                                var temp = this.menu.items[index];
                                this.menu.removeAt(index);
                                this.menu.append(temp);
                            }
                        } else {
                            
                            var sub1 = this.menu.items[index].submenu;
                            if(obj.type == 'separator') {
                                // add separator
                                sub1.append(new gui.MenuItem({ 
                                    type: 'separator',
                                }));
                            } else {
                                sub1.append(new gui.MenuItem({label: obj.title}));
                            }
                            sub1.items[sub1.items.length-1].text_id = obj.id;
                            this.menuIds[index].sub.push({id: obj.id, sub:[]});

                            // On Windows you have to refresh the menus after modifying...
                            if(process.platform == "win32" || process.platform == "win64") {
                                var temp = this.menu.items[index];
                                this.menu.removeAt(index);
                                this.menu.append(temp);
                            }
                        }
                    }
                },
                onClicked: { 
                    addListener: function(callback) {

                        // @private
                        function _addClickEvent(menuItem, menuId) {
                            
                            menuItem.click = (function(info, tab) { 
                                return function() {
                                    info.checked = !info.checked;
                                    callback(info, tab);
                                }
                            })(/* info */
                                {
                                    menuItemId: menuId,
                                    checked: false
                                },
                                /*tab */ 
                                {
                                    
                                }
                            );
                        }

                        var len = chrome.contextMenus.menu.items.length;
                        for(var i = 0; i < len; i++) {
                            var sublen = chrome.contextMenus.menuIds[i].sub.length;
                            for(var j = 0; j < sublen; j++) {
                                _addClickEvent(chrome.contextMenus.menu.items[i].submenu.items[j], chrome.contextMenus.menuIds[i].sub[j].id);
                            }
                            if(sublen == 0)
                                _addClickEvent(chrome.contextMenus.menu.items[i], chrome.contextMenus.menuIds[i].id);
                            
                        }                    
                    }
                },
                removeAll: function() {
                    console.warn("not implemented.");
                },
                update: function(id, menuObj) {
                    var index = utils.getIndexFromArray(id, this.menuIds);


                }
            }
        })(),
        idle: {
            onStateChanged: {
                addListener: function() {
                    var newState;
                    console.warn("not implemented.");
                }
            },
            setDetectionInterval: function(interval) {
                console.warn("not implemented");
            }
        },
        runtime: {
            getManifest: function() {
                return typeof(require) !== "undefined" ? require("../package.json") : {};
            },
            getBackgroundPage: function(callback) {
                var backgroundPage = {
                    postMessage: function(message, origin) {
                        if(window.opener != null)
                            window.opener.postMessage(message, origin);
                        else
                            window.postMessage(message, origin);
                    }
                };
                callback(backgroundPage);

            },
            onStartup: {
                addListener: function(callback) {
                    console.warn("not implemented");return;
                    setTimeout(function() { callback(); }, 500);
                }
            },
            onSuspend: {
                addListener: function(callback) {
                    console.warn("not implemented");return;
                    setTimeout(function() { callback(); }, 500);
                }
            },
            onInstalled: {
                addListener: function(callback) {
                    console.warn("not implemented");return;
                    setTimeout(function() { callback(); }, 500);
                }
            },
            onUpdateAvailable: {
                addListener: function(callback) {
                    console.warn("not implemented");return;
                    setTimeout(function() { callback(); }, 500);   
                }
            },
            reload: (function() {
                if(window.opener == null) {
                    return function() { 
                        require('nw.gui').Window.get().reload();
                    }
                } else {
                    return function() {
                        require('nw.gui').Window.get().reload = this.reload;
                        //window.opener.require('nw.gui').Window.get().reload();
                        window.opener.chrome.runtime.reload();
                    }
                }
            })()
        },
        
        storage: {
            local: {
                clear: function() {
                    localStorage.clear();
                },
                get: function(name, callback) {
                    if(localStorage) {
                        if(name != null && localStorage[name] == undefined) {
                            var obj = {};
                            obj[name] = JSON.parse(localStorage.storage)[name];
                            
                            setTimeout(function() {
                                callback(obj);     
                                
                            },500);


                        } else {
                            if(typeof(name) == "string") {
                                setTimeout(function() {
                                    callback(localStorage[name]);
                                },500);
                            } else {
                                if(localStorage.storage !== undefined) {
                                    setTimeout(function() {
                                        callback(JSON.parse(localStorage.storage));
                                    },500);
                                } else {
                                    setTimeout(function() {
                                        callback({});
                                    },500);
                                }
                            }
                        }       
                    }
                },

                set: function(data, callback) {
                    if(localStorage) {
                        if(data !== undefined) {

                            // @private
                            function _addToObject(jString, objCol) {

                                localStorage.storage = JSON.stringify(jString);

                            }

                            _addToObject(data, localStorage);
                        }
                    }
                }
            }

        }
    };

    /*
     * This object overrides webkitNotifications.createNotification, which overrides the 
     * Notification with a NodeWebkitNotification object. 
     *
     */
    window.nodeWebkitNotifications = {
        createNotification: function(
                              icon,  // icon url - can be relative
                              title,  // notification title
                              description  // notification body text
                          ) {

            console.log("createNotification :: " + icon + title + description);
            return (function(icon, title, description) {
                return {
                    onAction: {},
                    constructor: function NodeWebkitNotification() { },
                    show: function() {

                        var utils = {
                            fromAppRootDir: function(char) {
                                if(typeof(process) === "undefined")  // if chromium app, just return empty string
                                    return "";
                                
                                // this assumes you've set the app:// protocol in the main property in package.json
                                  // see https://github.com/rogerwang/node-webkit/wiki/App%20protocol
                                return (char==undefined)?'app://'+window.location.hostname:'app://'+window.location.hostname+char;
                            }
                        };

                        // @private
                        function showNwNotification(icon, title, description, callback) {
                            console.log("showNwNotification :: icon = " + utils.fromAppRootDir('/') + icon);
                            console.log("showNwNotification :: title = " + title);
                            console.log("showNwNotification :: description = " + description);
                            if(window.LOCAL_NW) {
                                window.LOCAL_NW.desktopNotifications.notify(utils.fromAppRootDir('/') + icon, title, description, callback);
                                require('nw.gui').Window.get().requestAttention(true);
                            } else {
                                // you can import https://github.com/robrighter/nw-desktop-notifications and 
                                  // place it in commons/nw-desktop-notifications. The unimplemented webkitNotifications 
                                    // will wrap it by default.
                                console.warn("showNwNotification :: webkitNotifications not implemented.")
                            }
                        }
                        showNwNotification(icon, title, description, this.onAction['click']);
                        if(!this.ondisplay) return ;
                        this.ondisplay();
                    },

                    /*
                     * @parameter: eventName is the name of an event, like 'click'.
                     * @parameter: callback is the function to run when the event is triggered.
                     *
                     * Currently, only the click event is supported.
                     */
                    addEventListener: function(eventName, callback) {
                        
                        this.onAction[eventName] = typeof(callback) == 'function' ? callback : null;

                    },
                    cancel: (function() {
                        if(window.opener == null) {
                            console.debug("NodeWebkitNotification.cancel :: window.opener is null.");
                            return window.LOCAL_NW.desktopNotifications.closeAnyOpenNotificationWindows;
                        } else {
                            console.debug("NodeWebkitNotification.cancel :: window.opener is NOT null.");
                            debug_win = window.opener;
                            window.LOCAL_NW.desktopNotifications.closeAnyOpenNotificationWindows = this.cancel;
                            return this.cancel;
                        }

                    })()
                }
            })(icon, title, description);
        }
    };

    if(window.LOCAL_NW) {
        if(window.opener == null) // if background page, override webkitNotifications
            window.webkitNotifications.createNotification = window.nodeWebkitNotifications.createNotification;
        else {

            // if child page, then override and delegate to background page
            window.webkitNotifications.createNotification = (function() { 
                return window.opener.webkitNotifications.createNotification;
            })();
        
        }
    } else {
        console.warn("webkitNotifications not implemented");
    }
    
}