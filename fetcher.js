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
      if (json.result && json.result.transportation && json.result.transportation.modes) {
        cacheData = json.result.transportation.modes;;
        cacheFilters = filters;
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