'use strict';

var property = require('./property');


// Opens implicit notations (only @)
var openImplicit = function (obj, prefix) {
    Object.getOwnPropertyNames(obj).forEach(function (propName) {

        var path = prefix ? prefix + '.' + propName : '@' + propName;

        var prop = obj[propName];
        if (prop === '@') {
            obj[propName] = path;
        } else if (typeof prop === 'object') {
            openImplicit(prop, path);
        }
    });
};


// Parses reshape intructions to single object.
// Normalizes shorthand array notation to default notation
// Latter definitions overwrite prior
var parseReshapeDefinition = function (definitions) {

    // Convert shorthand array notation to standard notation
    definitions = definitions.map(function (instruction) {
        if (Array.isArray(instruction)) {
            var obj = {};
            instruction.forEach(function (propertyName) {
                obj[propertyName] = '@' + propertyName;
            });
            return obj;
        } else {
            return instruction;
        }
    });


    // Combine definitions to one object
    // Latter one overwrites prior
    var combined = definitions.reduce(function (dest, addt) {
        Object.getOwnPropertyNames(addt).forEach(function (prop) {
            dest[prop] = addt[prop];
        });
        return dest;
    }, {});

    openImplicit(combined);

    return combined;
};




var nestedProperty;

var createMapping = function (definitions) {

    var map = {};

    Object.getOwnPropertyNames(definitions).forEach(function (prop) {
        var def = definitions[prop];
        var defType = typeof def;
        var defFn;

        if (defType === 'string') {
            // Map from property
            defFn = property(def);

        } else if (defType === 'object') {
            // Nested definitions
            defFn = nestedProperty(def);

        } else if (defType === 'function') {
            // Custom function
            defFn = def;

        } else if (defType === 'number') {
            throw new Error('Number?');
        } else if (Array.isArray(def)) {
            throw new Error('Array?');
        } else {
            throw new Error('Doh');
        }

        map[prop] = defFn;
    });

    return map;
};



nestedProperty = function (definitions) {
    var mappingFns = createMapping(definitions);
    var properties = Object.getOwnPropertyNames(definitions);

    return function (sourceObject) {
        var destObject = {};

        properties.forEach(function (prop) {
            destObject[prop] = mappingFns[prop](sourceObject);
        });

        return destObject;
    };
};



module.exports = function transform() {
    var definitions = parseReshapeDefinition(Array.prototype.slice.call(arguments));

    return nestedProperty(definitions);
};


