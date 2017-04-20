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

Print all methods names
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


