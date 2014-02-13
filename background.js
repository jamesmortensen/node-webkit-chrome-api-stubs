
chrome.app.runtime.onLaunched.addListener(function() {
	console.info("onlaunched fires successfully.");
	    
   
    chrome.app.window.create("test.html", {
		width: 500,
		height: 500,
		frame: 'true'
	}, function(appWindow) {
		console.info("popup window opened");
		console.log(appWindow);
	});

});