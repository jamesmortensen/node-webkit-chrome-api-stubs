/*
Copyright (c) 2014, James Mortensen, Synclio
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the {organization} nor the names of its
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
                    //window.open('../contacts.html');
                    if(obj.width == undefined) {
                        obj.width = '1100';
                        obj.height = '800';
                    }
                    var appWindow = {
                        contentWindow: window.open(url, '', 'width='+obj.width+',height='+obj.height),
                        hide: function() {
                            console.warn("chrome.app.window.create :: appWindow.hide() :: not implemented");
                            //this.contentWindow.close();
                        },
                        close: function() {
                            console.log("chrome.app.window.create :: appWindow.close() :: close window");
                            this.contentWindow.close();  
                        }
                    };

                    if(callback)
                        callback(appWindow);

                },
                current: function() {
                    return {
                        contentWindow: window
                    }
                }
            }
        },
        contextMenus: {
            create: function(obj) {
                console.warn("not implemented");
            },
            onClicked: {
                addListener: function(callback) {
                    console.warn("not implemented.");
                    //callback(info, tab);
                } 
            },
            removeAll: function() {
                console.warn("not implemented.");
            }
        },
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
                return require("../package.json");
            },
            getBackgroundPage: function(callback) {
                var backgroundPage = {
                    postMessage: function(message, origin) {
                        // do stuff here
                        //console.warn("postMessage is not implemented.");
                        window.opener.postMessage(message, origin);
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
            reload: function() {
                console.warn("not implemented.");
            }
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
                            callback(obj);
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
    }
}
