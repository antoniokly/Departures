class DataSource {
  constructor(url, apiKey, apiAllowedFiltes, cache, fetch) {
      this.url = url;
      this.apiKey = apiKey;
      this.apiAllowedFiltes = apiAllowedFiltes;
      this.cache = cache;
      this.fetch = fetch;
  }
} 

DataSource.prototype.getData = async function(filters) {

  var cacheData;

  if (this.cache) {
    cacheData = this.cache.getCacheData(filters);
  }
 
  if (cacheData) {
    return cacheData.data;
  }

  var urlString = this.url;

  var apiFilters = {};

  if (filters) {
    var paramStrings = []

    for (var key in filters) {
      if (this.apiAllowedFiltes.indexOf(key) > -1) {
        apiFilters[key] = filters[key];
        paramStrings.push(`${key}=${filters[key]}`);
      }
    }
    
    urlString += '?' 
    urlString += paramStrings.join('&');
  }

  const response = await this.fetch(encodeURI(urlString), {
    method: 'GET',
    headers: {
      'x-api-key': this.apiKey
    }
  });

  let json = await response.json();
  
  if (json.statusCode === 200) {
    const data = json.result
    if (data) {
      if (this.cache.setCacheData(data, filters)) {
        return data;
      }
    }
  } 

  throw { name: "Network Error", message: json.message }
  
}

module.exports = DataSource