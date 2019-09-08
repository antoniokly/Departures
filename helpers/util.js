
module.exports = {
    getDisplayTime: function (date, moment) {
        if (!moment) {
            moment = require('moment');
        } 
        return  moment(date).format('Do MMM YYYY, h:mm a');
    },      
    getDisplayType: function (item) {
        var text = ["Train", "Bus"][item.typeId];
        if (item.route) {
            text += ` ${item.route}`
        }
        if (item.isExpress) {
            text += `,X`
        }
        if (item.hasMyKiTopUp) {
            text += `,MK`
        }
        return text;
    } 
}

