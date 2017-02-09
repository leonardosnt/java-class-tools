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

import ByteBuffer from 'bytebuffer';
import ConstantType from './constant-type';

/**
 * All objects (structure) MUST follow Jvm8 specification.
 * 
 * @see https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html
 */
class JavaClassFileWriter {

  /**
   * Write ClassFile object to a ByteBuffer.
   * The classFile object must follow this structure
   * https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.1
   *
   * @param {Object} classFile - The classFile object.
   * @return {ByteBuffer}
   */
  write(classFile) {
    this.buf = new ByteBuffer();
    this.classFile = classFile;

    this.buf.writeUint8(0xCA);
    this.buf.writeUint8(0xFE);
    this.buf.writeUint8(0xBA);
    this.buf.writeUint8(0xBE);

    this.buf.writeUint16(classFile.minor_version);
    this.buf.writeUint16(classFile.major_version);

    this.buf.writeInt16(classFile.constant_pool_count);
    this._writeConstantPool(classFile.constant_pool);

    this.buf.writeUint16(classFile.access_flags);
    this.buf.writeUint16(classFile.this_class);
    this.buf.writeUint16(classFile.super_class);

    this.buf.writeUint16(classFile.interfaces_count);
    this._writeInterfaces(classFile.interfaces);

    this.buf.writeUint16(classFile.fields_count);
    this._writeCommonFieldMethodArray(classFile.fields);

    this.buf.writeUint16(classFile.methods_count);
    this._writeCommonFieldMethodArray(classFile.methods);

    this.buf.writeUint16(classFile.attributes_count);
    this._writeAttributeInfoArray(classFile.attributes);

    this.buf.buffer = this.buf.buffer.slice(0, this.buf.offset);
    return this.buf;
  }

  _writeCommonFieldMethodArray(array) {
    for (var i = 0; i < array.length; i++) {
      const entry = array[i];

      this.buf.writeUint16(entry.access_flags);
      this.buf.writeUint16(entry.name_index);
      this.buf.writeUint16(entry.descriptor_index);
      this.buf.writeUint16(entry.attributes_count);
      this._writeAttributeInfoArray(entry.attributes);
    }
  }

  _writeAttributeInfoArray(attributes) {
    for (var i = 0; i < attributes.length; i++) {
      this._writeAttributeInfo(attributes[i]);
    }
  }

  _writeAttributeAnnotation(annotation) {
    this.buf.writeUint16(annotation.type_index);
    this.buf.writeUint16(annotation.num_element_value_pairs);

    for (var i = 0; i < annotation.num_element_value_pairs; i++) {
      const element = annotation.element_value_pairs[i];

      this.buf.writeUint16(element.element_name_index);
      this._writeElementValue(element.element_value);
    }
  }

  _writeElementValue(element_value) {
    this.buf.writeUint8(element_value.tag);

    const value = element_value.value;
    switch (element_value.tag) {
      case 101: // e
        this.buf.writeUint16(value.enum_const_value.type_name_index);
        this.buf.writeUint16(value.enum_const_value.const_name_index);
        break;

      case 99: // c
        this.buf.writeUint16(value.class_info_index);
        break;

      case 91: // [
        this.buf.writeUint16(value.array_value.num_values);

        for (var i = 0; i < value.array_value.num_values; i++) {
          this._writeElementValue(value.array_value.values[i]);
        }
        break;

      case 64:
        this._writeAttributeAnnotation(value.annotation);
        break;

      case 66: // B
      case 67: // C
      case 68: // D
      case 70: // F
      case 73: // I
      case 74: // J
      case 83: // S
      case 90: // Z
      case 115:// s
        this.buf.writeUint16(value.const_value_index);
        break;

      default:
        throw `Unexpected tag: ${element_value.tag}`;
    }
  }

  _writeTypeAnnotation(type_annotation) {
    this.buf.writeUint8(type_annotation.target_type);

    switch (type_annotation.target_type) {
      // type_parameter_target
      case 0x00: case 0x01:
        this.buf.writeUint8(type_annotation.target_info.type_parameter_index);
        break;

      // supertype_target
      case 0x10:
        this.buf.writeUint16(type_annotation.target_info.supertype_index);
        break;

      // type_parameter_bound_target
      case 0x11: case 0x12:
        this.buf.writeUint8(type_annotation.target_info.type_parameter_index);
        this.buf.writeUint8(type_annotation.target_info.bound_index);
        break;

      // empty_target
      case 0x13: case 0x14: case 0x15:
        break;

      // formal_parameter_target
      case 0x16:
        this.buf.writeUint8(type_annotation.target_info.formal_parameter_index);
        break;

      // throws_target
      case 0x17:
        this.buf.writeUint16(type_annotation.target_info.throws_type_index);
        break;

      // localvar_target
      case 0x40: case 0x41:
        this.buf.writeUint16(type_annotation.target_info.table_length);

        for (var i = 0; i < type_annotation.target_info.table_length; i++) {
          const table_entry = type_annotation.target_info.table[i];

          this.buf.writeUint16(table_entry.start_pc);
          this.buf.writeUint16(table_entry.length);
          this.buf.writeUint16(table_entry.index);
        }
        break;

      // catch_target
      case 0x42:
        this.buf.writeUint16(type_annotation.target_info.exception_table_index);
        break;

      // offset_target
      case 0x43: case 0x44: case 0x45: case 0x46:
        this.buf.writeUint16(type_annotation.target_info.offset);
        break;

      // type_argument_target
      case 0x47: case 0x48: case 0x49: case 0x4A: case 0x4B:
        this.buf.writeUint16(type_annotation.target_info.offset);
        this.buf.writeUint8(type_annotation.target_info.type_argument_index);
        break;

      default:
        throw `Unexpected target_type: ${type_annotation.target_type}`;
    }

    this.buf.writeUint8(type_annotation.type_path.path_length);

    for (var i = 0; i < type_annotation.type_path.path_length; i++) {
      const path_entry = type_annotation.type_path.path[i];

      this.buf.writeUint8(path_entry.type_path_kind);
      this.buf.writeUint8(path_entry.type_argument_index);
    }

    this.buf.writeUint16(type_annotation.type_index);
    this.buf.writeUint16(type_annotation.num_element_value_pairs);

    for (var i = 0; i < type_annotation.num_element_value_pairs; i++) {
      const element_value_entry = type_annotation.element_value_pairs[i];

      this.buf.writeUint16(element_value_entry.element_name_index);
      this._writeElementValue(element_value_entry.element_value);
    }
  }

  _writeAttributeInfo(attribute_info) {
    this.buf.writeUint16(attribute_info.attribute_name_index);
    this.buf.writeUint32(attribute_info.attribute_length);

    let attributeNameBytes = this.classFile.constant_pool[attribute_info.attribute_name_index].bytes;
    let attributeName = String.fromCharCode.apply(null, attributeNameBytes); // TODO: is this safe?

    switch (attributeName) {
      case 'RuntimeInvisibleAnnotations':
      case 'RuntimeVisibleAnnotations':
        this.buf.writeUint16(attribute_info.num_annotations);

        for (var i = 0; i < attribute_info.num_annotations; i++) {
          this._writeAttributeAnnotation(attribute_info.annotations[i]);
        }
        break;

      // There's no additional information
      case 'Deprecated':
      case 'Synthetic':
        break;

      case 'InnerClasses':
        this.buf.writeUint16(attribute_info.number_of_classes);

        for (var i = 0; i < attribute_info.number_of_classes; i++) {
          const inner_class = attribute_info.classes[i];

          this.buf.writeUint16(inner_class.inner_class_info_index);
          this.buf.writeUint16(inner_class.outer_class_info_index);
          this.buf.writeUint16(inner_class.inner_name_index);
          this.buf.writeUint16(inner_class.inner_class_access_flags);
        }
        break;

      case 'LocalVariableTable':
        this.buf.writeUint16(attribute_info.local_variable_table_length);

        for (var i = 0; i < attribute_info.local_variable_table_length; i++) {
          const local_variable = attribute_info.local_variable_table[i];

          this.buf.writeUint16(local_variable.start_pc);
          this.buf.writeUint16(local_variable.length);
          this.buf.writeUint16(local_variable.name_index);
          this.buf.writeUint16(local_variable.descriptor_index);
          this.buf.writeUint16(local_variable.index);
        }
        break;

      case 'LocalVariableTypeTable':
        this.buf.writeUint16(attribute_info.local_variable_type_table_length);

        for (var i = 0; i < attribute_info.local_variable_type_table_length; i++) {
          const local_variable_type = attribute_info.local_variable_type_table[i];

          this.buf.writeUint16(local_variable_type.start_pc);
          this.buf.writeUint16(local_variable_type.length);
          this.buf.writeUint16(local_variable_type.name_index);
          this.buf.writeUint16(local_variable_type.signature_index);
          this.buf.writeUint16(local_variable_type.index);
        }
        break;

      case 'RuntimeInvisibleParameterAnnotations':
      case 'RuntimeVisibleParameterAnnotations':
        this.buf.writeUint8(attribute_info.num_parameters);

        for (var i = 0; i < attribute_info.num_parameters; i++) {
          const parameter_annotation = attribute_info.parameter_annotations[i];
          this.buf.writeUint16(parameter_annotation.num_annotations);

          for (var j = 0; j < parameter_annotation.num_annotations; j++) {
            this._writeAttributeAnnotation(parameter_annotation.annotations[j]);
          }
        }
        break;

      case 'BootstrapMethods':
        this.buf.writeUint16(attribute_info.num_bootstrap_methods);

        for (var i = 0; i < attribute_info.num_bootstrap_methods; i++) {
          const bootstrap_method = attribute_info.bootstrap_methods[i];

          this.buf.writeUint16(bootstrap_method.bootstrap_method_ref);
          this.buf.writeUint16(bootstrap_method.num_bootstrap_arguments);

          for (var j = 0; j < bootstrap_method.num_bootstrap_arguments; j++) {
            this.buf.writeUint16(bootstrap_method.bootstrap_arguments[j]);
          }
        }
        break;

      case 'RuntimeInvisibleTypeAnnotations':
      case 'RuntimeVisibleTypeAnnotations':
        this.buf.writeUint16(attribute_info.num_annotations);

        for (var i = 0; i < attribute_info.num_annotations; i++) {
          this._writeTypeAnnotation(attribute_info.annotations[i]);
        }
        break;

      case 'SourceDebugExtension':
        for (var i = 0; i < attribute_info.attribute_length; i++) {
          this.buf.writeUint8(attribute_info.debug_extension[i]);
        }
        break;

      case 'SourceFile':
        this.buf.writeUint16(attribute_info.sourcefile_index);
        break;

      case 'EnclosingMethod':
        this.buf.writeUint16(attribute_info.class_index);
        this.buf.writeUint16(attribute_info.method_index);
        break;

      case 'AnnotationDefault':
        this._writeElementValue(attribute_info.default_value);
        break;

      case 'MethodParameters':
        this.buf.writeUint16(attribute_info.parameters_count);

        for (var i = 0; i < attribute_info.parameters_count; i++) {
          const parameter = attribute_info.parameters[i];

          this.buf.writeUint16(parameter.name_index);
          this.buf.writeUint16(parameter.access_flags);
        }
        break;

      case 'Exceptions':
        this.buf.writeUint16(attribute_info.number_of_exceptions);

        for (var i = 0; i < attribute_info.number_of_exceptions; i++) {
          this.buf.writeUint16(attribute_info.exception_index_table[i])
        }
        break;

      case 'ConstantValue':
        this.buf.writeUint16(attribute_info.constantvalue_index);
        break;

      case 'Signature':
        this.buf.writeUint16(attribute_info.signature_index);
        break;

      case 'StackMapTable': {
        this.buf.writeUint16(attribute_info.number_of_entries);

        for (var i = 0; i < attribute_info.number_of_entries; i++) {
          const stack_map_frame = attribute_info.entries[i];
          const frame_type = stack_map_frame.frame_type;

          this.buf.writeUint8(frame_type);

          // SAME_LOCALS_1_STACK_ITEM
          if (frame_type >= 64 &&  frame_type <= 127) {
            this._writeVerificationTypeInfo(stack_map_frame.stack[0]);
          }
          // SAME_LOCALS_1_STACK_ITEM_EXTENDED
          else if (stack_map_frame.frame_type == 247) {
            this.buf.writeUint16(stack_map_frame.offset_delta);
            this._writeVerificationTypeInfo(stack_map_frame.stack[0]);
          }
          // CHOP = 248-250, SAME_FRAME_EXTENDED = 251
          else if (frame_type >= 248 && frame_type <= 251) {
            this.buf.writeUint16(stack_map_frame.offset_delta);
          }
          // APPEND
          else if (frame_type >= 252 && frame_type <= 254) {
            this.buf.writeUint16(stack_map_frame.offset_delta);

            const number_of_locals = frame_type - 251;
            for (var j = 0; j < number_of_locals; j++) {
              this._writeVerificationTypeInfo(stack_map_frame.locals[j]);
            }
          }
          // FULL_FRAME
          else if (frame_type == 255) {
            this.buf.writeUint16(stack_map_frame.offset_delta);
            this.buf.writeUint16(stack_map_frame.number_of_locals);

            for (var j = 0; j < stack_map_frame.number_of_locals; j++) {
              this._writeVerificationTypeInfo(stack_map_frame.locals[j]);
            }

            this.buf.writeUint16(stack_map_frame.number_of_stack_items);

            for (var j = 0; j < stack_map_frame.number_of_stack_items; j++) {
              this._writeVerificationTypeInfo(stack_map_frame.stack[j]);
            }
          }
        }
        break;
      }

      case 'Code':
        this.buf.writeUint16(attribute_info.max_stack);
        this.buf.writeUint16(attribute_info.max_locals);
        this.buf.writeUint32(attribute_info.code_length);

        for (var i = 0; i < attribute_info.code_length; i++) {
          this.buf.writeUint8(attribute_info.code[i]);
        }

        this.buf.writeUint16(attribute_info.exception_table_length);

        for (var i = 0; i < attribute_info.exception_table_length; i++) {
          const exception_entry = attribute_info.exception_table[i];

          this.buf.writeUint16(exception_entry.start_pc);
          this.buf.writeUint16(exception_entry.end_pc);
          this.buf.writeUint16(exception_entry.handler_pc);
          this.buf.writeUint16(exception_entry.catch_type);
        }

        this.buf.writeUint16(attribute_info.attributes_count);
        this._writeAttributeInfoArray(attribute_info.attributes);
        break;

      case 'LineNumberTable':
        this.buf.writeUint16(attribute_info.line_number_table_length);

        for (var i = 0; i < attribute_info.line_number_table_length; i++) {
          const line_number = attribute_info.line_number_table[i];

          this.buf.writeUint16(line_number.start_pc);
          this.buf.writeUint16(line_number.line_number);
        }
        break;

      default:
        throw `Unexpected attributeName: ${attributeName}`;
    }
  }

  _writeVerificationTypeInfo(type_info) {
    this.buf.writeUint8(type_info.tag);
    if (type_info.tag == 7) {
      this.buf.writeUint16(type_info.cpool_index);
    } else if (type_info.tag == 8) {
      this.buf.writeUint16(type_info.offset);
    }
  }

  _writeInterfaces(interfaces) {
    for (var i = 0; i < interfaces.length; i++) {
      this.buf.writeUint16(interfaces[i]);
    }
  }

  _writeConstantPool(constant_pool) {
    for (var i = 1; i < constant_pool.length; i++) {
      const entry = constant_pool[i];

      if (entry !== undefined) {
        this._writeConstantPoolEntry(entry);
      }
    }
  }

  _writeConstantPoolEntry(entry) {
    this.buf.writeUint8(entry.tag);

    switch (entry.tag) {
      case ConstantType.UTF8: {
        this.buf.writeUint16(entry.length);

        for (var i = 0; i < entry.length; i++) {
          this.buf.writeUint8(entry.bytes[i]);
        }
        break;
      }

      case ConstantType.INTEGER:
      case ConstantType.FLOAT:
        this.buf.writeUint32(entry.bytes);
        break;

      case ConstantType.LONG:
      case ConstantType.DOUBLE:
        this.buf.writeUint32(entry.high_bytes);
        this.buf.writeUint32(entry.low_bytes);
        break;

      case ConstantType.CLASS:
        this.buf.writeUint16(entry.name_index);
        break;

      case ConstantType.STRING:
        this.buf.writeUint16(entry.string_index);
        break;

      case ConstantType.FIELDREF:
      case ConstantType.METHODREF:
      case ConstantType.INTERFACE_METHODREF:
        this.buf.writeUint16(entry.class_index);
        this.buf.writeUint16(entry.name_and_type_index);
        break;

      case ConstantType.NAME_AND_TYPE:
        this.buf.writeUint16(entry.name_index);
        this.buf.writeUint16(entry.descriptor_index);
        break;

      case ConstantType.METHOD_HANDLE:
        this.buf.writeUint8(entry.reference_kind);
        this.buf.writeUint16(entry.reference_index);
        break;

      case ConstantType.METHOD_TYPE:
        this.buf.writeUint16(entry.descriptor_index);
        break;

      case ConstantType.INVOKE_DYNAMIC:
        this.buf.writeUint16(entry.bootstrap_method_attr_index);
        this.buf.writeUint16(entry.name_and_type_index);
        break;

      default:
        throw 'Unexpected tag: ' + cp_info.tag;
    }

  }
}

module.exports = JavaClassFileWriter;