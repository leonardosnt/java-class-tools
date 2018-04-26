# java-class-tools

[![Build status](https://ci.appveyor.com/api/projects/status/dwfu9sq51uhofyyv?svg=true)](https://ci.appveyor.com/project/leonardosnt/java-class-tools)
---
All object's structures are based on the [Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)

## Install
```
npm install java-class-tools
```

## Examples:
- [Live example](https://rawgit.com/leonardosnt/java-class-tools/master/examples/browser.html)  
- [Try yourself](https://runkit.com/leonardosnt/java-class-tools-example)  (_RunKit:_ you must login with github to be able to fork it)

Print all method names (node.js)
```javascript
const { JavaClassFileReader } = require('java-class-tools');

const reader = new JavaClassFileReader();
const classFile = reader.read('path/to/file.class');

classFile.methods.forEach(md => {
  /**
   * Method name in constant-pool.
   * 
   * Points to a CONSTANT_Utf8_info structure: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.7
   */
  const nameInConstantPool = classFile.constant_pool[md.name_index];

  // To string (hacky)
  const name = String.fromCharCode.apply(null, nameInConstantPool.bytes);

  console.log(name);
});
```

Usage Example (browser): print all method names
```html
<script src="https://cdn.jsdelivr.net/npm/java-class-tools@latest/dist/java-class-tools.min.js"></script>
<script>
  fetch('https://gist.githubusercontent.com/leonardosnt/69207dd9bcae55c93ff8fe6546c92eef/raw/fa008a94f9bc208cfa593cf568f0c504e3b30413/Class.class')
    .then(r => r.arrayBuffer())
    .then(printAllMethods);
  
  function printAllMethods(classData) {
    const reader = new JavaClassTools.JavaClassFileReader();
    const classFile = reader.read(classData);

    classFile.methods.forEach(md => {
      /**
       * Method name in constant-pool.
       * 
       * Points to a CONSTANT_Utf8_info structure: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.7
       */
      const nameInConstantPool = classFile.constant_pool[md.name_index];

      // To string (hacky)
      const name = String.fromCharCode.apply(null, nameInConstantPool.bytes);

      console.log(name);
    });
 }
</script>
```

## License
Copyright (C) 2017 leonardosnt <<leonrdsnt@gmail.com>>  
Licensed under the MIT License. See LICENSE file in the project root for full license information.

