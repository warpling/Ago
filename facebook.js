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
    if (!isFacebookApiInit() || !isFacebookAuthorized())
        return "";

    FB.api('/me', function(response) {
        Session.set('first_name', response.first_name);
    }); 

    // Obvious race condition??

    return Session.get('first_name');
};

var statuses = [];
var offset, limit = 100;
var targetTime;

var getLatestStatus = function () {
    FB.api('/me/statuses?fields=message&since=2011-10-01&limit=300', function(response) {
        if (response.data && response.data.length > 0)
            Session.set('latest_status', response.data[0].message);

    }); 
}

var getYearAgoStatus = function () {

    console.log("Fetching staus from a year ago using limit/offset method...");

    statuses = [];
    offset = 0;
    var now = Math.floor(new Date() / 1000);
    // Figure out a more acurate way to compute this perhaps?
    targetTime = now - (60*60*24*365); // now - 12 months

    FB.api('/me/statuses?fields=message&offset=0&limit=100', addStatusesToList); 
}

var addStatusesToList = function (response) {

    console.log("Adding/searching 100 statuses");

    if (!response) {
        // There was an error, there should always be a valid repsonse
        Console.log("No response received to add to statuses list.");
        // findAndSetYearAgoStatus();
    }
    else if (response) {
        if(response.data && response.data.length > 0) {

            var returnedStatuses = response.data;
            // debugger;

            // Add statuses to our list
            for (var i = 0; i < returnedStatuses.length; i++) {
                statuses.push(returnedStatuses[i]);
            };

            // Search for the one we want
            for (var i = offset; i < statuses.length; i++) {
                
                // TODO: edge case handling of first result being target

                var curStatusTime = noOffset(statuses[i].updated_time) / 1000;
                // debugger;
                if(curStatusTime < targetTime) {
                    // Wait, we either passed it or are on it.
                    var prevStatusTime = (new Date(statuses[i-1].updated_time)) / 1000;

                    var diffCurrent  = Math.abs(targetTime - curStatusTime);
                    var diffPrevious = Math.abs(targetTime - prevStatusTime);
                    
                    if(diffCurrent < diffPrevious) {
                        Session.set('oneYearAgoStatus', statuses[i]);
                    }
                    else {
                        Session.set('oneYearAgoStatus', statuses[i-1]);
                    }

                    return;
                }
            }
            // debugger;

            // Get next set
            offset += limit;
            FB.api('/me/statuses?fields=message,updated_time&offset=' + offset + '&limit=100', addStatusesToList);
        }
        else {
            Session.set('oneYearAgoStatus', {message:'Error: the time machine fell apart, one sec…', error:true});
            // debugger;
            // There are no more statuses to add
        }
    }
}

// Source: http://stackoverflow.com/questions/8266710/javascript-date-parse-difference-in-chrome-and-other-browsers
var noOffset = function(s) {
  var day= s.slice(0,-5).split(/\D/).map(function(itm){
    return parseInt(itm, 10) || 0;
  });
  day[1]-= 1;
  day= new Date(Date.UTC.apply(Date, day));  
  var offsetString = s.slice(-5)
  var offset = parseInt(offsetString,10)/100;
  if (offsetString.slice(0,1)=="+") offset*=-1;
  day.setHours(day.getHours()+offset);
  return day.getTime();
}

/*
 * getYearAgoStatus starts the asnyc calls necessary to get the status from a year ago.
 * First we must format the initial Graph API call and then a cascade of async addStatusesToList
 * calls page through all the returned data and store it in the statuses queue. When there
 * are no more statuses to add, the target status is found using findAndSetYearAgoStatus at
 * which point the view will update from the setting of a watched Session variable.
 */
/*var getYearAgoStatus = function () {

    console.log("getting year ago status");

    var statuses = [];
    var now = Math.floor(new Date() / 1000);
    var tStamp = now - (60*60*24*426); // now - ~14 months
    var pages = false;
    FB.api('/me/statuses?fields=message&since=' + tStamp + '&limit=5000', function(response) {

    }); 
}*/

/*var addStatusesToList = function (response) {

    if (!response) {
        // There was an error, there should always be a valid repsonse
        Console.log("No response received to add to statuses list.");
        findAndSetYearAgoStatus();
    }
    else if (response) {
        if(response.data && response.data.length > 0) {
            // There are more statuses to add

            // Add them
            for (var i = 0; i < returnedStatuses.length; i++) {
                statuses.push(returnedStatuses[i]);
            };

            // Paginate
            if (response.paging && response.paging.length == 2) {
                FB.api(response.paging.previous, function(response) {
            }
            else
                Session.set('oneYearAgo', response.data[0].message);
        }
        else {
            Session.set('oneYearAgo', response.data[0].message);
            // There are no more statuses to add
        }
    }
}*/

/*var findAndSetYearAgoStatus = function () {
    // parse through statuses for the one from a year ago
    // set it in the session variable
}*/
