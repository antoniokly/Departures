const filterables = {
    typeId: (item, value) => { 
        // console.log(item.typeId, value, item.typeId === value)
        return item.typeId === value 
    },
    departureTimeMin: (item, value) => {
        if (!item.departureTime || !value) {
            return false;
        }
        const filterTime = new Date(value).getTime();
        const itemTime = new Date(item.departureTime).getTime();
        // console.log(itemTime, filterTime, itemTime >= filterTime)
        return itemTime >= filterTime;
    },
    departureTimeMax: (item, value) => {
        if (!item.departureTime || !value) {
            return false;
        }
        const filterTime = new Date(value).getTime();
        const itemTime = new Date(item.departureTime).getTime();
        // console.log(itemTime, filterTime, itemTime <= filterTime)
        return itemTime <= filterTime;
    },
    topUpOnly: (item, value) => {
        if (!value) {
            return true;
        }
        return item.hasMyKiTopUp; 
    },
    expressOnly: (item, value) => {
        if (!value) {
            return true;
        }
        return item.isExpress; 
    },

    //Future expansion
    routeContains: (item, value) => {
        if (!item.route || !value) {
            return false;
        }
        return item.route.includes(value); 
    },
    nameStartsWith: (item, value) => {
        if (!item.route || !value) {
            return false;
        }
        return item.name.toLowerCase().startsWith(value.toLowerCase());
    }
};

function filterModes(modes, filters) {
    if (!filters) {
        return modes;
    }

    return filtered = modes.filter( item =>  {
        for (var key in filters) {
            if (!filterables[key]) {
                return false;
            }
            
            if (!filterables[key](item, filters[key])) {
                return false;
            }
        }

        return true;
    });
}

module.exports = {
    filterModes
}