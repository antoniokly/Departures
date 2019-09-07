class Cache {
    constructor(ttl) {
        this.ttl = ttl;
    }
  } 

  Cache.prototype.getCacheData = function(filters = null, time = new Date()) {
    if (!this.lastUpdated || !this.cacheData || !this.ttl) {
        return null
    }

    if (time.getTime() - this.lastUpdated.getTime() > this.ttl) {
        return null;
    }

    if (!filters && this.cacheFilters) {
        // should not return cache if the cachefFilters exists but the request doesn't
        return null;
    }

    if (filters && this.cacheFilters) {
        // should not return cache if cachefFilters has some keys not in request
        for(var p in this.cacheFilters){
            if(!filters.hasOwnProperty(p)) {
                return null;
            }
        }

        // should not return cache if cachefFilters contain any filter that are not matching
        for(var p in filters){
            if(this.cacheFilters.hasOwnProperty(p) && this.cacheFilters[p] != filters[p]) {
                return null;
            }
        }
    }

    return {
        data: this.cacheData,
        filters: this.cacheFilters,
        lastUpdated: this.lastUpdated
    };
}

Cache.prototype.setCacheData = function(data, filters, time = new Date()) {
    if (this.lastUpdated && time.getTime() < this.lastUpdated.getTime()) {
        return false
    }
    
    this.cacheData = data;
    this.cacheFilters = filters;
    this.lastUpdated = time;
    return true;
}

Cache.prototype.resetCache = function() {
    this.cacheData = null;
    this.cacheFilters = null;
    this.lastUpdated = null;
}

module.exports = Cache