var socket = io();

function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {
    console.log('connecetd to server');
});

socket.on('disconnect', () => {
    console.log('Disconnecetd from server');
});

socket.on('newMessage', (message) => {
    const time = moment(message.createdAt).format('h:mm a');
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: time
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', (location) => {
    const time = moment(message.createdAt).format('h:mm a');
    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template, {
        from: location.from,
        url: location.url,
        createdAt: time
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    var messageBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'Saeed',
        text: messageBox.val()
    }, (data) => {
        messageBox.val('');
        console.log(data);
    });
});

var locationButton = jQuery('#share-location');

locationButton.on('click', () => {
    if (!navigator.geolocation) return alert('Geolocation not supported by your browser');

    locationButton.attr('disabled', 'disabled').text('sending...');

    navigator.geolocation.getCurrentPosition((position) => {
        alert('Are you sure to send location?');
        locationButton.removeAttr('disabled').text('Share location');
        socket.emit('createLocationMessage', {
            from: 'Saeed',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

    }, () => {
        alert('Unable to fetch location');
        locationButton.removeAttr('disabled').text('Share location');
    });
});

