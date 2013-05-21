'use strict';

var property = require('./property');

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

    return combined;
};




var createXXX;

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
            defFn = createXXX(def);

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



createXXX = function (definitions) {
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

    return createXXX(definitions);
};


