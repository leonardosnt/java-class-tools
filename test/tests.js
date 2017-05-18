'use strict';

const assert = require('assert');
const ByteBuffer = require('bytebuffer');
const { JavaClassFileWriter, JavaClassFileReader, ConstantType, Modifier, InstructionParser } = require('../');
const CPUtil = require('./constant-pool-util');
const cp = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');

const TMP_DIR_PATH = './tmp/';

if (!fs.existsSync(TMP_DIR_PATH)) {
  fs.mkdirSync(TMP_DIR_PATH);
}

after(() => {
   fs.removeSync(TMP_DIR_PATH);
});

describe('class writer', () => {
  it('validate JavaClassWriter#write()', () => {
    const code = `
    public class Foo {
      int bar = 10;
      Class<?> f;

      private int bar() {
        return 1;
      }

      class Inner {
        String x;
      }

      public void foo() {
        int val = 23;

        switch (val) {
          case 22:
            break;
          case 21:
            break;
          default:
            break;
        }

        int val2 = Integer.MAX_VALUE;

        switch (val2) {
          case Integer.MAX_VALUE:
            break;
          case Integer.MIN_VALUE:
            break;
        }

        String x = "asdasdsad";

        switch (x) {
          case "asdasdsad": return;
          case "asdasdasd": break;
        }
      }

    }
  `;

    const { classFile, fileData } = compileAndRead({
      fileName: 'Foo',
      code: code,
      returnFileData: true
    });

    const classWriter = new JavaClassFileWriter();
    const buff = classWriter.write(classFile);

    assert.deepStrictEqual(buff.buffer, fileData);
  });
});

describe('instruction parser', () => {
  const code = `
  public class Foo {

    public void foo() {
      int val = 23;

      switch (val) {
        case 22:
          break;
        case 21:
          break;
        default:
          break;
      }

      int val2 = Integer.MAX_VALUE;

      switch (val2) {
        case Integer.MAX_VALUE:
          break;
        case Integer.MIN_VALUE:
          break;
      }

      String x = "asdasdsad";

      switch (x) {
        case "asdasdsad": return;
        case "asdasdasd": break;
      }
    }

  }
`;

  const classFile = compileAndRead({
    fileName: 'Foo',
    code: code
  });
  const method0 = classFile.methods[0];

  it('fromBytecode() === toBytecode()', () => {
    const codeAttr = getAttribute(method0, 'Code', classFile);
    const originalBytecode = codeAttr.code;

    const parsedInstructions = InstructionParser.fromBytecode(originalBytecode);
    const rewrittenBytecode = InstructionParser.toBytecode(parsedInstructions);

    assert.deepEqual(originalBytecode, rewrittenBytecode);
  })
})

describe('ReadMethodsTest_0', () => {
  const code = `
  public class ReadMethodsTest_0 {

    @Deprecated
    static int x = 1;

    public ReadMethodsTest_0() {
      // Used to test verification_type_info
      int i = 25;
      double j = 76;
      ReadMethodsTest_0 xx = null;

      System.out.println("Hello World");
      System.out.println(xx + " " + i + " " + j);
      try {
        System.out.println();
      } catch (Exception ex) {
        ex.printStackTrace();
      }

      try {
        System.out.println();
      } catch (Exception ex) {
        ex.printStackTrace();
      }
    }

    public int add(int a, int b) {
      return a + b;
    }

  }
`;

  const classFile = compileAndRead({
    fileName: 'ReadMethodsTest_0',
    code: code,
    javac_flags: '-parameters'
  });

  describe('the "SourceFile" attribute', () => {
    const srcFileAttr = classFile.attributes.filter(attr => {
      const attrName = CPUtil.getString(classFile, attr.attribute_name_index);
      return attrName === "SourceFile";
    })[0];

    it('should exists', () => {
      assert.notEqual(srcFileAttr, undefined);
    });

    it('value should be equal to "ReadMethodsTest_0.java"', () => {
      assert.equal(CPUtil.getString(classFile, srcFileAttr.sourcefile_index), "ReadMethodsTest_0.java");
    })
  });

  describe('the constructor', () => {
    const method = classFile.methods[0];

    it('name should be equal to "<init>"', () => {
      const name = CPUtil.getString(classFile, method.name_index);
      assert.equal(name, "<init>")
    });

    it('descriptor should be equal to "()V"', () => {
      const descriptor = CPUtil.getString(classFile, method.descriptor_index);
      assert.equal(descriptor, "()V");
    });

    describe('the Code attribute', () => {
      const codeAttr = getAttribute(method, 'Code', classFile);

      it('should exists', () => {
        assert.notEqual(codeAttr, undefined);
      });

      it('the exception_table_length should be equal to 2', () => {
        const table_len = codeAttr.exception_table_length;
        assert.equal(table_len, 2);
        assert.equal(codeAttr.exception_table.length, table_len);
      });
    });

  });

  describe('the "add" method', () => {
    const method = classFile.methods[1];

    it('name should be equal to "add"', () => {
      const name = CPUtil.getString(classFile, method.name_index);
      assert.equal(name, "add")
    });

    it('descriptor should be equal to "(II)I"', () => {
      const descriptor = CPUtil.getString(classFile, method.descriptor_index);
      assert.equal(descriptor, "(II)I");
    });

    describe('the Code attribute', () => {
      const codeAttr = getAttribute(method, 'Code', classFile);

      it('should exists', () => {
        assert.notEqual(codeAttr, undefined);
      });

      it('the bytecode should be equals to [iload_1, iload_2, iadd, ireturn]', () => {
        assert.deepStrictEqual(codeAttr.code, [
          0x1b, // iload_1
          0x1c, // iload_2
          0x60, // iadd
          0xac  // ireturn
        ]);
      })
    });

    describe('the "MethodParameters" attribute', () => {
      const mpAttr = method.attributes.filter(attr => {
        const attrName = CPUtil.getString(classFile, attr.attribute_name_index);
        return attrName === "MethodParameters";
      })[0];

      it('should exists', () => {
        assert.notEqual(mpAttr, undefined);
      });

      it('parameters_count should be equal to 2', () => {
        assert.equal(mpAttr.parameters_count, 2);
      });

      it('parameters names should be equal to [a, b]', () => {
        const params = mpAttr.parameters;
        assert.equal(CPUtil.getString(classFile, params[0].name_index), "a");
        assert.equal(CPUtil.getString(classFile, params[1].name_index), "b");
      });
    });

  });

});

describe('ReadMethodsTest_1', () => {
  const code = `
  import java.lang.annotation.*;
  import java.util.*;

  public class ReadMethodsTest_1 {

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE_PARAMETER)
    public @interface TypeAnnotation_1 {
      int value() default 0;
    }

    <@TypeAnnotation_1 T> T generic() {
      return null;
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ ElementType.TYPE_PARAMETER, ElementType.TYPE_USE, ElementType.TYPE })
    public @interface A { }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ ElementType.TYPE_PARAMETER, ElementType.TYPE_USE, ElementType.TYPE })
    public @interface B { }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ ElementType.TYPE_PARAMETER, ElementType.TYPE_USE, ElementType.TYPE })
    public @interface C { }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ ElementType.TYPE_PARAMETER, ElementType.TYPE_USE, ElementType.TYPE })
    public @interface D { }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ ElementType.TYPE_PARAMETER, ElementType.TYPE_USE, ElementType.TYPE })
    public @interface E { }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ ElementType.TYPE_PARAMETER, ElementType.TYPE_USE, ElementType.TYPE })
    public @interface F { }

    void generic2(@A List<@B Comparable<@F Object @C [] @D [] @E []>> list) {
    }

  }
`;

  const classFile = compileAndRead({
    fileName: 'ReadMethodsTest_1',
    code: code,
    javac_flags: '-parameters'
  });

  describe('#generic()', () => {
    const method = classFile.methods[1];

    describe('attribute: RuntimeVisibleTypeAnnotations', () => {
      const rvtAttr = method.attributes.filter(attr => {
        const attrName = CPUtil.getString(classFile, attr.attribute_name_index);
        return attrName === "RuntimeVisibleTypeAnnotations";
      })[0];

      it('!== undefined', () => {
        assert.notEqual(rvtAttr, undefined);
      });

      it('.num_annotations should be equal to 1', () => {
        assert.equal(rvtAttr.num_annotations, 1);
        assert.equal(rvtAttr.annotations.length, 1);
      });

      it('.annotations[0] type should be equals to "TypeAnnotation_1"', () => {
        const type = CPUtil.getString(classFile, rvtAttr.annotations[0].type_index);
        assert.equal(type, "LReadMethodsTest_1$TypeAnnotation_1;");
      });
    });
  });

  /**
   * https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.7.20.2
   * See Table 4.7.20.2-D.
   */
  describe('#generic2()', () => {
    const method = classFile.methods[2];

    describe('attribute: RuntimeVisibleTypeAnnotations', () => {
      const rvtAttr = method.attributes.filter(attr => {
        const attrName = CPUtil.getString(classFile, attr.attribute_name_index);
        return attrName === "RuntimeVisibleTypeAnnotations";
      })[0];

      it('should exist', () => {
        assert.notEqual(rvtAttr, undefined);
      });

      it('property: num_annotations should be equal to 6', () => {
        assert.equal(rvtAttr.num_annotations, 6);
        assert.equal(rvtAttr.annotations.length, 6);
      });

      /**
       * Get annotation by type from 'rvtAttr.annotations'
       */
      function getAnnotationByType(type) {
        return  rvtAttr.annotations.filter(ann => {
          const annType = CPUtil.getString(classFile, ann.type_index);
          return annType === type;
        })[0];
      }

      describe('the @A annotation', () => {
        const annotation = getAnnotationByType('LReadMethodsTest_1$A;');

        it('should exist', () => {
          assert.notEqual(annotation, undefined);
        });

        it('type_path.path_length should be equal to 0', () => {
          assert.equal(annotation.type_path.path_length, 0);
        });

        it('type_path.path should be equal to []', () => {
          assert.deepEqual(annotation.type_path.path, []);
        });
      });

      describe('the @B annotation', () => {
        const annotation = getAnnotationByType('LReadMethodsTest_1$B;');

        it('should exist', () => {
          assert.notEqual(annotation, undefined);
        });

        it('type_path.path_length should be equal to 1', () => {
          assert.equal(annotation.type_path.path_length, 1);
        });

        it('type_path.path should be equal to [{type_path_kind: 3, type_argument_index: 0}]', () => {
          assert.deepEqual(annotation.type_path.path, [ { type_path_kind: 3, type_argument_index: 0 } ]);
        });
      });

      describe('the @C annotation', () => {
        const annotation = getAnnotationByType('LReadMethodsTest_1$C;');

        it('should exist', () => {
          assert.notEqual(annotation, undefined);
        });

        it('type_path.path_length should be equal to 2', () => {
          assert.equal(annotation.type_path.path_length, 2);
        });

        it('type_path.path should be equal to ', () => {
          assert.deepEqual(annotation.type_path.path, [
            {type_path_kind: 3, type_argument_index: 0},
            {type_path_kind: 3, type_argument_index: 0}
          ]);
        });
      });

      describe('the @D annotation', () => {
        const annotation = getAnnotationByType('LReadMethodsTest_1$D;');

        it('should exist', () => {
          assert.notEqual(annotation, undefined);
        });

        it('type_path.path_length should be equal to 3', () => {
          assert.equal(annotation.type_path.path_length, 3);
        });

        it('type_path.path should be equal to [{type_path_kind: 3, type_argument_index: 0}, {type_path_kind: 3, type_argument_index: 0}]', () => {
          assert.deepEqual(annotation.type_path.path, [
            {type_path_kind: 3, type_argument_index: 0},
            {type_path_kind: 3, type_argument_index: 0},
            {type_path_kind: 0, type_argument_index: 0}
          ]);
        });
      });

      describe('the @E annotation', () => {
        const annotation = getAnnotationByType('LReadMethodsTest_1$E;');

        it('should exist', () => {
          assert.notEqual(annotation, undefined);
        });

        it('type_path.path_length should be equal to 4', () => {
          assert.equal(annotation.type_path.path_length, 4);
        });

        it('type_path.path should be equal to [{type_path_kind: 3, type_argument_index: 0}, {type_path_kind: 3, type_argument_index: 0}, {type_path_kind: 0, type_argument_index: 0}, {type_path_kind: 0, type_argument_index: 0}]', () => {
          assert.deepEqual(annotation.type_path.path, [
            {type_path_kind: 3, type_argument_index: 0},
            {type_path_kind: 3, type_argument_index: 0},
            {type_path_kind: 0, type_argument_index: 0},
            {type_path_kind: 0, type_argument_index: 0}
          ]);
        });
      });

      describe('the @F annotation', () => {
        const annotation = getAnnotationByType('LReadMethodsTest_1$F;');

        it('should exist', () => {
          assert.notEqual(annotation, undefined);
        });

        it('type_path.path_length should be equal to 5', () => {
          assert.equal(annotation.type_path.path_length, 5);
        });

        it('type_path.path should be equal to [{type_path_kind: 3, type_argument_index: 0}, {type_path_kind: 3, type_argument_index: 0}, {type_path_kind: 0, type_argument_index: 0}, {type_path_kind: 0, type_argument_index: 0}, {type_path_kind: 0, type_argument_index: 0}]', () => {
          assert.deepEqual(annotation.type_path.path, [
            {type_path_kind: 3, type_argument_index: 0},
            {type_path_kind: 3, type_argument_index: 0},
            {type_path_kind: 0, type_argument_index: 0},
            {type_path_kind: 0, type_argument_index: 0},
            {type_path_kind: 0, type_argument_index: 0}
          ]);
        });
      });

    });
  });

});

describe('test fields', () => {
   const code = `
import java.lang.annotation.*;

public class ReadFieldTest_0 {

  @Retention(RetentionPolicy.RUNTIME)
  @Target(ElementType.FIELD)
  @interface Bar {
    boolean _boolean();
    String _string();
    int _integer();
    double _double();
    String[] _strArray();
    Nested _nested();
  }

  @Retention(RetentionPolicy.RUNTIME)
  @Target(ElementType.ANNOTATION_TYPE)
  @interface Nested {
    String value();
  }

  @Deprecated
  @Bar(
    _boolean = true,
    _string = "quux",
    _integer = 4444,
    _double = 4433.22,
    _strArray = { "foo", "bar" },
    _nested = @Nested("string")
  )
  protected static int someValue = 333333;
}
  `;

  let classFile = compileAndRead({
    fileName: 'ReadFieldTest_0',
    code: code
  });

  describe('fields[0]', () => {
    let field = classFile.fields[0];

    it('should be "protected" and "static"', () => {
      assert((field.access_flags & Modifier.PROTECTED) === Modifier.PROTECTED);
      assert((field.access_flags & Modifier.STATIC) === Modifier.STATIC);
    });

    it('should have "Deprecated" attribute.', () => {
      field.attributes.some(attr => {
        return CPUtil.getString(classFile, attr.attribute_name_index) === 'Deprecated';
      });
    });

    it('the name should be equals to "someValue"', () => {
      assert.equal(CPUtil.getString(classFile, field.name_index), "someValue")
    });

    it('the descriptor should be equals to "I"', () => {
      assert.equal(CPUtil.getString(classFile, field.descriptor_index), "I");
    });
  })
})

describe('class Foo', () => {
  let classFile = compileAndRead({
    fileName: 'Foo',
    code: `public class Foo {}`
  });

  it('should be public', () => {
    assert(classFile.access_flags & Modifier.PUBLIC);
  });

  it('constant_pool should not be empty', () => {
    assert(classFile.constant_pool_count > 0);
  })
})

describe('_readConstantEntry()', () => {

  describe('ConstantType.INTEGER', () => {
    function testInteger(input) {
      let reader = new JavaClassFileReader();
      let buf = (reader.buf = new ByteBuffer(5));

      buf.writeUint8(ConstantType.INTEGER);
      buf.writeUint32(input);
      buf.flip();

      let cp_info = reader._readConstantPoolEntry();
      assert.equal(cp_info.tag, ConstantType.INTEGER);
      cp_info.bytes |= 0; // cast to signed
      assert.equal(cp_info.bytes, input);

    }
    let integerTests = [
      [2147483647],
      [-2147483648],
      [-333],
      [0],
      [150]
    ];

    integerTests.forEach(function(args) {
      it(`With args: (${args})`, () => {
        testInteger.apply(null, args);
      });
    })
  })

  describe('ConstantType.FLOAT', () => {
    function testFloat(input, expected, writeInt) {
      if (expected === undefined) expected = input;
      let reader = new JavaClassFileReader();
      let buf = (reader.buf = new ByteBuffer(5));

      buf.writeUint8(ConstantType.FLOAT);
      if (writeInt) {
        buf.writeInt32(input);
      } else {
        buf.writeFloat32(input);
      }
      buf.flip();

      let cp_info = reader._readConstantPoolEntry();
      let floatValue = CPUtil.u32ToFloat(cp_info.bytes);

      assert.equal(cp_info.tag, ConstantType.FLOAT);
      assert(compareFloatBits(floatValue, expected), floatValue + " != " + expected)
    }
    let floatTestInputs = [
      [55.8734],
      [5124124125.939838383],
      [0x7f800000, Number.POSITIVE_INFINITY, true],
      [0xff800000, Number.NEGATIVE_INFINITY, true],
      [0x7f800001, Number.NaN, true],
      [0x7f800001 + 100, Number.NaN, true],
      [0x7fffffff, Number.NaN, true],
      [0xffffffff, Number.NaN, true]
    ];

    floatTestInputs.forEach(function(args) {
      it(`With args: (${args})`, function() {
        testFloat.apply(null, args);
      });
    })
  })

  describe('ConstantType.LONG', () => {
    function testLong(hig, low) {
      let reader = new JavaClassFileReader();
      let buf = (reader.buf = new ByteBuffer(5));

      buf.writeUint8(ConstantType.LONG);
      buf.writeUint32(hig);
      buf.writeUint32(low);
      buf.flip();

      let cp_info = reader._readConstantPoolEntry();
      assert.equal(cp_info.tag, ConstantType.LONG);
      assert.equal(cp_info.high_bytes, hig);
      assert.equal(cp_info.low_bytes, low);
    }
    let longTests = [
      [0x7fffffff, 0xffffffff]
    ];

    longTests.forEach(function(args) {
      it(`With args: (${args})`, () => {
        testLong.apply(null, args);
      });
    })
  })

});

function compareFloatBits(f1, f2) {
  let buf1 = ByteBuffer.allocate(4), buf2 = ByteBuffer.allocate(4)
  buf1.writeFloat(f1).flip();
  buf2.writeFloat(f2).flip();
  return buf1.buffer.equals(buf2.buffer);
}

function compileAndRead(options) {
  if (typeof options !== 'object')
    throw 'Invalid options';

  if (typeof options.fileName !== 'string')
    throw 'Invalid fileName';

  if (!options.javac_flags) options.javac_flags = '';
  if (!options.printReadTime) options.printReadTime = false;
  if (!options.printJavap) options.printJavap = false;

  let tmpFile = fs.mkdtempSync(TMP_DIR_PATH) + `/${options.fileName}.java`;
  let tmpDir = path.dirname(tmpFile);

  fs.writeFileSync(tmpFile, options.code, { encoding: 'utf8'});

  let res = cp.execSync(`javac ${options.javac_flags} -d ${tmpDir} "${tmpFile}"`);
  let reader = new JavaClassFileReader();
  let compiledFile = `${tmpDir}/${options.fileName}.class`;

  if (options.printJavap) {
    console.log(" ======= JAVAP ======= ");
    console.log(cp.execSync(`javap -v "${compiledFile}"`).toString('utf8'));
    console.log(" ======= JAVAP ======= ");
  }

  if (options.printReadTime) console.time('compileAndRead#readTime: ' + options.fileName);
  let classFile = reader.read(compiledFile);
  if (options.printReadTime) console.timeEnd('compileAndRead#readTime: ' + options.fileName);

  if (options.returnFileData) {
    const fileData = fs.readFileSync(compiledFile);
    return { classFile, fileData };
  }

  return classFile;
}

function getAttribute(source, attrName, classFile) {
  return source.attributes.filter(attr => {
    const attrName = CPUtil.getString(classFile, attr.attribute_name_index);
    return attrName === attrName
  })[0];
}

function deepInspect(obj) {
  return util.inspect(obj, undefined, 100, true);
}

function dumpConstantPool(classFile) {
  for (var i = 0; i < classFile.constant_pool.length; i++) {
    let entry = classFile.constant_pool[i];

    if (entry && entry.tag === ConstantType.UTF8) {
      entry.str = new Buffer(entry.bytes).toString('utf-8');
    }
    console.log(i + " = " + util.inspect(entry, undefined, 2, true));
  }
}