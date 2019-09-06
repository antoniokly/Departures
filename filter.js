


function filterModes(modes, filters) {
    if (!filters) {
        return modes
    }

    const filtered = modes.filter( item =>  {
        var match = true;

        Object.keys(filters).forEach(function(key) {
            if (key === "departureTimeMax" || key === "departureTimeMin") {
                if (!item.departureTime) {
                    match = false;
                } else {
                    const filterTime = new Date(filters[key]).getTime();
                    const time = new Date(item.departureTime).getTime();
    
                    if ((key === "departureTimeMax" &&  time > filterTime) 
                        || (key === "departureTimeMin" &&  time < filterTime)) {
                        match = false;
                    }
                }
            } else if (filters[key] !== item[key]) {
                match = false
            }
        });

        return match;
    });

    return filtered;
}

module.exports = {
    filterModes
}