'use strict';

var chai = require('chai');
var expect = chai.expect;

var reshape = require('./../index');

describe('property', function () {
    it('should support implicit property name', function () {
        var obj = {
            prop: 'root level',
            nested: {
                level: 'leveled'
            }
        };

        var r = reshape({
            prop: '@',
            nested: {
                level: '@',
                not: '@prop'
            }
        })(obj);

        expect(r).to.have.property('prop', obj.prop);
        expect(r).to.have.deep.property('nested.level', obj.nested.level);
        expect(r).to.have.deep.property('nested.not', obj.prop);
    });
});