const {getCacheData, setCacheData, resetCache} = require('../model/cache');
const t0 = new Date();
const t1 = new Date(t0.getTime() + 1000);
const t10 = new Date(t0.getTime() + 10000);
const t30 = new Date(t0.getTime() + 30000);
const t_1 = new Date(t0.getTime() - 1000);

describe("Cache test", () => {
    resetCache();

    test("it should return no cache", async () => {
        const data = getCacheData();    
        expect(data).toBeNull();
    });
});

describe("Cache with no filters", () => {
    resetCache();

    test("it should set the cache if never set before", async () => {
        expect(setCacheData("something", null, t0, 10000)).toBeTruthy();
    });


    test("it should not overwrite the cache with outdated data", async () => {
        expect(setCacheData("something old", null, t_1)).toBeFalsy();
    });

    test("it should return the cache within 10s", async () => {
        expect(getCacheData(null, t1)).toEqual({
            "data": "something", 
            "filters": null, 
            "lastUpdated": t0
        });
    });

    test("it should return the cache at 10s", async () => {
        expect(getCacheData(null, t10)).toEqual({
            "data": "something", 
            "filters": null, 
            "lastUpdated": t0
        });
    });

    test("it should not return any data after 10s", async () => {
        expect(getCacheData(null, t30)).toBeNull();
    });
});

describe("Cache with filters", () => {
    resetCache();

    test("it should set the cache if never set before", async () => {
        expect(setCacheData("something", {id: 1}, t0, 10000)).toBeTruthy();
    });

    test("it should not return any data if the cache filters are more restrictive", async () => {
        expect(getCacheData(null, t1)).toBeNull();
    });

    test("it should not return any data if the cache filters does not match", async () => {
        expect(getCacheData({id: 2}, t1)).toBeNull();
    });

    test("it should not return any data if the cache filters does not match", async () => {
        expect(getCacheData({timeMin: "sometime"}, t1)).toBeNull();
    });

    test("it should return the cache if the cache filters are less restrictive", async () => {
        expect(getCacheData({id: 1, timeMin: "sometime"}, t1)).toBeDefined();
    });
});