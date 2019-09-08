import DataSource from '../model/dataSource'
import Cache from '../model/cache'
import MockDate from 'mockdate'

const {transportationURL, transportationAPIKey, defaultTtl} = require('../model/constants');
const fetch = require('jest-fetch-mock');
jest.setMock('node-fetch', fetch);

const cache = new Cache(defaultTtl);
const dataSource = new DataSource(transportationURL, transportationAPIKey, cache, fetch)

describe("Mock test", () => {

  test("it should fetch data from API with cache", async () => {
    var data;

    fetch.mockResponse(JSON.stringify({statusCode: 200, result: {data: "something"}}));

    expect(fetch.mock.calls.length).toBe(0);

    data = await dataSource.getData();
    expect(data).toEqual({data: "something"});
    expect(fetch.mock.calls.length).toBe(1);

    data = await dataSource.getData();
    data = await dataSource.getData();
    data = await dataSource.getData();
    expect(data).toEqual({data: "something"});
    expect(fetch.mock.calls.length).toBe(1);

    MockDate.set('2030-09-07T04:22:41.037Z')

    data = await dataSource.getData();
    expect(data).toEqual({data: "something"});
    expect(fetch.mock.calls.length).toBe(2);
    
  });

});