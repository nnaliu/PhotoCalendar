Photos = new Meteor.Collection('photos');
CalEvents = new Meteor.Collection('calevents');

if (Meteor.isClient) {
	Session.setDefault('editing_calevent', null);
	Session.setDefault('showEditEvent', false);
	Session.setDefault('lastMod', null);

	Template.calendar.rendered = function() {
		$('#calendar').fullCalendar({
			dayClick: function(date, allDay, jsEvent, view) {
				console.log("Inserting at: ", date);
				CalEvents.insert({title: 'New Event', start:date, end:date})
				Session.set('lastMod', new Date());
			},
			eventClick: function(calEvent, jsEvent, view) {
				Session.set('editing_calevent',calEvent._id);
				Session.set('showEditEvent', true);
			},
			eventDrop: function(calEvent) {
				CalEvents.update(calEvent._id, {$set: {start:calEvent.start, end:calEvent.end}});
			},
			events: function(start, end, callback) {
				var events = [];
				calEvents = CalEvents.find();
				calEvents.forEach(function(evt) {
					events.push({
						id:evt_.id,
						title:evt.title,
						start:evt.start,
						end:evt.end
					});
				});
				callback(events);
			}
		});
	}

	// Template.editEvent.evt = function() {
	// 	return CalEvents.findOne({_id:Session.get('editing_calevent')});
	// }

	// Template.editEvent.events({
	// 	'click .save': function(evt,tmpl) {
	// 		updateCalEvent(Session.get('editing_calevent',tmpl.find('.title').value));
	// 		Session.set('editing_calevent', null);
	// 		Session.set('showEditEvent', false);
	// 	}
	// });

	Template.calendar.helpers({
		lastMod: function() {
			return Session.get('lastMod');
		},
		showEditEvent: function() {
			return Session.get('showEditEvent');
		}
	});

	var updateCalEvent = function(id, name) {
		CalEvents.update(id, {$set: {title:title}});
	}

}

if (Meteor.isServer) {
	Meteor.startup(function () {
  	// code to run on server at startup
	});
}