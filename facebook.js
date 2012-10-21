// Facebook ---------------------------------------------------------------

Meteor.methods({});

var connect = function () {
    window.fbAsyncInit = function() {
        FB.init({
            appId  : '362472857175085', // App ID
            channelUrl : 'channel.html', // Channel File
            status : true, // check login status
            cookie : true, // enable cookies to allow the server to access the session
            xfbml  : true, // parse XFBML
            oauth  : true  // enable OAuth so we can make a custom button
        });

        // This will run as soon as FB is initalized
        FB.getLoginStatus(function(response) {
            Session.set('fbApiInit', true);
        });

        function loginStatusDidChange(response) {
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire

                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;

                // console.log("Logged in and connected (uid: " + uid + " token: " + accessToken + ")");
                console.log("Logged in and connected (uid: " + uid + ")");
                // Do the ago magic...
                Session.set('fbAuthorized', true);
                // goBackInTime();
                // TODO: Update the view!
            }

            else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
                console.log("Logged in, but NOT connected");
                // Present with the splash screen.
                Session.set('fbAuthorized', false);
            }

            else {
                // the user isn't logged in to Facebook.
                console.log("Not logged in and not connected");
                // Present with the same splash screen.
                Session.set('fbAuthorized', false);
            }
        }

        FB.Event.subscribe('auth.statusChange', loginStatusDidChange);
    };

    // Load the SDK Asynchronously
    (function(d){
      var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
      js = d.createElement('script'); js.id = id; js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      d.getElementsByTagName('head')[0].appendChild(js);
    }(document));
};

var fbLogin = function () {
    FB.login(function(response) {

        if (response.authResponse) {
            // User accepted the terms
            // Do we need to do anything here since loginStatusDidChange will catch this anyway?
        }
        else { /* User rejected the terms */ }

    }, {scope:'user_status, user_photos'});
};

var isFacebookApiInit = function () {
    return !!Session.get('fbApiInit');
}

var isFacebookAuthorized = function () {
    return !!Session.get('fbAuthorized');
}

var getFirstName = function () {
    // Check if we're authorized (even though we should be) just in case the rug gets pulled out from under us
    if(!isFacebookApiInit() || !isFacebookAuthorized())
        return "";

    FB.api('/me', function(response) {
        Session.set('first_name', response.first_name);
    }); 

    return Session.get('first_name');
};

var statuses = [];

var getLatestStatus = function () {
    FB.api('/me/statuses?fields=message&since=2011-10-01&limit=300', function(response) {
        if(response.data && response.data.length > 0)
            Session.set('latest_status', response.data[0].message);

    }); 
}

var fetch14Months = function () {
    FB.api('/me/statuses?fields=message&since=2011-10-01&limit=300', function(response) {
        debugger;
        if(response.data && response.data.length > 0) {
                        Session.set('latest_status', response.data[0].message);

        }
    }); 
}
