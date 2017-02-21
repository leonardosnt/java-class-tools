# java-class-tools

## Examples:
[Live example](https://rawgit.com/leonardosnt/java-class-tools/master/examples/browser.html)

Print all methods names
```javascript
'use strict';

const { JavaClassFileReader } = require('java-class-tools');

const reader = new JavaClassFileReader();
const classFile = reader.read('path/to/file.class');

classFile.methods.forEach(md => {
  /**
   * Method name in constant-pool.
   * 
   * https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.7
   */
  const nameCpEntry = classFile.constant_pool[md.name_index];

  // To utf-8 string
  const name = String.fromCharCode.apply(null, nameCpEntry.bytes);

  console.log(name);
});
```


