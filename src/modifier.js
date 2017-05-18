/*!
 * https://github.com/leonardosnt/java-class-tools
 *
 * Copyright (C) 2017 leonardosnt
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

const Modifier = {
  PUBLIC: 0x0001,
  PRIVATE: 0x0002,
  PROTECTED: 0x0004,
  STATIC: 0x0008,
  FINAL: 0x0010,
  SUPER: 0x0020,
  VOLATILE: 0x0040,
  BRIDGE: 0x0040,
  TRANSIENT: 0x0080,
  VARARGS: 0x0080,
  NATIVE: 0x0100,
  INTERFACE: 0x0200,
  ABSTRACT: 0x0400,
  SYNTHETIC: 0x1000,
  ANNOTATION: 0x2000,
  ENUM: 0x4000
};

module.exports = Modifier;
