const fetcher = require('../fetcher');

describe("Smoke test", () => {

  test("it should return statusCode 200", async () => {
    const data = await fetcher();
    console.log(data);
    
    expect(data.statusCode).toEqual(200);
    expect(data.message).toEqual('Listing possible transportation available at this time.');


    // console.log(data.result.transportation)

  });
});