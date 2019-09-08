const moment = require('moment');

module.exports = {
    getDisplayTime: function (date) {
        return  moment(date).format('Do MMM YYYY, h:mm a');
    },
      
    getDisplayType: function (item) {
        var text = ["Train", "Bus"][item.typeId];
        if (item.route) {
            text += ` ${item.route}`
        }
        return text;
    } 
}

