const moment = require('moment');

function generateMessage (from, text) {
    return {
        from,
        text,
        createdAt: moment.valueOf()
    }
};

function generateLocationMessage(from ,latitude, longitude) { 
    return {
        from,
        url : `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment.valueOf()
    }
};

module.exports.generateLocationMessage = generateLocationMessage;
module.exports.generateMessage = generateMessage;