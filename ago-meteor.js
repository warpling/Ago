if (Meteor.isClient) {

    // var FB;
    Session.set('fbApiInit', false);
    Session.set('fbAuthorized', false);

    // Page (general stuff) -----------------------------------------------------
    Template.page.imagePath = function () {
        if(isFacebookAuthorized())
            return "test.jpg"
        else
            return "fallen%20leaves%20compressed.jpg";
    };

    Template.page.fbAuthorized = function () {
        return isFacebookAuthorized();
    };

    Template.page.fbApiInit = function () {
        return isFacebookApiInit();
    }

    var isFacebookAuthorized = function () {
        return !!Session.get('fbAuthorized');
    }

    var isFacebookApiInit = function () {
        return !!Session.get('fbApiInit');
    }

    Template.greeting.events({
        'click .find-out': function (event, template) {
            fbLogin();
            // Meteor.loginWithFacebook(callback)
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

                    console.log("Logged in and connected (uid: " + uid + " token: " + accessToken + ")");
                    // Do the ago magic...
                    Session.set('fbAuthorized', true);
                    goBackInTime();
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
    }

    // Time Machine -----------------------------------------------------------

    Template.page.createTimeMachine = function() {
        return "This is a time-machine.";
    }

    Template.timeMachine.getFirstName = function () {
        var bar = Session.get('foo');
        // Check if we're authorized (even though we should be) just in case the rug gets pulled out from under us
        if(!isFacebookApiInit() || !isFacebookAuthorized())
            return " x";

        FB.api('/me', function(response) {
            console.log("his name is " + response.first_name);
            return " " + response.first_name;
        });  
    }

    Template.timeMachine.junk = function() {
        return "junk";
    }

    var goBackInTime = function () {
        // Check if we're authorized (even though we should be) just in case the rug gets pulled out from under us
        if(!isFacebookApiInit() || !isFacebookAuthorized())
            return "";

        // FB.api('/me', function(response) {
        //     var userInfo = document.getElementById('user-info');
        //     userInfo.innerHTML = 
        //         '<img src="https://graph.facebook.com/' 
        //         + response.id + '/picture" style="margin-right:5px"/>' 
        //         + response.name;
        //         // 1042050196/statuses?fields=message,updated_time,id&since=2012-10-01&limit=500
        // });    
    }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
});
}
