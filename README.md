# java-class-tools

[![Build status](https://ci.appveyor.com/api/projects/status/dwfu9sq51uhofyyv?svg=true)](https://ci.appveyor.com/project/leonardosnt/java-class-tools)
---
The structure of the ClassFile object returned by `JavaClassFileReader#read` and its _inner objects_ matches the [Java Virtual Machine Specification](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html), therefore you can use this specification as a guide on how to understand and change a Class file.

## Install
```
npm install java-class-tools
```

## Examples:
- [Browser usage example](https://rawgit.com/leonardosnt/java-class-tools/master/examples/browser.html) (List all methods and fields of a class file)
- [Node usage example](https://repl.it/@leonardosnt/jct-example) (Simple disassembler)
- [Try yourself](https://runkit.com/leonardosnt/java-class-tools-example)  (_RunKit:_ you must login with GitHub to be able to fork it)

Print method names (Node.js):
```javascript
const { JavaClassFileReader } = require('java-class-tools');
const { TextDecoder } = require('util');

const reader = new JavaClassFileReader();
const classFile = reader.read('./Foo.class');
const textDecoder = new TextDecoder();

classFile.methods.forEach(md => {
  /**
   * Method name in constant-pool.
   * 
   * Points to a CONSTANT_Utf8_info structure: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.7
   */
  const nameInConstantPool = classFile.constant_pool[md.name_index];

  // It is also possible to use the string_decoder builtin module.
  const name = textDecoder.decode(new Uint8Array(nameInConstantPool.bytes));

  console.log(name);
});
```

Print method names (Node.js):
```html
<script src="https://cdn.jsdelivr.net/npm/java-class-tools@latest/dist/java-class-tools.min.js"></script>
<script>
  fetch('https://gist.githubusercontent.com/leonardosnt/69207dd9bcae55c93ff8fe6546c92eef/raw/fa008a94f9bc208cfa593cf568f0c504e3b30413/Class.class')
    .then(r => r.arrayBuffer())
    .then(printAllMethods);
  
  function printAllMethods(classData) {
    const reader = new JavaClassTools.JavaClassFileReader();
    const classFile = reader.read(classData);
    const textDecoder = new TextDecoder();

    classFile.methods.forEach(method => {
      /**
       * Method name in constant-pool.
       * 
       * Points to a CONSTANT_Utf8_info structure: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.7
       */
      const nameEntry = classFile.constant_pool[method.name_index];

      const name = textDecoder.decode(new Uint8Array(nameEntry.bytes));

      console.log(name);
    });
 }
</script>
```

## License
Copyright (C) 2017-2020 leonardosnt <<leonrdsnt@gmail.com>>  
Licensed under the MIT License. See LICENSE file in the project root for full license information.

