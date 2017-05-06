/*!
 * https://github.com/leonardosnt/java-class-tools
 * 
 * Copyright (C) 2017 leonardosnt
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

const ConstantType = {
  UTF8: 1,
  INTEGER: 3,
  FLOAT: 4,
  LONG: 5,
  DOUBLE: 6,
  CLASS: 7,
  STRING: 8,
  FIELDREF: 9,
  METHODREF: 10,
  INTERFACE_METHODREF: 11,
  NAME_AND_TYPE: 12,
  METHOD_HANDLE: 15,
  METHOD_TYPE: 16,
  INVOKE_DYNAMIC: 18
};

module.exports = ConstantType;
