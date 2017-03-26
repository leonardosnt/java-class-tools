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

/// <reference types="node" />
/// <reference types="bytebuffer" />

declare module 'java-class-tools' {
  
  export class JavaClassFileReader {
    public read(data: Uint8Array | Buffer | number[] | string): JavaClassFile;

    public readFromFile(path: string): JavaClassFile;
  }

  export class JavaClassFileWriter {
    public write(classFile: JavaClassFile): ByteBuffer;
  }

  export class InstructionParser {
    /**
     * Converts raw bytecode into Instruction objects.
     *
     * @param {number[]} bytecode - An array of bytes containing the jvm bytecode.
     * @see {@link https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5}
     */
    public static fromBytecode(bytecode: number[]): Instruction[];

    /**
     * Converts Instruction objects into raw bytecode.
     *
     * @param {Instruction[]} instruction - Instructions to convert.
     * @see {@link https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5}
     */
    public static toBytecode(instructions: Instruction[]): number[];
  }

  export class JavaClassFile {
    public major_version: number;
    public minor_version: number;

    public constant_pool_count: number;
    public constant_pool: ConstantPoolInfo[];

    public access_flags: number;
    
    public this_class: number;
    public super_class: number;
    
    public interfaces_count: number;
    public interfaces: number[];

    public fields_count: number;
    public fields: FieldInfo[];

    public methods_count: number;
    public methods: MethodInfo[];

    public attributes_count: number;
    public attributes: AttributeInfo[];
  }

  export class ConstantPoolInfo {
    tag: ConstantType;
  }

  export class ClassInfo extends ConstantPoolInfo {
    name_index: number;
  }

  export class FieldRefInfo extends ConstantPoolInfo {
    class_index: number;
    name_and_type_index: number;
  }

  export class MethodRefInfo extends ConstantPoolInfo {
    class_index: number;
    name_and_type_index: number;
  }

  export class InterfaceMethodRefInfo extends ConstantPoolInfo {
    class_index: number;
    name_and_type_index: number;
  }
 
  export class StringInfo extends ConstantPoolInfo {
    string_index: number;
  }

  export class IntegerInfo extends ConstantPoolInfo {
    bytes: number;
  }

  export class FloatInfo extends ConstantPoolInfo {
    bytes: number;
  }

  export class LongInfo extends ConstantPoolInfo {
    high_bytes: number;
    low_bytes: number;
  }

  export class DoubleInfo extends ConstantPoolInfo {
    high_bytes: number;
    low_bytes: number;
  }

  export class NameAndTypeInfo extends ConstantPoolInfo {
    name_index: number;
    descriptor_index: number;
  }

  export class Utf8Info extends ConstantPoolInfo {
    length: number;
    bytes: number[];
  }

  export class MethodHandleInfo extends ConstantPoolInfo {
    reference_kind: number;
    reference_index: number;
  }

  export class MethodTypeInfo extends ConstantPoolInfo {
    descriptor_index: number;
  }

  export class InvokeDynamicInfo extends ConstantPoolInfo {
    bootstrap_method_attr_index: number;
    name_and_type_index: number;
  }

  export class AttributeInfo {
    public attribute_name_index: number;
    public attribute_length: number;
  }

  export class ConstantValueAttributeInfo extends AttributeInfo {
    public constantvalue_index: number;
  }

  export class CodeAttributeInfo extends AttributeInfo {
    public max_stack: number;
    public max_locals: number;
    public code_length: number;
    public code: number[];
    public exception_table_length: number;
    public exception_table: {
      start_pc: number;
      end_pc: number;
      handler_pc: number;
      catch_type: number
    }[];
    public attributes_count: number;
    public attributes: AttributeInfo[];
  }

  export class StackMapTableAttributeInfo extends AttributeInfo {
    public number_of_entries: number;
    public entries: StackMapFrame[];
  }

  export type StackMapFrame = SameFrame | SameLocalsOneStackItemFrame | SameLocalsOneStackItemFrameExtended |
    ChopFrame | SameFrameExtended | AppendFrame | FullFrame;

  export type SameFrame = {
    /**
     * 0-63
     * @type {number}
     */
    frame_type: number;
  }

  export type SameLocalsOneStackItemFrame = {
    /**
     * 64-127
     * @type {number}
     */
    frame_type: number;
    stack: VerificationTypeInfo[];
  }

  export type SameLocalsOneStackItemFrameExtended = {
    /**
     * 247 
     * @type {number}
     */
    frame_type: number;
    offset_delta: number;
    stack: VerificationTypeInfo[];
  }

  export type ChopFrame = {
    /**
     * 248-250
     * @type {number}
     */
    frame_type: number;
    offset_delta: number;
  }

  export type SameFrameExtended = {
    /**
     * 251
     * @type {number}
     */
    frame_type: number;
    offset_delta: number;
  }

  export type AppendFrame = {
    /**
     * 252-254 
     * @type {number}
     */
    frame_type: number;
    offset_delta: number;
    /**
     * length = frame_type - 251
     * @type {any[]}
     */
    locals: VerificationTypeInfo[];
  }

  export type FullFrame = {
    /**
     * 255
     * @type {number}
     */
    frame_type: number;
    offset_delta: number;
    number_of_locals: number;
    locals: number;
    number_of_stack_items: number;
    stack: VerificationTypeInfo[];
  }

  export type VerificationTypeInfo = TopVariableInfo | IntegerVariableInfo | FloatVariableInfo | LongVariableInfo | 
    DoubleVariableInfo | NullVariableInfo | UninitializedThisVariableInfo | ObjectVariableInfo | UninitializedVariableInfo;

  export type TopVariableInfo = {
    tag: 0;
  }

  export type IntegerVariableInfo = {
    tag: 1;
  }

  export type FloatVariableInfo = {
    tag: 2;
  }

  export type NullVariableInfo = {
    tag: 5;
  }

  export type UninitializedThisVariableInfo = {
    tag: 6;
  }

  export type ObjectVariableInfo = {
    tag: 7;
    cpool_index: number;
  }

  export type UninitializedVariableInfo = {
    tag: 8;
    offset: number;
  }

  export type LongVariableInfo = {
    tag: 4;
  }

  export type DoubleVariableInfo = {
    tag: 3;
  }

  export class ExceptionsAttributeInfo extends AttributeInfo {
    public number_of_exceptions: number;
    public exception_index_table: number[];
  }

  export class InnerClassesAttributeInfo extends AttributeInfo {
    public number_of_classes: number;
    public classes: {   
      inner_class_info_index: number;
      outer_class_info_index: number;
      inner_name_index: number;
      inner_class_access_flags: number;
    }[];
  }

  export class EnclosingMethodAttributeInfo extends AttributeInfo {
    public class_index: number;
    public method_index: number;
  }

  export class SyntheticAttributeInfo extends AttributeInfo { }

  export class SignatureAttributeInfo extends AttributeInfo {
    public signature_index: number;
  }

  export class SourceFileAttributeInfo extends AttributeInfo {
    public sourcefile_index: number;
  }  

  export class SourceDebugExtensionAttributeInfo extends AttributeInfo {
    public debug_extension: number;
  }

  export class LineNumberTableAttributeInfo extends AttributeInfo {
    public line_number_table_length: number;
    public line_number_table: {
      start_pc: number;
      line_number: number;
    }[];
  }

  export class LocalVariableTableAttributeInfo extends AttributeInfo {
    public local_variable_table_length: number;
    public local_variable_table: {
      start_pc: number;
      length: number;
      name_index: number;
      descriptor_index: number;
      index: number;
    }[];
  }

  export class LocalVariableTypeTableAttributeInfo extends AttributeInfo {
    public local_variable_type_table_length: number;
    public local_variable_type_table: {
      start_pc: number;
      length: number;
      name_index: number;
      signature_index: number;
      index: number;
    }[];
  }

  export class DeprecatedAttributeInfo extends AttributeInfo { }

  export class RuntimeVisibleAnnotationsAttributeInfo extends AttributeInfo {
    public num_annotations: number;
    public annotations: Annotation[]
  }

  export class RuntimeInvisibleAnnotationsAttributeInfo extends AttributeInfo {
    public num_annotations: number;
    public annotations: Annotation[];
  }

  export class RuntimeVisibleParameterAnnotationsAttributeInfo extends AttributeInfo {
    public num_parameters: number;
    public parameter_annotations: {
      num_annotations: number;
      annotations: Annotation[];
    }[];
  }

  export class RuntimeInvisibleParameterAnnotationsAttributeInfo extends AttributeInfo {
    public num_parameters: number;
    public parameter_annotations: {
      num_annotations: number;
      annotations: Annotation[];
    }[];
  }

  export class RuntimeVisibleTypeAnnotationAttributeInfo extends AttributeInfo {
    public num_annotations: number;
    public annotations: Annotation[];
  }

  export class RuntimeInvisibleTypeAnnotationAttributeInfo extends AttributeInfo {
    public num_annotations: number;
    public annotations: Annotation[];
  }

  export class AnnotationDefaultAttributeInfo extends AttributeInfo {
    public default_value: ElementValue;
  }

  export class BootstrapMethodsAttributeInfo extends AttributeInfo {
    public num_bootstrap_methods: number;
    public bootstrap_methods: {
      bootstrap_method_ref: number;
      num_bootstrap_arguments: number;
      bootstrap_arguments: number[];
    }[];
  }

  export class MethodParametersAttributeInfo extends AttributeInfo {
    public parameters_count: number;
    public parameters: {
      name_index: number;
      access_flags: number;
    }[];
  }

  /**
   * https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.7.16.1
   * 
   * @class ElementValue
   */
  class ElementValue {
    /**
     * The tag item uses a single ASCII character to indicate the type of the `value`.
     * 
     * @type {number}
     * @memberOf ElementValue
     */
    public tag: number;

    /**
     * - When `tag` is `B`, `C`, `D`, `F`, `I`, `J`, `S`, `Z` or `s` `const_value_index` should be used.
     * - When `tag` is `e` `enum_const_value` should be used.
     * - When `tag` is `c` `class_info_index` should be used.
     * - When `tag` is `@` `annotation_value` should be used.
     * - When `tag` is `[` `array_value` should be used.
     */
    public value: const_value_index | enum_const_value | class_info_index | annotation_value | array_value;
  }

  export type enum_const_value = { 
    type_name_index: number;
    const_name_index: number;
  }

  export type const_value_index = { const_value_index: number; }

  export type class_info_index = { class_info_index: number; }

  export type annotation_value = { annotation_value: Annotation; }

  export type array_value = { 
    num_values: number;
    values: ElementValue[];
  }

  export class Annotation {
    type_index: number;
    num_element_value_pairs: number;
    element_value_pairs: {
      element_name_index: number;
      value: ElementValue;
    }[]
  }

  export class FieldInfo {
    public access_flags: number;
    public name_index: number;
    public descriptor_index: number;
    public attributes_count: number;
    public attributes: AttributeInfo[];
  }

  export class MethodInfo {
    public access_flags: number;
    public name_index: number;
    public descriptor_index: number;
    public attributes_count: number;
    public attributes: AttributeInfo[];
  }

  export class Instruction {
    public opcode: number;
    public operands: any[];
  }

  export enum ConstantType {
    UTF8 = 1,
    INTEGER = 3,
    FLOAT = 4,
    LONG = 5,
    DOUBLE = 6,
    CLASS = 7,
    STRING = 8,
    FIELDREF = 9,
    METHODREF = 10,
    INTERFACE_METHODREF = 11,
    NAME_AND_TYPE = 12,
    METHOD_HANDLE = 15,
    METHOD_TYPE = 16,
    INVOKE_DYNAMIC = 18
  }

  export enum Modifier {
    PUBLIC = 0x0001,
    PRIVATE = 0x0002,
    PROTECTED = 0x0004,
    STATIC = 0x0008,
    FINAL = 0x0010,
    SUPER = 0x0020,
    VOLATILE = 0x0040,
    BRIDGE = 0x0040,
    TRANSIENT = 0x0080,
    VARARGS = 0x0080,
    NATIVE = 0x0100,
    INTERFACE = 0x0200,
    ABSTRACT = 0x0400,
    SYNTHETIC = 0x1000,
    ANNOTATION = 0x2000,
    ENUM = 0x4000
  }

  export enum Opcode {
    NOP = 0x0,
    ACONST_NULL = 0x1,
    ICONST_M1 = 0x2,
    ICONST_0 = 0x3,
    ICONST_1 = 0x4,
    ICONST_2 = 0x5,
    ICONST_3 = 0x6,
    ICONST_4 = 0x7,
    ICONST_5 = 0x8,
    LCONST_0 = 0x9,
    LCONST_1 = 0xa,
    FCONST_0 = 0xb,
    FCONST_1 = 0xc,
    FCONST_2 = 0xd,
    DCONST_0 = 0xe,
    DCONST_1 = 0xf,
    BIPUSH = 0x10,
    SIPUSH = 0x11,
    LDC = 0x12,
    LDC_W = 0x13,
    LDC2_W = 0x14,
    ILOAD = 0x15,
    LLOAD = 0x16,
    FLOAD = 0x17,
    DLOAD = 0x18,
    ALOAD = 0x19,
    ILOAD_0 = 0x1a,
    ILOAD_1 = 0x1b,
    ILOAD_2 = 0x1c,
    ILOAD_3 = 0x1d,
    LLOAD_0 = 0x1e,
    LLOAD_1 = 0x1f,
    LLOAD_2 = 0x20,
    LLOAD_3 = 0x21,
    FLOAD_0 = 0x22,
    FLOAD_1 = 0x23,
    FLOAD_2 = 0x24,
    FLOAD_3 = 0x25,
    DLOAD_0 = 0x26,
    DLOAD_1 = 0x27,
    DLOAD_2 = 0x28,
    DLOAD_3 = 0x29,
    ALOAD_0 = 0x2a,
    ALOAD_1 = 0x2b,
    ALOAD_2 = 0x2c,
    ALOAD_3 = 0x2d,
    IALOAD = 0x2e,
    LALOAD = 0x2f,
    FALOAD = 0x30,
    DALOAD = 0x31,
    AALOAD = 0x32,
    BALOAD = 0x33,
    CALOAD = 0x34,
    SALOAD = 0x35,
    ISTORE = 0x36,
    LSTORE = 0x37,
    FSTORE = 0x38,
    DSTORE = 0x39,
    ASTORE = 0x3a,
    ISTORE_0 = 0x3b,
    ISTORE_1 = 0x3c,
    ISTORE_2 = 0x3d,
    ISTORE_3 = 0x3e,
    LSTORE_0 = 0x3f,
    LSTORE_1 = 0x40,
    LSTORE_2 = 0x41,
    LSTORE_3 = 0x42,
    FSTORE_0 = 0x43,
    FSTORE_1 = 0x44,
    FSTORE_2 = 0x45,
    FSTORE_3 = 0x46,
    DSTORE_0 = 0x47,
    DSTORE_1 = 0x48,
    DSTORE_2 = 0x49,
    DSTORE_3 = 0x4a,
    ASTORE_0 = 0x4b,
    ASTORE_1 = 0x4c,
    ASTORE_2 = 0x4d,
    ASTORE_3 = 0x4e,
    IASTORE = 0x4f,
    LASTORE = 0x50,
    FASTORE = 0x51,
    DASTORE = 0x52,
    AASTORE = 0x53,
    BASTORE = 0x54,
    CASTORE = 0x55,
    SASTORE = 0x56,
    POP = 0x57,
    POP2 = 0x58,
    DUP = 0x59,
    DUP_X1 = 0x5a,
    DUP_X2 = 0x5b,
    DUP2 = 0x5c,
    DUP2_X1 = 0x5d,
    DUP2_X2 = 0x5e,
    SWAP = 0x5f,
    IADD = 0x60,
    LADD = 0x61,
    FADD = 0x62,
    DADD = 0x63,
    ISUB = 0x64,
    LSUB = 0x65,
    FSUB = 0x66,
    DSUB = 0x67,
    IMUL = 0x68,
    LMUL = 0x69,
    FMUL = 0x6a,
    DMUL = 0x6b,
    IDIV = 0x6c,
    LDIV = 0x6d,
    FDIV = 0x6e,
    DDIV = 0x6f,
    IREM = 0x70,
    LREM = 0x71,
    FREM = 0x72,
    DREM = 0x73,
    INEG = 0x74,
    LNEG = 0x75,
    FNEG = 0x76,
    DNEG = 0x77,
    ISHL = 0x78,
    LSHL = 0x79,
    ISHR = 0x7a,
    LSHR = 0x7b,
    IUSHR = 0x7c,
    LUSHR = 0x7d,
    IAND = 0x7e,
    LAND = 0x7f,
    IOR = 0x80,
    LOR = 0x81,
    IXOR = 0x82,
    LXOR = 0x83,
    IINC = 0x84,
    I2L = 0x85,
    I2F = 0x86,
    I2D = 0x87,
    L2I = 0x88,
    L2F = 0x89,
    L2D = 0x8a,
    F2I = 0x8b,
    F2L = 0x8c,
    F2D = 0x8d,
    D2I = 0x8e,
    D2L = 0x8f,
    D2F = 0x90,
    I2B = 0x91,
    I2C = 0x92,
    I2S = 0x93,
    LCMP = 0x94,
    FCMPL = 0x95,
    FCMPG = 0x96,
    DCMPL = 0x97,
    DCMPG = 0x98,
    IFEQ = 0x99,
    IFNE = 0x9a,
    IFLT = 0x9b,
    IFGE = 0x9c,
    IFGT = 0x9d,
    IFLE = 0x9e,
    IF_ICMPEQ = 0x9f,
    IF_ICMPNE = 0xa0,
    IF_ICMPLT = 0xa1,
    IF_ICMPGE = 0xa2,
    IF_ICMPGT = 0xa3,
    IF_ICMPLE = 0xa4,
    IF_ACMPEQ = 0xa5,
    IF_ACMPNE = 0xa6,
    GOTO = 0xa7,
    JSR = 0xa8,
    RET = 0xa9,
    TABLESWITCH = 0xaa,
    LOOKUPSWITCH = 0xab,
    IRETURN = 0xac,
    LRETURN = 0xad,
    FRETURN = 0xae,
    DRETURN = 0xaf,
    ARETURN = 0xb0,
    RETURN = 0xb1,
    GETSTATIC = 0xb2,
    PUTSTATIC = 0xb3,
    GETFIELD = 0xb4,
    PUTFIELD = 0xb5,
    INVOKEVIRTUAL = 0xb6,
    INVOKESPECIAL = 0xb7,
    INVOKESTATIC = 0xb8,
    INVOKEINTERFACE = 0xb9,
    INVOKEDYNAMIC = 0xba,
    NEW = 0xbb,
    NEWARRAY = 0xbc,
    ANEWARRAY = 0xbd,
    ARRAYLENGTH = 0xbe,
    ATHROW = 0xbf,
    CHECKCAST = 0xc0,
    INSTANCEOF = 0xc1,
    MONITORENTER = 0xc2,
    MONITOREXIT = 0xc3,
    WIDE = 0xc4,
    MULTIANEWARRAY = 0xc5,
    IFNULL = 0xc6,
    IFNONNULL = 0xc7,
    GOTO_W = 0xc8,
    JSR_W = 0xc9,
    BREAKPOINT = 0xca,
    IMPDEP1 = 0xfe,
    IMPDEP2 = 0xff
  }
}