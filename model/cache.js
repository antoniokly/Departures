import {defaultTtl} from './constants'

var cacheFilters, cacheData, lastUpdated, cacheTtl;

function getCacheData(filters = null, time = new Date()) {
    if (!lastUpdated || !cacheData || !cacheTtl) {
        return null
    }

    if (time.getTime() - lastUpdated.getTime() > cacheTtl) {
        return null;
    }

    if (!filters && cacheFilters) {
        // should not return cache if the cachefFilters exists but the request doesn't
        return null;
    }

    if (filters && cacheFilters) {
        // should not return cache if cachefFilters has some keys not in request
        for(var p in cacheFilters){
            if(!filters.hasOwnProperty(p)) {
                return null;
            }
        }

        // should not return cache if cachefFilters contain any filter that are not matching
        for(var p in filters){
            if(cacheFilters.hasOwnProperty(p) && cacheFilters[p] != filters[p]) {
                return null;
            }
        }
    }

    return {
        data: cacheData,
        filters: cacheFilters,
        lastUpdated: lastUpdated
    };
}

function setCacheData(data, filters, time = new Date(), ttl) {
    if (lastUpdated && time.getTime() < lastUpdated.getTime()) {
        return false
    }
    
    cacheData = data;
    cacheFilters = filters;
    lastUpdated = time;
    cacheTtl = ttl ? ttl : defaultTtl;
    return true;
}

function resetCache() {
    cacheData = null;
    cacheFilters = null;
    lastUpdated = null;
}

export {
    getCacheData,
    setCacheData,
    resetCache
}