'use strict';

const fs = require('fs');
const moby = require('moby');
const Filter = require('bad-words');
const level = require('level');
const readimage = require('readimage');
const writegif = require('writegif');
const glitcher = require('glitcher');

const MAX = 256;

const customFilter = new Filter({ placeHolder: ' '});

let StrangeNoise = function () {
  this.dbPath = './db';

  let dataset = {};

  this.scan = function (image, tags, next) {
    tags.forEach((tag) => {
      let cleaned = customFilter.clean(tag);

      if (cleaned.length > 2) {
        let img = fs.readFileSync(image);
        let results = moby.search(tags[0]);
        let randIdx = Math.floor(Math.random() * results.length);
        let newTag = results[randIdx];
        let blank = new Buffer([100, 0, 0, 255]);

        readimage(img, (err, i) => {
          if (err) {
            return next(err);
          }

          i.frames.forEach((frame) => {
            glitcher.redBlueOverlay(frame.data);
            glitcher.interleave(i.width, i.frames[0].data)
            glitcher.ghostColors(frame.data, MAX);
            glitcher.chromaKey(frame.data, [255, 255, 255], blank, 200)
          });

          writegif(i, (err, buffer) => {
            fs.writeFileSync('./test/glitch-rewrite.gif', buffer);
            dataset[tag] = {
              title: newTag,
              image: 'data:image/gif;base64,' + buffer.toString('base64')
            }
            next(null, dataset);
          });
        });
      } else {
        next(null, dataset);
      }
    });
  };
};

module.exports = StrangeNoise;
