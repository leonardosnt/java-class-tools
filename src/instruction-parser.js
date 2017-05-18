/*!
 * https://github.com/leonardosnt/java-class-tools
 * 
 * Copyright (C) 2017 leonardosnt
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

import Opcode from './opcode';

// -1 = variable length
// index = opcode
const opcodeOperandCount = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2,
  2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 1, -1, -1, 0, 0, 0, 0, 0, 0, 2,
  2, 2, 2, 2, 2, 2, 4, 4, 2, 1, 2, 0, 0, 2, 2, 0, 0, -1, 3,
  2, 2, 4, 4, 0
];

// index = opcode
const opcodeMnemonics = [
  'nop', 'aconst_null', 'iconst_m1', 'iconst_0', 'iconst_1', 'iconst_2', 'iconst_3', 'iconst_4', 'iconst_5', 'lconst_0',
  'lconst_1', 'fconst_0', 'fconst_1', 'fconst_2', 'dconst_0', 'dconst_1', 'bipush', 'sipush', 'ldc', 'ldc_w',
  'ldc2_w', 'iload', 'lload', 'fload', 'dload', 'aload', 'iload_0', 'iload_1', 'iload_2', 'iload_3',
  'lload_0', 'lload_1', 'lload_2', 'lload_3', 'fload_0', 'fload_1', 'fload_2', 'fload_3', 'dload_0', 'dload_1',
  'dload_2', 'dload_3', 'aload_0', 'aload_1', 'aload_2', 'aload_3', 'iaload', 'laload', 'faload', 'daload',
  'aaload', 'baload', 'caload', 'saload', 'istore', 'lstore', 'fstore', 'dstore', 'astore', 'istore_0',
  'istore_1', 'istore_2', 'istore_3', 'lstore_0', 'lstore_1', 'lstore_2', 'lstore_3', 'fstore_0', 'fstore_1', 'fstore_2',
  'fstore_3', 'dstore_0', 'dstore_1', 'dstore_2', 'dstore_3', 'astore_0', 'astore_1', 'astore_2', 'astore_3', 'iastore',
  'lastore', 'fastore', 'dastore', 'aastore', 'bastore', 'castore', 'sastore', 'pop', 'pop2', 'dup',  'dup_x1', 'dup_x2',
  'dup2', 'dup2_x1', 'dup2_x2', 'swap', 'iadd', 'ladd', 'fadd', 'dadd',  'isub', 'lsub', 'fsub', 'dsub', 'imul', 'lmul', 'fmul',
  'dmul', 'idiv', 'ldiv',  'fdiv', 'ddiv', 'irem', 'lrem', 'frem', 'drem', 'ineg', 'lneg', 'fneg', 'dneg',  'ishl', 'lshl',
  'ishr', 'lshr', 'iushr', 'lushr', 'iand', 'land', 'ior', 'lor',  'ixor', 'lxor', 'iinc', 'i2l', 'i2f', 'i2d', 'l2i', 'l2f',
  'l2d', 'f2i', 'f2l', 'f2d', 'd2i', 'd2l', 'd2f', 'i2b', 'i2c', 'i2s', 'lcmp', 'fcmpl',  'fcmpg', 'dcmpl',  'dcmpg',
  'ifeq', 'ifne', 'iflt', 'ifge', 'ifgt', 'ifle', 'if_icmpeq',  'if_icmpne', 'if_icmplt', 'if_icmpge',  'if_icmpgt',
  'if_icmple', 'if_acmpeq', 'if_acmpne', 'goto', 'jsr', 'ret',  'tableswitch', 'lookupswitch', 'ireturn',  'lreturn',
  'freturn', 'dreturn', 'areturn', 'return', 'getstatic', 'putstatic', 'getfield', 'putfield',  'invokevirtual',
  'invokespecial', 'invokestatic', 'invokeinterface', 'invokedynamic', 'new', 'newarray', 'anewarray',  'arraylength',
  'athrow', 'checkcast', 'instanceof', 'monitorenter', 'monitorexit', 'wide', 'multianewarray', 'ifnull', 'ifnonnull',
  'goto_w', 'jsr_w', 'breakpoint'
];

class Instruction {
  constructor(opcode, operands) {
    if (typeof opcode !== 'number') throw TypeError('opcode must be a number');
    if (!Array.isArray(operands)) throw TypeError('operands must be an array');

    this.opcode = opcode;
    this.operands = operands;
  }

  toString() {
    const opcodeMnemonic = opcodeMnemonics[this.opcode] ||
      (this.opcode === 0xFE ? 'impdep1': this.opcode === 0xFF ? 'impdep2' : undefined);
    return `Instruction { opcode: ${opcodeMnemonic}, operands: [${this.operands}] }`
  }
}

class InstructionParser {
  /**
   * Converts Instruction objects into raw bytecode.
   *
   * @param {Instruction[]} instruction - Instructions to convert.
   * @see {@link https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5}
   */
  static toBytecode(instructions) {
    if (!Array.isArray(instructions)) {
      throw TypeError('instructions must be an array.');
    }

    const bytecode = [];
    let offset = 0;

    while (offset < instructions.length) {
      const current = instructions[offset];
      bytecode.push(current.opcode);

      switch (current.opcode) {
        case Opcode.LOOKUPSWITCH: {
          let padding = (bytecode.length % 4) ? 4 - (bytecode.length % 4) : 0;
          let operandOffset = 0;

          while (padding-- > 0) {
            bytecode.push(0);
          }

          const defaultOffset = current.operands[operandOffset++] - 1;

          bytecode.push((defaultOffset >> 24) & 0xFF, (defaultOffset >> 16) & 0xFF, (defaultOffset >> 8) & 0xFF, defaultOffset & 0xFF);

          let npairs = current.operands[operandOffset++];

          bytecode.push((npairs >> 24) & 0xFF, (npairs >> 16) & 0xFF, (npairs >> 8) & 0xFF, npairs & 0xFF);

          while (npairs-- > 0) {
            const npair = current.operands[operandOffset++];
            const matchOffset = current.operands[operandOffset++] - 1;

            bytecode.push((npair >> 24) & 0xFF, (npair >> 16) & 0xFF, (npair >> 8) & 0xFF, npair & 0xFF);
            bytecode.push((matchOffset >> 24) & 0xFF, (matchOffset >> 16) & 0xFF, (matchOffset >> 8) & 0xFF, matchOffset & 0xFF);
          }
          break;
        }

        case Opcode.TABLESWITCH: {
          let padding = (bytecode.length % 4) ? 4 - (bytecode.length % 4) : 0;
          let operandOffset = 0;

          while (padding-- > 0) {
            bytecode.push(0);
          }

          const defaultOffset = current.operands[operandOffset++] - 1;

          bytecode.push((defaultOffset >> 24) & 0xFF, (defaultOffset >> 16) & 0xFF, (defaultOffset >> 8) & 0xFF, defaultOffset & 0xFF);

          const low = current.operands[operandOffset++];
          const high = current.operands[operandOffset++];

          bytecode.push((low >> 24) & 0xFF, (low >> 16) & 0xFF, (low >> 8) & 0xFF, low & 0xFF);
          bytecode.push((high >> 24) & 0xFF, (high >> 16) & 0xFF, (high >> 8) & 0xFF, high & 0xFF);

          let jumpOffsets = (high - low) + 1;
          while (jumpOffsets-- > 0) {
            const jumpOffset = current.operands[operandOffset++] - 1;
            bytecode.push((jumpOffset >> 24) & 0xFF, (jumpOffset >> 16) & 0xFF, (jumpOffset >> 8) & 0xFF, jumpOffset & 0xFF);
          }
          break;
        }

        case Opcode.WIDE: {
          const targetOpcode = current.operands[0];

          switch (targetOpcode) {
            case Opcode.ILOAD:
            case Opcode.FLOAD:
            case Opcode.ALOAD:
            case Opcode.LLOAD:
            case Opcode.DLOAD:
            case Opcode.ISTORE:
            case Opcode.FSTORE:
            case Opcode.ASTORE:
            case Opcode.LSTORE:
            case Opcode.DSTORE:
            case Opcode.RET:
              bytecode.push(targetOpcode, current.operands[1], current.operands[2]);
              break;

            case Opcode.IINC:
              bytecode.push(targetOpcode, current.operands[1], current.operands[2], current.operands[3], current.operands[4]);
              break;

            default:
              throw `Unexpected wide opcode: ${targetOpcode}`;
          }
          break;
        }

        default: {
          let operandCount = opcodeOperandCount[current.opcode];

          if (operandCount === undefined) {
            throw Error(`Unexpected opcode: ${current}`);
          }

          if (current.operands.length > operandCount) {
            throw Error(`The number of operands in instruction: ${current} is greater than the allowed.`);
          }

          for (let i = 0; i < operandCount; i++) {
            bytecode.push(current.operands[i]);
          }
          break;
        }
      }

      offset++;
    }

    return bytecode;
  }

  /**
   * Converts raw bytecode into Instruction objects.
   *
   * @param {number[]} bytecode - An array of bytes containing the jvm bytecode.
   * @see {@link https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5}
   */
  static fromBytecode(bytecode) {
    if (!Array.isArray(bytecode)) {
      throw TypeError('bytecode must be an array of bytes.');
    }

    const parsed = [];
    let offset = 0;

    while (offset < bytecode.length) {
      const current = bytecode[offset++];
      const instruction = new Instruction(current, []);

      switch (current) {
        // https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lookupswitch
        case Opcode.LOOKUPSWITCH: {
          const padding = (offset % 4) ? 4 - (offset % 4) : 0;
          offset += padding; // Skip padding

          // the "default" case offset
          const defaultOffset = (bytecode[offset++] << 24) | (bytecode[offset++] << 16) | (bytecode[offset++] << 8) | (bytecode[offset++]);
          instruction.operands.push(defaultOffset + 1);

          // number of "cases"
          let npairs = (bytecode[offset++] << 24) | (bytecode[offset++] << 16) | (bytecode[offset++] << 8) | (bytecode[offset++]);
          instruction.operands.push(npairs);

          while (npairs-- > 0) {
            const npair = (bytecode[offset++] << 24) | (bytecode[offset++] << 16) | (bytecode[offset++] << 8) | (bytecode[offset++]);
            const matchOffset = (bytecode[offset++] << 24) | (bytecode[offset++] << 16) | (bytecode[offset++] << 8) | (bytecode[offset++]);
            instruction.operands.push(npair);
            instruction.operands.push(matchOffset + 1);
          }
          break;
        }

        // https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.tableswitch
        case Opcode.TABLESWITCH: {
          const padding = (offset % 4) ? 4 - (offset % 4) : 0;
          offset += padding; // Skip padding

          // the "default" case offset
          const defaultOffset = (bytecode[offset++] << 24) | (bytecode[offset++] << 16) | (bytecode[offset++] << 8) | (bytecode[offset++]);
          instruction.operands.push(defaultOffset + 1);

          const low = (bytecode[offset++] << 24) | (bytecode[offset++] << 16) | (bytecode[offset++] << 8) | (bytecode[offset++]);
          const high = (bytecode[offset++] << 24) | (bytecode[offset++] << 16) | (bytecode[offset++] << 8) | (bytecode[offset++]);

          instruction.operands.push(low);
          instruction.operands.push(high);

          let jumpOffsets = (high - low) + 1;
          while (jumpOffsets-- > 0) {
            const jumpOffset = (bytecode[offset++] << 24) | (bytecode[offset++] << 16) | (bytecode[offset++] << 8) | (bytecode[offset++]);
            instruction.operands.push(jumpOffset + 1);
          }
          break;
        }

        // https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.wide
        case Opcode.WIDE: {
          const targetOpcode = bytecode[offset];
          switch (targetOpcode) {
            case Opcode.ILOAD:
            case Opcode.FLOAD:
            case Opcode.ALOAD:
            case Opcode.LLOAD:
            case Opcode.DLOAD:
            case Opcode.ISTORE:
            case Opcode.FSTORE:
            case Opcode.ASTORE:
            case Opcode.LSTORE:
            case Opcode.DSTORE:
            case Opcode.RET:
              instruction.operands.push(bytecode[offset++], bytecode[offset++], bytecode[offset++]);
              break;

            case Opcode.IINC:
              instruction.operands.push(bytecode[offset++], bytecode[offset++], bytecode[offset++], bytecode[offset++], bytecode[offset++]);
              break;

            default:
              throw `Unexpected wide opcode: ${targetOpcode}`;
          }
          break;
        }

        default: {
          let operandCount = opcodeOperandCount[current];

          if (operandCount === undefined) {
            throw Error(`Unexpected opcode: ${current}`);
          }

          while (operandCount-- > 0) {
            instruction.operands.push(bytecode[offset++]);
          }
          break;
        }
      }

      parsed.push(instruction);
    }
    return parsed;
  }
}

module.exports = {
  Instruction,
  InstructionParser
};
