const {filterModes} = require('../filter');
const mockData = require('../mockData')

describe("Filter function", () => {
    
  test("it should return the original", () => {
    
    const input = mockData.transportationResponse.result.transportation.modes;

    const result = filterModes(input);
    // console.log(result)
    expect(result).toEqual(input);

  });
});