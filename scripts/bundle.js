(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\base64-js\\lib\\b64.js","/..\\node_modules\\base64-js\\lib")
},{"buffer":2,"qC859L":4}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\buffer\\index.js","/..\\node_modules\\buffer")
},{"base64-js":1,"buffer":2,"ieee754":3,"qC859L":4}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\ieee754\\index.js","/..\\node_modules\\ieee754")
},{"buffer":2,"qC859L":4}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/..\\node_modules\\process\\browser.js","/..\\node_modules\\process")
},{"buffer":2,"qC859L":4}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function AcceptCookies(selector) {
    var that = this;
    this.$parent = $(selector);
    if (this.$parent[0]) {
        this.init(that);
    }
}

AcceptCookies.prototype.init = function (that) {
    this.elems = {
        $actionBtn: this.$parent.find('.accept-cookies__action')
    };

    this.elems.$actionBtn.on('click', function(e) {
        that.hideBlock(e);
    })
};
AcceptCookies.prototype.hideBlock = function(e) {
    e.preventDefault();
    this.$parent.fadeOut(400, function() {
        $(this).addClass("hidden");
    });
};


module.exports = AcceptCookies;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/acceptCookies.js","/")
},{"buffer":2,"qC859L":4}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function AdvantagesTabs (parent) {
    var that = this;
    this.parent = parent;
    this.$parent = $(parent);

    if (this.$parent[0]) {
        this.init(that);
    }
}

AdvantagesTabs.prototype.init = function (that) {
    this.elements = {
        $advNavItem:           this.$parent.find(".advantages-nav li"),
        $advItems:             this.$parent.find(".advantages-items"),
        $advItem:              this.$parent.find(".advantages-item"),
        $advBottomChange:      this.$parent.find(".advantages-item__action")
    };

    this.params = {
        tabsLength:            this.elements.$advItems.length
    };

    this.elements.$advNavItem.children('a').on('click', function(e) {
        that.changeState(that, e);
    });

    this.elements.$advBottomChange.children('a').on('click', function(e) {
        that.changeStateButtom(that, e);
    });
};

AdvantagesTabs.prototype.changeState = function(that, e) {
    e.preventDefault();

    var targetLink = e.target;
    var targetLinkIndex = $(targetLink).parents('li').index();

    // changeNav state
    that.elements.$advNavItem.removeClass('active');
    $(targetLink).parents('li').addClass('active');

    // change content
    that.elements.$advItem.removeClass('active');
    $(that.elements.$advItem[targetLinkIndex]).addClass('active');
};

AdvantagesTabs.prototype.changeStateButtom = function(that, e) {
    e.preventDefault();

    var itemActiveIndex = that.elements.$advItems.find('.active').index();
    that.elements.$advNavItem.removeClass('active');
    that.elements.$advItem.removeClass('active');

    if (itemActiveIndex < that.params.tabsLength) {
        $(that.elements.$advNavItem[itemActiveIndex + 1]).addClass('active');
        $(that.elements.$advItem[itemActiveIndex + 1]).addClass('active');

    } else {
        $(that.elements.$advNavItem[0]).addClass('active');
        $(that.elements.$advItem[0]).addClass('active');
    }
};


module.exports = AdvantagesTabs;
}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/advantagesTabs.js","/")
},{"buffer":2,"qC859L":4}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function Basket (selector) {
    var that = this;
    this.$basket = $(selector);

    if (this.$basket[0]) {
        this.init();
    }
}

Basket.prototype.init = function() {
    this.elements = {
        $basketZoomBtn: this.$basket.find('.basket-item__zoom')
    };
    // magnific popup
    this.elements.$basketZoomBtn.magnificPopup({
        type: 'image',
        image: {
            verticalFit: true
        }
        // zoom: {
        //     enabled: true,
        //     duration: 300
        // }
    });
};

module.exports = Basket;
}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/basket.js","/")
},{"buffer":2,"qC859L":4}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function CatalogDetailSlider(selector) {
    var that = this;
    this.slider = document.querySelector(selector);
    this.$slider = $(selector);

    if (this.$slider[0]) {
        this.init(that);
    }
}

CatalogDetailSlider.prototype.init = function(that) {
    this.elems = {
        $sliderMain: this.$slider.find('.catalog-detail-slider__main'),
        $sliderSub: this.$slider.find('.catalog-detail-slider__sub')
    };

    var paramsMain = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        infinite: true,
        speed: 500,
        asNavFor: ".catalog-detail-slider__sub"
    };

    var paramsSub = {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 500,
        asNavFor: ".catalog-detail-slider__main",
        centerMode: true,
        centerPadding: '0px'
    };

    this.elems.$sliderMain.on('init', function(){
        that.$slider.css("visibility", "visible");
    });

    this.elems.$sliderMain.slick(paramsMain);
    this.elems.$sliderSub.slick(paramsSub);

    this.elems.$sliderMain.on('afterChange', function(event, slick, currentSlide) {
        that.elems.$sliderSub.slick('slickGoTo', currentSlide);
        var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
        $('.slider-nav .slick-slide.is-active').removeClass('is-active');
        $(currrentNavSlideElem).addClass('is-active');
    });
    this.elems.$sliderSub.on('click', '.slick-slide', function(event) {
        event.preventDefault();
        var goToSingleSlide = $(this).data('slick-index');
        that.elems.$sliderMain.slick('slickGoTo', goToSingleSlide);
    });

    console.log($('.catalog-detail-slider__zoom-btn'));

    // magnific popup
    $('.catalog-detail-slider__zoom-btn').magnificPopup({
        type: 'image',
        // closeOnContentClick: true,
        // closeBtnInside: false,
        image: {
            verticalFit: true
        }
        // zoom: {
        //     enabled: true,
        //     duration: 300 // don't foget to change the duration also in CSS
        // }
    });
};

module.exports = CatalogDetailSlider;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/catalogDetailSlider.js","/")
},{"buffer":2,"qC859L":4}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function ContactsMap(selector) {
	var that = this;
	this.$parent = $(selector);
	if (this.$parent[0]) {
		this.init(that);
	}
}

ContactsMap.prototype.init = function (that) {
	if (this.$parent.length) {
		this.elems = {
			map: this.$parent.get(0)
		};

		this.options = {
			center: [54.98892245, 82.88548275],
			placemark: '/images/map/placemark.png'
		};

		ymaps.ready(function () {
			var myMap = new ymaps.Map(that.elems.map.getAttribute('id'), {
					center: that.options.center,
					zoom: 17,
					controls: []
				}),
				myPlacemark = new ymaps.Placemark(myMap.getCenter(), {}, {
					iconLayout: 'default#image',
					iconImageHref: that.options.placemark,
					iconImageSize: [85, 100],
					iconImageOffset: [-42.4, -100]
				});

			myMap.geoObjects
				.add(myPlacemark);
		})
	}
};

module.exports = ContactsMap;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/contactsMap.js","/")
},{"buffer":2,"qC859L":4}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function CustomInputCount(selector) {
    this.$counter = $(selector);
    var that = this;
    if (this.$counter[0]) {
        this.init(that);
    }
}

CustomInputCount.prototype.init = function(that) {
    this.elems = {
        $btnMinus: this.$counter.find('.minus'),
        $btnPlus: this.$counter.find('.plus')
    };
    this.elems.$btnMinus.on('click', function(e) {
        e.preventDefault();
        this.parentNode.querySelector('input').stepDown();
    });
    this.elems.$btnPlus.on('click', function(e) {
        e.preventDefault();
        this.parentNode.querySelector('input').stepUp();
    });
};

module.exports = CustomInputCount;
}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/customInputCount.js","/")
},{"buffer":2,"qC859L":4}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var HeaderPlugin = require('./headerPlugin');
var UserToolsDropDown = require('./userToolsDropDown');
var validation = require('./validation');
var SliderMain = require('./sliderMain');
var SliderBestSales = require('./sliderBestSales');
var OrderPayment = require('./orderPayment');
var OrederForm = require('./orderForm');
var FaqAccordion = require('./faqAccordion');
var AdvantagesTabs = require('./advantagesTabs');
var CatalogDetailSlider = require('./catalogDetailSlider');
var ParallaxReviews = require('./parallaxReviews');
var Modal = require('./modals');
// var ModalCatalogQuickView = require('./modalCatalogQuickView');
var CustomInputCount = require('./customInputCount');
var PhotoGallery = require('./photoGallery');
var HistoryOrders = require('./historyOrders');
var OurCertificates = require('./ourCertificates');
var ContactsMap = require('./contactsMap');
var Basket = require('./basket');
var Uploader = require('./uploader');
var AcceptCookies = require('./acceptCookies');
var SubscriptionForm = require ('./subscriptionForm');
// var CustomSelect = require('./customSelect');


window.addEventListener('load', function() {
    // Шапка
    new HeaderPlugin('.header');

    // user-tools
    new UserToolsDropDown('.user-tools-drop-down');

    // Параллакс
    new ParallaxReviews('.reviews-section');

    // Слайдеры
    new SliderMain('.slider-main__list', '.slider-main-item__bg');
    new SliderBestSales('.bestsellers-slider');
    new CatalogDetailSlider('.catalog-detail-slider');

    // Аккордеоны
    new FaqAccordion('.faq-categories');

    // фотогаллерея
    new PhotoGallery('.photo-gallery');

    // Преимущества
    new AdvantagesTabs('.advantages');

    // Наши сертификаты
    new OurCertificates('.our-certificates');

    // История заказов в ЛК
    new HistoryOrders('.history-orders');

    // Заказы
    new OrederForm('.order-form');
    new OrderPayment('.order-payment');

    // Корзина
    new Basket('.basket');

    // Модалки
    new Modal('.modal-auth', '.showAuth');
    new Modal('.modal-restor', '.showRestor');
    // new Modal('.modal-filter-m', '.showFilterM');
    // new ModalCatalogQuickView('.modal-catalog-quick-view', '.catalog-card__quick-view');

    // счетчик колличества товара
    new CustomInputCount('.custom-input-count');

    // Подтвтерждение испольвания кук
    new AcceptCookies('.accept-cookies');

    // Карта в контактах
    new ContactsMap('#contact_map');

    // Загрузчик файлов (контакты)
    new Uploader('[data-upload]');

    // Кастомный селект
    // new CustomSelect('.custom-select');

    // Валидация
    new SubscriptionForm('.subscription-form');
    validation();
});

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_1451404b.js","/")
},{"./acceptCookies":5,"./advantagesTabs":6,"./basket":7,"./catalogDetailSlider":8,"./contactsMap":9,"./customInputCount":10,"./faqAccordion":12,"./headerPlugin":13,"./historyOrders":14,"./modals":15,"./orderForm":16,"./orderPayment":17,"./ourCertificates":18,"./parallaxReviews":19,"./photoGallery":20,"./sliderBestSales":21,"./sliderMain":22,"./subscriptionForm":23,"./uploader":24,"./userToolsDropDown":25,"./validation":26,"buffer":2,"qC859L":4}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function FaqAccordion(accordionParent) {
    var that = this;
    this.accordionParent = $(accordionParent);
    if (this.accordionParent[0]) {
        this.init(that);
    }
}

FaqAccordion.prototype.init = function(that) {
    this.elements = {
        $accordItem: this.accordionParent.find('.faq-category__item'),
        $accordItemHead: this.accordionParent.find('.faq-category__head'),
        $accordItemContent: this.accordionParent.find('.faq-category__content')
    };
    this.elements.$accordItemHead.on("click", function() {
        var callingElem = this;
        that.accordItemAction(callingElem)
    });
};

FaqAccordion.prototype.accordItemAction = function(callingElem) {
    for (var n = 0; n < this.elements.$accordItem.length; n++) {
        if (this.elements.$accordItemHead[n] === callingElem) {
            if (this.elements.$accordItem[n].classList.contains('active')) {
                this.elements.$accordItem[n].classList.remove('active');
                $(this.elements.$accordItemContent[n]).slideUp(350);
            } else if(!this.elements.$accordItem[n].classList.contains('active')) {
                this.elements.$accordItem[n].classList.add('active');
                $(this.elements.$accordItemContent[n]).slideDown(350);
            }
        } else {
            this.elements.$accordItem[n].classList.remove('active');
            $(this.elements.$accordItemContent[n]).slideUp(350);
        }
    }
};

module.exports = FaqAccordion;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/faqAccordion.js","/")
},{"buffer":2,"qC859L":4}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function HeaderPlugin(selector) {
    var that = this;
    this.header = document.querySelector(selector);
    this.$header = $(selector);
    if (this.$header[0]) {
        this.init(that);
    }
}

HeaderPlugin.prototype.init = function(that) {
    this.elements = {
        $headerNavMobile: this.$header.find('.header-nav-mobile'),
        $headerNavMobileList: this.$header.find('.header-nav-mobile__list'),
        $headerNavMobileBtn: this.$header.find('.header-nav-mobile__btn'),
        $headerExpand: this.$header.find('.header__expand'),
        $logo: this.$header.find('.logo'),
        $body: $('body')
    };

    this.updateOnScroll();
    this.updateOnResize();

    this.elements.$headerNavMobileBtn.on('click', function() {
        that.navToggle();
    });

    window.addEventListener('scroll', function() {
        that.updateOnScroll();
    });
    window.addEventListener('resize', function() {
        that.updateOnResize();
    });
};


HeaderPlugin.prototype.updateOnScroll = function() {
    var headerHeight = this.header.offsetHeight;

    if (window.pageYOffset >= headerHeight / 1.5) {
        if (!this.$header.hasClass("sticky")) {
            this.$header.addClass("sticky");
            this.$header.slideUp(0, function() {
                $(this).slideDown(200);
            });
        }
    } else {
        this.$header.removeClass("sticky");
    }
};

HeaderPlugin.prototype.updateOnResize = function() {
    // var headerHeight = this.header.offsetHeight;
    var getWindowWidth = document.documentElement.clientWidth;

    // добавление/удаление отступа у body
    if (getWindowWidth < 767 - 17) {
        this.elements.$body.css("padding-top", 142);
    } else if (getWindowWidth < 1180 - 17) {
        this.elements.$body.css("padding-top", 82);
    } else {
        this.elements.$body.css("padding-top", 0);
    }

    // добавление/удаление дополнительной секции Expand
    if (getWindowWidth > 767 - 17) {
        this.elements.$headerExpand.css("display", "none");
    } else {
        this.elements.$headerExpand.css("display", "block");
    }
};

HeaderPlugin.prototype.navToggle = function() {
    this.elements.$headerNavMobile.toggleClass('active');
    this.elements.$headerNavMobileList.slideToggle(250);

    if (!(document.documentElement.clientWidth < 768-17)) {
        return
    }
    if (this.elements.$headerNavMobile.hasClass('active') && !this.header.classList.contains('sticky')) {
        this.elements.$headerExpand.slideUp(300, function() {
        });
    } else {
        this.elements.$headerExpand.slideDown(300, function() {
        });
    }
};

module.exports = HeaderPlugin;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/headerPlugin.js","/")
},{"buffer":2,"qC859L":4}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function HistoryOrders(parent) {
    var that = this;
    this.$historyOrdersParent = $(parent);
    if (this.$historyOrdersParent[0]) {
        this.init(that);
    }
}

HistoryOrders.prototype.init = function(that) {
    this.elements = {
        $historyOrdersList: this.$historyOrdersParent.find('.history-orders-list'),
        $historyOrdersListHead: this.$historyOrdersParent.find('.history-orders-list__head h3'),
        $historyOrdersListBody: this.$historyOrdersParent.find('.history-orders-list__body'),
        $historyOrdersItem: this.$historyOrdersParent.find('.history-orders-item__zoom')
    };


    // magnific popup
    this.elements.$historyOrdersItem.magnificPopup({
        type: 'image',
        image: {
            verticalFit: true
        }
    });

    // accordion
    this.elements.$historyOrdersListHead.on("click", function() {
        var callingElem = this;
        that.accordItemAction(callingElem, that)
    });
};

HistoryOrders.prototype.accordItemAction = function(callingElem, that) {
    for (var n = 0; n < this.elements.$historyOrdersList.length; n++) {
        if (this.elements.$historyOrdersListHead[n] === callingElem) {
            if (this.elements.$historyOrdersList[n].classList.contains('active')) {
                $(this.elements.$historyOrdersListBody[n]).slideUp(500);
                that.elements.$historyOrdersList[n].classList.remove('active');
            } else if(!this.elements.$historyOrdersList[n].classList.contains('active')) {
                this.elements.$historyOrdersList[n].classList.add('active');
                $(this.elements.$historyOrdersListBody[n]).slideDown(500);
            }
        } else {
            $(this.elements.$historyOrdersListBody[n]).slideUp(500);
            that.elements.$historyOrdersList[n].classList.remove('active');
        }
    }
};

module.exports = HistoryOrders;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/historyOrders.js","/")
},{"buffer":2,"qC859L":4}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function Modals (modal, defiantElem) {
    var that = this;
    this.modal = modal;
    this.$modal = $(modal);

    if (this.$modal[0]) {
        this.defiantElem = defiantElem;
        this.init(that);
    }
}

Modals.prototype.init = function (that) {
    this.elements = {
        $modal:              this.$modal,
        $closeBtn:           this.$modal.find(".modal-close"),
        $tabs:               this.$modal.find(".modal__tabs"),
        $modalContent:       this.$modal.find(".modal__content"),
        $modalMobile:        this.$modal.find(".modal__mobile"),
        $quickSlider:        this.$modal.find(".catalog-quick-view-slider")
    };

    // show modal
    $(this.defiantElem).on('click', function (e) {
        e.preventDefault();
        that.showModal(that);
    });

    this.elements.$closeBtn.on('click', function(e) {
        e.stopPropagation();
        that.hideModal(that, e)
    });
    // hide modal
    this.elements.$modal.on('click', function (e) {
        that.hideModal(that, e)
    });

    // change state modal
    this.elements.$tabs.children('div').on('click', function(e) {
        that.changeState(that, e);
    });

    // change state modal mobile
    this.elements.$modalMobile.children('a').on('click', function(e) {
        that.changeStateMobile(that, e);
    });
};

Modals.prototype.showModal = function (that) {

    $('.modal').fadeOut(300, function () {
        $(this).removeClass('opened').addClass('closed');
    });

    that.elements.$modal.fadeIn(300, function () {
        $(this).removeClass('closed').addClass('opened');
    });
};

Modals.prototype.hideModal = function (that, e) {
    var modal = that.elements.$modal;
    var currTarget = $(e.currentTarget).attr('class');

    if (e.target === modal[0] || currTarget === 'modal-close') {
        modal.fadeOut(300, function() {
            $(this).removeClass('open').addClass('closed');
        });
    }
};

Modals.prototype.changeState = function(that, e) {
    var targetDiv = e.target;

    // changeTab
    that.elements.$tabs.children('div').removeClass('active');
    $(targetDiv).addClass('active');

    // changeContent
    var activeTab = that.elements.$tabs.children('div').index(targetDiv);
    that.elements.$modalContent.children('div').removeClass('active');
    $(that.elements.$modalContent.children('div')[activeTab]).addClass('active');
};

Modals.prototype.changeStateMobile = function(that) {
    var $tabs = that.elements.$tabs.children('div');
    var $content = that.elements.$modalContent.children('div');
    var tabsActiveIndex = that.elements.$tabs.children('.active').index();

    $content.removeClass('active');
    $tabs.removeClass('active');
    if (tabsActiveIndex === 0) {
        $($content[1]).addClass('active');
        $($tabs[1]).addClass('active');
    } else if (tabsActiveIndex === 1) {
        $($content[0]).addClass('active');
        $($tabs[0]).addClass('active');
    }
};

module.exports = Modals;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modals.js","/")
},{"buffer":2,"qC859L":4}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function OrderForm (selector) {
    var that = this;
    this.$orderForm = $(selector);

    if (this.$orderForm[0]) {
        this.init(that);
    }
}

OrderForm.prototype.init = function(that) {
    this.elements = {
        $accordItem: this.$orderForm.find('.order-accordion-item'),
        $accordItemHead: this.$orderForm.find('.order-accordion-item__head'),
        $accordItemBody: this.$orderForm.find('.order-accordion-item__body'),
        $accordItemBtn: this.$orderForm.find('.order-accordion-item__actions a'),
        $formSubmitBtn: this.$orderForm.find('.order-payment__action')
    };

    this.validParams = {
        errorElement: "p",
        rules: {
            // Контактные данные
            country: {
                required: true
            },
            city: {
                required: true
            },
            // street: {
            //     required: true
            // },
            // house: {
            //     required: true
            // },
            // room: {
            //     required: true
            // },

            // Способ доставки
            delivery: {
                required: true
            },
            // Способ полаты
            payment: {
                required: true
            },

            // личные данные
            lastname: {
                required: true,
                minlength: 2
            },
            firstname: {
                required: true,
                minlength: 2
            },
            phone: {
                required: true
            },
            email: {
                required: true,
                email: true
            }
        },
        errorPlacement: function(error, element) {},

        ignore: []
    };

    this.elements.$orderFormValid = this.$orderForm.validate(this.validParams);

    // set initial state
    var $initialItem = $(this.elements.$accordItem[0]);
    var $initialBody = $(this.elements.$accordItemBody[0]);

    $initialItem.addClass('active');
    $initialItem.attr("data-visited", "true");
    this.elements.$accordItemBody.not($initialBody).css("display", "none");

    this.$orderForm.validate(this.validParams);

    // add events
    this.elements.$accordItemBtn.on("click", function(e) {
        var callingElem = this;
        e.preventDefault();
        that.accordionItemBtnAction(callingElem);
    });

    this.elements.$accordItemHead.on("click", function() {
        var callingElem = this;
        that.accordionItemHeadAction(callingElem);
    });

    this.elements.$formSubmitBtn.on("click", function(e) {
        e.preventDefault();
        that.submitForm();
    })
};

OrderForm.prototype.accordionItemBtnAction = function (callingElem) {
    this.elements.$orderFormValid.settings.ignore = ":hidden";
    var resltValid = this.$orderForm.valid();

    if (resltValid) {
        var callingElemParent = $(callingElem).parents('.order-accordion-item');
        var callingElemIndex = callingElemParent.index();
        var $callingElem = $(this.elements.$accordItem[callingElemIndex + 1]);

        // clear state
        this.elements.$accordItem.removeClass('active');
        this.elements.$accordItemBody.slideUp(300);

        // set state
        $callingElem.addClass('active');
        $callingElem.attr("data-visited", "true");
        $(this.elements.$accordItemBody[callingElemIndex + 1]).slideDown(300, function() {
            // get elem position
            var callingElemPosTop = $callingElem.position().top;

            // set window position
            $('html, body').animate({scrollTop: callingElemPosTop - $('.header').outerHeight() - 20}, 500);
        });
    }
};

OrderForm.prototype.accordionItemHeadAction = function(callingElem) {
    var callingElemParent = $(callingElem).parents('.order-accordion-item');

    if (callingElemParent.attr('data-visited') && !callingElemParent.hasClass('active')) {
        var callingElemIndex = callingElemParent.index();

        // clear state
        this.elements.$accordItem.removeClass('active');
        this.elements.$accordItemBody.slideUp(300);

        // set state
        $(this.elements.$accordItem[callingElemIndex]).addClass('active');
        $(this.elements.$accordItemBody[callingElemIndex]).slideDown(300, function() {
            // get elem position
            var callingElemPosTop = callingElemParent.position().top;

            // set window position
            $('html, body').animate({scrollTop: callingElemPosTop - $('.header').outerHeight() - 20}, 500);
        });
    }
};

OrderForm.prototype.submitForm = function() {
    this.elements.$orderFormValid.settings.ignore = "";
    var resltValid = this.$orderForm.valid();
    if (resltValid) {
        this.$orderForm.submit();
    }
};

module.exports = OrderForm;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/orderForm.js","/")
},{"buffer":2,"qC859L":4}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function OrderPayment (selector) {
    var that = this;
    this.$orderPayment = $(selector);

    if (this.$orderPayment[0]) {
        this.init(that);
    }
}

OrderPayment.prototype.init = function(that) {
    this.elements = {
        $header: $('.header')
    };

    this.params = {
        orderPaymentPos: that.$orderPayment.position().top
    };

    that.updateOnScroll();

    window.addEventListener('scroll', function() {
        that.updateOnScroll();
    });
};

OrderPayment.prototype.updateOnScroll = function() {
    var headerHeight = this.elements.$header.outerHeight() + 20;
    var scrollWindow = window.pageYOffset + headerHeight;

    if (scrollWindow > this.params.orderPaymentPos) {
        this.$orderPayment.addClass('sticky');
        this.$orderPayment.css('top', headerHeight);
    } else {
        this.$orderPayment.removeClass('sticky');
    }
};

module.exports = OrderPayment;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/orderPayment.js","/")
},{"buffer":2,"qC859L":4}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function ourCertificates (selector) {
    var that = this;
    this.$ourCertificates = $(selector);

    if (this.$ourCertificates[0]) {
        this.init();
    }
}

ourCertificates.prototype.init = function() {
    this.elements = {
        $ourCertificatesLink: this.$ourCertificates.find('.our-certificates__item a')
    };
    // magnific popup
    this.elements.$ourCertificatesLink.magnificPopup({
        type: 'image',
        image: {
            verticalFit: true
        },
        zoom: {
            enabled: true,
            duration: 300
        }
    });
};

module.exports = ourCertificates;
}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/ourCertificates.js","/")
},{"buffer":2,"qC859L":4}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function ParallaxReviews (selector) {
    this.reviews = selector;
    this.$reviews = $(selector);

    if (this.$reviews[0]) {
        this.init();
    }
}

ParallaxReviews.prototype.init = function() {
    $(this.reviews).parallax();
};

module.exports = ParallaxReviews;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/parallaxReviews.js","/")
},{"buffer":2,"qC859L":4}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function PhotoGallery (selector) {
    var that = this;
    this.$photoGallery = $(selector);

    if (this.$photoGallery[0]) {
        this.init();
    }
}

PhotoGallery.prototype.init = function() {
    this.elements = {
        $photoGalleryLink: this.$photoGallery.find('.photo-gallery-item a')
    };
    // magnific popup
    this.elements.$photoGalleryLink.magnificPopup({
        type: 'image',
        image: {
            verticalFit: true
        },
        zoom: {
            enabled: true,
            duration: 300
        }
    });
};

module.exports = PhotoGallery;
}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/photoGallery.js","/")
},{"buffer":2,"qC859L":4}],21:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function SliderBestSales(selector) {
    var that = this;
    this.slider = document.querySelector(selector);

    if (this.slider) {
        this.init(that);
    }
}

SliderBestSales.prototype.init = function(that) {
    this.elems = {
        $bestsellersSlider: $(this.slider)
    };

    var params = {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        infinite: true,
        speed: 500,
        responsive: [
            {
                breakpoint: 1180,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: true,
                    dots: false,
                    infinite: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    dots: false,
                    infinite: true
                }
            }
        ]
    };

    this.elems.$bestsellersSlider.on('init', function(){
        that.elems.$bestsellersSlider.css("visibility", "visible");
    });

    this.elems.$bestsellersSlider.slick(params);

};

module.exports = SliderBestSales;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/sliderBestSales.js","/")
},{"buffer":2,"qC859L":4}],22:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function SliderMain(slider, intemBg) {
    var that = this;
    this.$slider = $(slider);
    this.intemBg = intemBg;

    if (this.$slider[0]) {
        this.init(that);
    }
}

SliderMain.prototype.init = function(that) {
    var params = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000
    };

    this.$slider.on('init', function(){
        that.$slider.css("visibility", "visible");
    });
    this.$slider.slick(params);

    // Инизиализируется параллакс
    this.initParallax(that);
};

SliderMain.prototype.initParallax = function() {
    if (!(document.documentElement.clientWidth < 768-17)) {
        this.paramsParallax = {
            speed: -10,
            center: false,
            wrapper: null,
            round: true,
            vertical: true,
            horizontal: false
        };
        this.parallax = new Rellax(this.intemBg, this.paramsParallax);
    }
};


module.exports = SliderMain;


}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/sliderMain.js","/")
},{"buffer":2,"qC859L":4}],23:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function SubscriptionForm (selector) {
    var that = this;
    this.$subscriptionForm = $(selector);

    if (this.$subscriptionForm[0]) {
        this.init();
    }
}

SubscriptionForm.prototype.init = function () {
    this.$subscriptionForm.each(function() {   // <- selects every <form> on page
        $(this).validate({        // <- initialize validate() on each form
            errorElement: "p",
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                email: {
                    required: "Введите email адрес",
                    email: "Пожалуйста, введите email корректно"
                }
            }
        });
    });
};

module.exports = SubscriptionForm;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/subscriptionForm.js","/")
},{"buffer":2,"qC859L":4}],24:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function Uploader(selector) {
	var that = this;
	this.$parent = $(selector);
	if (this.$parent[0]) {
		this.init(that);
	}
}

Uploader.prototype.init = function (that) {
	this.elems = {
		$input: this.$parent.find('[data-upload-input]'),
		$text: this.$parent.find('[data-upload-text]')
	};

	this.elems.$input.on('change', function(e) {
		that.changeText(e);
	})
};

Uploader.prototype.changeText = function(e) {
	e.preventDefault();
	var files = this.elems.$input.get(0).files;

	if (files.length) {
		files = files[0];
		this.elems.$text.text(files.name);
	} else {
		this.elems.$text.text(this.$parent.data('upload-default'));
	}
};

module.exports = Uploader;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uploader.js","/")
},{"buffer":2,"qC859L":4}],25:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function UserToolsDropDown (selector) {
    var that = this;
    this.$userToolsDropDown = $(selector);

    if (this.$userToolsDropDown[0]) {
        this.init(that);
    }
}

UserToolsDropDown.prototype.init = function(that) {
    this.elements = {
        $dropDownHead: this.$userToolsDropDown.find('.user-tools-drop-down__head'),
        $dropDownMenu: this.$userToolsDropDown.find('.user-tools-drop-down__menu'),
    };

    this.elements.$dropDownHead.on("click", function (e) {
        e.preventDefault();
        that.changeStateToggle(that, e);
    });

    $('body').on('click', function (e) {
        that.setDefaultState(that, e);
    });

};

UserToolsDropDown.prototype.changeStateToggle = function(that) {
    that.$userToolsDropDown.toggleClass('open');
    that.elements.$dropDownMenu.slideToggle(200);
};

UserToolsDropDown.prototype.setDefaultState = function(that, e) {
    var $targetElement = $(e.target);
    if (!($targetElement === that.$userToolsDropDown || $targetElement.parents('.user-tools-drop-down')[0])) {
        that.$userToolsDropDown.removeClass('open');
        that.elements.$dropDownMenu.slideUp(200);
    }
};

module.exports = UserToolsDropDown;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/userToolsDropDown.js","/")
},{"buffer":2,"qC859L":4}],26:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function validation() {
    $(".restor__form").validate({
        errorElement: "p",
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            email: {
                required: "Введите email адрес",
                email: "Пожалуйста, введите email корректно"
            }
        }
    });

    // Вход в ЛК
    $(".sing-in__form").validate({
        errorElement: "p",
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            email: {
                required: "Это поле обязательно для заполнения",
                email: "Пожалуйста, введите email корректно"
            },
            password: {
                required: "Это поле обязательно для заполнения",
                minlength: "Короткий пароль (менее 5 символов)"
            }
        }
    });

    // Регистрация ЛК
    $(".sing-up__form").validate({
        ignore: [],
        errorElement: "p",
        rules: {
            firstname: {
                required: true,
                minlength: 2
            },
            lastname: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5
            },
            confirm_password: {
                required: true,
                minlength: 5,
                equalTo: "#sing-up-pass"
            },
            gender: {
                required: true
            },
            privacyPolicy: {
                required: true
            }
        },

        messages: {
            firstname: {
                required: "Это поле обязательно для заполнения",
                minlength: "Слишком короткое имя"
            },
            lastname: {
                required: "Это поле обязательно для заполнения",
                minlength: "Слишком короткая фамилия"
            },
            email: {
                required: "Это поле обязательно для заполнения",
                email: "Пожалуйста введите email корректно"
            },
            password: {
                required: "Это поле обязательно для заполнения",
                minlength: "Короткий пароль (менее 5 символов)"
            },
            confirm_password: {
                required: "Это поле обязательно для заполнения",
                minlength: "Короткий пароль (менее 5 символов)",
                equalTo: "Введенные пароли не совподают"
            },
            gender: {
                required: "Выберите ваш пол"
            },
            privacyPolicy: {
                required: false
            }
        }
    });

    // Вход в ЛК
    $("#contacts_form").validate({
        errorElement: "p",
        rules: {
            name: {
                required: true
            },
            contact: {
                required: true
            },
            message: {
                required: true
            }
        },
        messages: {
            name: {
                required: "Это поле обязательно для заполнения"
            },
            contact: {
                required: "Это поле обязательно для заполнения"
            },
            message: {
                required: "Это поле обязательно для заполнения"
            }
        }
    });


    // изменение личных данных в ЛК
    $(".user-data-change-form").validate({
        rules: {
            firstname: {
                required: true,
                minlength: 2
            },
            lastname: {
                required: true,
                minlength: 2
            },
            phone: {
                required: true
            },
            email: {
                required: true,
                email: true
            }
        },
        errorPlacement: function(error, element) {}
    });

    // изменение контактных данных в ЛК
    $(".delivery-contacts-change-form").validate({
        rules: {
            street: {
                required: true
            },
            house: {
                required: true
            },
            room: {
                required: true
            }
        },
        errorPlacement: function(error, element) {}
    });

    $(".password-change-form").validate({
        rules: {
            password: {
                required: true,
                minlength: 5
            },
            password_new: {
                required: true,
                minlength: 5
            },
            confirm_password: {
                required: true,
                minlength: 5,
                equalTo: "#user-cab-pass"
            }
        },
        errorPlacement: function(error, element) {}
    });

}

module.exports = validation;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/validation.js","/")
},{"buffer":2,"qC859L":4}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxzaXRlc1xcYnJ1bW1pXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJEOi9zaXRlcy9icnVtbWkvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiRDovc2l0ZXMvYnJ1bW1pL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJEOi9zaXRlcy9icnVtbWkvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJEOi9zaXRlcy9icnVtbWkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL2FjY2VwdENvb2tpZXMuanMiLCJEOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9hZHZhbnRhZ2VzVGFicy5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL2Jhc2tldC5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL2NhdGFsb2dEZXRhaWxTbGlkZXIuanMiLCJEOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9jb250YWN0c01hcC5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL2N1c3RvbUlucHV0Q291bnQuanMiLCJEOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9mYWtlXzE0NTE0MDRiLmpzIiwiRDovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvZmFxQWNjb3JkaW9uLmpzIiwiRDovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvaGVhZGVyUGx1Z2luLmpzIiwiRDovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvaGlzdG9yeU9yZGVycy5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL21vZGFscy5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL29yZGVyRm9ybS5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL29yZGVyUGF5bWVudC5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL291ckNlcnRpZmljYXRlcy5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL3BhcmFsbGF4UmV2aWV3cy5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL3Bob3RvR2FsbGVyeS5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL3NsaWRlckJlc3RTYWxlcy5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL3NsaWRlck1haW4uanMiLCJEOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9zdWJzY3JpcHRpb25Gb3JtLmpzIiwiRDovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvdXBsb2FkZXIuanMiLCJEOi9zaXRlcy9icnVtbWkvc2NyaXB0cy91c2VyVG9vbHNEcm9wRG93bi5qcyIsIkQ6L3NpdGVzL2JydW1taS9zY3JpcHRzL3ZhbGlkYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxiYXNlNjQtanNcXFxcbGliXFxcXGI2NC5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxiYXNlNjQtanNcXFxcbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcYnVmZmVyXFxcXGluZGV4LmpzXCIsXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gKGUgKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAoKHZhbHVlICogYykgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcaWVlZTc1NFxcXFxpbmRleC5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxpZWVlNzU0XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXHByb2Nlc3NcXFxcYnJvd3Nlci5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxwcm9jZXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gQWNjZXB0Q29va2llcyhzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kcGFyZW50ID0gJChzZWxlY3Rvcik7XHJcbiAgICBpZiAodGhpcy4kcGFyZW50WzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BY2NlcHRDb29raWVzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbXMgPSB7XHJcbiAgICAgICAgJGFjdGlvbkJ0bjogdGhpcy4kcGFyZW50LmZpbmQoJy5hY2NlcHQtY29va2llc19fYWN0aW9uJylcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtcy4kYWN0aW9uQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB0aGF0LmhpZGVCbG9jayhlKTtcclxuICAgIH0pXHJcbn07XHJcbkFjY2VwdENvb2tpZXMucHJvdG90eXBlLmhpZGVCbG9jayA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRoaXMuJHBhcmVudC5mYWRlT3V0KDQwMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImhpZGRlblwiKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWNjZXB0Q29va2llcztcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2FjY2VwdENvb2tpZXMuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBBZHZhbnRhZ2VzVGFicyAocGFyZW50KSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgIHRoaXMuJHBhcmVudCA9ICQocGFyZW50KTtcclxuXHJcbiAgICBpZiAodGhpcy4kcGFyZW50WzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BZHZhbnRhZ2VzVGFicy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRhZHZOYXZJdGVtOiAgICAgICAgICAgdGhpcy4kcGFyZW50LmZpbmQoXCIuYWR2YW50YWdlcy1uYXYgbGlcIiksXHJcbiAgICAgICAgJGFkdkl0ZW1zOiAgICAgICAgICAgICB0aGlzLiRwYXJlbnQuZmluZChcIi5hZHZhbnRhZ2VzLWl0ZW1zXCIpLFxyXG4gICAgICAgICRhZHZJdGVtOiAgICAgICAgICAgICAgdGhpcy4kcGFyZW50LmZpbmQoXCIuYWR2YW50YWdlcy1pdGVtXCIpLFxyXG4gICAgICAgICRhZHZCb3R0b21DaGFuZ2U6ICAgICAgdGhpcy4kcGFyZW50LmZpbmQoXCIuYWR2YW50YWdlcy1pdGVtX19hY3Rpb25cIilcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSB7XHJcbiAgICAgICAgdGFic0xlbmd0aDogICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRhZHZJdGVtcy5sZW5ndGhcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kYWR2TmF2SXRlbS5jaGlsZHJlbignYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB0aGF0LmNoYW5nZVN0YXRlKHRoYXQsIGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kYWR2Qm90dG9tQ2hhbmdlLmNoaWxkcmVuKCdhJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoYXQuY2hhbmdlU3RhdGVCdXR0b20odGhhdCwgZSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbkFkdmFudGFnZXNUYWJzLnByb3RvdHlwZS5jaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uKHRoYXQsIGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB2YXIgdGFyZ2V0TGluayA9IGUudGFyZ2V0O1xyXG4gICAgdmFyIHRhcmdldExpbmtJbmRleCA9ICQodGFyZ2V0TGluaykucGFyZW50cygnbGknKS5pbmRleCgpO1xyXG5cclxuICAgIC8vIGNoYW5nZU5hdiBzdGF0ZVxyXG4gICAgdGhhdC5lbGVtZW50cy4kYWR2TmF2SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRhcmdldExpbmspLnBhcmVudHMoJ2xpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgIC8vIGNoYW5nZSBjb250ZW50XHJcbiAgICB0aGF0LmVsZW1lbnRzLiRhZHZJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGhhdC5lbGVtZW50cy4kYWR2SXRlbVt0YXJnZXRMaW5rSW5kZXhdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbn07XHJcblxyXG5BZHZhbnRhZ2VzVGFicy5wcm90b3R5cGUuY2hhbmdlU3RhdGVCdXR0b20gPSBmdW5jdGlvbih0aGF0LCBlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdmFyIGl0ZW1BY3RpdmVJbmRleCA9IHRoYXQuZWxlbWVudHMuJGFkdkl0ZW1zLmZpbmQoJy5hY3RpdmUnKS5pbmRleCgpO1xyXG4gICAgdGhhdC5lbGVtZW50cy4kYWR2TmF2SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB0aGF0LmVsZW1lbnRzLiRhZHZJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICBpZiAoaXRlbUFjdGl2ZUluZGV4IDwgdGhhdC5wYXJhbXMudGFic0xlbmd0aCkge1xyXG4gICAgICAgICQodGhhdC5lbGVtZW50cy4kYWR2TmF2SXRlbVtpdGVtQWN0aXZlSW5kZXggKyAxXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICQodGhhdC5lbGVtZW50cy4kYWR2SXRlbVtpdGVtQWN0aXZlSW5kZXggKyAxXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh0aGF0LmVsZW1lbnRzLiRhZHZOYXZJdGVtWzBdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCh0aGF0LmVsZW1lbnRzLiRhZHZJdGVtWzBdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBZHZhbnRhZ2VzVGFicztcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvYWR2YW50YWdlc1RhYnMuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBCYXNrZXQgKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiRiYXNrZXQgPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kYmFza2V0WzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkJhc2tldC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkYmFza2V0Wm9vbUJ0bjogdGhpcy4kYmFza2V0LmZpbmQoJy5iYXNrZXQtaXRlbV9fem9vbScpXHJcbiAgICB9O1xyXG4gICAgLy8gbWFnbmlmaWMgcG9wdXBcclxuICAgIHRoaXMuZWxlbWVudHMuJGJhc2tldFpvb21CdG4ubWFnbmlmaWNQb3B1cCh7XHJcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcclxuICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbEZpdDogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB6b29tOiB7XHJcbiAgICAgICAgLy8gICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgLy8gICAgIGR1cmF0aW9uOiAzMDBcclxuICAgICAgICAvLyB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFza2V0O1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9iYXNrZXQuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBDYXRhbG9nRGV0YWlsU2xpZGVyKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgdGhpcy4kc2xpZGVyID0gJChzZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuJHNsaWRlclswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuQ2F0YWxvZ0RldGFpbFNsaWRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbXMgPSB7XHJcbiAgICAgICAgJHNsaWRlck1haW46IHRoaXMuJHNsaWRlci5maW5kKCcuY2F0YWxvZy1kZXRhaWwtc2xpZGVyX19tYWluJyksXHJcbiAgICAgICAgJHNsaWRlclN1YjogdGhpcy4kc2xpZGVyLmZpbmQoJy5jYXRhbG9nLWRldGFpbC1zbGlkZXJfX3N1YicpXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBwYXJhbXNNYWluID0ge1xyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgc3BlZWQ6IDUwMCxcclxuICAgICAgICBhc05hdkZvcjogXCIuY2F0YWxvZy1kZXRhaWwtc2xpZGVyX19zdWJcIlxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcGFyYW1zU3ViID0ge1xyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMyxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgIHNwZWVkOiA1MDAsXHJcbiAgICAgICAgYXNOYXZGb3I6IFwiLmNhdGFsb2ctZGV0YWlsLXNsaWRlcl9fbWFpblwiLFxyXG4gICAgICAgIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICAgICAgY2VudGVyUGFkZGluZzogJzBweCdcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtcy4kc2xpZGVyTWFpbi5vbignaW5pdCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhhdC4kc2xpZGVyLmNzcyhcInZpc2liaWxpdHlcIiwgXCJ2aXNpYmxlXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtcy4kc2xpZGVyTWFpbi5zbGljayhwYXJhbXNNYWluKTtcclxuICAgIHRoaXMuZWxlbXMuJHNsaWRlclN1Yi5zbGljayhwYXJhbXNTdWIpO1xyXG5cclxuICAgIHRoaXMuZWxlbXMuJHNsaWRlck1haW4ub24oJ2FmdGVyQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUpIHtcclxuICAgICAgICB0aGF0LmVsZW1zLiRzbGlkZXJTdWIuc2xpY2soJ3NsaWNrR29UbycsIGN1cnJlbnRTbGlkZSk7XHJcbiAgICAgICAgdmFyIGN1cnJyZW50TmF2U2xpZGVFbGVtID0gJy5zbGlkZXItbmF2IC5zbGljay1zbGlkZVtkYXRhLXNsaWNrLWluZGV4PVwiJyArIGN1cnJlbnRTbGlkZSArICdcIl0nO1xyXG4gICAgICAgICQoJy5zbGlkZXItbmF2IC5zbGljay1zbGlkZS5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgJChjdXJycmVudE5hdlNsaWRlRWxlbSkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmVsZW1zLiRzbGlkZXJTdWIub24oJ2NsaWNrJywgJy5zbGljay1zbGlkZScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgZ29Ub1NpbmdsZVNsaWRlID0gJCh0aGlzKS5kYXRhKCdzbGljay1pbmRleCcpO1xyXG4gICAgICAgIHRoYXQuZWxlbXMuJHNsaWRlck1haW4uc2xpY2soJ3NsaWNrR29UbycsIGdvVG9TaW5nbGVTbGlkZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygkKCcuY2F0YWxvZy1kZXRhaWwtc2xpZGVyX196b29tLWJ0bicpKTtcclxuXHJcbiAgICAvLyBtYWduaWZpYyBwb3B1cFxyXG4gICAgJCgnLmNhdGFsb2ctZGV0YWlsLXNsaWRlcl9fem9vbS1idG4nKS5tYWduaWZpY1BvcHVwKHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIC8vIGNsb3NlT25Db250ZW50Q2xpY2s6IHRydWUsXHJcbiAgICAgICAgLy8gY2xvc2VCdG5JbnNpZGU6IGZhbHNlLFxyXG4gICAgICAgIGltYWdlOiB7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsRml0OiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHpvb206IHtcclxuICAgICAgICAvLyAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAvLyAgICAgZHVyYXRpb246IDMwMCAvLyBkb24ndCBmb2dldCB0byBjaGFuZ2UgdGhlIGR1cmF0aW9uIGFsc28gaW4gQ1NTXHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhdGFsb2dEZXRhaWxTbGlkZXI7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9jYXRhbG9nRGV0YWlsU2xpZGVyLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gQ29udGFjdHNNYXAoc2VsZWN0b3IpIHtcclxuXHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0dGhpcy4kcGFyZW50ID0gJChzZWxlY3Rvcik7XHJcblx0aWYgKHRoaXMuJHBhcmVudFswXSkge1xyXG5cdFx0dGhpcy5pbml0KHRoYXQpO1xyXG5cdH1cclxufVxyXG5cclxuQ29udGFjdHNNYXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodGhhdCkge1xyXG5cdGlmICh0aGlzLiRwYXJlbnQubGVuZ3RoKSB7XHJcblx0XHR0aGlzLmVsZW1zID0ge1xyXG5cdFx0XHRtYXA6IHRoaXMuJHBhcmVudC5nZXQoMClcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5vcHRpb25zID0ge1xyXG5cdFx0XHRjZW50ZXI6IFs1NC45ODg5MjI0NSwgODIuODg1NDgyNzVdLFxyXG5cdFx0XHRwbGFjZW1hcms6ICcvaW1hZ2VzL21hcC9wbGFjZW1hcmsucG5nJ1xyXG5cdFx0fTtcclxuXHJcblx0XHR5bWFwcy5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBteU1hcCA9IG5ldyB5bWFwcy5NYXAodGhhdC5lbGVtcy5tYXAuZ2V0QXR0cmlidXRlKCdpZCcpLCB7XHJcblx0XHRcdFx0XHRjZW50ZXI6IHRoYXQub3B0aW9ucy5jZW50ZXIsXHJcblx0XHRcdFx0XHR6b29tOiAxNyxcclxuXHRcdFx0XHRcdGNvbnRyb2xzOiBbXVxyXG5cdFx0XHRcdH0pLFxyXG5cdFx0XHRcdG15UGxhY2VtYXJrID0gbmV3IHltYXBzLlBsYWNlbWFyayhteU1hcC5nZXRDZW50ZXIoKSwge30sIHtcclxuXHRcdFx0XHRcdGljb25MYXlvdXQ6ICdkZWZhdWx0I2ltYWdlJyxcclxuXHRcdFx0XHRcdGljb25JbWFnZUhyZWY6IHRoYXQub3B0aW9ucy5wbGFjZW1hcmssXHJcblx0XHRcdFx0XHRpY29uSW1hZ2VTaXplOiBbODUsIDEwMF0sXHJcblx0XHRcdFx0XHRpY29uSW1hZ2VPZmZzZXQ6IFstNDIuNCwgLTEwMF1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdG15TWFwLmdlb09iamVjdHNcclxuXHRcdFx0XHQuYWRkKG15UGxhY2VtYXJrKTtcclxuXHRcdH0pXHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb250YWN0c01hcDtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2NvbnRhY3RzTWFwLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gQ3VzdG9tSW5wdXRDb3VudChzZWxlY3Rvcikge1xyXG4gICAgdGhpcy4kY291bnRlciA9ICQoc2VsZWN0b3IpO1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgaWYgKHRoaXMuJGNvdW50ZXJbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkN1c3RvbUlucHV0Q291bnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1zID0ge1xyXG4gICAgICAgICRidG5NaW51czogdGhpcy4kY291bnRlci5maW5kKCcubWludXMnKSxcclxuICAgICAgICAkYnRuUGx1czogdGhpcy4kY291bnRlci5maW5kKCcucGx1cycpXHJcbiAgICB9O1xyXG4gICAgdGhpcy5lbGVtcy4kYnRuTWludXMub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignaW5wdXQnKS5zdGVwRG93bigpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmVsZW1zLiRidG5QbHVzLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jykuc3RlcFVwKCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ3VzdG9tSW5wdXRDb3VudDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvY3VzdG9tSW5wdXRDb3VudC5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBIZWFkZXJQbHVnaW4gPSByZXF1aXJlKCcuL2hlYWRlclBsdWdpbicpO1xyXG52YXIgVXNlclRvb2xzRHJvcERvd24gPSByZXF1aXJlKCcuL3VzZXJUb29sc0Ryb3BEb3duJyk7XHJcbnZhciB2YWxpZGF0aW9uID0gcmVxdWlyZSgnLi92YWxpZGF0aW9uJyk7XHJcbnZhciBTbGlkZXJNYWluID0gcmVxdWlyZSgnLi9zbGlkZXJNYWluJyk7XHJcbnZhciBTbGlkZXJCZXN0U2FsZXMgPSByZXF1aXJlKCcuL3NsaWRlckJlc3RTYWxlcycpO1xyXG52YXIgT3JkZXJQYXltZW50ID0gcmVxdWlyZSgnLi9vcmRlclBheW1lbnQnKTtcclxudmFyIE9yZWRlckZvcm0gPSByZXF1aXJlKCcuL29yZGVyRm9ybScpO1xyXG52YXIgRmFxQWNjb3JkaW9uID0gcmVxdWlyZSgnLi9mYXFBY2NvcmRpb24nKTtcclxudmFyIEFkdmFudGFnZXNUYWJzID0gcmVxdWlyZSgnLi9hZHZhbnRhZ2VzVGFicycpO1xyXG52YXIgQ2F0YWxvZ0RldGFpbFNsaWRlciA9IHJlcXVpcmUoJy4vY2F0YWxvZ0RldGFpbFNsaWRlcicpO1xyXG52YXIgUGFyYWxsYXhSZXZpZXdzID0gcmVxdWlyZSgnLi9wYXJhbGxheFJldmlld3MnKTtcclxudmFyIE1vZGFsID0gcmVxdWlyZSgnLi9tb2RhbHMnKTtcclxuLy8gdmFyIE1vZGFsQ2F0YWxvZ1F1aWNrVmlldyA9IHJlcXVpcmUoJy4vbW9kYWxDYXRhbG9nUXVpY2tWaWV3Jyk7XHJcbnZhciBDdXN0b21JbnB1dENvdW50ID0gcmVxdWlyZSgnLi9jdXN0b21JbnB1dENvdW50Jyk7XHJcbnZhciBQaG90b0dhbGxlcnkgPSByZXF1aXJlKCcuL3Bob3RvR2FsbGVyeScpO1xyXG52YXIgSGlzdG9yeU9yZGVycyA9IHJlcXVpcmUoJy4vaGlzdG9yeU9yZGVycycpO1xyXG52YXIgT3VyQ2VydGlmaWNhdGVzID0gcmVxdWlyZSgnLi9vdXJDZXJ0aWZpY2F0ZXMnKTtcclxudmFyIENvbnRhY3RzTWFwID0gcmVxdWlyZSgnLi9jb250YWN0c01hcCcpO1xyXG52YXIgQmFza2V0ID0gcmVxdWlyZSgnLi9iYXNrZXQnKTtcclxudmFyIFVwbG9hZGVyID0gcmVxdWlyZSgnLi91cGxvYWRlcicpO1xyXG52YXIgQWNjZXB0Q29va2llcyA9IHJlcXVpcmUoJy4vYWNjZXB0Q29va2llcycpO1xyXG52YXIgU3Vic2NyaXB0aW9uRm9ybSA9IHJlcXVpcmUgKCcuL3N1YnNjcmlwdGlvbkZvcm0nKTtcclxuLy8gdmFyIEN1c3RvbVNlbGVjdCA9IHJlcXVpcmUoJy4vY3VzdG9tU2VsZWN0Jyk7XHJcblxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuICAgIC8vINCo0LDQv9C60LBcclxuICAgIG5ldyBIZWFkZXJQbHVnaW4oJy5oZWFkZXInKTtcclxuXHJcbiAgICAvLyB1c2VyLXRvb2xzXHJcbiAgICBuZXcgVXNlclRvb2xzRHJvcERvd24oJy51c2VyLXRvb2xzLWRyb3AtZG93bicpO1xyXG5cclxuICAgIC8vINCf0LDRgNCw0LvQu9Cw0LrRgVxyXG4gICAgbmV3IFBhcmFsbGF4UmV2aWV3cygnLnJldmlld3Mtc2VjdGlvbicpO1xyXG5cclxuICAgIC8vINCh0LvQsNC50LTQtdGA0YtcclxuICAgIG5ldyBTbGlkZXJNYWluKCcuc2xpZGVyLW1haW5fX2xpc3QnLCAnLnNsaWRlci1tYWluLWl0ZW1fX2JnJyk7XHJcbiAgICBuZXcgU2xpZGVyQmVzdFNhbGVzKCcuYmVzdHNlbGxlcnMtc2xpZGVyJyk7XHJcbiAgICBuZXcgQ2F0YWxvZ0RldGFpbFNsaWRlcignLmNhdGFsb2ctZGV0YWlsLXNsaWRlcicpO1xyXG5cclxuICAgIC8vINCQ0LrQutC+0YDQtNC10L7QvdGLXHJcbiAgICBuZXcgRmFxQWNjb3JkaW9uKCcuZmFxLWNhdGVnb3JpZXMnKTtcclxuXHJcbiAgICAvLyDRhNC+0YLQvtCz0LDQu9C70LXRgNC10Y9cclxuICAgIG5ldyBQaG90b0dhbGxlcnkoJy5waG90by1nYWxsZXJ5Jyk7XHJcblxyXG4gICAgLy8g0J/RgNC10LjQvNGD0YnQtdGB0YLQstCwXHJcbiAgICBuZXcgQWR2YW50YWdlc1RhYnMoJy5hZHZhbnRhZ2VzJyk7XHJcblxyXG4gICAgLy8g0J3QsNGI0Lgg0YHQtdGA0YLQuNGE0LjQutCw0YLRi1xyXG4gICAgbmV3IE91ckNlcnRpZmljYXRlcygnLm91ci1jZXJ0aWZpY2F0ZXMnKTtcclxuXHJcbiAgICAvLyDQmNGB0YLQvtGA0LjRjyDQt9Cw0LrQsNC30L7QsiDQsiDQm9CaXHJcbiAgICBuZXcgSGlzdG9yeU9yZGVycygnLmhpc3Rvcnktb3JkZXJzJyk7XHJcblxyXG4gICAgLy8g0JfQsNC60LDQt9GLXHJcbiAgICBuZXcgT3JlZGVyRm9ybSgnLm9yZGVyLWZvcm0nKTtcclxuICAgIG5ldyBPcmRlclBheW1lbnQoJy5vcmRlci1wYXltZW50Jyk7XHJcblxyXG4gICAgLy8g0JrQvtGA0LfQuNC90LBcclxuICAgIG5ldyBCYXNrZXQoJy5iYXNrZXQnKTtcclxuXHJcbiAgICAvLyDQnNC+0LTQsNC70LrQuFxyXG4gICAgbmV3IE1vZGFsKCcubW9kYWwtYXV0aCcsICcuc2hvd0F1dGgnKTtcclxuICAgIG5ldyBNb2RhbCgnLm1vZGFsLXJlc3RvcicsICcuc2hvd1Jlc3RvcicpO1xyXG4gICAgLy8gbmV3IE1vZGFsKCcubW9kYWwtZmlsdGVyLW0nLCAnLnNob3dGaWx0ZXJNJyk7XHJcbiAgICAvLyBuZXcgTW9kYWxDYXRhbG9nUXVpY2tWaWV3KCcubW9kYWwtY2F0YWxvZy1xdWljay12aWV3JywgJy5jYXRhbG9nLWNhcmRfX3F1aWNrLXZpZXcnKTtcclxuXHJcbiAgICAvLyDRgdGH0LXRgtGH0LjQuiDQutC+0LvQu9C40YfQtdGB0YLQstCwINGC0L7QstCw0YDQsFxyXG4gICAgbmV3IEN1c3RvbUlucHV0Q291bnQoJy5jdXN0b20taW5wdXQtY291bnQnKTtcclxuXHJcbiAgICAvLyDQn9C+0LTRgtCy0YLQtdGA0LbQtNC10L3QuNC1INC40YHQv9C+0LvRjNCy0LDQvdC40Y8g0LrRg9C6XHJcbiAgICBuZXcgQWNjZXB0Q29va2llcygnLmFjY2VwdC1jb29raWVzJyk7XHJcblxyXG4gICAgLy8g0JrQsNGA0YLQsCDQsiDQutC+0L3RgtCw0LrRgtCw0YVcclxuICAgIG5ldyBDb250YWN0c01hcCgnI2NvbnRhY3RfbWFwJyk7XHJcblxyXG4gICAgLy8g0JfQsNCz0YDRg9C30YfQuNC6INGE0LDQudC70L7QsiAo0LrQvtC90YLQsNC60YLRiylcclxuICAgIG5ldyBVcGxvYWRlcignW2RhdGEtdXBsb2FkXScpO1xyXG5cclxuICAgIC8vINCa0LDRgdGC0L7QvNC90YvQuSDRgdC10LvQtdC60YJcclxuICAgIC8vIG5ldyBDdXN0b21TZWxlY3QoJy5jdXN0b20tc2VsZWN0Jyk7XHJcblxyXG4gICAgLy8g0JLQsNC70LjQtNCw0YbQuNGPXHJcbiAgICBuZXcgU3Vic2NyaXB0aW9uRm9ybSgnLnN1YnNjcmlwdGlvbi1mb3JtJyk7XHJcbiAgICB2YWxpZGF0aW9uKCk7XHJcbn0pO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV8xNDUxNDA0Yi5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIEZhcUFjY29yZGlvbihhY2NvcmRpb25QYXJlbnQpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuYWNjb3JkaW9uUGFyZW50ID0gJChhY2NvcmRpb25QYXJlbnQpO1xyXG4gICAgaWYgKHRoaXMuYWNjb3JkaW9uUGFyZW50WzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5GYXFBY2NvcmRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRhY2NvcmRJdGVtOiB0aGlzLmFjY29yZGlvblBhcmVudC5maW5kKCcuZmFxLWNhdGVnb3J5X19pdGVtJyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1IZWFkOiB0aGlzLmFjY29yZGlvblBhcmVudC5maW5kKCcuZmFxLWNhdGVnb3J5X19oZWFkJyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1Db250ZW50OiB0aGlzLmFjY29yZGlvblBhcmVudC5maW5kKCcuZmFxLWNhdGVnb3J5X19jb250ZW50JylcclxuICAgIH07XHJcbiAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtSGVhZC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjYWxsaW5nRWxlbSA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC5hY2NvcmRJdGVtQWN0aW9uKGNhbGxpbmdFbGVtKVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5GYXFBY2NvcmRpb24ucHJvdG90eXBlLmFjY29yZEl0ZW1BY3Rpb24gPSBmdW5jdGlvbihjYWxsaW5nRWxlbSkge1xyXG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1IZWFkW25dID09PSBjYWxsaW5nRWxlbSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtuXS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtW25dLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtQ29udGVudFtuXSkuc2xpZGVVcCgzNTApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIXRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1bbl0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtuXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUNvbnRlbnRbbl0pLnNsaWRlRG93bigzNTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtuXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtQ29udGVudFtuXSkuc2xpZGVVcCgzNTApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmFxQWNjb3JkaW9uO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFxQWNjb3JkaW9uLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gSGVhZGVyUGx1Z2luKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLmhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgdGhpcy4kaGVhZGVyID0gJChzZWxlY3Rvcik7XHJcbiAgICBpZiAodGhpcy4kaGVhZGVyWzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5IZWFkZXJQbHVnaW4ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRoZWFkZXJOYXZNb2JpbGU6IHRoaXMuJGhlYWRlci5maW5kKCcuaGVhZGVyLW5hdi1tb2JpbGUnKSxcclxuICAgICAgICAkaGVhZGVyTmF2TW9iaWxlTGlzdDogdGhpcy4kaGVhZGVyLmZpbmQoJy5oZWFkZXItbmF2LW1vYmlsZV9fbGlzdCcpLFxyXG4gICAgICAgICRoZWFkZXJOYXZNb2JpbGVCdG46IHRoaXMuJGhlYWRlci5maW5kKCcuaGVhZGVyLW5hdi1tb2JpbGVfX2J0bicpLFxyXG4gICAgICAgICRoZWFkZXJFeHBhbmQ6IHRoaXMuJGhlYWRlci5maW5kKCcuaGVhZGVyX19leHBhbmQnKSxcclxuICAgICAgICAkbG9nbzogdGhpcy4kaGVhZGVyLmZpbmQoJy5sb2dvJyksXHJcbiAgICAgICAgJGJvZHk6ICQoJ2JvZHknKVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZU9uU2Nyb2xsKCk7XHJcbiAgICB0aGlzLnVwZGF0ZU9uUmVzaXplKCk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kaGVhZGVyTmF2TW9iaWxlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoYXQubmF2VG9nZ2xlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhhdC51cGRhdGVPblNjcm9sbCgpO1xyXG4gICAgfSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhhdC51cGRhdGVPblJlc2l6ZSgpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuSGVhZGVyUGx1Z2luLnByb3RvdHlwZS51cGRhdGVPblNjcm9sbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGhlYWRlckhlaWdodCA9IHRoaXMuaGVhZGVyLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID49IGhlYWRlckhlaWdodCAvIDEuNSkge1xyXG4gICAgICAgIGlmICghdGhpcy4kaGVhZGVyLmhhc0NsYXNzKFwic3RpY2t5XCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGhlYWRlci5hZGRDbGFzcyhcInN0aWNreVwiKTtcclxuICAgICAgICAgICAgdGhpcy4kaGVhZGVyLnNsaWRlVXAoMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNsaWRlRG93bigyMDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJGhlYWRlci5yZW1vdmVDbGFzcyhcInN0aWNreVwiKTtcclxuICAgIH1cclxufTtcclxuXHJcbkhlYWRlclBsdWdpbi5wcm90b3R5cGUudXBkYXRlT25SZXNpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIHZhciBoZWFkZXJIZWlnaHQgPSB0aGlzLmhlYWRlci5vZmZzZXRIZWlnaHQ7XHJcbiAgICB2YXIgZ2V0V2luZG93V2lkdGggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgLy8g0LTQvtCx0LDQstC70LXQvdC40LUv0YPQtNCw0LvQtdC90LjQtSDQvtGC0YHRgtGD0L/QsCDRgyBib2R5XHJcbiAgICBpZiAoZ2V0V2luZG93V2lkdGggPCA3NjcgLSAxNykge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMuJGJvZHkuY3NzKFwicGFkZGluZy10b3BcIiwgMTQyKTtcclxuICAgIH0gZWxzZSBpZiAoZ2V0V2luZG93V2lkdGggPCAxMTgwIC0gMTcpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLiRib2R5LmNzcyhcInBhZGRpbmctdG9wXCIsIDgyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cy4kYm9keS5jc3MoXCJwYWRkaW5nLXRvcFwiLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQtNC+0LHQsNCy0LvQtdC90LjQtS/Rg9C00LDQu9C10L3QuNC1INC00L7Qv9C+0LvQvdC40YLQtdC70YzQvdC+0Lkg0YHQtdC60YbQuNC4IEV4cGFuZFxyXG4gICAgaWYgKGdldFdpbmRvd1dpZHRoID4gNzY3IC0gMTcpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLiRoZWFkZXJFeHBhbmQuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMuJGhlYWRlckV4cGFuZC5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5IZWFkZXJQbHVnaW4ucHJvdG90eXBlLm5hdlRvZ2dsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5lbGVtZW50cy4kaGVhZGVyTmF2TW9iaWxlLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIHRoaXMuZWxlbWVudHMuJGhlYWRlck5hdk1vYmlsZUxpc3Quc2xpZGVUb2dnbGUoMjUwKTtcclxuXHJcbiAgICBpZiAoIShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggPCA3NjgtMTcpKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbGVtZW50cy4kaGVhZGVyTmF2TW9iaWxlLmhhc0NsYXNzKCdhY3RpdmUnKSAmJiAhdGhpcy5oZWFkZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdGlja3knKSkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMuJGhlYWRlckV4cGFuZC5zbGlkZVVwKDMwMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMuJGhlYWRlckV4cGFuZC5zbGlkZURvd24oMzAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyUGx1Z2luO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvaGVhZGVyUGx1Z2luLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gSGlzdG9yeU9yZGVycyhwYXJlbnQpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJGhpc3RvcnlPcmRlcnNQYXJlbnQgPSAkKHBhcmVudCk7XHJcbiAgICBpZiAodGhpcy4kaGlzdG9yeU9yZGVyc1BhcmVudFswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuSGlzdG9yeU9yZGVycy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbWVudHMgPSB7XHJcbiAgICAgICAgJGhpc3RvcnlPcmRlcnNMaXN0OiB0aGlzLiRoaXN0b3J5T3JkZXJzUGFyZW50LmZpbmQoJy5oaXN0b3J5LW9yZGVycy1saXN0JyksXHJcbiAgICAgICAgJGhpc3RvcnlPcmRlcnNMaXN0SGVhZDogdGhpcy4kaGlzdG9yeU9yZGVyc1BhcmVudC5maW5kKCcuaGlzdG9yeS1vcmRlcnMtbGlzdF9faGVhZCBoMycpLFxyXG4gICAgICAgICRoaXN0b3J5T3JkZXJzTGlzdEJvZHk6IHRoaXMuJGhpc3RvcnlPcmRlcnNQYXJlbnQuZmluZCgnLmhpc3Rvcnktb3JkZXJzLWxpc3RfX2JvZHknKSxcclxuICAgICAgICAkaGlzdG9yeU9yZGVyc0l0ZW06IHRoaXMuJGhpc3RvcnlPcmRlcnNQYXJlbnQuZmluZCgnLmhpc3Rvcnktb3JkZXJzLWl0ZW1fX3pvb20nKVxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gbWFnbmlmaWMgcG9wdXBcclxuICAgIHRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNJdGVtLm1hZ25pZmljUG9wdXAoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgdmVydGljYWxGaXQ6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBhY2NvcmRpb25cclxuICAgIHRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0SGVhZC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjYWxsaW5nRWxlbSA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC5hY2NvcmRJdGVtQWN0aW9uKGNhbGxpbmdFbGVtLCB0aGF0KVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5IaXN0b3J5T3JkZXJzLnByb3RvdHlwZS5hY2NvcmRJdGVtQWN0aW9uID0gZnVuY3Rpb24oY2FsbGluZ0VsZW0sIHRoYXQpIHtcclxuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgdGhpcy5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3QubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3RIZWFkW25dID09PSBjYWxsaW5nRWxlbSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3Rbbl0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdEJvZHlbbl0pLnNsaWRlVXAoNTAwKTtcclxuICAgICAgICAgICAgICAgIHRoYXQuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0W25dLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIXRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0W25dLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0W25dLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdEJvZHlbbl0pLnNsaWRlRG93big1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdEJvZHlbbl0pLnNsaWRlVXAoNTAwKTtcclxuICAgICAgICAgICAgdGhhdC5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3Rbbl0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIaXN0b3J5T3JkZXJzO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvaGlzdG9yeU9yZGVycy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIE1vZGFscyAobW9kYWwsIGRlZmlhbnRFbGVtKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLm1vZGFsID0gbW9kYWw7XHJcbiAgICB0aGlzLiRtb2RhbCA9ICQobW9kYWwpO1xyXG5cclxuICAgIGlmICh0aGlzLiRtb2RhbFswXSkge1xyXG4gICAgICAgIHRoaXMuZGVmaWFudEVsZW0gPSBkZWZpYW50RWxlbTtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk1vZGFscy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRtb2RhbDogICAgICAgICAgICAgIHRoaXMuJG1vZGFsLFxyXG4gICAgICAgICRjbG9zZUJ0bjogICAgICAgICAgIHRoaXMuJG1vZGFsLmZpbmQoXCIubW9kYWwtY2xvc2VcIiksXHJcbiAgICAgICAgJHRhYnM6ICAgICAgICAgICAgICAgdGhpcy4kbW9kYWwuZmluZChcIi5tb2RhbF9fdGFic1wiKSxcclxuICAgICAgICAkbW9kYWxDb250ZW50OiAgICAgICB0aGlzLiRtb2RhbC5maW5kKFwiLm1vZGFsX19jb250ZW50XCIpLFxyXG4gICAgICAgICRtb2RhbE1vYmlsZTogICAgICAgIHRoaXMuJG1vZGFsLmZpbmQoXCIubW9kYWxfX21vYmlsZVwiKSxcclxuICAgICAgICAkcXVpY2tTbGlkZXI6ICAgICAgICB0aGlzLiRtb2RhbC5maW5kKFwiLmNhdGFsb2ctcXVpY2stdmlldy1zbGlkZXJcIilcclxuICAgIH07XHJcblxyXG4gICAgLy8gc2hvdyBtb2RhbFxyXG4gICAgJCh0aGlzLmRlZmlhbnRFbGVtKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGF0LnNob3dNb2RhbCh0aGF0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJGNsb3NlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoYXQuaGlkZU1vZGFsKHRoYXQsIGUpXHJcbiAgICB9KTtcclxuICAgIC8vIGhpZGUgbW9kYWxcclxuICAgIHRoaXMuZWxlbWVudHMuJG1vZGFsLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGhhdC5oaWRlTW9kYWwodGhhdCwgZSlcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGNoYW5nZSBzdGF0ZSBtb2RhbFxyXG4gICAgdGhpcy5lbGVtZW50cy4kdGFicy5jaGlsZHJlbignZGl2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoYXQuY2hhbmdlU3RhdGUodGhhdCwgZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBjaGFuZ2Ugc3RhdGUgbW9kYWwgbW9iaWxlXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRtb2RhbE1vYmlsZS5jaGlsZHJlbignYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB0aGF0LmNoYW5nZVN0YXRlTW9iaWxlKHRoYXQsIGUpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbHMucHJvdG90eXBlLnNob3dNb2RhbCA9IGZ1bmN0aW9uICh0aGF0KSB7XHJcblxyXG4gICAgJCgnLm1vZGFsJykuZmFkZU91dCgzMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuZWQnKS5hZGRDbGFzcygnY2xvc2VkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGF0LmVsZW1lbnRzLiRtb2RhbC5mYWRlSW4oMzAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbHMucHJvdG90eXBlLmhpZGVNb2RhbCA9IGZ1bmN0aW9uICh0aGF0LCBlKSB7XHJcbiAgICB2YXIgbW9kYWwgPSB0aGF0LmVsZW1lbnRzLiRtb2RhbDtcclxuICAgIHZhciBjdXJyVGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2NsYXNzJyk7XHJcblxyXG4gICAgaWYgKGUudGFyZ2V0ID09PSBtb2RhbFswXSB8fCBjdXJyVGFyZ2V0ID09PSAnbW9kYWwtY2xvc2UnKSB7XHJcbiAgICAgICAgbW9kYWwuZmFkZU91dCgzMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWxzLnByb3RvdHlwZS5jaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uKHRoYXQsIGUpIHtcclxuICAgIHZhciB0YXJnZXREaXYgPSBlLnRhcmdldDtcclxuXHJcbiAgICAvLyBjaGFuZ2VUYWJcclxuICAgIHRoYXQuZWxlbWVudHMuJHRhYnMuY2hpbGRyZW4oJ2RpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGFyZ2V0RGl2KS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgLy8gY2hhbmdlQ29udGVudFxyXG4gICAgdmFyIGFjdGl2ZVRhYiA9IHRoYXQuZWxlbWVudHMuJHRhYnMuY2hpbGRyZW4oJ2RpdicpLmluZGV4KHRhcmdldERpdik7XHJcbiAgICB0aGF0LmVsZW1lbnRzLiRtb2RhbENvbnRlbnQuY2hpbGRyZW4oJ2RpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGhhdC5lbGVtZW50cy4kbW9kYWxDb250ZW50LmNoaWxkcmVuKCdkaXYnKVthY3RpdmVUYWJdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbn07XHJcblxyXG5Nb2RhbHMucHJvdG90eXBlLmNoYW5nZVN0YXRlTW9iaWxlID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdmFyICR0YWJzID0gdGhhdC5lbGVtZW50cy4kdGFicy5jaGlsZHJlbignZGl2Jyk7XHJcbiAgICB2YXIgJGNvbnRlbnQgPSB0aGF0LmVsZW1lbnRzLiRtb2RhbENvbnRlbnQuY2hpbGRyZW4oJ2RpdicpO1xyXG4gICAgdmFyIHRhYnNBY3RpdmVJbmRleCA9IHRoYXQuZWxlbWVudHMuJHRhYnMuY2hpbGRyZW4oJy5hY3RpdmUnKS5pbmRleCgpO1xyXG5cclxuICAgICRjb250ZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICR0YWJzLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIGlmICh0YWJzQWN0aXZlSW5kZXggPT09IDApIHtcclxuICAgICAgICAkKCRjb250ZW50WzFdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCgkdGFic1sxXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSBlbHNlIGlmICh0YWJzQWN0aXZlSW5kZXggPT09IDEpIHtcclxuICAgICAgICAkKCRjb250ZW50WzBdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCgkdGFic1swXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbHM7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2RhbHMuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBPcmRlckZvcm0gKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiRvcmRlckZvcm0gPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kb3JkZXJGb3JtWzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PcmRlckZvcm0ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRhY2NvcmRJdGVtOiB0aGlzLiRvcmRlckZvcm0uZmluZCgnLm9yZGVyLWFjY29yZGlvbi1pdGVtJyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1IZWFkOiB0aGlzLiRvcmRlckZvcm0uZmluZCgnLm9yZGVyLWFjY29yZGlvbi1pdGVtX19oZWFkJyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1Cb2R5OiB0aGlzLiRvcmRlckZvcm0uZmluZCgnLm9yZGVyLWFjY29yZGlvbi1pdGVtX19ib2R5JyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1CdG46IHRoaXMuJG9yZGVyRm9ybS5maW5kKCcub3JkZXItYWNjb3JkaW9uLWl0ZW1fX2FjdGlvbnMgYScpLFxyXG4gICAgICAgICRmb3JtU3VibWl0QnRuOiB0aGlzLiRvcmRlckZvcm0uZmluZCgnLm9yZGVyLXBheW1lbnRfX2FjdGlvbicpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudmFsaWRQYXJhbXMgPSB7XHJcbiAgICAgICAgZXJyb3JFbGVtZW50OiBcInBcIixcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICAvLyDQmtC+0L3RgtCw0LrRgtC90YvQtSDQtNCw0L3QvdGL0LVcclxuICAgICAgICAgICAgY291bnRyeToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2l0eToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gc3RyZWV0OiB7XHJcbiAgICAgICAgICAgIC8vICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICAvLyB9LFxyXG4gICAgICAgICAgICAvLyBob3VzZToge1xyXG4gICAgICAgICAgICAvLyAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgLy8gfSxcclxuICAgICAgICAgICAgLy8gcm9vbToge1xyXG4gICAgICAgICAgICAvLyAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgLy8gfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCh0L/QvtGB0L7QsSDQtNC+0YHRgtCw0LLQutC4XHJcbiAgICAgICAgICAgIGRlbGl2ZXJ5OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyDQodC/0L7RgdC+0LEg0L/QvtC70LDRgtGLXHJcbiAgICAgICAgICAgIHBheW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQu9C40YfQvdGL0LUg0LTQsNC90L3Ri9C1XHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHt9LFxyXG5cclxuICAgICAgICBpZ25vcmU6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJG9yZGVyRm9ybVZhbGlkID0gdGhpcy4kb3JkZXJGb3JtLnZhbGlkYXRlKHRoaXMudmFsaWRQYXJhbXMpO1xyXG5cclxuICAgIC8vIHNldCBpbml0aWFsIHN0YXRlXHJcbiAgICB2YXIgJGluaXRpYWxJdGVtID0gJCh0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtWzBdKTtcclxuICAgIHZhciAkaW5pdGlhbEJvZHkgPSAkKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1Cb2R5WzBdKTtcclxuXHJcbiAgICAkaW5pdGlhbEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJGluaXRpYWxJdGVtLmF0dHIoXCJkYXRhLXZpc2l0ZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJvZHkubm90KCRpbml0aWFsQm9keSkuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcblxyXG4gICAgdGhpcy4kb3JkZXJGb3JtLnZhbGlkYXRlKHRoaXMudmFsaWRQYXJhbXMpO1xyXG5cclxuICAgIC8vIGFkZCBldmVudHNcclxuICAgIHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1CdG4ub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdmFyIGNhbGxpbmdFbGVtID0gdGhpcztcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhhdC5hY2NvcmRpb25JdGVtQnRuQWN0aW9uKGNhbGxpbmdFbGVtKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1IZWFkLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGNhbGxpbmdFbGVtID0gdGhpcztcclxuICAgICAgICB0aGF0LmFjY29yZGlvbkl0ZW1IZWFkQWN0aW9uKGNhbGxpbmdFbGVtKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJGZvcm1TdWJtaXRCdG4ub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoYXQuc3VibWl0Rm9ybSgpO1xyXG4gICAgfSlcclxufTtcclxuXHJcbk9yZGVyRm9ybS5wcm90b3R5cGUuYWNjb3JkaW9uSXRlbUJ0bkFjdGlvbiA9IGZ1bmN0aW9uIChjYWxsaW5nRWxlbSkge1xyXG4gICAgdGhpcy5lbGVtZW50cy4kb3JkZXJGb3JtVmFsaWQuc2V0dGluZ3MuaWdub3JlID0gXCI6aGlkZGVuXCI7XHJcbiAgICB2YXIgcmVzbHRWYWxpZCA9IHRoaXMuJG9yZGVyRm9ybS52YWxpZCgpO1xyXG5cclxuICAgIGlmIChyZXNsdFZhbGlkKSB7XHJcbiAgICAgICAgdmFyIGNhbGxpbmdFbGVtUGFyZW50ID0gJChjYWxsaW5nRWxlbSkucGFyZW50cygnLm9yZGVyLWFjY29yZGlvbi1pdGVtJyk7XHJcbiAgICAgICAgdmFyIGNhbGxpbmdFbGVtSW5kZXggPSBjYWxsaW5nRWxlbVBhcmVudC5pbmRleCgpO1xyXG4gICAgICAgIHZhciAkY2FsbGluZ0VsZW0gPSAkKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1bY2FsbGluZ0VsZW1JbmRleCArIDFdKTtcclxuXHJcbiAgICAgICAgLy8gY2xlYXIgc3RhdGVcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtQm9keS5zbGlkZVVwKDMwMCk7XHJcblxyXG4gICAgICAgIC8vIHNldCBzdGF0ZVxyXG4gICAgICAgICRjYWxsaW5nRWxlbS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJGNhbGxpbmdFbGVtLmF0dHIoXCJkYXRhLXZpc2l0ZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJvZHlbY2FsbGluZ0VsZW1JbmRleCArIDFdKS5zbGlkZURvd24oMzAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gZ2V0IGVsZW0gcG9zaXRpb25cclxuICAgICAgICAgICAgdmFyIGNhbGxpbmdFbGVtUG9zVG9wID0gJGNhbGxpbmdFbGVtLnBvc2l0aW9uKCkudG9wO1xyXG5cclxuICAgICAgICAgICAgLy8gc2V0IHdpbmRvdyBwb3NpdGlvblxyXG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBjYWxsaW5nRWxlbVBvc1RvcCAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpIC0gMjB9LCA1MDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuT3JkZXJGb3JtLnByb3RvdHlwZS5hY2NvcmRpb25JdGVtSGVhZEFjdGlvbiA9IGZ1bmN0aW9uKGNhbGxpbmdFbGVtKSB7XHJcbiAgICB2YXIgY2FsbGluZ0VsZW1QYXJlbnQgPSAkKGNhbGxpbmdFbGVtKS5wYXJlbnRzKCcub3JkZXItYWNjb3JkaW9uLWl0ZW0nKTtcclxuXHJcbiAgICBpZiAoY2FsbGluZ0VsZW1QYXJlbnQuYXR0cignZGF0YS12aXNpdGVkJykgJiYgIWNhbGxpbmdFbGVtUGFyZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIHZhciBjYWxsaW5nRWxlbUluZGV4ID0gY2FsbGluZ0VsZW1QYXJlbnQuaW5kZXgoKTtcclxuXHJcbiAgICAgICAgLy8gY2xlYXIgc3RhdGVcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtQm9keS5zbGlkZVVwKDMwMCk7XHJcblxyXG4gICAgICAgIC8vIHNldCBzdGF0ZVxyXG4gICAgICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtjYWxsaW5nRWxlbUluZGV4XSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJvZHlbY2FsbGluZ0VsZW1JbmRleF0pLnNsaWRlRG93bigzMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBnZXQgZWxlbSBwb3NpdGlvblxyXG4gICAgICAgICAgICB2YXIgY2FsbGluZ0VsZW1Qb3NUb3AgPSBjYWxsaW5nRWxlbVBhcmVudC5wb3NpdGlvbigpLnRvcDtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldCB3aW5kb3cgcG9zaXRpb25cclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogY2FsbGluZ0VsZW1Qb3NUb3AgLSAkKCcuaGVhZGVyJykub3V0ZXJIZWlnaHQoKSAtIDIwfSwgNTAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbk9yZGVyRm9ybS5wcm90b3R5cGUuc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5lbGVtZW50cy4kb3JkZXJGb3JtVmFsaWQuc2V0dGluZ3MuaWdub3JlID0gXCJcIjtcclxuICAgIHZhciByZXNsdFZhbGlkID0gdGhpcy4kb3JkZXJGb3JtLnZhbGlkKCk7XHJcbiAgICBpZiAocmVzbHRWYWxpZCkge1xyXG4gICAgICAgIHRoaXMuJG9yZGVyRm9ybS5zdWJtaXQoKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3JkZXJGb3JtO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvb3JkZXJGb3JtLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gT3JkZXJQYXltZW50IChzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kb3JkZXJQYXltZW50ID0gJChzZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuJG9yZGVyUGF5bWVudFswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuT3JkZXJQYXltZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkaGVhZGVyOiAkKCcuaGVhZGVyJylcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSB7XHJcbiAgICAgICAgb3JkZXJQYXltZW50UG9zOiB0aGF0LiRvcmRlclBheW1lbnQucG9zaXRpb24oKS50b3BcclxuICAgIH07XHJcblxyXG4gICAgdGhhdC51cGRhdGVPblNjcm9sbCgpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGF0LnVwZGF0ZU9uU2Nyb2xsKCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk9yZGVyUGF5bWVudC5wcm90b3R5cGUudXBkYXRlT25TY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBoZWFkZXJIZWlnaHQgPSB0aGlzLmVsZW1lbnRzLiRoZWFkZXIub3V0ZXJIZWlnaHQoKSArIDIwO1xyXG4gICAgdmFyIHNjcm9sbFdpbmRvdyA9IHdpbmRvdy5wYWdlWU9mZnNldCArIGhlYWRlckhlaWdodDtcclxuXHJcbiAgICBpZiAoc2Nyb2xsV2luZG93ID4gdGhpcy5wYXJhbXMub3JkZXJQYXltZW50UG9zKSB7XHJcbiAgICAgICAgdGhpcy4kb3JkZXJQYXltZW50LmFkZENsYXNzKCdzdGlja3knKTtcclxuICAgICAgICB0aGlzLiRvcmRlclBheW1lbnQuY3NzKCd0b3AnLCBoZWFkZXJIZWlnaHQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRvcmRlclBheW1lbnQucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPcmRlclBheW1lbnQ7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9vcmRlclBheW1lbnQuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBvdXJDZXJ0aWZpY2F0ZXMgKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiRvdXJDZXJ0aWZpY2F0ZXMgPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kb3VyQ2VydGlmaWNhdGVzWzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm91ckNlcnRpZmljYXRlcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkb3VyQ2VydGlmaWNhdGVzTGluazogdGhpcy4kb3VyQ2VydGlmaWNhdGVzLmZpbmQoJy5vdXItY2VydGlmaWNhdGVzX19pdGVtIGEnKVxyXG4gICAgfTtcclxuICAgIC8vIG1hZ25pZmljIHBvcHVwXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRvdXJDZXJ0aWZpY2F0ZXNMaW5rLm1hZ25pZmljUG9wdXAoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgdmVydGljYWxGaXQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHpvb206IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgZHVyYXRpb246IDMwMFxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBvdXJDZXJ0aWZpY2F0ZXM7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL291ckNlcnRpZmljYXRlcy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIFBhcmFsbGF4UmV2aWV3cyAoc2VsZWN0b3IpIHtcclxuICAgIHRoaXMucmV2aWV3cyA9IHNlbGVjdG9yO1xyXG4gICAgdGhpcy4kcmV2aWV3cyA9ICQoc2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLiRyZXZpZXdzWzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblBhcmFsbGF4UmV2aWV3cy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgJCh0aGlzLnJldmlld3MpLnBhcmFsbGF4KCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhcmFsbGF4UmV2aWV3cztcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL3BhcmFsbGF4UmV2aWV3cy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIFBob3RvR2FsbGVyeSAoc2VsZWN0b3IpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJHBob3RvR2FsbGVyeSA9ICQoc2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLiRwaG90b0dhbGxlcnlbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuUGhvdG9HYWxsZXJ5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRwaG90b0dhbGxlcnlMaW5rOiB0aGlzLiRwaG90b0dhbGxlcnkuZmluZCgnLnBob3RvLWdhbGxlcnktaXRlbSBhJylcclxuICAgIH07XHJcbiAgICAvLyBtYWduaWZpYyBwb3B1cFxyXG4gICAgdGhpcy5lbGVtZW50cy4kcGhvdG9HYWxsZXJ5TGluay5tYWduaWZpY1BvcHVwKHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIGltYWdlOiB7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsRml0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB6b29tOiB7XHJcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzMDBcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGhvdG9HYWxsZXJ5O1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9waG90b0dhbGxlcnkuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBTbGlkZXJCZXN0U2FsZXMoc2VsZWN0b3IpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuc2xpZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuc2xpZGVyKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5TbGlkZXJCZXN0U2FsZXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1zID0ge1xyXG4gICAgICAgICRiZXN0c2VsbGVyc1NsaWRlcjogJCh0aGlzLnNsaWRlcilcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHBhcmFtcyA9IHtcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgIHNwZWVkOiA1MDAsXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMTgwLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVsZW1zLiRiZXN0c2VsbGVyc1NsaWRlci5vbignaW5pdCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhhdC5lbGVtcy4kYmVzdHNlbGxlcnNTbGlkZXIuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1zLiRiZXN0c2VsbGVyc1NsaWRlci5zbGljayhwYXJhbXMpO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2xpZGVyQmVzdFNhbGVzO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvc2xpZGVyQmVzdFNhbGVzLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gU2xpZGVyTWFpbihzbGlkZXIsIGludGVtQmcpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJHNsaWRlciA9ICQoc2xpZGVyKTtcclxuICAgIHRoaXMuaW50ZW1CZyA9IGludGVtQmc7XHJcblxyXG4gICAgaWYgKHRoaXMuJHNsaWRlclswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuU2xpZGVyTWFpbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHZhciBwYXJhbXMgPSB7XHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICBzcGVlZDogNTAwLFxyXG4gICAgICAgIGF1dG9wbGF5OiB0cnVlLFxyXG4gICAgICAgIGF1dG9wbGF5U3BlZWQ6IDUwMDBcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy4kc2xpZGVyLm9uKCdpbml0JywgZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGF0LiRzbGlkZXIuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuJHNsaWRlci5zbGljayhwYXJhbXMpO1xyXG5cclxuICAgIC8vINCY0L3QuNC30LjQsNC70LjQt9C40YDRg9C10YLRgdGPINC/0LDRgNCw0LvQu9Cw0LrRgVxyXG4gICAgdGhpcy5pbml0UGFyYWxsYXgodGhhdCk7XHJcbn07XHJcblxyXG5TbGlkZXJNYWluLnByb3RvdHlwZS5pbml0UGFyYWxsYXggPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICghKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA8IDc2OC0xNykpIHtcclxuICAgICAgICB0aGlzLnBhcmFtc1BhcmFsbGF4ID0ge1xyXG4gICAgICAgICAgICBzcGVlZDogLTEwLFxyXG4gICAgICAgICAgICBjZW50ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICB3cmFwcGVyOiBudWxsLFxyXG4gICAgICAgICAgICByb3VuZDogdHJ1ZSxcclxuICAgICAgICAgICAgdmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgICAgIGhvcml6b250YWw6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnBhcmFsbGF4ID0gbmV3IFJlbGxheCh0aGlzLmludGVtQmcsIHRoaXMucGFyYW1zUGFyYWxsYXgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2xpZGVyTWFpbjtcclxuXHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9zbGlkZXJNYWluLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gU3Vic2NyaXB0aW9uRm9ybSAoc2VsZWN0b3IpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJHN1YnNjcmlwdGlvbkZvcm0gPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kc3Vic2NyaXB0aW9uRm9ybVswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5TdWJzY3JpcHRpb25Gb3JtLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy4kc3Vic2NyaXB0aW9uRm9ybS5lYWNoKGZ1bmN0aW9uKCkgeyAgIC8vIDwtIHNlbGVjdHMgZXZlcnkgPGZvcm0+IG9uIHBhZ2VcclxuICAgICAgICAkKHRoaXMpLnZhbGlkYXRlKHsgICAgICAgIC8vIDwtIGluaXRpYWxpemUgdmFsaWRhdGUoKSBvbiBlYWNoIGZvcm1cclxuICAgICAgICAgICAgZXJyb3JFbGVtZW50OiBcInBcIixcclxuICAgICAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0JLQstC10LTQuNGC0LUgZW1haWwg0LDQtNGA0LXRgVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSBlbWFpbCDQutC+0YDRgNC10LrRgtC90L5cIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU3Vic2NyaXB0aW9uRm9ybTtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL3N1YnNjcmlwdGlvbkZvcm0uanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBVcGxvYWRlcihzZWxlY3Rvcikge1xyXG5cdHZhciB0aGF0ID0gdGhpcztcclxuXHR0aGlzLiRwYXJlbnQgPSAkKHNlbGVjdG9yKTtcclxuXHRpZiAodGhpcy4kcGFyZW50WzBdKSB7XHJcblx0XHR0aGlzLmluaXQodGhhdCk7XHJcblx0fVxyXG59XHJcblxyXG5VcGxvYWRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0aGF0KSB7XHJcblx0dGhpcy5lbGVtcyA9IHtcclxuXHRcdCRpbnB1dDogdGhpcy4kcGFyZW50LmZpbmQoJ1tkYXRhLXVwbG9hZC1pbnB1dF0nKSxcclxuXHRcdCR0ZXh0OiB0aGlzLiRwYXJlbnQuZmluZCgnW2RhdGEtdXBsb2FkLXRleHRdJylcclxuXHR9O1xyXG5cclxuXHR0aGlzLmVsZW1zLiRpbnB1dC5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0dGhhdC5jaGFuZ2VUZXh0KGUpO1xyXG5cdH0pXHJcbn07XHJcblxyXG5VcGxvYWRlci5wcm90b3R5cGUuY2hhbmdlVGV4dCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0dmFyIGZpbGVzID0gdGhpcy5lbGVtcy4kaW5wdXQuZ2V0KDApLmZpbGVzO1xyXG5cclxuXHRpZiAoZmlsZXMubGVuZ3RoKSB7XHJcblx0XHRmaWxlcyA9IGZpbGVzWzBdO1xyXG5cdFx0dGhpcy5lbGVtcy4kdGV4dC50ZXh0KGZpbGVzLm5hbWUpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aGlzLmVsZW1zLiR0ZXh0LnRleHQodGhpcy4kcGFyZW50LmRhdGEoJ3VwbG9hZC1kZWZhdWx0JykpO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXBsb2FkZXI7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi91cGxvYWRlci5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIFVzZXJUb29sc0Ryb3BEb3duIChzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kdXNlclRvb2xzRHJvcERvd24gPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kdXNlclRvb2xzRHJvcERvd25bMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblVzZXJUb29sc0Ryb3BEb3duLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkZHJvcERvd25IZWFkOiB0aGlzLiR1c2VyVG9vbHNEcm9wRG93bi5maW5kKCcudXNlci10b29scy1kcm9wLWRvd25fX2hlYWQnKSxcclxuICAgICAgICAkZHJvcERvd25NZW51OiB0aGlzLiR1c2VyVG9vbHNEcm9wRG93bi5maW5kKCcudXNlci10b29scy1kcm9wLWRvd25fX21lbnUnKSxcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kZHJvcERvd25IZWFkLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhhdC5jaGFuZ2VTdGF0ZVRvZ2dsZSh0aGF0LCBlKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHRoYXQuc2V0RGVmYXVsdFN0YXRlKHRoYXQsIGUpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuVXNlclRvb2xzRHJvcERvd24ucHJvdG90eXBlLmNoYW5nZVN0YXRlVG9nZ2xlID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhhdC4kdXNlclRvb2xzRHJvcERvd24udG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgIHRoYXQuZWxlbWVudHMuJGRyb3BEb3duTWVudS5zbGlkZVRvZ2dsZSgyMDApO1xyXG59O1xyXG5cclxuVXNlclRvb2xzRHJvcERvd24ucHJvdG90eXBlLnNldERlZmF1bHRTdGF0ZSA9IGZ1bmN0aW9uKHRoYXQsIGUpIHtcclxuICAgIHZhciAkdGFyZ2V0RWxlbWVudCA9ICQoZS50YXJnZXQpO1xyXG4gICAgaWYgKCEoJHRhcmdldEVsZW1lbnQgPT09IHRoYXQuJHVzZXJUb29sc0Ryb3BEb3duIHx8ICR0YXJnZXRFbGVtZW50LnBhcmVudHMoJy51c2VyLXRvb2xzLWRyb3AtZG93bicpWzBdKSkge1xyXG4gICAgICAgIHRoYXQuJHVzZXJUb29sc0Ryb3BEb3duLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgdGhhdC5lbGVtZW50cy4kZHJvcERvd25NZW51LnNsaWRlVXAoMjAwKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXNlclRvb2xzRHJvcERvd247XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi91c2VyVG9vbHNEcm9wRG93bi5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIHZhbGlkYXRpb24oKSB7XHJcbiAgICAkKFwiLnJlc3Rvcl9fZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgZXJyb3JFbGVtZW50OiBcInBcIixcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0JLQstC10LTQuNGC0LUgZW1haWwg0LDQtNGA0LXRgVwiLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1IGVtYWlsINC60L7RgNGA0LXQutGC0L3QvlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQktGF0L7QtCDQsiDQm9CaXHJcbiAgICAkKFwiLnNpbmctaW5fX2Zvcm1cIikudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yRWxlbWVudDogXCJwXCIsXHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiA1XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIixcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSBlbWFpbCDQutC+0YDRgNC10LrRgtC90L5cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IFwi0JrQvtGA0L7RgtC60LjQuSDQv9Cw0YDQvtC70YwgKNC80LXQvdC10LUgNSDRgdC40LzQstC+0LvQvtCyKVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINCb0JpcclxuICAgICQoXCIuc2luZy11cF9fZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgaWdub3JlOiBbXSxcclxuICAgICAgICBlcnJvckVsZW1lbnQ6IFwicFwiLFxyXG4gICAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGFzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogNVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb25maXJtX3Bhc3N3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogNSxcclxuICAgICAgICAgICAgICAgIGVxdWFsVG86IFwiI3NpbmctdXAtcGFzc1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdlbmRlcjoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJpdmFjeVBvbGljeToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IFwi0KHQu9C40YjQutC+0Lwg0LrQvtGA0L7RgtC60L7QtSDQuNC80Y9cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IFwi0KHQu9C40YjQutC+0Lwg0LrQvtGA0L7RgtC60LDRjyDRhNCw0LzQuNC70LjRj1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIixcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwINCy0LLQtdC00LjRgtC1IGVtYWlsINC60L7RgNGA0LXQutGC0L3QvlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIixcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogXCLQmtC+0YDQvtGC0LrQuNC5INC/0LDRgNC+0LvRjCAo0LzQtdC90LXQtSA1INGB0LjQvNCy0L7Qu9C+0LIpXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29uZmlybV9wYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IFwi0JrQvtGA0L7RgtC60LjQuSDQv9Cw0YDQvtC70YwgKNC80LXQvdC10LUgNSDRgdC40LzQstC+0LvQvtCyKVwiLFxyXG4gICAgICAgICAgICAgICAgZXF1YWxUbzogXCLQktCy0LXQtNC10L3QvdGL0LUg0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QvtC00LDRjtGCXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQktGL0LHQtdGA0LjRgtC1INCy0LDRiCDQv9C+0LtcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwcml2YWN5UG9saWN5OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCS0YXQvtC0INCyINCb0JpcclxuICAgICQoXCIjY29udGFjdHNfZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgZXJyb3JFbGVtZW50OiBcInBcIixcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250YWN0OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtZXNzYWdlOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250YWN0OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtZXNzYWdlOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vINC40LfQvNC10L3QtdC90LjQtSDQu9C40YfQvdGL0YUg0LTQsNC90L3Ri9GFINCyINCb0JpcclxuICAgICQoXCIudXNlci1kYXRhLWNoYW5nZS1mb3JtXCIpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uKGVycm9yLCBlbGVtZW50KSB7fVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0LjQt9C80LXQvdC10L3QuNC1INC60L7QvdGC0LDQutGC0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQm9CaXHJcbiAgICAkKFwiLmRlbGl2ZXJ5LWNvbnRhY3RzLWNoYW5nZS1mb3JtXCIpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBzdHJlZXQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhvdXNlOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByb29tOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHt9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiLnBhc3N3b3JkLWNoYW5nZS1mb3JtXCIpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBwYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFzc3dvcmRfbmV3OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogNVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb25maXJtX3Bhc3N3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogNSxcclxuICAgICAgICAgICAgICAgIGVxdWFsVG86IFwiI3VzZXItY2FiLXBhc3NcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHt9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGlvbjtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL3ZhbGlkYXRpb24uanNcIixcIi9cIikiXX0=
