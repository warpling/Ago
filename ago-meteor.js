if (Meteor.isClient) {

    // var FB;
    Session.set('fbApiInit', false);
    Session.set('fbAuthorized', false);
    Session.set('oneYearAgoStatus', false);
    Session.set('oneYearAgoPhoto', false);

    // Page (general stuff) -----------------------------------------------------
    Template.page.imagePath = function () {

        var photo = Session.get('oneYearAgoPhoto'); 

        if (!photo)
            return "fallen%20leaves%20compressed.jpg";
        else
            return photo.src_big;
    };

    Template.page.fbApiInit = function () {
        return isFacebookApiInit();
    }

    Template.page.fbAuthorized = function () {
        return isFacebookAuthorized();
    };

    Template.greeting.events({
        'click #find-out': function (event, template) {
            fbLogin();
            // Meteor.loginWithFacebook(callback)
        }
    });

    // Facebook
    Template.fbconnect.connect = function () {
        connect();
    }

    // Time Machine -----------------------------------------------------------

    Template.timeMachine.funnyMessage = function() {

        var random = Math.floor(Math.random()*4)

        switch(random) {
            case 0:
                return "If you like to talk a lot, hold tight…";
            case 1:
                return "If you're really popular you might even have time to read this whole sentence…";
            case 2:
                return "I've never actually done this before…";
            default:
                return "Keep your arms and legs inside the browser at all times…";
        }

    }

    Template.timeMachine.getFirstName = function () {
        // Check if we're authorized (even though we should be) just in case the rug gets pulled out from under us
        // if (!isFacebookApiInit() || !isFacebookAuthorized())
            // return " x";

        var name = getFirstName();
        return name ? (" " + name) : ""; 
    }

    // Template.timeMachine.readyToReturnYearAgoStatus = function () {
    //     return !!Session.get("oneYearAgoStatus")
    // }

    // Template.timeMachine.getLatestStatus = function () {
    //     getLatestStatus();
    //     return Session.get("latest_status")
    // }

    Template.timeMachine.yearAgoStatusMessage = function () {
        
        var status = Session.get('oneYearAgoStatus'); 
        console.log("checking for yearAgoStatus: " + status.message);

        if (!status) {
            getYearAgoStatus();
            getYearAgoPhoto();
        }
        else
            return status.message;
    }

    Template.timeMachine.error = function () {
        var status = Session.get('oneYearAgoStatus'); 
        return status && status.error;
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
