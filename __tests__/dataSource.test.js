import DataSource from '../model/dataSource'
import Cache from '../model/cache'
import MockDate from 'mockdate'

const {transportationURL, transportationAPIKey, defaultTtl, transportationAPIFilters} = require('../model/constants');
const fetch = require('jest-fetch-mock');
jest.setMock('node-fetch', fetch);

const cache = new Cache(defaultTtl);
const dataSource = new DataSource(transportationURL, transportationAPIKey, transportationAPIFilters, cache, fetch)

describe("Mock test", () => {

  test("it should fetch data from API with cache", async () => {
    var data;

    fetch.mockResponse(JSON.stringify({statusCode: 200, result: {data: "something"}}));

    expect(fetch.mock.calls.length).toBe(0);

    let filters = {
      typeId: 1, 
      departureTimeMin: '2024-07-07T13:50:00.000Z', 
      departureTimeMax: '2024-07-07T13:50:00.000Z',
      expressOnly: true,
      unexpectedKey: "sth"
    }

    data = await dataSource.getData(filters);
    expect(data).toEqual({data: "something"});
    expect(fetch.mock.calls.length).toBe(1); 
    expect(fetch.mock.calls[0][0]).toEqual(
      "https://lreypjgj1c.execute-api.ap-southeast-2.amazonaws.com/dev/transportation?typeId=1&departureTimeMin=2024-07-07T13:50:00.000Z&departureTimeMax=2024-07-07T13:50:00.000Z"
      ); // should only submit allowed parameters

    data = await dataSource.getData(filters);
    data = await dataSource.getData(filters);
    data = await dataSource.getData(filters);
    expect(data).toEqual({data: "something"}); 
    expect(fetch.mock.calls.length).toBe(1); // should only call the API once

    MockDate.set('2030-09-07T04:22:41.037Z')

    data = await dataSource.getData(filters);
    expect(data).toEqual({data: "something"});
    expect(fetch.mock.calls.length).toBe(2); // should only call the API again after cache expires
    
  });

});