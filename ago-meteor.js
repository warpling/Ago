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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
});
}
