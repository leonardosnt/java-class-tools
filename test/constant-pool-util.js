'use strict';

module.exports = {
  /**
   * Get IEEE 754 float from constant_pool
   * 
   * See https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.4
   */
  getFloat: function(classFile, index) {
    return this.u32ToFloat(classFile.constant_pool[index].bytes);
  },

  /**
   * Converts 32-bit integer to IEEE 754 float as described in
   * https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.4
   */
  u32ToFloat: function(bits) {
    if (bits == 0x7f800000) {
      return Number.POSITIVE_INFINITY;
    }
    if (bits == 0xff800000) {
      return Number.NEGATIVE_INFINITY;
    }
    if ((bits >= 0xff800001 && bits <= 0xffffffff) || (bits >= 0x7f800001 && bits <= 0x7fffffff)) {
      return Number.NaN;
    }

    let s = ((bits >> 31) == 0) ? 1 : -1;
    let e = ((bits >> 23) & 0xff);
    let m = (e == 0) ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000;
    return s * m * Math.pow(2, e - 150)
  },

  bytesToString: function(bytes) {
    return String.fromCharCode.apply(null, bytes);
  },

  getString: function(classFile, index) {
    let cp_entry = classFile.constant_pool[index];
    return this.bytesToString(cp_entry.bytes)
  }
}