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

    //Extras for expansion
    route: (item, value) => {
        if (!item.route || !value) {
            return false;
        }
        // console.log(item.route, value, item.route.includes(value))
        return item.route.includes(value); 
    },
    name: (item, value) => {
        if (!item.route || !value) {
            return false;
        }
        // console.log(item.name, value, item.name.startsWith(value))
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