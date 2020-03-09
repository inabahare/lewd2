const unit = 1024;

const units = [
    { 
        unit: "TiB", 
        value: Math.pow(unit, 4) 
    },
    { 
        unit: "GiB", 
        value: Math.pow(unit, 3) 
    },
    { 
        unit: "MiB", 
        value: Math.pow(unit, 2) 
    },
    { 
        unit: "KiB", 
        value: Math.pow(unit, 1) 
    },
    { 
        unit: "B", 
        value: Math.pow(unit, 0) 
    },
];

function convertNumberToBestByteUnit(number) {
    let unit = null;
    
    for (const n of units) {
        unit = n;
        
        if (number > n.value) {
            break;
        }
    }

    if (unit == null) 
        throw new Error(`Couldn't find unit for ${number}`);
    
    const result = {
        value: (number / unit.value).toFixed(2),
        unit: unit.unit,
    };

    return result;
}

export { convertNumberToBestByteUnit };