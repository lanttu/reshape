'use strict';


// Maps property definitions
// e.g. `property`, `property.nested.`
var mapFromProperty = function (definition) {
    var parts       = definition.split('.');
    var targetDepth = parts.length - 1;

    return function (sourceObj) {
        var obj = sourceObj;
        var value;
        var depth;

        for (depth = 0; depth <= targetDepth; depth++) {
            if (obj && typeof obj === 'object' && obj.hasOwnProperty(parts[depth])) {
                if (depth === targetDepth) {
                    return obj[parts[depth]];
                } else {
                    obj = obj[parts[depth]];
                }
            } else {
                return undefined;
            }
        }
    };
};


var property = module.exports = function (definition) {
    if (!definition.length) throw new Error('Invalid definition ' + definition);

    if (definition[0] === '@') {
        return mapFromProperty(definition.slice(1));
    } else {
        throw new Error('Invalid definition ' + definition);
    }
};
