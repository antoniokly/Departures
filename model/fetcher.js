import "isomorphic-fetch";
const {transportationURL, apiKey} = require('./constants');
const {getCacheData, setCacheData, resetCache} = require('./cache');


async function fetcher(filters) {

  var cacheData = getCacheData(filters);
 
  if (cacheData) {
    return cacheData;
  }

  try {
    const response = await fetch(transportationURL, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
        }
      });
  
    let json = await response.json();
    
    if (json.statusCode === 200) {
      if (json.result && json.result.transportation && json.result.transportation.modes) {
        cacheData = setCacheData(json.result.transportation.modes, filters);
        return cacheData;
      }
    } 
    return null;
  } catch (err) {
    console.log(err);
    return err
  }  
}
module.exports = fetcher;