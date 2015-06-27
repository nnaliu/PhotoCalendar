if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Meteor.subscribe('calendar', function () {
  Session.set('superCalendarReady', true);
});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

    Meteor.publish('calendar', function () {
  return Calendar.find();
});

}
