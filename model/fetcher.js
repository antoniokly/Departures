import "isomorphic-fetch";

class Fetcher {
  constructor(url, apiKey, cache) {
      this.url = url;
      this.apiKey = apiKey;
      this.cache = cache;
  }
} 

Fetcher.prototype.getData = async function(filters) {

  var cacheData;

  if (this.cache) {
    cacheData = this.cache.getCacheData(filters);
  }
 
  if (cacheData) {
    return cacheData.data;
  }

  var urlString = this.url;

  if (filters) {
    urlString += '?'
    urlString += Object.keys(filters).map(key => `${key}=${filters[key]}`).join('&');
  }

  console.log(encodeURI(urlString));

  try {
    
    const response = await fetch(encodeURI(urlString), {
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

    return null;

  } catch (err) {
    console.log(err);
    throw err;
    //TODO: error handling
  }  
}

module.exports = Fetcher