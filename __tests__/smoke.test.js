import DataSource from '../model/dataSource'
import Cache from '../model/cache'

const {transportationURL, transportationAPIKey, defaultTtl} = require('../model/constants');
const fetch = require('node-fetch');
const cache = new Cache(defaultTtl);
const dataSource = new DataSource(transportationURL, transportationAPIKey, cache, fetch)

describe("Smoke test", () => {

  test("it should return some data from the API", async () => {
    const filters = {
      typeId: 0,
      departureTimeMin: '2024-01-04T15:35:00.000Z',
      departureTimeMax: '2024-10-04T15:35:00.000Z'
    }
    const data = await dataSource.getData(filters);

    expect(data.transportation).toBeDefined();
  });
});