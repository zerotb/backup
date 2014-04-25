define( 'facebook', 
    [ 'jquery', 
      'https://connect.facebook.net/en_US/all/debug.js' ], // remove "/debug" in live env
    function( $ ) 
    {
        // add Facebook div
        $("body").append("<div id='fb-root'>");

        // init the Facebook JS SDK
    	FB.init({
      		appId      : '413554158721439', // App ID from the App Dashboard
      		channelUrl : '//elaval.site44.com/demowebapi/channel.html', // Channel File for x-domain communication
      		status     : true, // check the login status upon init?
      		cookie     : true, // set sessions cookies to allow your server to access the session?
      		xfbml      : true  // parse XFBML tags on this page?
    	});


        // Additional initialization code such as adding Event Listeners goes here
        console.log( 'Facebook ready' );

        return FB;
    } 
);