import util from '../helpers/util'


describe("display time test", () => {

    test("it should return local time", () => {
        const moment = require('moment-timezone');
        moment.locale('en');
        moment.tz.setDefault('Australia/Sydney');

        const date = new Date('2024-07-08T16:00:00.000Z')
        expect(util.getDisplayTime(date, moment)).toBe('9th Jul 2024, 2:00 am');
    });

    test("it should print all information", () => {

        const item = { 
            typeId: 1,
            departureTime: '2024-07-07T13:50:00.000Z',
            route: '624',
            name: 'Queen Victoria Market',
            latitude: -37.806718,
            longitude: 144.9574589,
            hasMyKiTopUp: true ,
            isExpress: true
        }

        expect(util.getDisplayType(item)).toBe('Bus 624,X,MK');
    });
});