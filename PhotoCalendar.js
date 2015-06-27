Photos = new Meteor.Collection('photos');
CalEvents = new Meteor.Collection('calevents');

if (Meteor.isClient) {
	Session.setDefault('editing_calevent', null);
	Session.setDefault('showEditEvent', false);
	Session.setDefault('lastMod', null);

	Template.calendar.helpers({
		lastMod: function() {
			return Session.get('lastMod');
		},
		showEditEvent: function() {
			return Session.get('showEditEvent');
		}
	});

	var updateCalendar = function() {
		$('#calendar').fullCalendar( 'refetchEvents' );
	}

	Template.editEvent.helpers({
		evt: function() {
			return CalEvents.findOne({_id:Session.get('editing_calevent')});
		}
	});

	Template.editEvent.events({
		'click .save': function(evt, tmpl) {
			updateCalEvent(Session.get('editing_calevent',tmpl.find('.title').value));
			Session.set('editing_calevent', null);
			Session.set('showEditEvent', false);
		},
		'click .close': function(evt, tmpl) {
			Session.set('editing_calevent', null);
			Session.set('showEditEvent', false);
			$('#EditEventModal').modal("hide");
		},
		'click .remove':function(evt,tmpl) {
			removeCalEvent(Session.get('editing_calevent'));
			Session.set('editing_calevent',null);
			Session.set('showEditEvent',false);
			$('#EditEventModal').modal("hide");
		}
	});

	Template.calendar.rendered = function() {
		$('#calendar').fullCalendar({
			dayRender: function(date, cell)  {
				console.log(cell);
				cell.css('background-image', 'url(https://40.media.tumblr.com/56940bda9afd94eddc402c7a75988358/tumblr_mrl9s0MPj81s1xze4o5_400.jpg)');
				cell.css('background-size', 'contain');
			},
			dayClick: function(date, allDay, jsEvent, view) {
				console.log("Inserting at: ", date);
				CalEvents.insert({title: 'New Event', start:date, end:date})
				updateCalendar();
			},
			eventClick: function(calEvent, jsEvent, view) {
				Session.set('editing_calevent',calEvent.id);
				Session.set('showEditEvent', true);
				$('#EditEventModal').modal("show");
			},
			eventDrop: function(calEvent) {
				CalEvents.update(calEvent.id, {$set: {start:calEvent.start, end:calEvent.end}});
			},
			events: function(start, end, callback) {
				var events = [];
				calEvents = CalEvents.find();
				calEvents.forEach(function(evt) {
					events.push({
						id:evt.id,
						title:evt.title,
						start:evt.start,
						end:evt.end
					});
				});
				callback(events);
			}
		});
	}

	var updateCalEvent = function(id, name) {
		CalEvents.update(id, {$set: {title:title}});
	}

	var removeCalEvent = function(id,title){
		CalEvents.remove({_id:id});
		updateCalendar();
	}

}

if (Meteor.isServer) {
	Meteor.startup(function () {
  	// code to run on server at startup
	});
}