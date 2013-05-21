'use strict';

var chai = require('chai');
var expect = chai.expect;

var reshape = require('./../index');

describe('reshape', function () {
    it('should create reshape function', function () {
        var fn = reshape({});
        expect(fn).to.be.a('function');
    });

    it('should support array definitions', function () {
        var a = reshape(['a', 'b'], ['c']);

        var r = a({
            a: 'AA',
            b: 'BB',
            c: 'CC',
            d: 'DD'
        });

        expect(r).to.include.include.keys('a', 'b', 'c');
        expect(r).to.not.include.keys('d');
    });


    it('should support object definitions', function () {
        var shaper = reshape({ a: '@A', b: '@B' });
        var shaped = shaper({ A: 'AAA', B: 'BBB' });

        expect(shaped).to.be.a('object');
        expect(shaped).to.have.property('a', 'AAA');
        expect(shaped).to.have.property('b', 'BBB');
    });

    it('should support nested definitions', function () {
        var reshapeUser = reshape({
            name: {
                first: '@firstname',
                last: '@lastname',
                nick: {
                    primary: '@nick1'
                }
            }
        });

        var user = {
            firstname: 'John',
            lastname: 'Doe',
            nick1: 'K1llah'
        };

        var r = reshapeUser(user);

        var name = r.name;
        expect(name).to.be.a('object');
        expect(name).to.have.property('first', 'John');
        expect(name).to.have.property('last', 'Doe');

        var nick = name.nick;
        expect(nick).to.be.a('object');
        expect(nick).to.have.property('primary', 'K1llah');
    });

    var reshapeUser = reshape({
        firstname: '@name.first',
        lastname: '@name.last'
    });

    it('should be able to flatten nested objects', function () {
        var r = reshapeUser({
            name: {
                first: 'John',
                last: 'Doe'
            },
            firstname: 'Fake name'
        });

        expect(r).to.have.property('firstname', 'John');
        expect(r).to.have.property('lastname', 'Doe');
    });

    it('should not crash even if nested object doesn\'t exist', function () {
        var r = reshapeUser({
            firstname: 'Fake'
        });

        expect(r).to.be.a('object');
        expect(r.hasOwnProperty('firstname')).to.be.true;
        expect(r.firstname).to.eql(undefined);
    });

    it('should support own value resolvers', function () {
        var obj = { a: 'prop' };

        var r = reshape({
            b: '@a',
            value: function (src) {
                expect(src).to.equal(obj);
                return 'custom';
            }
        });

        var dest = r(obj);

        expect(dest).to.have.property('b', 'prop');
        expect(dest).to.have.property('value', 'custom');
    });
});