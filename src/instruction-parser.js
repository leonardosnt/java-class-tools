/*
 *  Copyright (C) 2017 leonardosnt
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

import Opcode from './opcode';

const OPERAND_COUNT_MAP = {
  0x00: 0, 0x01: 0, 0x02: 0, 0x03: 0, 0x04: 0, 0x05: 0, 0x06: 0, 0x07: 0, 0x08: 0, 0x09: 0,
  0x0A: 0, 0x0B: 0, 0x0C: 0, 0x0D: 0, 0x0E: 0, 0x0F: 0, 0x1A: 0, 0x1B: 0, 0x1C: 0, 0x1D: 0,
  0x1E: 0, 0x1F: 0, 0x20: 0, 0x21: 0, 0x22: 0, 0x23: 0, 0x24: 0, 0x25: 0, 0x26: 0, 0x27: 0,
  0x28: 0, 0x29: 0, 0x2A: 0, 0x2B: 0, 0x2C: 0, 0x2D: 0, 0x2E: 0, 0x2F: 0, 0x30: 0, 0x31: 0,
  0x32: 0, 0x33: 0, 0x34: 0, 0x35: 0, 0x3B: 0, 0x3C: 0, 0x3D: 0, 0x3E: 0, 0x3F: 0, 0x40: 0,
  0x41: 0, 0x42: 0, 0x43: 0, 0x44: 0, 0x45: 0, 0x46: 0, 0x47: 0, 0x48: 0, 0x49: 0, 0x4A: 0,
  0x4B: 0, 0x4C: 0, 0x4D: 0, 0x4E: 0, 0x4F: 0, 0x50: 0, 0x51: 0, 0x52: 0, 0x53: 0, 0x54: 0,
  0x55: 0, 0x56: 0, 0x57: 0, 0x58: 0, 0x59: 0, 0x5A: 0, 0x5B: 0, 0x5C: 0, 0x5D: 0, 0x5E: 0,
  0x5F: 0, 0x60: 0, 0x61: 0, 0x62: 0, 0x63: 0, 0x64: 0, 0x65: 0, 0x66: 0, 0x67: 0, 0x68: 0,
  0x69: 0, 0x6A: 0, 0x6B: 0, 0x6C: 0, 0x6D: 0, 0x6E: 0, 0x6F: 0, 0x70: 0, 0x71: 0, 0x72: 0,
  0x73: 0, 0x74: 0, 0x75: 0, 0x76: 0, 0x77: 0, 0x78: 0, 0x79: 0, 0x7A: 0, 0x7B: 0, 0x7C: 0,
  0x7D: 0, 0x7E: 0, 0x7F: 0, 0x80: 0, 0x81: 0, 0x82: 0, 0x83: 0, 0x85: 0, 0x86: 0, 0x87: 0,
  0x88: 0, 0x89: 0, 0x8A: 0, 0x8B: 0, 0x8C: 0, 0x8D: 0, 0x8E: 0, 0x8F: 0, 0x90: 0, 0x91: 0,
  0x92: 0, 0x93: 0, 0x94: 0, 0x95: 0, 0x96: 0, 0x97: 0, 0x98: 0, 0xAC: 0, 0xAD: 0, 0xAE: 0,
  0xAF: 0, 0xB0: 0, 0xB1: 0, 0xBE: 0, 0xBF: 0, 0xC2: 0, 0xC3: 0, 0xCA: 0, 0xFE: 0, 0xFF: 0,

  0x10: 1, 0x12: 1, 0x15: 1, 0x16: 1, 0x17: 1, 0x18: 1, 0x19: 1, 0x36: 1, 0x37: 1, 0x38: 1,
  0x39: 1, 0x3A: 1, 0xA9: 1, 0xBC: 1,

  0x11: 2, 0x13: 2, 0x14: 2, 0x84: 2, 0x99: 2, 0x9A: 2, 0x9B: 2, 0x9C: 2, 0x9D: 2, 0x9E: 2,
  0x9F: 2, 0xA0: 2, 0xA1: 2, 0xA2: 2, 0xA3: 2, 0xA4: 2, 0xA5: 2, 0xA6: 2, 0xA7: 2, 0xA8: 2,
  0xB2: 2, 0xB3: 2, 0xB4: 2, 0xB5: 2, 0xB6: 2, 0xB7: 2, 0xB8: 2, 0xBB: 2, 0xBD: 2, 0xC0: 2,
  0xC1: 2, 0xC6: 2, 0xC7: 2,

  0xC5: 3,

  0xB9: 4, 0xBA: 4, 0xC8: 4, 0xC9: 4
};

class Instruction {
  constructor(opcode, operands) {
    if (typeof opcode !== 'number') throw TypeError('opcode must be a number');
    if (!Array.isArray(operands)) throw TypeError('operands must be an array');

    this.opcode = opcode;
    this.operands = operands;
  }

  toString() {
    return `Instruction { opcode: ${opcodeToString(this.opcode)}, operands: [${this.operands}] }`
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
          
          while (padding--) {
            bytecode.push(0);
          }
          
          const defaultOffset = current.operands[operandOffset++] - 1;

          bytecode.push((defaultOffset >> 24) & 0xFF, (defaultOffset >> 16) & 0xFF, (defaultOffset >> 8) & 0xFF, defaultOffset & 0xFF);

          let npairs = current.operands[operandOffset++];

          bytecode.push((npairs >> 24) & 0xFF, (npairs >> 16) & 0xFF, (npairs >> 8) & 0xFF, npairs & 0xFF);

          while (npairs--) {
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
          
          while (padding--) {
            bytecode.push(0);
          }

          const defaultOffset = current.operands[operandOffset++] - 1;

          bytecode.push((defaultOffset >> 24) & 0xFF, (defaultOffset >> 16) & 0xFF, (defaultOffset >> 8) & 0xFF, defaultOffset & 0xFF);

          const low = current.operands[operandOffset++];
          const high = current.operands[operandOffset++];

          bytecode.push((low >> 24) & 0xFF, (low >> 16) & 0xFF, (low >> 8) & 0xFF, low & 0xFF);
          bytecode.push((high >> 24) & 0xFF, (high >> 16) & 0xFF, (high >> 8) & 0xFF, high & 0xFF);

          let jumpOffsets = (high - low) + 1;
          while (jumpOffsets--) {
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
          let operandCount = OPERAND_COUNT_MAP[current.opcode];

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

          while (npairs--) {
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
          while (jumpOffsets--) {
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
          let operandCount = OPERAND_COUNT_MAP[current];

          if (operandCount === undefined) {
            throw Error(`Unexpected opcode: ${current}`);
          }

          while (operandCount--) {
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

const opcodeToString = function (opcode) {
  return {
    0x0: 'nop', 0x1: 'aconst_null', 0x2: 'iconst_m1', 0x3: 'iconst_0', 0x4: 'iconst_1', 0x5: 'iconst_2',
    0x6: 'iconst_3', 0x7: 'iconst_4', 0x8: 'iconst_5', 0x9: 'lconst_0', 0xa: 'lconst_1', 0xb: 'fconst_0', 0xc: 'fconst_1',
    0xd: 'fconst_2', 0xe: 'dconst_0', 0xf: 'dconst_1', 0x10: 'bipush', 0x11: 'sipush', 0x12: 'ldc', 0x13: 'ldc_w',
    0x14: 'ldc2_w', 0x15: 'iload', 0x16: 'lload', 0x17: 'fload', 0x18: 'dload', 0x19: 'aload', 0x1a: 'iload_0',
    0x1b: 'iload_1', 0x1c: 'iload_2', 0x1d: 'iload_3', 0x1e: 'lload_0', 0x1f: 'lload_1', 0x20: 'lload_2', 0x21: 'lload_3',
    0x22: 'fload_0', 0x23: 'fload_1', 0x24: 'fload_2', 0x25: 'fload_3', 0x26: 'dload_0', 0x27: 'dload_1', 0x28: 'dload_2',
    0x29: 'dload_3', 0x2a: 'aload_0', 0x2b: 'aload_1', 0x2c: 'aload_2', 0x2d: 'aload_3', 0x2e: 'iaload', 0x2f: 'laload',
    0x30: 'faload', 0x31: 'daload', 0x32: 'aaload', 0x33: 'baload', 0x34: 'caload', 0x35: 'saload', 0x36: 'istore',
    0x37: 'lstore', 0x38: 'fstore', 0x39: 'dstore', 0x3a: 'astore', 0x3b: 'istore_0', 0x3c: 'istore_1', 0x3d: 'istore_2',
    0x3e: 'istore_3', 0x3f: 'lstore_0', 0x40: 'lstore_1', 0x41: 'lstore_2', 0x42: 'lstore_3', 0x43: 'fstore_0', 0x44: 'fstore_1',
    0x45: 'fstore_2', 0x46: 'fstore_3', 0x47: 'dstore_0', 0x48: 'dstore_1', 0x49: 'dstore_2', 0x4a: 'dstore_3', 0x4b: 'astore_0',
    0x4c: 'astore_1', 0x4d: 'astore_2', 0x4e: 'astore_3', 0x4f: 'iastore', 0x50: 'lastore', 0x51: 'fastore', 0x52: 'dastore',
    0x53: 'aastore', 0x54: 'bastore', 0x55: 'castore', 0x56: 'sastore', 0x57: 'pop', 0x58: 'pop2', 0x59: 'dup',
    0x5a: 'dup_x1', 0x5b: 'dup_x2', 0x5c: 'dup2', 0x5d: 'dup2_x1', 0x5e: 'dup2_x2', 0x5f: 'swap', 0x60: 'iadd',
    0x61: 'ladd', 0x62: 'fadd', 0x63: 'dadd', 0x64: 'isub', 0x65: 'lsub', 0x66: 'fsub', 0x67: 'dsub',
    0x68: 'imul', 0x69: 'lmul', 0x6a: 'fmul', 0x6b: 'dmul', 0x6c: 'idiv', 0x6d: 'ldiv', 0x6e: 'fdiv',
    0x6f: 'ddiv', 0x70: 'irem', 0x71: 'lrem', 0x72: 'frem', 0x73: 'drem', 0x74: 'ineg', 0x75: 'lneg',
    0x76: 'fneg', 0x77: 'dneg', 0x78: 'ishl', 0x79: 'lshl', 0x7a: 'ishr', 0x7b: 'lshr', 0x7c: 'iushr',
    0x7d: 'lushr', 0x7e: 'iand', 0x7f: 'land', 0x80: 'ior', 0x81: 'lor', 0x82: 'ixor', 0x83: 'lxor',
    0x84: 'iinc', 0x85: 'i2l', 0x86: 'i2f', 0x87: 'i2d', 0x88: 'l2i', 0x89: 'l2f', 0x8a: 'l2d',
    0x8b: 'f2i', 0x8c: 'f2l', 0x8d: 'f2d', 0x8e: 'd2i', 0x8f: 'd2l', 0x90: 'd2f', 0x91: 'i2b',
    0x92: 'i2c', 0x93: 'i2s', 0x94: 'lcmp', 0x95: 'fcmpl', 0x96: 'fcmpg', 0x97: 'dcmpl', 0x98: 'dcmpg',
    0x99: 'ifeq', 0x9a: 'ifne', 0x9b: 'iflt', 0x9c: 'ifge', 0x9d: 'ifgt', 0x9e: 'ifle', 0x9f: 'if_icmpeq',
    0xa0: 'if_icmpne', 0xa1: 'if_icmplt', 0xa2: 'if_icmpge', 0xa3: 'if_icmpgt', 0xa4: 'if_icmple', 0xa5: 'if_acmpeq', 0xa6: 'if_acmpne',
    0xa7: 'goto', 0xa8: 'jsr', 0xa9: 'ret', 0xaa: 'tableswitch', 0xab: 'lookupswitch', 0xac: 'ireturn', 0xad: 'lreturn',
    0xae: 'freturn', 0xaf: 'dreturn', 0xb0: 'areturn', 0xb1: 'return', 0xb2: 'getstatic', 0xb3: 'putstatic', 0xb4: 'getfield',
    0xb5: 'putfield', 0xb6: 'invokevirtual', 0xb7: 'invokespecial', 0xb8: 'invokestatic', 0xb9: 'invokeinterface',
    0xba: 'invokedynamic', 0xbb: 'new', 0xbc: 'newarray', 0xbd: 'anewarray', 0xbe: 'arraylength', 0xbf: 'athrow', 0xc0: 'checkcast',
    0xc1: 'instanceof', 0xc2: 'monitorenter', 0xc3: 'monitorexit', 0xc4: 'wide', 0xc5: 'multianewarray', 0xc6: 'ifnull',
    0xc7: 'ifnonnull', 0xc8: 'goto_w', 0xc9: 'jsr_w', 0xca: 'breakpoint', 0xfe: 'impdep1', 0xff: 'impdep2',
  }[opcode];
}

module.exports = {
  Instruction,
  InstructionParser
};
