import DataSource from '../model/dataSource'
import Cache from '../model/cache'
import MockDate from 'mockdate'

const {transportationURL, transportationAPIKey, defaultTtl} = require('../model/constants');

describe("Smoke test", () => {
  const fetch = require('node-fetch');
  const cache = new Cache(defaultTtl);
  const dataSource = new DataSource(transportationURL, transportationAPIKey, cache, fetch)

  test("it should return some data from the API", async () => {
    const filters = {
      typeId: 0,
      departureTimeMin: '2024-01-04T15:35:00.000Z',
      departureTimeMax: '2024-10-04T15:35:00.000Z'
    }
    const data = await dataSource.getData(filters);

    console.log(data);

    expect(data.transportation).toBeDefined();
  });
});

describe("Mock test", () => {
  const fetch = require('jest-fetch-mock');
  jest.setMock('node-fetch', fetch);

  const cache = new Cache(defaultTtl);
  const dataSource = new DataSource(transportationURL, transportationAPIKey, cache, fetch)
  

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