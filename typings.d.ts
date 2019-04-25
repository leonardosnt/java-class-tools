/*!
 * https://github.com/leonardosnt/java-class-tools
 *
 * Copyright (C) 2017 leonardosnt
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
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

    /**
     * "The constant_pool table is indexed from 1 to constant_pool_count - 1." - jvms 4.1
     *
     * So, constant_pool[0] is always undefined.
     *
     * "All 8-byte constants take up two entries in the constant_pool table of the class file.
     * If a CONSTANT_Long_info or CONSTANT_Double_info structure is the item in the constant_pool table at index n,
     * then the next usable item in the pool is located at index n+2.
     * The constant_pool index n+1 must be valid but is considered unusable." - jvms 4.4.5
     *
     * So, the entry after a CONSTANT_Long or CONSTANT_Double is always undefined.
     */
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
    public opcode: Opcode;
    public operands: number[];
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
    // This was automatically generated!

    /**
     * Operation:
     *   - Do nothing
     *
     * Description:
     * - Do nothing.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.nop
     */
    NOP = 0x0,

    /**
     * Operation:
     *   - Push null
     *
     * Description:
     * - Push the null object reference onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.aconst_null
     */
    ACONST_NULL = 0x1,

    /**
     * Operation:
     *   - Push int constant
     *
     * Description:
     * - Push the int constant 0 (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iconst_i
     */
    ICONST_M1 = 0x2,

    /**
     * Operation:
     *   - Push int constant
     *
     * Description:
     * - Push the int constant 1 (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iconst_i
     */
    ICONST_0 = 0x3,

    /**
     * Operation:
     *   - Push int constant
     *
     * Description:
     * - Push the int constant 2 (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iconst_i
     */
    ICONST_1 = 0x4,

    /**
     * Operation:
     *   - Push int constant
     *
     * Description:
     * - Push the int constant 3 (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iconst_i
     */
    ICONST_2 = 0x5,

    /**
     * Operation:
     *   - Push int constant
     *
     * Description:
     * - Push the int constant 4 (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iconst_i
     */
    ICONST_3 = 0x6,

    /**
     * Operation:
     *   - Push int constant
     *
     * Description:
     * - Push the int constant 5 (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iconst_i
     */
    ICONST_4 = 0x7,

    /**
     * Operation:
     *   - Push int constant
     *
     * Description:
     * - Push the int constant 6 (-1, 0, 1, 2, 3, 4 or 5) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iconst_i
     */
    ICONST_5 = 0x8,

    /**
     * Operation:
     *   - Push long constant
     *
     * Description:
     * - Push the long constant <l> (0 or 1) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lconst_l
     */
    LCONST_0 = 0x9,

    /**
     * Operation:
     *   - Push long constant
     *
     * Description:
     * - Push the long constant <l> (0 or 1) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lconst_l
     */
    LCONST_1 = 0xa,

    /**
     * Operation:
     *   - Push float
     *
     * Description:
     * - Push the float constant <f> (0.0, 1.0, or 2.0) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fconst_f
     */
    FCONST_0 = 0xb,

    /**
     * Operation:
     *   - Push float
     *
     * Description:
     * - Push the float constant <f> (0.0, 1.0, or 2.0) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fconst_f
     */
    FCONST_1 = 0xc,

    /**
     * Operation:
     *   - Push float
     *
     * Description:
     * - Push the float constant <f> (0.0, 1.0, or 2.0) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fconst_f
     */
    FCONST_2 = 0xd,

    /**
     * Operation:
     *   - Push double
     *
     * Description:
     * - Push the double constant <d> (0.0 or 1.0) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dconst_d
     */
    DCONST_0 = 0xe,

    /**
     * Operation:
     *   - Push double
     *
     * Description:
     * - Push the double constant <d> (0.0 or 1.0) onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dconst_d
     */
    DCONST_1 = 0xf,

    /**
     * Operation:
     *   - Push byte
     *
     * Operands:
     *   - `byte`
     *
     * Description:
     * - The immediate byte is sign-extended to an int value. That value is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.bipush
     */
    BIPUSH = 0x10,

    /**
     * Operation:
     *   - Push short
     *
     * Operands:
     *   - `byte1`
     *   - `byte2`
     *
     * Description:
     * - The immediate unsigned byte1 and byte2 values are assembled into an intermediate short, where the value of the short is (byte1 << 8) | byte2. The intermediate value is then sign-extended to an int value. That value is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.sipush
     */
    SIPUSH = 0x11,

    /**
     * Operation:
     *   - Push item from run-time constant pool
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte that must be a valid index into the run-time constant pool of the current class (§2.6). The run-time constant pool entry at index either must be a run-time constant of type int or float, or a reference to a string literal, or a symbolic reference to a class, method type, or method handle (§5.1).
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ldc
     */
    LDC = 0x12,

    /**
     * Operation:
     *   - Push item from run-time constant pool (wide index)
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are assembled into an unsigned 16-bit index into the run-time constant pool of the current class (§2.6), where the value of the index is calculated as (indexbyte1 << 8) | indexbyte2. The index must be a valid index into the run-time constant pool of the current class. The run-time constant pool entry at the index either must be a run-time constant of type int or float, or a reference to a string literal, or a symbolic reference to a class, method type, or method handle (§5.1).
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ldc_w
     */
    LDC_W = 0x13,

    /**
     * Operation:
     *   - Push long or double from run-time constant pool (wide index)
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are assembled into an unsigned 16-bit index into the run-time constant pool of the current class (§2.6), where the value of the index is calculated as (indexbyte1 << 8) | indexbyte2. The index must be a valid index into the run-time constant pool of the current class. The run-time constant pool entry at the index must be a run-time constant of type long or double (§5.1). The numeric value of that run-time constant is pushed onto the operand stack as a long or double, respectively.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ldc2_w
     */
    LDC2_W = 0x14,

    /**
     * Operation:
     *   - Load int from local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte that must be an index into the local variable array of the current frame (§2.6). The local variable at index must contain an int. The value of the local variable at index is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iload
     */
    ILOAD = 0x15,

    /**
     * Operation:
     *   - Load long from local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte. Both index and index+1 must be indices into the local variable array of the current frame (§2.6). The local variable at index must contain a long. The value of the local variable at index is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lload
     */
    LLOAD = 0x16,

    /**
     * Operation:
     *   - Load float from local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte that must be an index into the local variable array of the current frame (§2.6). The local variable at index must contain a float. The value of the local variable at index is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fload
     */
    FLOAD = 0x17,

    /**
     * Operation:
     *   - Load double from local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte. Both index and index+1 must be indices into the local variable array of the current frame (§2.6). The local variable at index must contain a double. The value of the local variable at index is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dload
     */
    DLOAD = 0x18,

    /**
     * Operation:
     *   - Load reference from local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte that must be an index into the local variable array of the current frame (§2.6). The local variable at index must contain a reference. The objectref in the local variable at index is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.aload
     */
    ALOAD = 0x19,

    /**
     * Operation:
     *   - Load int from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain an int. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iload_n
     */
    ILOAD_0 = 0x1a,

    /**
     * Operation:
     *   - Load int from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain an int. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iload_n
     */
    ILOAD_1 = 0x1b,

    /**
     * Operation:
     *   - Load int from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain an int. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iload_n
     */
    ILOAD_2 = 0x1c,

    /**
     * Operation:
     *   - Load int from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain an int. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iload_n
     */
    ILOAD_3 = 0x1d,

    /**
     * Operation:
     *   - Load long from local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The local variable at <n> must contain a long. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lload_n
     */
    LLOAD_0 = 0x1e,

    /**
     * Operation:
     *   - Load long from local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The local variable at <n> must contain a long. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lload_n
     */
    LLOAD_1 = 0x1f,

    /**
     * Operation:
     *   - Load long from local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The local variable at <n> must contain a long. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lload_n
     */
    LLOAD_2 = 0x20,

    /**
     * Operation:
     *   - Load long from local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The local variable at <n> must contain a long. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lload_n
     */
    LLOAD_3 = 0x21,

    /**
     * Operation:
     *   - Load float from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain a float. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fload_n
     */
    FLOAD_0 = 0x22,

    /**
     * Operation:
     *   - Load float from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain a float. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fload_n
     */
    FLOAD_1 = 0x23,

    /**
     * Operation:
     *   - Load float from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain a float. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fload_n
     */
    FLOAD_2 = 0x24,

    /**
     * Operation:
     *   - Load float from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain a float. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fload_n
     */
    FLOAD_3 = 0x25,

    /**
     * Operation:
     *   - Load double from local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The local variable at <n> must contain a double. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dload_n
     */
    DLOAD_0 = 0x26,

    /**
     * Operation:
     *   - Load double from local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The local variable at <n> must contain a double. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dload_n
     */
    DLOAD_1 = 0x27,

    /**
     * Operation:
     *   - Load double from local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The local variable at <n> must contain a double. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dload_n
     */
    DLOAD_2 = 0x28,

    /**
     * Operation:
     *   - Load double from local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The local variable at <n> must contain a double. The value of the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dload_n
     */
    DLOAD_3 = 0x29,

    /**
     * Operation:
     *   - Load reference from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain a reference. The objectref in the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.aload_n
     */
    ALOAD_0 = 0x2a,

    /**
     * Operation:
     *   - Load reference from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain a reference. The objectref in the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.aload_n
     */
    ALOAD_1 = 0x2b,

    /**
     * Operation:
     *   - Load reference from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain a reference. The objectref in the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.aload_n
     */
    ALOAD_2 = 0x2c,

    /**
     * Operation:
     *   - Load reference from local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The local variable at <n> must contain a reference. The objectref in the local variable at <n> is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.aload_n
     */
    ALOAD_3 = 0x2d,

    /**
     * Operation:
     *   - Load int from array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type int. The index must be of type int. Both arrayref and index are popped from the operand stack. The int value in the component of the array at index is retrieved and pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iaload
     */
    IALOAD = 0x2e,

    /**
     * Operation:
     *   - Load long from array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type long. The index must be of type int. Both arrayref and index are popped from the operand stack. The long value in the component of the array at index is retrieved and pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.laload
     */
    LALOAD = 0x2f,

    /**
     * Operation:
     *   - Load float from array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type float. The index must be of type int. Both arrayref and index are popped from the operand stack. The float value in the component of the array at index is retrieved and pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.faload
     */
    FALOAD = 0x30,

    /**
     * Operation:
     *   - Load double from array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type double. The index must be of type int. Both arrayref and index are popped from the operand stack. The double value in the component of the array at index is retrieved and pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.daload
     */
    DALOAD = 0x31,

    /**
     * Operation:
     *   - Load reference from array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type reference. The index must be of type int. Both arrayref and index are popped from the operand stack. The reference value in the component of the array at index is retrieved and pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.aaload
     */
    AALOAD = 0x32,

    /**
     * Operation:
     *   - Load byte or boolean from array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type byte or of type boolean. The index must be of type int. Both arrayref and index are popped from the operand stack. The byte value in the component of the array at index is retrieved, sign-extended to an int value, and pushed onto the top of the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.baload
     */
    BALOAD = 0x33,

    /**
     * Operation:
     *   - Load char from array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type char. The index must be of type int. Both arrayref and index are popped from the operand stack. The component of the array at index is retrieved and zero-extended to an int value. That value is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.caload
     */
    CALOAD = 0x34,

    /**
     * Operation:
     *   - Load short from array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type short. The index must be of type int. Both arrayref and index are popped from the operand stack. The component of the array at index is retrieved and sign-extended to an int value. That value is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.saload
     */
    SALOAD = 0x35,

    /**
     * Operation:
     *   - Store int into local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte that must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type int. It is popped from the operand stack, and the value of the local variable at index is set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.istore
     */
    ISTORE = 0x36,

    /**
     * Operation:
     *   - Store long into local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte. Both index and index+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type long. It is popped from the operand stack, and the local variables at index and index+1 are set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lstore
     */
    LSTORE = 0x37,

    /**
     * Operation:
     *   - Store float into local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte that must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type float. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The value of the local variable at index is set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fstore
     */
    FSTORE = 0x38,

    /**
     * Operation:
     *   - Store double into local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte. Both index and index+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type double. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The local variables at index and index+1 are set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dstore
     */
    DSTORE = 0x39,

    /**
     * Operation:
     *   - Store reference into local variable
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte that must be an index into the local variable array of the current frame (§2.6). The objectref on the top of the operand stack must be of type returnAddress or of type reference. It is popped from the operand stack, and the value of the local variable at index is set to objectref.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.astore
     */
    ASTORE = 0x3a,

    /**
     * Operation:
     *   - Store int into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type int. It is popped from the operand stack, and the value of the local variable at <n> is set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.istore_n
     */
    ISTORE_0 = 0x3b,

    /**
     * Operation:
     *   - Store int into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type int. It is popped from the operand stack, and the value of the local variable at <n> is set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.istore_n
     */
    ISTORE_1 = 0x3c,

    /**
     * Operation:
     *   - Store int into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type int. It is popped from the operand stack, and the value of the local variable at <n> is set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.istore_n
     */
    ISTORE_2 = 0x3d,

    /**
     * Operation:
     *   - Store int into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type int. It is popped from the operand stack, and the value of the local variable at <n> is set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.istore_n
     */
    ISTORE_3 = 0x3e,

    /**
     * Operation:
     *   - Store long into local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type long. It is popped from the operand stack, and the local variables at <n> and <n>+1 are set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lstore_n
     */
    LSTORE_0 = 0x3f,

    /**
     * Operation:
     *   - Store long into local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type long. It is popped from the operand stack, and the local variables at <n> and <n>+1 are set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lstore_n
     */
    LSTORE_1 = 0x40,

    /**
     * Operation:
     *   - Store long into local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type long. It is popped from the operand stack, and the local variables at <n> and <n>+1 are set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lstore_n
     */
    LSTORE_2 = 0x41,

    /**
     * Operation:
     *   - Store long into local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type long. It is popped from the operand stack, and the local variables at <n> and <n>+1 are set to value.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lstore_n
     */
    LSTORE_3 = 0x42,

    /**
     * Operation:
     *   - Store float into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type float. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The value of the local variable at <n> is set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fstore_n
     */
    FSTORE_0 = 0x43,

    /**
     * Operation:
     *   - Store float into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type float. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The value of the local variable at <n> is set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fstore_n
     */
    FSTORE_1 = 0x44,

    /**
     * Operation:
     *   - Store float into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type float. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The value of the local variable at <n> is set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fstore_n
     */
    FSTORE_2 = 0x45,

    /**
     * Operation:
     *   - Store float into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type float. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The value of the local variable at <n> is set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fstore_n
     */
    FSTORE_3 = 0x46,

    /**
     * Operation:
     *   - Store double into local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type double. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The local variables at <n> and <n>+1 are set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dstore_n
     */
    DSTORE_0 = 0x47,

    /**
     * Operation:
     *   - Store double into local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type double. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The local variables at <n> and <n>+1 are set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dstore_n
     */
    DSTORE_1 = 0x48,

    /**
     * Operation:
     *   - Store double into local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type double. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The local variables at <n> and <n>+1 are set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dstore_n
     */
    DSTORE_2 = 0x49,

    /**
     * Operation:
     *   - Store double into local variable
     *
     * Description:
     * - Both <n> and <n>+1 must be indices into the local variable array of the current frame (§2.6). The value on the top of the operand stack must be of type double. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The local variables at <n> and <n>+1 are set to value'.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dstore_n
     */
    DSTORE_3 = 0x4a,

    /**
     * Operation:
     *   - Store reference into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The objectref on the top of the operand stack must be of type returnAddress or of type reference. It is popped from the operand stack, and the value of the local variable at <n> is set to objectref.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.astore_n
     */
    ASTORE_0 = 0x4b,

    /**
     * Operation:
     *   - Store reference into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The objectref on the top of the operand stack must be of type returnAddress or of type reference. It is popped from the operand stack, and the value of the local variable at <n> is set to objectref.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.astore_n
     */
    ASTORE_1 = 0x4c,

    /**
     * Operation:
     *   - Store reference into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The objectref on the top of the operand stack must be of type returnAddress or of type reference. It is popped from the operand stack, and the value of the local variable at <n> is set to objectref.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.astore_n
     */
    ASTORE_2 = 0x4d,

    /**
     * Operation:
     *   - Store reference into local variable
     *
     * Description:
     * - The <n> must be an index into the local variable array of the current frame (§2.6). The objectref on the top of the operand stack must be of type returnAddress or of type reference. It is popped from the operand stack, and the value of the local variable at <n> is set to objectref.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.astore_n
     */
    ASTORE_3 = 0x4e,

    /**
     * Operation:
     *   - Store into int array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type int. Both index and value must be of type int. The arrayref, index, and value are popped from the operand stack. The int value is stored as the component of the array indexed by index.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iastore
     */
    IASTORE = 0x4f,

    /**
     * Operation:
     *   - Store into long array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type long. The index must be of type int, and value must be of type long. The arrayref, index, and value are popped from the operand stack. The long value is stored as the component of the array indexed by index.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lastore
     */
    LASTORE = 0x50,

    /**
     * Operation:
     *   - Store into float array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type float. The index must be of type int, and the value must be of type float. The arrayref, index, and value are popped from the operand stack. The float value undergoes value set conversion (§2.8.3), resulting in value', and value' is stored as the component of the array indexed by index.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fastore
     */
    FASTORE = 0x51,

    /**
     * Operation:
     *   - Store into double array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type double. The index must be of type int, and value must be of type double. The arrayref, index, and value are popped from the operand stack. The double value undergoes value set conversion (§2.8.3), resulting in value', which is stored as the component of the array indexed by index.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dastore
     */
    DASTORE = 0x52,

    /**
     * Operation:
     *   - Store into reference array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type reference. The index must be of type int and value must be of type reference. The arrayref, index, and value are popped from the operand stack. The reference value is stored as the component of the array at index.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.aastore
     */
    AASTORE = 0x53,

    /**
     * Operation:
     *   - Store into byte or boolean array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type byte or of type boolean. The index and the value must both be of type int. The arrayref, index, and value are popped from the operand stack. The int value is truncated to a byte and stored as the component of the array indexed by index.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.bastore
     */
    BASTORE = 0x54,

    /**
     * Operation:
     *   - Store into char array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type char. The index and the value must both be of type int. The arrayref, index, and value are popped from the operand stack. The int value is truncated to a char and stored as the component of the array indexed by index.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.castore
     */
    CASTORE = 0x55,

    /**
     * Operation:
     *   - Store into short array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array whose components are of type short. Both index and value must be of type int. The arrayref, index, and value are popped from the operand stack. The int value is truncated to a short and stored as the component of the array indexed by index.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.sastore
     */
    SASTORE = 0x56,

    /**
     * Operation:
     *   - Pop the top operand stack value
     *
     * Description:
     * - Pop the top value from the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.pop
     */
    POP = 0x57,

    /**
     * Operation:
     *   - Pop the top one or two operand stack values
     *
     * Description:
     * - Pop the top one or two values from the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.pop2
     */
    POP2 = 0x58,

    /**
     * Operation:
     *   - Duplicate the top operand stack value
     *
     * Description:
     * - Duplicate the top value on the operand stack and push the duplicated value onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dup
     */
    DUP = 0x59,

    /**
     * Operation:
     *   - Duplicate the top operand stack value and insert two values down
     *
     * Description:
     * - Duplicate the top value on the operand stack and insert the duplicated value two values down in the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dup_x1
     */
    DUP_X1 = 0x5a,

    /**
     * Operation:
     *   - Duplicate the top operand stack value and insert two or three values down
     *
     * Description:
     * - Duplicate the top value on the operand stack and insert the duplicated value two or three values down in the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dup_x2
     */
    DUP_X2 = 0x5b,

    /**
     * Operation:
     *   - Duplicate the top one or two operand stack values
     *
     * Description:
     * - Duplicate the top one or two values on the operand stack and push the duplicated value or values back onto the operand stack in the original order.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dup2
     */
    DUP2 = 0x5c,

    /**
     * Operation:
     *   - Duplicate the top one or two operand stack values and insert two or three values down
     *
     * Description:
     * - Duplicate the top one or two values on the operand stack and insert the duplicated values, in the original order, one value beneath the original value or values in the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dup2_x1
     */
    DUP2_X1 = 0x5d,

    /**
     * Operation:
     *   - Duplicate the top one or two operand stack values and insert two, three, or four values down
     *
     * Description:
     * - Duplicate the top one or two values on the operand stack and insert the duplicated values, in the original order, into the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dup2_x2
     */
    DUP2_X2 = 0x5e,

    /**
     * Operation:
     *   - Swap the top two operand stack values
     *
     * Description:
     * - Swap the top two values on the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.swap
     */
    SWAP = 0x5f,

    /**
     * Operation:
     *   - Add int
     *
     * Description:
     * - Both value1 and value2 must be of type int. The values are popped from the operand stack. The int result is value1 + value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iadd
     */
    IADD = 0x60,

    /**
     * Operation:
     *   - Add long
     *
     * Description:
     * - Both value1 and value2 must be of type long. The values are popped from the operand stack. The long result is value1 + value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ladd
     */
    LADD = 0x61,

    /**
     * Operation:
     *   - Add float
     *
     * Description:
     * - Both value1 and value2 must be of type float. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The float result is value1' + value2'. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fadd
     */
    FADD = 0x62,

    /**
     * Operation:
     *   - Add double
     *
     * Description:
     * - Both value1 and value2 must be of type double. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The double result is value1' + value2'. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dadd
     */
    DADD = 0x63,

    /**
     * Operation:
     *   - Subtract int
     *
     * Description:
     * - Both value1 and value2 must be of type int. The values are popped from the operand stack. The int result is value1 - value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.isub
     */
    ISUB = 0x64,

    /**
     * Operation:
     *   - Subtract long
     *
     * Description:
     * - Both value1 and value2 must be of type long. The values are popped from the operand stack. The long result is value1 - value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lsub
     */
    LSUB = 0x65,

    /**
     * Operation:
     *   - Subtract float
     *
     * Description:
     * - Both value1 and value2 must be of type float. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The float result is value1' - value2'. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fsub
     */
    FSUB = 0x66,

    /**
     * Operation:
     *   - Subtract double
     *
     * Description:
     * - Both value1 and value2 must be of type double. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The double result is value1' - value2'. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dsub
     */
    DSUB = 0x67,

    /**
     * Operation:
     *   - Multiply int
     *
     * Description:
     * - Both value1 and value2 must be of type int. The values are popped from the operand stack. The int result is value1 * value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.imul
     */
    IMUL = 0x68,

    /**
     * Operation:
     *   - Multiply long
     *
     * Description:
     * - Both value1 and value2 must be of type long. The values are popped from the operand stack. The long result is value1 * value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lmul
     */
    LMUL = 0x69,

    /**
     * Operation:
     *   - Multiply float
     *
     * Description:
     * - Both value1 and value2 must be of type float. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The float result is value1' * value2'. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fmul
     */
    FMUL = 0x6a,

    /**
     * Operation:
     *   - Multiply double
     *
     * Description:
     * - Both value1 and value2 must be of type double. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The double result is value1' * value2'. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dmul
     */
    DMUL = 0x6b,

    /**
     * Operation:
     *   - Divide int
     *
     * Description:
     * - Both value1 and value2 must be of type int. The values are popped from the operand stack. The int result is the value of the Java programming language expression value1 / value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.idiv
     */
    IDIV = 0x6c,

    /**
     * Operation:
     *   - Divide long
     *
     * Description:
     * - Both value1 and value2 must be of type long. The values are popped from the operand stack. The long result is the value of the Java programming language expression value1 / value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ldiv
     */
    LDIV = 0x6d,

    /**
     * Operation:
     *   - Divide float
     *
     * Description:
     * - Both value1 and value2 must be of type float. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The float result is value1' / value2'. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fdiv
     */
    FDIV = 0x6e,

    /**
     * Operation:
     *   - Divide double
     *
     * Description:
     * - Both value1 and value2 must be of type double. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The double result is value1' / value2'. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ddiv
     */
    DDIV = 0x6f,

    /**
     * Operation:
     *   - Remainder int
     *
     * Description:
     * - Both value1 and value2 must be of type int. The values are popped from the operand stack. The int result is value1 - (value1 / value2) * value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.irem
     */
    IREM = 0x70,

    /**
     * Operation:
     *   - Remainder long
     *
     * Description:
     * - Both value1 and value2 must be of type long. The values are popped from the operand stack. The long result is value1 - (value1 / value2) * value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lrem
     */
    LREM = 0x71,

    /**
     * Operation:
     *   - Remainder float
     *
     * Description:
     * - Both value1 and value2 must be of type float. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The result is calculated and pushed onto the operand stack as a float.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.frem
     */
    FREM = 0x72,

    /**
     * Operation:
     *   - Remainder double
     *
     * Description:
     * - Both value1 and value2 must be of type double. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. The result is calculated and pushed onto the operand stack as a double.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.drem
     */
    DREM = 0x73,

    /**
     * Operation:
     *   - Negate int
     *
     * Description:
     * - The value must be of type int. It is popped from the operand stack. The int result is the arithmetic negation of value, -value. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ineg
     */
    INEG = 0x74,

    /**
     * Operation:
     *   - Negate long
     *
     * Description:
     * - The value must be of type long. It is popped from the operand stack. The long result is the arithmetic negation of value, -value. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lneg
     */
    LNEG = 0x75,

    /**
     * Operation:
     *   - Negate float
     *
     * Description:
     * - The value must be of type float. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The float result is the arithmetic negation of value'. This result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fneg
     */
    FNEG = 0x76,

    /**
     * Operation:
     *   - Negate double
     *
     * Description:
     * - The value must be of type double. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. The double result is the arithmetic negation of value'. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dneg
     */
    DNEG = 0x77,

    /**
     * Operation:
     *   - Shift left int
     *
     * Description:
     * - Both value1 and value2 must be of type int. The values are popped from the operand stack. An int result is calculated by shifting value1 left by s bit positions, where s is the value of the low 5 bits of value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ishl
     */
    ISHL = 0x78,

    /**
     * Operation:
     *   - Shift left long
     *
     * Description:
     * - The value1 must be of type long, and value2 must be of type int. The values are popped from the operand stack. A long result is calculated by shifting value1 left by s bit positions, where s is the low 6 bits of value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lshl
     */
    LSHL = 0x79,

    /**
     * Operation:
     *   - Arithmetic shift right int
     *
     * Description:
     * - Both value1 and value2 must be of type int. The values are popped from the operand stack. An int result is calculated by shifting value1 right by s bit positions, with sign extension, where s is the value of the low 5 bits of value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ishr
     */
    ISHR = 0x7a,

    /**
     * Operation:
     *   - Arithmetic shift right long
     *
     * Description:
     * - The value1 must be of type long, and value2 must be of type int. The values are popped from the operand stack. A long result is calculated by shifting value1 right by s bit positions, with sign extension, where s is the value of the low 6 bits of value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lshr
     */
    LSHR = 0x7b,

    /**
     * Operation:
     *   - Logical shift right int
     *
     * Description:
     * - Both value1 and value2 must be of type int. The values are popped from the operand stack. An int result is calculated by shifting value1 right by s bit positions, with zero extension, where s is the value of the low 5 bits of value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iushr
     */
    IUSHR = 0x7c,

    /**
     * Operation:
     *   - Logical shift right long
     *
     * Description:
     * - The value1 must be of type long, and value2 must be of type int. The values are popped from the operand stack. A long result is calculated by shifting value1 right logically by s bit positions, with zero extension, where s is the value of the low 6 bits of value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lushr
     */
    LUSHR = 0x7d,

    /**
     * Operation:
     *   - Boolean AND int
     *
     * Description:
     * - Both value1 and value2 must be of type int. They are popped from the operand stack. An int result is calculated by taking the bitwise AND (conjunction) of value1 and value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iand
     */
    IAND = 0x7e,

    /**
     * Operation:
     *   - Boolean AND long
     *
     * Description:
     * - Both value1 and value2 must be of type long. They are popped from the operand stack. A long result is calculated by taking the bitwise AND of value1 and value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.land
     */
    LAND = 0x7f,

    /**
     * Operation:
     *   - Boolean OR int
     *
     * Description:
     * - Both value1 and value2 must be of type int. They are popped from the operand stack. An int result is calculated by taking the bitwise inclusive OR of value1 and value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ior
     */
    IOR = 0x80,

    /**
     * Operation:
     *   - Boolean OR long
     *
     * Description:
     * - Both value1 and value2 must be of type long. They are popped from the operand stack. A long result is calculated by taking the bitwise inclusive OR of value1 and value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lor
     */
    LOR = 0x81,

    /**
     * Operation:
     *   - Boolean XOR int
     *
     * Description:
     * - Both value1 and value2 must be of type int. They are popped from the operand stack. An int result is calculated by taking the bitwise exclusive OR of value1 and value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ixor
     */
    IXOR = 0x82,

    /**
     * Operation:
     *   - Boolean XOR long
     *
     * Description:
     * - Both value1 and value2 must be of type long. They are popped from the operand stack. A long result is calculated by taking the bitwise exclusive OR of value1 and value2. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lxor
     */
    LXOR = 0x83,

    /**
     * Operation:
     *   - Increment local variable by constant
     *
     * Operands:
     *   - `index`
     *   - `const`
     *
     * Description:
     * - The index is an unsigned byte that must be an index into the local variable array of the current frame (§2.6). The const is an immediate signed byte. The local variable at index must contain an int. The value const is first sign-extended to an int, and then the local variable at index is incremented by that amount.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.iinc
     */
    IINC = 0x84,

    /**
     * Operation:
     *   - Convert int to long
     *
     * Description:
     * - The value on the top of the operand stack must be of type int. It is popped from the operand stack and sign-extended to a long result. That result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.i2l
     */
    I2L = 0x85,

    /**
     * Operation:
     *   - Convert int to float
     *
     * Description:
     * - The value on the top of the operand stack must be of type int. It is popped from the operand stack and converted to the float result using IEEE 754 round to nearest mode. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.i2f
     */
    I2F = 0x86,

    /**
     * Operation:
     *   - Convert int to double
     *
     * Description:
     * - The value on the top of the operand stack must be of type int. It is popped from the operand stack and converted to a double result. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.i2d
     */
    I2D = 0x87,

    /**
     * Operation:
     *   - Convert long to int
     *
     * Description:
     * - The value on the top of the operand stack must be of type long. It is popped from the operand stack and converted to an int result by taking the low-order 32 bits of the long value and discarding the high-order 32 bits. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.l2i
     */
    L2I = 0x88,

    /**
     * Operation:
     *   - Convert long to float
     *
     * Description:
     * - The value on the top of the operand stack must be of type long. It is popped from the operand stack and converted to a float result using IEEE 754 round to nearest mode. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.l2f
     */
    L2F = 0x89,

    /**
     * Operation:
     *   - Convert long to double
     *
     * Description:
     * - The value on the top of the operand stack must be of type long. It is popped from the operand stack and converted to a double result using IEEE 754 round to nearest mode. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.l2d
     */
    L2D = 0x8a,

    /**
     * Operation:
     *   - Convert float to int
     *
     * Description:
     * - The value on the top of the operand stack must be of type float. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. Then value' is converted to an int result. This result is pushed onto the operand stack:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.f2i
     */
    F2I = 0x8b,

    /**
     * Operation:
     *   - Convert float to long
     *
     * Description:
     * - The value on the top of the operand stack must be of type float. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. Then value' is converted to a long result. This result is pushed onto the operand stack:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.f2l
     */
    F2L = 0x8c,

    /**
     * Operation:
     *   - Convert float to double
     *
     * Description:
     * - The value on the top of the operand stack must be of type float. It is popped from the operand stack and undergoes value set conversion (§2.8.3), resulting in value'. Then value' is converted to a double result. This result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.f2d
     */
    F2D = 0x8d,

    /**
     * Operation:
     *   - Convert double to int
     *
     * Description:
     * - The value on the top of the operand stack must be of type double. It is popped from the operand stack and undergoes value set conversion (§2.8.3) resulting in value'. Then value' is converted to an int. The result is pushed onto the operand stack:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.d2i
     */
    D2I = 0x8e,

    /**
     * Operation:
     *   - Convert double to long
     *
     * Description:
     * - The value on the top of the operand stack must be of type double. It is popped from the operand stack and undergoes value set conversion (§2.8.3) resulting in value'. Then value' is converted to a long. The result is pushed onto the operand stack:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.d2l
     */
    D2L = 0x8f,

    /**
     * Operation:
     *   - Convert double to float
     *
     * Description:
     * - The value on the top of the operand stack must be of type double. It is popped from the operand stack and undergoes value set conversion (§2.8.3) resulting in value'. Then value' is converted to a float result using IEEE 754 round to nearest mode. The result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.d2f
     */
    D2F = 0x90,

    /**
     * Operation:
     *   - Convert int to byte
     *
     * Description:
     * - The value on the top of the operand stack must be of type int. It is popped from the operand stack, truncated to a byte, then sign-extended to an int result. That result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.i2b
     */
    I2B = 0x91,

    /**
     * Operation:
     *   - Convert int to char
     *
     * Description:
     * - The value on the top of the operand stack must be of type int. It is popped from the operand stack, truncated to char, then zero-extended to an int result. That result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.i2c
     */
    I2C = 0x92,

    /**
     * Operation:
     *   - Convert int to short
     *
     * Description:
     * - The value on the top of the operand stack must be of type int. It is popped from the operand stack, truncated to a short, then sign-extended to an int result. That result is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.i2s
     */
    I2S = 0x93,

    /**
     * Operation:
     *   - Compare long
     *
     * Description:
     * - Both value1 and value2 must be of type long. They are both popped from the operand stack, and a signed integer comparison is performed. If value1 is greater than value2, the int value 1 is pushed onto the operand stack. If value1 is equal to value2, the int value 0 is pushed onto the operand stack. If value1 is less than value2, the int value -1 is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lcmp
     */
    LCMP = 0x94,

    /**
     * Operation:
     *   - Compare float
     *
     * Description:
     * - Both value1 and value2 must be of type float. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. A floating-point comparison is performed:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fcmpop
     */
    FCMPL = 0x95,

    /**
     * Operation:
     *   - Compare float
     *
     * Description:
     * - Both value1 and value2 must be of type float. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. A floating-point comparison is performed:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.fcmpop
     */
    FCMPG = 0x96,

    /**
     * Operation:
     *   - Compare double
     *
     * Description:
     * - Both value1 and value2 must be of type double. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. A floating-point comparison is performed:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dcmpop
     */
    DCMPL = 0x97,

    /**
     * Operation:
     *   - Compare double
     *
     * Description:
     * - Both value1 and value2 must be of type double. The values are popped from the operand stack and undergo value set conversion (§2.8.3), resulting in value1' and value2'. A floating-point comparison is performed:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dcmpop
     */
    DCMPG = 0x98,

    /**
     * Operation:
     *   - Branch if int comparison with zero succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The value must be of type int. It is popped from the operand stack and compared against zero. All comparisons are signed. The results of the comparisons are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ifcond
     */
    IFEQ = 0x99,

    /**
     * Operation:
     *   - Branch if int comparison with zero succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The value must be of type int. It is popped from the operand stack and compared against zero. All comparisons are signed. The results of the comparisons are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ifcond
     */
    IFNE = 0x9a,

    /**
     * Operation:
     *   - Branch if int comparison with zero succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The value must be of type int. It is popped from the operand stack and compared against zero. All comparisons are signed. The results of the comparisons are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ifcond
     */
    IFLT = 0x9b,

    /**
     * Operation:
     *   - Branch if int comparison with zero succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The value must be of type int. It is popped from the operand stack and compared against zero. All comparisons are signed. The results of the comparisons are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ifcond
     */
    IFGE = 0x9c,

    /**
     * Operation:
     *   - Branch if int comparison with zero succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The value must be of type int. It is popped from the operand stack and compared against zero. All comparisons are signed. The results of the comparisons are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ifcond
     */
    IFGT = 0x9d,

    /**
     * Operation:
     *   - Branch if int comparison with zero succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The value must be of type int. It is popped from the operand stack and compared against zero. All comparisons are signed. The results of the comparisons are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ifcond
     */
    IFLE = 0x9e,

    /**
     * Operation:
     *   - Branch if int comparison succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - Both value1 and value2 must be of type int. They are both popped from the operand stack and compared. All comparisons are signed. The results of the comparison are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.if_icmpcond
     */
    IF_ICMPEQ = 0x9f,

    /**
     * Operation:
     *   - Branch if int comparison succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - Both value1 and value2 must be of type int. They are both popped from the operand stack and compared. All comparisons are signed. The results of the comparison are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.if_icmpcond
     */
    IF_ICMPNE = 0xa0,

    /**
     * Operation:
     *   - Branch if int comparison succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - Both value1 and value2 must be of type int. They are both popped from the operand stack and compared. All comparisons are signed. The results of the comparison are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.if_icmpcond
     */
    IF_ICMPLT = 0xa1,

    /**
     * Operation:
     *   - Branch if int comparison succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - Both value1 and value2 must be of type int. They are both popped from the operand stack and compared. All comparisons are signed. The results of the comparison are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.if_icmpcond
     */
    IF_ICMPGE = 0xa2,

    /**
     * Operation:
     *   - Branch if int comparison succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - Both value1 and value2 must be of type int. They are both popped from the operand stack and compared. All comparisons are signed. The results of the comparison are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.if_icmpcond
     */
    IF_ICMPGT = 0xa3,

    /**
     * Operation:
     *   - Branch if int comparison succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - Both value1 and value2 must be of type int. They are both popped from the operand stack and compared. All comparisons are signed. The results of the comparison are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.if_icmpcond
     */
    IF_ICMPLE = 0xa4,

    /**
     * Operation:
     *   - Branch if reference comparison succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - Both value1 and value2 must be of type reference. They are both popped from the operand stack and compared. The results of the comparison are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.if_acmpcond
     */
    IF_ACMPEQ = 0xa5,

    /**
     * Operation:
     *   - Branch if reference comparison succeeds
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - Both value1 and value2 must be of type reference. They are both popped from the operand stack and compared. The results of the comparison are as follows:
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.if_acmpcond
     */
    IF_ACMPNE = 0xa6,

    /**
     * Operation:
     *   - Branch always
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The unsigned bytes branchbyte1 and branchbyte2 are used to construct a signed 16-bit branchoffset, where branchoffset is (branchbyte1 << 8) | branchbyte2. Execution proceeds at that offset from the address of the opcode of this goto instruction. The target address must be that of an opcode of an instruction within the method that contains this goto instruction.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.goto
     */
    GOTO = 0xa7,

    /**
     * Operation:
     *   - Jump subroutine
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The address of the opcode of the instruction immediately following this jsr instruction is pushed onto the operand stack as a value of type returnAddress. The unsigned branchbyte1 and branchbyte2 are used to construct a signed 16-bit offset, where the offset is (branchbyte1 << 8) | branchbyte2. Execution proceeds at that offset from the address of this jsr instruction. The target address must be that of an opcode of an instruction within the method that contains this jsr instruction.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.jsr
     */
    JSR = 0xa8,

    /**
     * Operation:
     *   - Return from subroutine
     *
     * Operands:
     *   - `index`
     *
     * Description:
     * - The index is an unsigned byte between 0 and 255, inclusive. The local variable at index in the current frame (§2.6) must contain a value of type returnAddress. The contents of the local variable are written into the Java Virtual Machine's pc register, and execution continues there.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ret
     */
    RET = 0xa9,

    /**
     * Operation:
     *   - Access jump table by index and jump
     *
     * Operands:
     *   - `<0-3 byte pad>`
     *   - `defaultbyte1`
     *   - `defaultbyte2`
     *   - `defaultbyte3`
     *   - `defaultbyte4`
     *   - `lowbyte1`
     *   - `lowbyte2`
     *   - `lowbyte3`
     *   - `lowbyte4`
     *   - `highbyte1`
     *   - `highbyte2`
     *   - `highbyte3`
     *   - `highbyte4`
     *   - `jump offsets...`
     *
     * Description:
     * - A tableswitch is a variable-length instruction. Immediately after the tableswitch opcode, between zero and three bytes must act as padding, such that defaultbyte1 begins at an address that is a multiple of four bytes from the start of the current method (the opcode of its first instruction). Immediately after the padding are bytes constituting three signed 32-bit values: default, low, and high. Immediately following are bytes constituting a series of high - low + 1 signed 32-bit offsets. The value low must be less than or equal to high. The high - low + 1 signed 32-bit offsets are treated as a 0-based jump table. Each of these signed 32-bit values is constructed as (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.tableswitch
     */
    TABLESWITCH = 0xaa,

    /**
     * Operation:
     *   - Access jump table by key match and jump
     *
     * Operands:
     *   - `<0-3 byte pad>`
     *   - `defaultbyte1`
     *   - `defaultbyte2`
     *   - `defaultbyte3`
     *   - `defaultbyte4`
     *   - `npairs1`
     *   - `npairs2`
     *   - `npairs3`
     *   - `npairs4`
     *   - `match-offset pairs...`
     *
     * Description:
     * - A lookupswitch is a variable-length instruction. Immediately after the lookupswitch opcode, between zero and three bytes must act as padding, such that defaultbyte1 begins at an address that is a multiple of four bytes from the start of the current method (the opcode of its first instruction). Immediately after the padding follow a series of signed 32-bit values: default, npairs, and then npairs pairs of signed 32-bit values. The npairs must be greater than or equal to 0. Each of the npairs pairs consists of an int match and a signed 32-bit offset. Each of these signed 32-bit values is constructed from four unsigned bytes as (byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lookupswitch
     */
    LOOKUPSWITCH = 0xab,

    /**
     * Operation:
     *   - Return int from method
     *
     * Description:
     * - The current method must have return type boolean, byte, short, char, or int. The value must be of type int. If the current method is a synchronized method, the monitor entered or reentered on invocation of the method is updated and possibly exited as if by execution of a monitorexit instruction (§monitorexit) in the current thread. If no exception is thrown, value is popped from the operand stack of the current frame (§2.6) and pushed onto the operand stack of the frame of the invoker. Any other values on the operand stack of the current method are discarded.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ireturn
     */
    IRETURN = 0xac,

    /**
     * Operation:
     *   - Return long from method
     *
     * Description:
     * - The current method must have return type long. The value must be of type long. If the current method is a synchronized method, the monitor entered or reentered on invocation of the method is updated and possibly exited as if by execution of a monitorexit instruction (§monitorexit) in the current thread. If no exception is thrown, value is popped from the operand stack of the current frame (§2.6) and pushed onto the operand stack of the frame of the invoker. Any other values on the operand stack of the current method are discarded.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.lreturn
     */
    LRETURN = 0xad,

    /**
     * Operation:
     *   - Return float from method
     *
     * Description:
     * - The current method must have return type float. The value must be of type float. If the current method is a synchronized method, the monitor entered or reentered on invocation of the method is updated and possibly exited as if by execution of a monitorexit instruction (§monitorexit) in the current thread. If no exception is thrown, value is popped from the operand stack of the current frame (§2.6) and undergoes value set conversion (§2.8.3), resulting in value'. The value' is pushed onto the operand stack of the frame of the invoker. Any other values on the operand stack of the current method are discarded.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.freturn
     */
    FRETURN = 0xae,

    /**
     * Operation:
     *   - Return double from method
     *
     * Description:
     * - The current method must have return type double. The value must be of type double. If the current method is a synchronized method, the monitor entered or reentered on invocation of the method is updated and possibly exited as if by execution of a monitorexit instruction (§monitorexit) in the current thread. If no exception is thrown, value is popped from the operand stack of the current frame (§2.6) and undergoes value set conversion (§2.8.3), resulting in value'. The value' is pushed onto the operand stack of the frame of the invoker. Any other values on the operand stack of the current method are discarded.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.dreturn
     */
    DRETURN = 0xaf,

    /**
     * Operation:
     *   - Return reference from method
     *
     * Description:
     * - The objectref must be of type reference and must refer to an object of a type that is assignment compatible (JLS §5.2) with the type represented by the return descriptor (§4.3.3) of the current method. If the current method is a synchronized method, the monitor entered or reentered on invocation of the method is updated and possibly exited as if by execution of a monitorexit instruction (§monitorexit) in the current thread. If no exception is thrown, objectref is popped from the operand stack of the current frame (§2.6) and pushed onto the operand stack of the frame of the invoker. Any other values on the operand stack of the current method are discarded.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.areturn
     */
    ARETURN = 0xb0,

    /**
     * Operation:
     *   - Return void from method
     *
     * Description:
     * - The current method must have return type void. If the current method is a synchronized method, the monitor entered or reentered on invocation of the method is updated and possibly exited as if by execution of a monitorexit instruction (§monitorexit) in the current thread. If no exception is thrown, any values on the operand stack of the current frame (§2.6) are discarded.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.return
     */
    RETURN = 0xb1,

    /**
     * Operation:
     *   - Get static field from class
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at that index must be a symbolic reference to a field (§5.1), which gives the name and descriptor of the field as well as a symbolic reference to the class or interface in which the field is to be found. The referenced field is resolved (§5.4.3.2).
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.getstatic
     */
    GETSTATIC = 0xb2,

    /**
     * Operation:
     *   - Set static field in class
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at that index must be a symbolic reference to a field (§5.1), which gives the name and descriptor of the field as well as a symbolic reference to the class or interface in which the field is to be found. The referenced field is resolved (§5.4.3.2).
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.putstatic
     */
    PUTSTATIC = 0xb3,

    /**
     * Operation:
     *   - Fetch field from object
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The objectref, which must be of type reference, is popped from the operand stack. The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at that index must be a symbolic reference to a field (§5.1), which gives the name and descriptor of the field as well as a symbolic reference to the class in which the field is to be found. The referenced field is resolved (§5.4.3.2). The value of the referenced field in objectref is fetched and pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.getfield
     */
    GETFIELD = 0xb4,

    /**
     * Operation:
     *   - Set field in object
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at that index must be a symbolic reference to a field (§5.1), which gives the name and descriptor of the field as well as a symbolic reference to the class in which the field is to be found. The class of objectref must not be an array. If the field is protected, and it is a member of a superclass of the current class, and the field is not declared in the same run-time package (§5.3) as the current class, then the class of objectref must be either the current class or a subclass of the current class.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.putfield
     */
    PUTFIELD = 0xb5,

    /**
     * Operation:
     *   - Invoke instance method; dispatch based on class
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at that index must be a symbolic reference to a method (§5.1), which gives the name and descriptor (§4.3.3) of the method as well as a symbolic reference to the class in which the method is to be found. The named method is resolved (§5.4.3.3).
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.invokevirtual
     */
    INVOKEVIRTUAL = 0xb6,

    /**
     * Operation:
     *   - Invoke instance method; special handling for superclass, private, and instance initialization method invocations
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at that index must be a symbolic reference to a method or an interface method (§5.1), which gives the name and descriptor (§4.3.3) of the method as well as a symbolic reference to the class or interface in which the method is to be found. The named method is resolved (§5.4.3.3, §5.4.3.4).
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.invokespecial
     */
    INVOKESPECIAL = 0xb7,

    /**
     * Operation:
     *   - Invoke a class (static) method
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at that index must be a symbolic reference to a method or an interface method (§5.1), which gives the name and descriptor (§4.3.3) of the method as well as a symbolic reference to the class or interface in which the method is to be found. The named method is resolved (§5.4.3.3).
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.invokestatic
     */
    INVOKESTATIC = 0xb8,

    /**
     * Operation:
     *   - Invoke interface method
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *   - `count`
     *   - `0`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at that index must be a symbolic reference to an interface method (§5.1), which gives the name and descriptor (§4.3.3) of the interface method as well as a symbolic reference to the interface in which the interface method is to be found. The named interface method is resolved (§5.4.3.4).
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.invokeinterface
     */
    INVOKEINTERFACE = 0xb9,

    /**
     * Operation:
     *   - Invoke dynamic method
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *   - `0`
     *   - `0`
     *
     * Description:
     * - Each specific lexical occurrence of an invokedynamic instruction is called a dynamic call site.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.invokedynamic
     */
    INVOKEDYNAMIC = 0xba,

    /**
     * Operation:
     *   - Create new object
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at the index must be a symbolic reference to a class or interface type. The named class or interface type is resolved (§5.4.3.1) and should result in a class type. Memory for a new instance of that class is allocated from the garbage-collected heap, and the instance variables of the new object are initialized to their default initial values (§2.3, §2.4). The objectref, a reference to the instance, is pushed onto the operand stack.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.new
     */
    NEW = 0xbb,

    /**
     * Operation:
     *   - Create new array
     *
     * Operands:
     *   - `atype`
     *
     * Description:
     * - The count must be of type int. It is popped off the operand stack. The count represents the number of elements in the array to be created.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.newarray
     */
    NEWARRAY = 0xbc,

    /**
     * Operation:
     *   - Create new array of reference
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The count must be of type int. It is popped off the operand stack. The count represents the number of components of the array to be created. The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at that index must be a symbolic reference to a class, array, or interface type. The named class, array, or interface type is resolved (§5.4.3.1). A new array with components of that type, of length count, is allocated from the garbage-collected heap, and a reference arrayref to this new array object is pushed onto the operand stack. All components of the new array are initialized to null, the default value for reference types (§2.4).
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.anewarray
     */
    ANEWARRAY = 0xbd,

    /**
     * Operation:
     *   - Get length of array
     *
     * Description:
     * - The arrayref must be of type reference and must refer to an array. It is popped from the operand stack. The length of the array it references is determined. That length is pushed onto the operand stack as an int.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.arraylength
     */
    ARRAYLENGTH = 0xbe,

    /**
     * Operation:
     *   - Throw exception or error
     *
     * Description:
     * - The objectref must be of type reference and must refer to an object that is an instance of class Throwable or of a subclass of Throwable. It is popped from the operand stack. The objectref is then thrown by searching the current method (§2.6) for the first exception handler that matches the class of objectref, as given by the algorithm in §2.10.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.athrow
     */
    ATHROW = 0xbf,

    /**
     * Operation:
     *   - Check whether object is of given type
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The objectref must be of type reference. The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at the index must be a symbolic reference to a class, array, or interface type.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.checkcast
     */
    CHECKCAST = 0xc0,

    /**
     * Operation:
     *   - Determine if object is of given type
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *
     * Description:
     * - The objectref, which must be of type reference, is popped from the operand stack. The unsigned indexbyte1 and indexbyte2 are used to construct an index into the run-time constant pool of the current class (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The run-time constant pool item at the index must be a symbolic reference to a class, array, or interface type.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.instanceof
     */
    INSTANCEOF = 0xc1,

    /**
     * Operation:
     *   - Enter monitor for object
     *
     * Description:
     * - The objectref must be of type reference.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.monitorenter
     */
    MONITORENTER = 0xc2,

    /**
     * Operation:
     *   - Exit monitor for object
     *
     * Description:
     * - The objectref must be of type reference.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.monitorexit
     */
    MONITOREXIT = 0xc3,

    /**
      * Operation:
      *  - Extend local variable index by additional bytes
      *
      * Operands: (if `<opcode>` is one of iload, fload, aload, lload, dload, istore, fstore, astore, lstore, dstore, or ret)
      *   - `<opcode>`
      *   - `indexbyte1`
      *   - `indexbyte2`
      *
      * Operands: (if opcode is iinc)
      *   - `iinc`
      *   - `indexbyte1`
      *   - `indexbyte2`
      *   - `constbyte1`
      *   - `constbyte2`
      *
      * Description:
      *  - The wide instruction modifies the behavior of another instruction. It takes one of two formats, depending on the instruction being modified. The first form of the wide instruction modifies one of the instructions iload, fload, aload, lload, dload, istore, fstore, astore, lstore, dstore, or ret (§iload, §fload, §aload, §lload, §dload, §istore, §fstore, §astore, §lstore, §dstore, §ret). The second form applies only to the iinc instruction (§iinc). In either case, the wide opcode itself is followed in the compiled code by the opcode of the instruction wide modifies. In either form, two unsigned bytes indexbyte1 and indexbyte2 follow the modified opcode and are assembled into a 16-bit unsigned index to a local variable in the current frame (§2.6), where the value of the index is (indexbyte1 << 8) | indexbyte2. The calculated index must be an index into the local variable array of the current frame. Where the wide instruction modifies an lload, dload, lstore, or dstore instruction, the index following the calculated index (index + 1) must also be an index into the local variable array. In the second form, two immediate unsigned bytes constbyte1 and constbyte2 follow indexbyte1 and indexbyte2 in the code stream. Those bytes are also assembled into a signed 16-bit constant, where the constant is (constbyte1 << 8) | constbyte2. The widened bytecode operates as normal, except for the use of the wider index and, in the case of the second form, the larger increment range.
    *
    * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.wide
    */
    WIDE = 0xc4,

    /**
     * Operation:
     *   - Create new multidimensional array
     *
     * Operands:
     *   - `indexbyte1`
     *   - `indexbyte2`
     *   - `dimensions`
     *
     * Description:
     * - The dimensions operand is an unsigned byte that must be greater than or equal to 1. It represents the number of dimensions of the array to be created. The operand stack must contain dimensions values. Each such value represents the number of components in a dimension of the array to be created, must be of type int, and must be non-negative. The count1 is the desired length in the first dimension, count2 in the second, etc.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.multianewarray
     */
    MULTIANEWARRAY = 0xc5,

    /**
     * Operation:
     *   - Branch if reference is null
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The value must of type reference. It is popped from the operand stack. If value is null, the unsigned branchbyte1 and branchbyte2 are used to construct a signed 16-bit offset, where the offset is calculated to be (branchbyte1 << 8) | branchbyte2. Execution then proceeds at that offset from the address of the opcode of this ifnull instruction. The target address must be that of an opcode of an instruction within the method that contains this ifnull instruction.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ifnull
     */
    IFNULL = 0xc6,

    /**
     * Operation:
     *   - Branch if reference not null
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *
     * Description:
     * - The value must be of type reference. It is popped from the operand stack. If value is not null, the unsigned branchbyte1 and branchbyte2 are used to construct a signed 16-bit offset, where the offset is calculated to be (branchbyte1 << 8) | branchbyte2. Execution then proceeds at that offset from the address of the opcode of this ifnonnull instruction. The target address must be that of an opcode of an instruction within the method that contains this ifnonnull instruction.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.ifnonnull
     */
    IFNONNULL = 0xc7,

    /**
     * Operation:
     *   - Branch always (wide index)
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *   - `branchbyte3`
     *   - `branchbyte4`
     *
     * Description:
     * - The unsigned bytes branchbyte1, branchbyte2, branchbyte3, and branchbyte4 are used to construct a signed 32-bit branchoffset, where branchoffset is (branchbyte1 << 24) | (branchbyte2 << 16) | (branchbyte3 << 8) | branchbyte4. Execution proceeds at that offset from the address of the opcode of this goto_w instruction. The target address must be that of an opcode of an instruction within the method that contains this goto_w instruction.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.goto_w
     */
    GOTO_W = 0xc8,

    /**
     * Operation:
     *   - Jump subroutine (wide index)
     *
     * Operands:
     *   - `branchbyte1`
     *   - `branchbyte2`
     *   - `branchbyte3`
     *   - `branchbyte4`
     *
     * Description:
     * - The address of the opcode of the instruction immediately following this jsr_w instruction is pushed onto the operand stack as a value of type returnAddress. The unsigned branchbyte1, branchbyte2, branchbyte3, and branchbyte4 are used to construct a signed 32-bit offset, where the offset is (branchbyte1 << 24) | (branchbyte2 << 16) | (branchbyte3 << 8) | branchbyte4. Execution proceeds at that offset from the address of this jsr_w instruction. The target address must be that of an opcode of an instruction within the method that contains this jsr_w instruction.
     *
     * See more: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5.jsr_w
     */
    JSR_W = 0xc9,
    BREAKPOINT = 0xca,
    IMPDEP1 = 0xfe,
    IMPDEP2 = 0xff
  }
}