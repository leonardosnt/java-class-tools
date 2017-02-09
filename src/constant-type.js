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
