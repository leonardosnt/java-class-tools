'use strict';
const fs = require('fs-extra');
const ByteBuffer = require('bytebuffer');
const deepEquals = require('deep-equal');
const { JavaClassFileReader, JavaClassFileWriter } = require('../index');

const walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else results.push(file)
    })
    return results
}

let count = 0;
walk('./cls/rt').forEach(cls => {
  testReadWrite(cls);

  if (count++ % 100 == 0) {
    console.log(`Total read: ${count}`);
  }
});


/**
 * Cover type annotations
 */
testReadWrite('./cls/TestTypeAnnotations.class');

function testReadWrite(cls) {
  let reader = new JavaClassFileReader();
  try {
    let classFile = reader.read(cls);
    let readbuf = reader.buf.buffer;

    let writer = new JavaClassFileWriter();
    let outbuf = writer.write(classFile);

    if (!readbuf.equals(outbuf.buffer)) {
      throw 'not equals: ' + cls;
    }
  } catch (ex) {
    console.log(ex);
  }
}
