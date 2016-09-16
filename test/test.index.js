'use strict';

const should = require('should');

const StrangeNoise = require('../index');

describe('strange noise', () => {
  it('should return a synonym for a given tag', (done) => {
    let random = new StrangeNoise();
    let tags = ['dog'];

    random.scan('./test/glitch.gif', tags, (err, resp) => {
      console.log('found synonym: ', resp[tags[0]].title);
      should.exist(resp[tags[0]]);
      done();
    });
  });

  it('should return nothing for a tag that has a blacklisted word', (done) => {
    let random = new StrangeNoise();
    let tags = ['fuck'];

    random.scan('./test/glitch.gif', tags, (err, resp) => {
      console.log('no synonym found: ', resp[tags[0]]);
      should.not.exist(resp[tags[0]].title);
      done();
    });
  });
});