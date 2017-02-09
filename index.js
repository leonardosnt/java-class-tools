'use strict';

const JavaClassFileReader = require('./lib/java-class-reader');
const JavaClassFileWriter = require('./lib/java-class-writer');
const ConstantType = require('./lib/constant-type');
const Opcode = require('./lib/opcode');
const Modifier = require('./lib/modifier');
const { InstructionParser, Instruction } = require('./lib/instruction-parser');

module.exports = {
  JavaClassFileReader,
  JavaClassFileWriter,
  Opcode,
  ConstantType,
  Modifier,
  Instruction,
  InstructionParser
};