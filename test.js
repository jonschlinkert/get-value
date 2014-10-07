/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var get = require('./');

describe('get', function() {
  it('should use property paths to get nested values from the source object.', function () {
    var fixture = {
      a: {locals : {name: {first: 'Brian'}}},
      b: {locals : {name: {last: 'Woodward'}}}
    };
    get(fixture, 'a.locals.name').should.eql({first: 'Brian'});
    get(fixture, 'b.locals.name').should.eql({last: 'Woodward'});
    get(fixture, 'b.locals.name.last').should.eql('Woodward');
  });

  it('should return null if the path is not found', function () {
    var fixture = {};
    (get(fixture, 'a.locals.name') == null).should.be.true;
    (get(fixture, 'b.locals.name') == null).should.be.true;
  });

});
