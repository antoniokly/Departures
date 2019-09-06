import "isomorphic-fetch";
import {transportationURL, apiKey} from './constants.js'

var cacheFilters, cacheData

async function fetcher(filters) {
  try {
    const response = await fetch(transportationURL, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
        }
      });
  
    let json = await response.json();
  
      console.log(json)
  
    if (json.statusCode === 200) {
      cacheData = json;
      cacheFilters = filters;
      return cacheData;
    } else {
      return null
    }
  } catch (err) {
    console.log(err);
    return err
  }  
}
module.exports = fetcher;