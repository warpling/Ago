if (Meteor.isClient) {

    // var FB;
    Session.set('fbApiInit', false);
    Session.set('fbAuthorized', false);
    Session.set('yearAgoStatus', false);

    // Page (general stuff) -----------------------------------------------------
    Template.page.imagePath = function () {
        if(isFacebookAuthorized())
            return "test.jpg"
        else
            return "fallen%20leaves%20compressed.jpg";
    };

    Template.page.fbApiInit = function () {
        return isFacebookApiInit();
    }

    Template.page.fbAuthorized = function () {
        return isFacebookAuthorized();
    };

    Template.greeting.events({
        'click .find-out': function (event, template) {
            fbLogin();
            // Meteor.loginWithFacebook(callback)
        }
    });

    // Facebook
    Template.fbconnect.connect = function () {
        connect();
    }

    // Time Machine -----------------------------------------------------------

    Template.page.createTimeMachine = function() {
        return "This is a time-machine.";
    }

    Template.timeMachine.getFirstName = function () {
        // Check if we're authorized (even though we should be) just in case the rug gets pulled out from under us
        // if(!isFacebookApiInit() || !isFacebookAuthorized())
            // return " x";

        var name = getFirstName();
        return name ? (" " + name) : ""; 
    }

    // Template.timeMachine.readyToReturnYearAgoStatus = function () {
    //     return !!Session.get("oneYearAgo")
    // }

    // Template.timeMachine.getLatestStatus = function () {
    //     getLatestStatus();
    //     return Session.get("latest_status")
    // }

    Template.timeMachine.yearAgoStatus = function () {
        
        var status = Session.get('oneYearAgo'); 

        console.log("checking for yearAgoStatus: " + status);

        if(!status)
            getYearAgoStatus();
        else
            return status;
    }

    // Template.timeMachine.loading = function () {
    //     // Check if statuses have come back yet and been parsed...
    //     return !Session.get("latest_status");
    // }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
});
}
