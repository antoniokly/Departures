import Fetcher from '../model/fetcher'
import Cache from '../model/cache'
import FetchMock from 'fetch-mock'
import MockDate from 'mockdate'

const {transportationURL, transportationAPIKey, defaultTtl} = require('../model/constants');

describe("Smoke test", () => {
  const cache = new Cache(defaultTtl);
  const fetcher = new Fetcher(transportationURL, transportationAPIKey, cache)

  test("it should return some data from the API", async () => {
    const data = await fetcher.getData();

    expect(data.transportation).toBeDefined();

  });
});

describe("Mock test", () => {
  const cache = new Cache(defaultTtl);
  const fetcher = new Fetcher(transportationURL, transportationAPIKey, cache)
  
  test("it should fetch data from API with cache", async () => {
    var data;
    const mock = FetchMock.get(transportationURL, {statusCode: 200, result: {data: "something"}});
    expect(mock.calls(transportationURL).length).toBe(0);

    data = await fetcher.getData();
    expect(data).toEqual({data: "something"});
    expect(mock.calls(transportationURL).length).toBe(1);

    data = await fetcher.getData();
    data = await fetcher.getData();
    data = await fetcher.getData();
    expect(data).toEqual({data: "something"});
    expect(mock.calls(transportationURL).length).toBe(1);


    MockDate.set('2030-09-07T04:22:41.037Z')

    data = await fetcher.getData();
    expect(data).toEqual({data: "something"});
    expect(mock.calls(transportationURL).length).toBe(2);
    
    FetchMock.reset();
    MockDate.reset();
  });

});