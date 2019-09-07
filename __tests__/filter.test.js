const {filterModes} = require('../model/filter');
const {transportationResponse, modes} = require('../model/mockData')

describe("Null filter", () => {    
  test("it should return the original", () => {
    const result = filterModes(modes, null);
    expect(result).toEqual(modes);
  });
});

describe("Filter by typeId", () => {
    test("it should return items with desired typeId", () => {
      const id = 1;
      const result = filterModes(modes, {typeId: id});
      const expectedNumberOfResults = modes.filter(item => item.typeId == id).length;

      expect(result.length).toBe(expectedNumberOfResults);

      result.forEach(item => {
        expect(item.typeId).toBe(id);
      });
    });

    test("it should return nothing", () => {
        const id = 2;
        const result = filterModes(modes, {typeId: id});
  
        expect(result.length).toBe(0);
    });

    test("it should return nothing", () => {
        const result = filterModes(modes, {noKey: 1});
  
        expect(result.length).toBe(0);
    });
});

describe("Filter by departureTime", () => {
    test("it should filter minTime", () => {
        const result = filterModes(modes, {departureTimeMin: "2024-07-08T14:55:00.000Z"});
        expect(result.length).toBe(3);
    });

    test("it should filter all out", () => {
        const result = filterModes(modes, {departureTimeMax: "2019-07-08T14:55:00.000Z"});
        expect(result.length).toBe(0);
    });

    test("it should return only 1", () => {
        const result = filterModes(modes, {departureTimeMax: "2024-07-08T14:55:00.000Z", departureTimeMin: "2024-07-08T14:55:00.000Z"});
        expect(result.length).toBe(1);
    });
});

describe("Filter by route", () => {
    test("it should return only 1 match", () => {
        const result = filterModes(modes, {route: "820"});
  
        expect(result.length).toBe(1);

        result.forEach(item => {
            expect(item.route).toBe("820");
          });
    });
});

describe("Filter by name", () => {
    test("it should filter name caseinsensitive", () => {
        const result = filterModes(modes, {name: "c"});
  
        expect(result.length).toBe(2);

        result.forEach(item => {
            expect(item.name.startsWith("C")).toBeTruthy();
          });
    });
});

describe("Filter multiple fieids", () => {
    test("it should return only 1 match", () => {
        const result = filterModes(modes, {typeId: 1, route: "820"});
  
        expect(result.length).toBe(1);

        result.forEach(item => {
            expect(item.typeId).toBe(1);
            expect(item.route).toBe("820");
          });
    });
});