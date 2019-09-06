const fetcher = require('../fetcher');

describe("Smoke test", () => {

  test("it should return statusCode 200", async () => {
    const data = await fetcher();
    // console.log(data);
    
    expect(data).toBeDefined();
  });
});