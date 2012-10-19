if (Meteor.isClient) {

    // Greetings and Such -----------------------------------------------------

    Template.page.imagePath = function () {
        if(isFacebookAuthorized())
            return "test.jpg"
        else
            return "fallen%20leaves%20compressed.jpg";
    };

    Template.page.fbConnected = function () {
        var a = 5;
        var isFBConnected = Session.get('fbConnected');
        console.log("fbConnected returned " + !!isFBConnected);
        return !!isFBConnected;
    };

    Template.page.events({
        'click input' : function () {
          // template data, if any, is available in 'this'
          if (typeof console !== 'undefined')
            console.log("You pressed the button");
        }
    });

    // Facebook ---------------------------------------------------------------

    Template.fbconnect.connect = function () {
        window.fbAsyncInit = function() {
            FB.init({
                appId  : '362472857175085', // App ID
                status : true, // check login status
                cookie : true, // enable cookies to allow the server to access the session
                xfbml  : true, // parse XFBML
                oauth  : true  // enable OAuth so we can make a custom button
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

                console.log("Logged in and connected (uid: " + uid + " token: " + accessToken + ")");
                // Do the ago magic...
                Session.set('fbConnected', true);
            }

            else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
                console.log("Logged in, but NOT connected");
                // Present with the splash screen.
                Session.set('fbConnected', false);
            }

            else {
                // the user isn't logged in to Facebook.
                console.log("Not logged in and not connected");
                // Present with the same splash screen.
                Session.set('fbConnected', false);
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

    // Time Machine -----------------------------------------------------------

    Template.page.createTimeMachine = function() {
        return "This is a time-machine.";
    }

    var isFacebookAuthorized = function () {
        return !!Session.get('fbConnected');
    }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
});
}
