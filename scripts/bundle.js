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
var OrderAccordion = require('./orderAccordion');
var OrderPayment = require('./orderPayment');
var OrederForm = require('./orderForm');
var FaqAccordion = require('./faqAccordion');
var AdvantagesTabs = require('./advantagesTabs');
var CatalogDetailSlider = require('./catalogDetailSlider');
var ParallaxReviews = require('./parallaxReviews');
var Modal = require('./modals');
var CustomInputCount = require('./customInputCount');
var PhotoGallery = require('./photoGallery');
var HistoryOrders = require('./historyOrders');
var OurCertificates = require('./ourCertificates');
var ContactsMap = require('./contactsMap');
var Basket = require('./basket');
var Uploader = require('./uploader');
var AcceptCookies = require('./acceptCookies');

window.onload = function () {
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
    new OrderAccordion('.order-accordion');
    new OrderPayment('.order-payment');

    // Корзина
    new Basket('.basket');

    // Модалки
    new Modal('.modal-auth', '.showAuth');
    new Modal('.modal-restor', '.showRestor');
    new Modal('.modal-filter-m', '.showFilterM');
    new Modal('.modal-catalog-quick-view', '.catalog-card__quick-view');

    // счетчик колличества товара
    new CustomInputCount('.custom-input-count');

    // Подтвтерждение испольвания кук
    new AcceptCookies('.accept-cookies');

    // Карта в контактах
    new ContactsMap('#contact_map');

    // Загрузчик файлов (контакты)
    new Uploader('[data-upload]');

    // Валидация
    validation();
};

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_b85f84b9.js","/")
},{"./acceptCookies":5,"./advantagesTabs":6,"./basket":7,"./catalogDetailSlider":8,"./contactsMap":9,"./customInputCount":10,"./faqAccordion":12,"./headerPlugin":13,"./historyOrders":14,"./modals":15,"./orderAccordion":16,"./orderForm":17,"./orderPayment":18,"./ourCertificates":19,"./parallaxReviews":20,"./photoGallery":21,"./sliderBestSales":22,"./sliderMain":23,"./uploader":24,"./userToolsDropDown":25,"./validation":26,"buffer":2,"qC859L":4}],12:[function(require,module,exports){
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
                $(this.elements.$accordItemContent[n]).slideUp(500);
            } else if(!this.elements.$accordItem[n].classList.contains('active')) {
                this.elements.$accordItem[n].classList.add('active');
                $(this.elements.$accordItemContent[n]).slideDown(500);
            }
        } else {
            this.elements.$accordItem[n].classList.remove('active');
            $(this.elements.$accordItemContent[n]).slideUp(500);
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
        this.$header.addClass("sticky");
        if (document.documentElement.clientWidth < 768-17) {
            // this.elements.$logo.slideDown();
        }
    } else {
        this.$header.removeClass("sticky");
    }
    // this.elements.$body.css("padding-top", headerHeight);
};

HeaderPlugin.prototype.updateOnResize = function() {
    var headerHeight = this.header.offsetHeight;
    var getWindowWidth = document.documentElement.clientWidth;

    if (getWindowWidth < 1180 - 17) {
        this.elements.$body.css("padding-top", headerHeight);
    } else {
        this.elements.$body.css("padding-top", 0);
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
        if (that.elements.$quickSlider[0]) {
            that.sliderCatalogQuickView(that);
        }
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
    console.log(activeTab);
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

Modals.prototype.sliderCatalogQuickView = function(that) {
    this.elements.$sliderMain = this.elements.$quickSlider.find('.catalog-quick-view-slider__main');
    this.elements.$sliderSub = this.elements.$quickSlider.find('.catalog-quick-view-slider__sub');

    if (this.elements.$sliderMain.hasClass('slick-initialized')) {
        return
    }

    var paramsMain = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        infinite: true,
        speed: 500,
        asNavFor: ".catalog-quick-view-slider__sub"
    };
    var paramsSub = {
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 500,
        asNavFor: ".catalog-quick-view-slider__main",
        centerMode: true,
        centerPadding: '0px'
    };


    this.elements.$sliderMain.on('init', function(){
        that.elements.$quickSlider.css("visibility", "visible");
    });

    this.elements.$sliderMain.slick(paramsMain);
    this.elements.$sliderSub.slick(paramsSub);

    this.elements.$sliderMain.on('afterChange', function(event, slick, currentSlide) {
        that.elements.$sliderSub.slick('slickGoTo', currentSlide);
        var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
        $('.slider-nav .slick-slide.is-active').removeClass('is-active');
        $(currrentNavSlideElem).addClass('is-active');
    });
    this.elements.$sliderSub.on('click', '.slick-slide', function(event) {
        event.preventDefault();
        var goToSingleSlide = $(this).data('slick-index');
        that.elements.$sliderMain.slick('slickGoTo', goToSingleSlide);
    });

};

module.exports = Modals;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modals.js","/")
},{"buffer":2,"qC859L":4}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function OrderAccordion (selector) {
    var that = this;
    this.$accordionParent = $(selector);

    if (this.$accordionParent[0]) {
        this.init(that);
    }
}

OrderAccordion.prototype.init = function(that) {
    this.elements = {
        $accordItem: this.$accordionParent.find('.order-accordion-item'),
        $accordItemHead: this.$accordionParent.find('.order-accordion-item__head'),
        $accordItemBody: this.$accordionParent.find('.order-accordion-item__body'),
        $accordItemBtn: this.$accordionParent.find('.order-accordion-item__actions a')
    };

    // set initial state
    var $initialItem = $(this.elements.$accordItem[0]);
    var $initialBody = $(this.elements.$accordItemBody[0]);

    $initialItem.addClass('active');
    $initialItem.attr("data-visited", "true");
    this.elements.$accordItemBody.not($initialBody).css("display", "none");

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
};


OrderAccordion.prototype.accordionItemBtnAction = function (callingElem) {
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
};

OrderAccordion.prototype.accordionItemHeadAction = function(callingElem) {
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

module.exports = OrderAccordion;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/orderAccordion.js","/")
},{"buffer":2,"qC859L":4}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function OrderForm (selector) {
    var that = this;
    this.$orderForm = $(selector);

    if (this.$orderForm[0]) {
        this.init();
    }
}

OrderForm.prototype.init = function() {

    $.validator.setDefaults({
        ignore: []
    });

    // validation form
    this.$orderForm.validate({
        errorElement: "p",
        rules: {
            // Контактные данные
            country: {
                required: true
            },
            city: {
                required: true
            },
            street: {
                required: true
            },
            house: {
                required: true
            },
            room: {
                required: true
            },

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
        errorPlacement: function(error, element) {}
    });
};


module.exports = OrderForm;

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/orderForm.js","/")
},{"buffer":2,"qC859L":4}],18:[function(require,module,exports){
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
},{"buffer":2,"qC859L":4}],19:[function(require,module,exports){
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
},{"buffer":2,"qC859L":4}],20:[function(require,module,exports){
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
},{"buffer":2,"qC859L":4}],21:[function(require,module,exports){
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
},{"buffer":2,"qC859L":4}],22:[function(require,module,exports){
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
},{"buffer":2,"qC859L":4}],23:[function(require,module,exports){
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
    // Подписка на рысслку
    $(".subscription-form").validate({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxzaXRlc1xcYnJ1bW1pXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9zaXRlcy9icnVtbWkvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiQzovc2l0ZXMvYnJ1bW1pL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJDOi9zaXRlcy9icnVtbWkvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJDOi9zaXRlcy9icnVtbWkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL2FjY2VwdENvb2tpZXMuanMiLCJDOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9hZHZhbnRhZ2VzVGFicy5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL2Jhc2tldC5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL2NhdGFsb2dEZXRhaWxTbGlkZXIuanMiLCJDOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9jb250YWN0c01hcC5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL2N1c3RvbUlucHV0Q291bnQuanMiLCJDOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9mYWtlX2I4NWY4NGI5LmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvZmFxQWNjb3JkaW9uLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvaGVhZGVyUGx1Z2luLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvaGlzdG9yeU9yZGVycy5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL21vZGFscy5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL29yZGVyQWNjb3JkaW9uLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvb3JkZXJGb3JtLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvb3JkZXJQYXltZW50LmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvb3VyQ2VydGlmaWNhdGVzLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvcGFyYWxsYXhSZXZpZXdzLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvcGhvdG9HYWxsZXJ5LmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvc2xpZGVyQmVzdFNhbGVzLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvc2xpZGVyTWFpbi5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL3VwbG9hZGVyLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvdXNlclRvb2xzRHJvcERvd24uanMiLCJDOi9zaXRlcy9icnVtbWkvc2NyaXB0cy92YWxpZGF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGJhc2U2NC1qc1xcXFxsaWJcXFxcYjY0LmpzXCIsXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGJhc2U2NC1qc1xcXFxsaWJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxidWZmZXJcXFxcaW5kZXguanNcIixcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcYnVmZmVyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxpZWVlNzU0XFxcXGluZGV4LmpzXCIsXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGllZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxccHJvY2Vzc1xcXFxicm93c2VyLmpzXCIsXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXHByb2Nlc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBBY2NlcHRDb29raWVzKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiRwYXJlbnQgPSAkKHNlbGVjdG9yKTtcclxuICAgIGlmICh0aGlzLiRwYXJlbnRbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkFjY2VwdENvb2tpZXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodGhhdCkge1xyXG4gICAgdGhpcy5lbGVtcyA9IHtcclxuICAgICAgICAkYWN0aW9uQnRuOiB0aGlzLiRwYXJlbnQuZmluZCgnLmFjY2VwdC1jb29raWVzX19hY3Rpb24nKVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVsZW1zLiRhY3Rpb25CdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoYXQuaGlkZUJsb2NrKGUpO1xyXG4gICAgfSlcclxufTtcclxuQWNjZXB0Q29va2llcy5wcm90b3R5cGUuaGlkZUJsb2NrID0gZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdGhpcy4kcGFyZW50LmZhZGVPdXQoNDAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY2NlcHRDb29raWVzO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvYWNjZXB0Q29va2llcy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIEFkdmFudGFnZXNUYWJzIChwYXJlbnQpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG4gICAgdGhpcy4kcGFyZW50ID0gJChwYXJlbnQpO1xyXG5cclxuICAgIGlmICh0aGlzLiRwYXJlbnRbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkFkdmFudGFnZXNUYWJzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbWVudHMgPSB7XHJcbiAgICAgICAgJGFkdk5hdkl0ZW06ICAgICAgICAgICB0aGlzLiRwYXJlbnQuZmluZChcIi5hZHZhbnRhZ2VzLW5hdiBsaVwiKSxcclxuICAgICAgICAkYWR2SXRlbXM6ICAgICAgICAgICAgIHRoaXMuJHBhcmVudC5maW5kKFwiLmFkdmFudGFnZXMtaXRlbXNcIiksXHJcbiAgICAgICAgJGFkdkl0ZW06ICAgICAgICAgICAgICB0aGlzLiRwYXJlbnQuZmluZChcIi5hZHZhbnRhZ2VzLWl0ZW1cIiksXHJcbiAgICAgICAgJGFkdkJvdHRvbUNoYW5nZTogICAgICB0aGlzLiRwYXJlbnQuZmluZChcIi5hZHZhbnRhZ2VzLWl0ZW1fX2FjdGlvblwiKVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnBhcmFtcyA9IHtcclxuICAgICAgICB0YWJzTGVuZ3RoOiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGFkdkl0ZW1zLmxlbmd0aFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRhZHZOYXZJdGVtLmNoaWxkcmVuKCdhJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoYXQuY2hhbmdlU3RhdGUodGhhdCwgZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRhZHZCb3R0b21DaGFuZ2UuY2hpbGRyZW4oJ2EnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhhdC5jaGFuZ2VTdGF0ZUJ1dHRvbSh0aGF0LCBlKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuQWR2YW50YWdlc1RhYnMucHJvdG90eXBlLmNoYW5nZVN0YXRlID0gZnVuY3Rpb24odGhhdCwgZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHZhciB0YXJnZXRMaW5rID0gZS50YXJnZXQ7XHJcbiAgICB2YXIgdGFyZ2V0TGlua0luZGV4ID0gJCh0YXJnZXRMaW5rKS5wYXJlbnRzKCdsaScpLmluZGV4KCk7XHJcblxyXG4gICAgLy8gY2hhbmdlTmF2IHN0YXRlXHJcbiAgICB0aGF0LmVsZW1lbnRzLiRhZHZOYXZJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGFyZ2V0TGluaykucGFyZW50cygnbGknKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgLy8gY2hhbmdlIGNvbnRlbnRcclxuICAgIHRoYXQuZWxlbWVudHMuJGFkdkl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCh0aGF0LmVsZW1lbnRzLiRhZHZJdGVtW3RhcmdldExpbmtJbmRleF0pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxufTtcclxuXHJcbkFkdmFudGFnZXNUYWJzLnByb3RvdHlwZS5jaGFuZ2VTdGF0ZUJ1dHRvbSA9IGZ1bmN0aW9uKHRoYXQsIGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB2YXIgaXRlbUFjdGl2ZUluZGV4ID0gdGhhdC5lbGVtZW50cy4kYWR2SXRlbXMuZmluZCgnLmFjdGl2ZScpLmluZGV4KCk7XHJcbiAgICB0aGF0LmVsZW1lbnRzLiRhZHZOYXZJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIHRoYXQuZWxlbWVudHMuJGFkdkl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgIGlmIChpdGVtQWN0aXZlSW5kZXggPCB0aGF0LnBhcmFtcy50YWJzTGVuZ3RoKSB7XHJcbiAgICAgICAgJCh0aGF0LmVsZW1lbnRzLiRhZHZOYXZJdGVtW2l0ZW1BY3RpdmVJbmRleCArIDFdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCh0aGF0LmVsZW1lbnRzLiRhZHZJdGVtW2l0ZW1BY3RpdmVJbmRleCArIDFdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoYXQuZWxlbWVudHMuJGFkdk5hdkl0ZW1bMF0pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKHRoYXQuZWxlbWVudHMuJGFkdkl0ZW1bMF0pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFkdmFudGFnZXNUYWJzO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9hZHZhbnRhZ2VzVGFicy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIEJhc2tldCAoc2VsZWN0b3IpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJGJhc2tldCA9ICQoc2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLiRiYXNrZXRbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuQmFza2V0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRiYXNrZXRab29tQnRuOiB0aGlzLiRiYXNrZXQuZmluZCgnLmJhc2tldC1pdGVtX196b29tJylcclxuICAgIH07XHJcbiAgICAvLyBtYWduaWZpYyBwb3B1cFxyXG4gICAgdGhpcy5lbGVtZW50cy4kYmFza2V0Wm9vbUJ0bi5tYWduaWZpY1BvcHVwKHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIGltYWdlOiB7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsRml0OiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHpvb206IHtcclxuICAgICAgICAvLyAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAvLyAgICAgZHVyYXRpb246IDMwMFxyXG4gICAgICAgIC8vIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYXNrZXQ7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Jhc2tldC5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIENhdGFsb2dEZXRhaWxTbGlkZXIoc2VsZWN0b3IpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuc2xpZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICB0aGlzLiRzbGlkZXIgPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kc2xpZGVyWzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DYXRhbG9nRGV0YWlsU2xpZGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtcyA9IHtcclxuICAgICAgICAkc2xpZGVyTWFpbjogdGhpcy4kc2xpZGVyLmZpbmQoJy5jYXRhbG9nLWRldGFpbC1zbGlkZXJfX21haW4nKSxcclxuICAgICAgICAkc2xpZGVyU3ViOiB0aGlzLiRzbGlkZXIuZmluZCgnLmNhdGFsb2ctZGV0YWlsLXNsaWRlcl9fc3ViJylcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHBhcmFtc01haW4gPSB7XHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICBzcGVlZDogNTAwLFxyXG4gICAgICAgIGFzTmF2Rm9yOiBcIi5jYXRhbG9nLWRldGFpbC1zbGlkZXJfX3N1YlwiXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBwYXJhbXNTdWIgPSB7XHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgc3BlZWQ6IDUwMCxcclxuICAgICAgICBhc05hdkZvcjogXCIuY2F0YWxvZy1kZXRhaWwtc2xpZGVyX19tYWluXCIsXHJcbiAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMHB4J1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVsZW1zLiRzbGlkZXJNYWluLm9uKCdpbml0JywgZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGF0LiRzbGlkZXIuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1zLiRzbGlkZXJNYWluLnNsaWNrKHBhcmFtc01haW4pO1xyXG4gICAgdGhpcy5lbGVtcy4kc2xpZGVyU3ViLnNsaWNrKHBhcmFtc1N1Yik7XHJcblxyXG4gICAgdGhpcy5lbGVtcy4kc2xpZGVyTWFpbi5vbignYWZ0ZXJDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSkge1xyXG4gICAgICAgIHRoYXQuZWxlbXMuJHNsaWRlclN1Yi5zbGljaygnc2xpY2tHb1RvJywgY3VycmVudFNsaWRlKTtcclxuICAgICAgICB2YXIgY3VycnJlbnROYXZTbGlkZUVsZW0gPSAnLnNsaWRlci1uYXYgLnNsaWNrLXNsaWRlW2RhdGEtc2xpY2staW5kZXg9XCInICsgY3VycmVudFNsaWRlICsgJ1wiXSc7XHJcbiAgICAgICAgJCgnLnNsaWRlci1uYXYgLnNsaWNrLXNsaWRlLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICAkKGN1cnJyZW50TmF2U2xpZGVFbGVtKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZWxlbXMuJHNsaWRlclN1Yi5vbignY2xpY2snLCAnLnNsaWNrLXNsaWRlJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBnb1RvU2luZ2xlU2xpZGUgPSAkKHRoaXMpLmRhdGEoJ3NsaWNrLWluZGV4Jyk7XHJcbiAgICAgICAgdGhhdC5lbGVtcy4kc2xpZGVyTWFpbi5zbGljaygnc2xpY2tHb1RvJywgZ29Ub1NpbmdsZVNsaWRlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCQoJy5jYXRhbG9nLWRldGFpbC1zbGlkZXJfX3pvb20tYnRuJykpO1xyXG5cclxuICAgIC8vIG1hZ25pZmljIHBvcHVwXHJcbiAgICAkKCcuY2F0YWxvZy1kZXRhaWwtc2xpZGVyX196b29tLWJ0bicpLm1hZ25pZmljUG9wdXAoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgLy8gY2xvc2VPbkNvbnRlbnRDbGljazogdHJ1ZSxcclxuICAgICAgICAvLyBjbG9zZUJ0bkluc2lkZTogZmFsc2UsXHJcbiAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgdmVydGljYWxGaXQ6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gem9vbToge1xyXG4gICAgICAgIC8vICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgIC8vICAgICBkdXJhdGlvbjogMzAwIC8vIGRvbid0IGZvZ2V0IHRvIGNoYW5nZSB0aGUgZHVyYXRpb24gYWxzbyBpbiBDU1NcclxuICAgICAgICAvLyB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2F0YWxvZ0RldGFpbFNsaWRlcjtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2NhdGFsb2dEZXRhaWxTbGlkZXIuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBDb250YWN0c01hcChzZWxlY3Rvcikge1xyXG5cdHZhciB0aGF0ID0gdGhpcztcclxuXHR0aGlzLiRwYXJlbnQgPSAkKHNlbGVjdG9yKTtcclxuXHRpZiAodGhpcy4kcGFyZW50WzBdKSB7XHJcblx0XHR0aGlzLmluaXQodGhhdCk7XHJcblx0fVxyXG59XHJcblxyXG5Db250YWN0c01hcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0aGF0KSB7XHJcblx0aWYgKHRoaXMuJHBhcmVudC5sZW5ndGgpIHtcclxuXHRcdHRoaXMuZWxlbXMgPSB7XHJcblx0XHRcdG1hcDogdGhpcy4kcGFyZW50LmdldCgwKVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLm9wdGlvbnMgPSB7XHJcblx0XHRcdGNlbnRlcjogWzU0Ljk4ODkyMjQ1LCA4Mi44ODU0ODI3NV0sXHJcblx0XHRcdHBsYWNlbWFyazogJy9pbWFnZXMvbWFwL3BsYWNlbWFyay5wbmcnXHJcblx0XHR9O1xyXG5cclxuXHRcdHltYXBzLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIG15TWFwID0gbmV3IHltYXBzLk1hcCh0aGF0LmVsZW1zLm1hcC5nZXRBdHRyaWJ1dGUoJ2lkJyksIHtcclxuXHRcdFx0XHRcdGNlbnRlcjogdGhhdC5vcHRpb25zLmNlbnRlcixcclxuXHRcdFx0XHRcdHpvb206IDE3LFxyXG5cdFx0XHRcdFx0Y29udHJvbHM6IFtdXHJcblx0XHRcdFx0fSksXHJcblx0XHRcdFx0bXlQbGFjZW1hcmsgPSBuZXcgeW1hcHMuUGxhY2VtYXJrKG15TWFwLmdldENlbnRlcigpLCB7fSwge1xyXG5cdFx0XHRcdFx0aWNvbkxheW91dDogJ2RlZmF1bHQjaW1hZ2UnLFxyXG5cdFx0XHRcdFx0aWNvbkltYWdlSHJlZjogdGhhdC5vcHRpb25zLnBsYWNlbWFyayxcclxuXHRcdFx0XHRcdGljb25JbWFnZVNpemU6IFs4NSwgMTAwXSxcclxuXHRcdFx0XHRcdGljb25JbWFnZU9mZnNldDogWy00Mi40LCAtMTAwXVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bXlNYXAuZ2VvT2JqZWN0c1xyXG5cdFx0XHRcdC5hZGQobXlQbGFjZW1hcmspO1xyXG5cdFx0fSlcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRhY3RzTWFwO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvY29udGFjdHNNYXAuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBDdXN0b21JbnB1dENvdW50KHNlbGVjdG9yKSB7XHJcbiAgICB0aGlzLiRjb3VudGVyID0gJChzZWxlY3Rvcik7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICBpZiAodGhpcy4kY291bnRlclswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuQ3VzdG9tSW5wdXRDb3VudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbXMgPSB7XHJcbiAgICAgICAgJGJ0bk1pbnVzOiB0aGlzLiRjb3VudGVyLmZpbmQoJy5taW51cycpLFxyXG4gICAgICAgICRidG5QbHVzOiB0aGlzLiRjb3VudGVyLmZpbmQoJy5wbHVzJylcclxuICAgIH07XHJcbiAgICB0aGlzLmVsZW1zLiRidG5NaW51cy5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnN0ZXBEb3duKCk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZWxlbXMuJGJ0blBsdXMub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGlzLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignaW5wdXQnKS5zdGVwVXAoKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDdXN0b21JbnB1dENvdW50O1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9jdXN0b21JbnB1dENvdW50LmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIEhlYWRlclBsdWdpbiA9IHJlcXVpcmUoJy4vaGVhZGVyUGx1Z2luJyk7XHJcbnZhciBVc2VyVG9vbHNEcm9wRG93biA9IHJlcXVpcmUoJy4vdXNlclRvb2xzRHJvcERvd24nKTtcclxudmFyIHZhbGlkYXRpb24gPSByZXF1aXJlKCcuL3ZhbGlkYXRpb24nKTtcclxudmFyIFNsaWRlck1haW4gPSByZXF1aXJlKCcuL3NsaWRlck1haW4nKTtcclxudmFyIFNsaWRlckJlc3RTYWxlcyA9IHJlcXVpcmUoJy4vc2xpZGVyQmVzdFNhbGVzJyk7XHJcbnZhciBPcmRlckFjY29yZGlvbiA9IHJlcXVpcmUoJy4vb3JkZXJBY2NvcmRpb24nKTtcclxudmFyIE9yZGVyUGF5bWVudCA9IHJlcXVpcmUoJy4vb3JkZXJQYXltZW50Jyk7XHJcbnZhciBPcmVkZXJGb3JtID0gcmVxdWlyZSgnLi9vcmRlckZvcm0nKTtcclxudmFyIEZhcUFjY29yZGlvbiA9IHJlcXVpcmUoJy4vZmFxQWNjb3JkaW9uJyk7XHJcbnZhciBBZHZhbnRhZ2VzVGFicyA9IHJlcXVpcmUoJy4vYWR2YW50YWdlc1RhYnMnKTtcclxudmFyIENhdGFsb2dEZXRhaWxTbGlkZXIgPSByZXF1aXJlKCcuL2NhdGFsb2dEZXRhaWxTbGlkZXInKTtcclxudmFyIFBhcmFsbGF4UmV2aWV3cyA9IHJlcXVpcmUoJy4vcGFyYWxsYXhSZXZpZXdzJyk7XHJcbnZhciBNb2RhbCA9IHJlcXVpcmUoJy4vbW9kYWxzJyk7XHJcbnZhciBDdXN0b21JbnB1dENvdW50ID0gcmVxdWlyZSgnLi9jdXN0b21JbnB1dENvdW50Jyk7XHJcbnZhciBQaG90b0dhbGxlcnkgPSByZXF1aXJlKCcuL3Bob3RvR2FsbGVyeScpO1xyXG52YXIgSGlzdG9yeU9yZGVycyA9IHJlcXVpcmUoJy4vaGlzdG9yeU9yZGVycycpO1xyXG52YXIgT3VyQ2VydGlmaWNhdGVzID0gcmVxdWlyZSgnLi9vdXJDZXJ0aWZpY2F0ZXMnKTtcclxudmFyIENvbnRhY3RzTWFwID0gcmVxdWlyZSgnLi9jb250YWN0c01hcCcpO1xyXG52YXIgQmFza2V0ID0gcmVxdWlyZSgnLi9iYXNrZXQnKTtcclxudmFyIFVwbG9hZGVyID0gcmVxdWlyZSgnLi91cGxvYWRlcicpO1xyXG52YXIgQWNjZXB0Q29va2llcyA9IHJlcXVpcmUoJy4vYWNjZXB0Q29va2llcycpO1xyXG5cclxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vINCo0LDQv9C60LBcclxuICAgIG5ldyBIZWFkZXJQbHVnaW4oJy5oZWFkZXInKTtcclxuXHJcbiAgICAvLyB1c2VyLXRvb2xzXHJcbiAgICBuZXcgVXNlclRvb2xzRHJvcERvd24oJy51c2VyLXRvb2xzLWRyb3AtZG93bicpO1xyXG5cclxuICAgIC8vINCf0LDRgNCw0LvQu9Cw0LrRgVxyXG4gICAgbmV3IFBhcmFsbGF4UmV2aWV3cygnLnJldmlld3Mtc2VjdGlvbicpO1xyXG5cclxuICAgIC8vINCh0LvQsNC50LTQtdGA0YtcclxuICAgIG5ldyBTbGlkZXJNYWluKCcuc2xpZGVyLW1haW5fX2xpc3QnLCAnLnNsaWRlci1tYWluLWl0ZW1fX2JnJyk7XHJcbiAgICBuZXcgU2xpZGVyQmVzdFNhbGVzKCcuYmVzdHNlbGxlcnMtc2xpZGVyJyk7XHJcbiAgICBuZXcgQ2F0YWxvZ0RldGFpbFNsaWRlcignLmNhdGFsb2ctZGV0YWlsLXNsaWRlcicpO1xyXG5cclxuICAgIC8vINCQ0LrQutC+0YDQtNC10L7QvdGLXHJcbiAgICBuZXcgRmFxQWNjb3JkaW9uKCcuZmFxLWNhdGVnb3JpZXMnKTtcclxuXHJcbiAgICAvLyDRhNC+0YLQvtCz0LDQu9C70LXRgNC10Y9cclxuICAgIG5ldyBQaG90b0dhbGxlcnkoJy5waG90by1nYWxsZXJ5Jyk7XHJcblxyXG4gICAgLy8g0J/RgNC10LjQvNGD0YnQtdGB0YLQstCwXHJcbiAgICBuZXcgQWR2YW50YWdlc1RhYnMoJy5hZHZhbnRhZ2VzJyk7XHJcblxyXG4gICAgLy8g0J3QsNGI0Lgg0YHQtdGA0YLQuNGE0LjQutCw0YLRi1xyXG4gICAgbmV3IE91ckNlcnRpZmljYXRlcygnLm91ci1jZXJ0aWZpY2F0ZXMnKTtcclxuXHJcbiAgICAvLyDQmNGB0YLQvtGA0LjRjyDQt9Cw0LrQsNC30L7QsiDQsiDQm9CaXHJcbiAgICBuZXcgSGlzdG9yeU9yZGVycygnLmhpc3Rvcnktb3JkZXJzJyk7XHJcblxyXG4gICAgLy8g0JfQsNC60LDQt9GLXHJcbiAgICBuZXcgT3JlZGVyRm9ybSgnLm9yZGVyLWZvcm0nKTtcclxuICAgIG5ldyBPcmRlckFjY29yZGlvbignLm9yZGVyLWFjY29yZGlvbicpO1xyXG4gICAgbmV3IE9yZGVyUGF5bWVudCgnLm9yZGVyLXBheW1lbnQnKTtcclxuXHJcbiAgICAvLyDQmtC+0YDQt9C40L3QsFxyXG4gICAgbmV3IEJhc2tldCgnLmJhc2tldCcpO1xyXG5cclxuICAgIC8vINCc0L7QtNCw0LvQutC4XHJcbiAgICBuZXcgTW9kYWwoJy5tb2RhbC1hdXRoJywgJy5zaG93QXV0aCcpO1xyXG4gICAgbmV3IE1vZGFsKCcubW9kYWwtcmVzdG9yJywgJy5zaG93UmVzdG9yJyk7XHJcbiAgICBuZXcgTW9kYWwoJy5tb2RhbC1maWx0ZXItbScsICcuc2hvd0ZpbHRlck0nKTtcclxuICAgIG5ldyBNb2RhbCgnLm1vZGFsLWNhdGFsb2ctcXVpY2stdmlldycsICcuY2F0YWxvZy1jYXJkX19xdWljay12aWV3Jyk7XHJcblxyXG4gICAgLy8g0YHRh9C10YLRh9C40Log0LrQvtC70LvQuNGH0LXRgdGC0LLQsCDRgtC+0LLQsNGA0LBcclxuICAgIG5ldyBDdXN0b21JbnB1dENvdW50KCcuY3VzdG9tLWlucHV0LWNvdW50Jyk7XHJcblxyXG4gICAgLy8g0J/QvtC00YLQstGC0LXRgNC20LTQtdC90LjQtSDQuNGB0L/QvtC70YzQstCw0L3QuNGPINC60YPQulxyXG4gICAgbmV3IEFjY2VwdENvb2tpZXMoJy5hY2NlcHQtY29va2llcycpO1xyXG5cclxuICAgIC8vINCa0LDRgNGC0LAg0LIg0LrQvtC90YLQsNC60YLQsNGFXHJcbiAgICBuZXcgQ29udGFjdHNNYXAoJyNjb250YWN0X21hcCcpO1xyXG5cclxuICAgIC8vINCX0LDQs9GA0YPQt9GH0LjQuiDRhNCw0LnQu9C+0LIgKNC60L7QvdGC0LDQutGC0YspXHJcbiAgICBuZXcgVXBsb2FkZXIoJ1tkYXRhLXVwbG9hZF0nKTtcclxuXHJcbiAgICAvLyDQktCw0LvQuNC00LDRhtC40Y9cclxuICAgIHZhbGlkYXRpb24oKTtcclxufTtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfYjg1Zjg0YjkuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBGYXFBY2NvcmRpb24oYWNjb3JkaW9uUGFyZW50KSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLmFjY29yZGlvblBhcmVudCA9ICQoYWNjb3JkaW9uUGFyZW50KTtcclxuICAgIGlmICh0aGlzLmFjY29yZGlvblBhcmVudFswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuRmFxQWNjb3JkaW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkYWNjb3JkSXRlbTogdGhpcy5hY2NvcmRpb25QYXJlbnQuZmluZCgnLmZhcS1jYXRlZ29yeV9faXRlbScpLFxyXG4gICAgICAgICRhY2NvcmRJdGVtSGVhZDogdGhpcy5hY2NvcmRpb25QYXJlbnQuZmluZCgnLmZhcS1jYXRlZ29yeV9faGVhZCcpLFxyXG4gICAgICAgICRhY2NvcmRJdGVtQ29udGVudDogdGhpcy5hY2NvcmRpb25QYXJlbnQuZmluZCgnLmZhcS1jYXRlZ29yeV9fY29udGVudCcpXHJcbiAgICB9O1xyXG4gICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUhlYWQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY2FsbGluZ0VsZW0gPSB0aGlzO1xyXG4gICAgICAgIHRoYXQuYWNjb3JkSXRlbUFjdGlvbihjYWxsaW5nRWxlbSlcclxuICAgIH0pO1xyXG59O1xyXG5cclxuRmFxQWNjb3JkaW9uLnByb3RvdHlwZS5hY2NvcmRJdGVtQWN0aW9uID0gZnVuY3Rpb24oY2FsbGluZ0VsZW0pIHtcclxuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbS5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtSGVhZFtuXSA9PT0gY2FsbGluZ0VsZW0pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1bbl0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtuXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUNvbnRlbnRbbl0pLnNsaWRlVXAoNTAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCF0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtW25dLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1bbl0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1Db250ZW50W25dKS5zbGlkZURvd24oNTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1bbl0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUNvbnRlbnRbbl0pLnNsaWRlVXAoNTAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZhcUFjY29yZGlvbjtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2ZhcUFjY29yZGlvbi5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIEhlYWRlclBsdWdpbihzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy5oZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgIHRoaXMuJGhlYWRlciA9ICQoc2VsZWN0b3IpO1xyXG4gICAgaWYgKHRoaXMuJGhlYWRlclswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuSGVhZGVyUGx1Z2luLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkaGVhZGVyTmF2TW9iaWxlOiB0aGlzLiRoZWFkZXIuZmluZCgnLmhlYWRlci1uYXYtbW9iaWxlJyksXHJcbiAgICAgICAgJGhlYWRlck5hdk1vYmlsZUxpc3Q6IHRoaXMuJGhlYWRlci5maW5kKCcuaGVhZGVyLW5hdi1tb2JpbGVfX2xpc3QnKSxcclxuICAgICAgICAkaGVhZGVyTmF2TW9iaWxlQnRuOiB0aGlzLiRoZWFkZXIuZmluZCgnLmhlYWRlci1uYXYtbW9iaWxlX19idG4nKSxcclxuICAgICAgICAkaGVhZGVyRXhwYW5kOiB0aGlzLiRoZWFkZXIuZmluZCgnLmhlYWRlcl9fZXhwYW5kJyksXHJcbiAgICAgICAgJGxvZ286IHRoaXMuJGhlYWRlci5maW5kKCcubG9nbycpLFxyXG4gICAgICAgICRib2R5OiAkKCdib2R5JylcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy51cGRhdGVPblNjcm9sbCgpO1xyXG4gICAgdGhpcy51cGRhdGVPblJlc2l6ZSgpO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJGhlYWRlck5hdk1vYmlsZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGF0Lm5hdlRvZ2dsZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoYXQudXBkYXRlT25TY3JvbGwoKTtcclxuICAgIH0pO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoYXQudXBkYXRlT25SZXNpemUoKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbkhlYWRlclBsdWdpbi5wcm90b3R5cGUudXBkYXRlT25TY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBoZWFkZXJIZWlnaHQgPSB0aGlzLmhlYWRlci5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+PSBoZWFkZXJIZWlnaHQgLyAxLjUpIHtcclxuICAgICAgICB0aGlzLiRoZWFkZXIuYWRkQ2xhc3MoXCJzdGlja3lcIik7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA8IDc2OC0xNykge1xyXG4gICAgICAgICAgICAvLyB0aGlzLmVsZW1lbnRzLiRsb2dvLnNsaWRlRG93bigpO1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kaGVhZGVyLnJlbW92ZUNsYXNzKFwic3RpY2t5XCIpO1xyXG4gICAgfVxyXG4gICAgLy8gdGhpcy5lbGVtZW50cy4kYm9keS5jc3MoXCJwYWRkaW5nLXRvcFwiLCBoZWFkZXJIZWlnaHQpO1xyXG59O1xyXG5cclxuSGVhZGVyUGx1Z2luLnByb3RvdHlwZS51cGRhdGVPblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGhlYWRlckhlaWdodCA9IHRoaXMuaGVhZGVyLm9mZnNldEhlaWdodDtcclxuICAgIHZhciBnZXRXaW5kb3dXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aDtcclxuXHJcbiAgICBpZiAoZ2V0V2luZG93V2lkdGggPCAxMTgwIC0gMTcpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLiRib2R5LmNzcyhcInBhZGRpbmctdG9wXCIsIGhlYWRlckhlaWdodCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMuJGJvZHkuY3NzKFwicGFkZGluZy10b3BcIiwgMCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5IZWFkZXJQbHVnaW4ucHJvdG90eXBlLm5hdlRvZ2dsZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5lbGVtZW50cy4kaGVhZGVyTmF2TW9iaWxlLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIHRoaXMuZWxlbWVudHMuJGhlYWRlck5hdk1vYmlsZUxpc3Quc2xpZGVUb2dnbGUoMjUwKTtcclxuXHJcbiAgICBpZiAoIShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggPCA3NjgtMTcpKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5lbGVtZW50cy4kaGVhZGVyTmF2TW9iaWxlLmhhc0NsYXNzKCdhY3RpdmUnKSAmJiAhdGhpcy5oZWFkZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdGlja3knKSkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMuJGhlYWRlckV4cGFuZC5zbGlkZVVwKDMwMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMuJGhlYWRlckV4cGFuZC5zbGlkZURvd24oMzAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlclBsdWdpbjtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2hlYWRlclBsdWdpbi5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIEhpc3RvcnlPcmRlcnMocGFyZW50KSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiRoaXN0b3J5T3JkZXJzUGFyZW50ID0gJChwYXJlbnQpO1xyXG4gICAgaWYgKHRoaXMuJGhpc3RvcnlPcmRlcnNQYXJlbnRbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkhpc3RvcnlPcmRlcnMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRoaXN0b3J5T3JkZXJzTGlzdDogdGhpcy4kaGlzdG9yeU9yZGVyc1BhcmVudC5maW5kKCcuaGlzdG9yeS1vcmRlcnMtbGlzdCcpLFxyXG4gICAgICAgICRoaXN0b3J5T3JkZXJzTGlzdEhlYWQ6IHRoaXMuJGhpc3RvcnlPcmRlcnNQYXJlbnQuZmluZCgnLmhpc3Rvcnktb3JkZXJzLWxpc3RfX2hlYWQgaDMnKSxcclxuICAgICAgICAkaGlzdG9yeU9yZGVyc0xpc3RCb2R5OiB0aGlzLiRoaXN0b3J5T3JkZXJzUGFyZW50LmZpbmQoJy5oaXN0b3J5LW9yZGVycy1saXN0X19ib2R5JyksXHJcbiAgICAgICAgJGhpc3RvcnlPcmRlcnNJdGVtOiB0aGlzLiRoaXN0b3J5T3JkZXJzUGFyZW50LmZpbmQoJy5oaXN0b3J5LW9yZGVycy1pdGVtX196b29tJylcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIG1hZ25pZmljIHBvcHVwXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzSXRlbS5tYWduaWZpY1BvcHVwKHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIGltYWdlOiB7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsRml0OiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gYWNjb3JkaW9uXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdEhlYWQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY2FsbGluZ0VsZW0gPSB0aGlzO1xyXG4gICAgICAgIHRoYXQuYWNjb3JkSXRlbUFjdGlvbihjYWxsaW5nRWxlbSwgdGhhdClcclxuICAgIH0pO1xyXG59O1xyXG5cclxuSGlzdG9yeU9yZGVycy5wcm90b3R5cGUuYWNjb3JkSXRlbUFjdGlvbiA9IGZ1bmN0aW9uKGNhbGxpbmdFbGVtLCB0aGF0KSB7XHJcbiAgICBmb3IgKHZhciBuID0gMDsgbiA8IHRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0Lmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0SGVhZFtuXSA9PT0gY2FsbGluZ0VsZW0pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0W25dLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcy5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3RCb2R5W25dKS5zbGlkZVVwKDUwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdFtuXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCF0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdFtuXS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdFtuXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQodGhpcy5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3RCb2R5W25dKS5zbGlkZURvd24oNTAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQodGhpcy5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3RCb2R5W25dKS5zbGlkZVVwKDUwMCk7XHJcbiAgICAgICAgICAgIHRoYXQuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0W25dLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGlzdG9yeU9yZGVycztcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2hpc3RvcnlPcmRlcnMuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBNb2RhbHMgKG1vZGFsLCBkZWZpYW50RWxlbSkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy5tb2RhbCA9IG1vZGFsO1xyXG4gICAgdGhpcy4kbW9kYWwgPSAkKG1vZGFsKTtcclxuXHJcbiAgICBpZiAodGhpcy4kbW9kYWxbMF0pIHtcclxuICAgICAgICB0aGlzLmRlZmlhbnRFbGVtID0gZGVmaWFudEVsZW07XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Nb2RhbHMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodGhhdCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkbW9kYWw6ICAgICAgICAgICAgICB0aGlzLiRtb2RhbCxcclxuICAgICAgICAkY2xvc2VCdG46ICAgICAgICAgICB0aGlzLiRtb2RhbC5maW5kKFwiLm1vZGFsLWNsb3NlXCIpLFxyXG4gICAgICAgICR0YWJzOiAgICAgICAgICAgICAgIHRoaXMuJG1vZGFsLmZpbmQoXCIubW9kYWxfX3RhYnNcIiksXHJcbiAgICAgICAgJG1vZGFsQ29udGVudDogICAgICAgdGhpcy4kbW9kYWwuZmluZChcIi5tb2RhbF9fY29udGVudFwiKSxcclxuICAgICAgICAkbW9kYWxNb2JpbGU6ICAgICAgICB0aGlzLiRtb2RhbC5maW5kKFwiLm1vZGFsX19tb2JpbGVcIiksXHJcbiAgICAgICAgJHF1aWNrU2xpZGVyOiAgICAgICAgdGhpcy4kbW9kYWwuZmluZChcIi5jYXRhbG9nLXF1aWNrLXZpZXctc2xpZGVyXCIpXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBzaG93IG1vZGFsXHJcbiAgICAkKHRoaXMuZGVmaWFudEVsZW0pLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoYXQuc2hvd01vZGFsKHRoYXQpO1xyXG4gICAgICAgIGlmICh0aGF0LmVsZW1lbnRzLiRxdWlja1NsaWRlclswXSkge1xyXG4gICAgICAgICAgICB0aGF0LnNsaWRlckNhdGFsb2dRdWlja1ZpZXcodGhhdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJGNsb3NlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoYXQuaGlkZU1vZGFsKHRoYXQsIGUpXHJcbiAgICB9KTtcclxuICAgIC8vIGhpZGUgbW9kYWxcclxuICAgIHRoaXMuZWxlbWVudHMuJG1vZGFsLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGhhdC5oaWRlTW9kYWwodGhhdCwgZSlcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGNoYW5nZSBzdGF0ZSBtb2RhbFxyXG4gICAgdGhpcy5lbGVtZW50cy4kdGFicy5jaGlsZHJlbignZGl2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoYXQuY2hhbmdlU3RhdGUodGhhdCwgZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBjaGFuZ2Ugc3RhdGUgbW9kYWwgbW9iaWxlXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRtb2RhbE1vYmlsZS5jaGlsZHJlbignYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB0aGF0LmNoYW5nZVN0YXRlTW9iaWxlKHRoYXQsIGUpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbHMucHJvdG90eXBlLnNob3dNb2RhbCA9IGZ1bmN0aW9uICh0aGF0KSB7XHJcblxyXG4gICAgJCgnLm1vZGFsJykuZmFkZU91dCgzMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuZWQnKS5hZGRDbGFzcygnY2xvc2VkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGF0LmVsZW1lbnRzLiRtb2RhbC5mYWRlSW4oMzAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY2xvc2VkJykuYWRkQ2xhc3MoJ29wZW5lZCcpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5Nb2RhbHMucHJvdG90eXBlLmhpZGVNb2RhbCA9IGZ1bmN0aW9uICh0aGF0LCBlKSB7XHJcbiAgICB2YXIgbW9kYWwgPSB0aGF0LmVsZW1lbnRzLiRtb2RhbDtcclxuICAgIHZhciBjdXJyVGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2NsYXNzJyk7XHJcblxyXG4gICAgaWYgKGUudGFyZ2V0ID09PSBtb2RhbFswXSB8fCBjdXJyVGFyZ2V0ID09PSAnbW9kYWwtY2xvc2UnKSB7XHJcbiAgICAgICAgbW9kYWwuZmFkZU91dCgzMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdvcGVuJykuYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWxzLnByb3RvdHlwZS5jaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uKHRoYXQsIGUpIHtcclxuICAgIHZhciB0YXJnZXREaXYgPSBlLnRhcmdldDtcclxuXHJcbiAgICAvLyBjaGFuZ2VUYWJcclxuICAgIHRoYXQuZWxlbWVudHMuJHRhYnMuY2hpbGRyZW4oJ2RpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGFyZ2V0RGl2KS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgLy8gY2hhbmdlQ29udGVudFxyXG4gICAgdmFyIGFjdGl2ZVRhYiA9IHRoYXQuZWxlbWVudHMuJHRhYnMuY2hpbGRyZW4oJ2RpdicpLmluZGV4KHRhcmdldERpdik7XHJcbiAgICBjb25zb2xlLmxvZyhhY3RpdmVUYWIpO1xyXG4gICAgdGhhdC5lbGVtZW50cy4kbW9kYWxDb250ZW50LmNoaWxkcmVuKCdkaXYnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoYXQuZWxlbWVudHMuJG1vZGFsQ29udGVudC5jaGlsZHJlbignZGl2JylbYWN0aXZlVGFiXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG59O1xyXG5cclxuTW9kYWxzLnByb3RvdHlwZS5jaGFuZ2VTdGF0ZU1vYmlsZSA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHZhciAkdGFicyA9IHRoYXQuZWxlbWVudHMuJHRhYnMuY2hpbGRyZW4oJ2RpdicpO1xyXG4gICAgdmFyICRjb250ZW50ID0gdGhhdC5lbGVtZW50cy4kbW9kYWxDb250ZW50LmNoaWxkcmVuKCdkaXYnKTtcclxuICAgIHZhciB0YWJzQWN0aXZlSW5kZXggPSB0aGF0LmVsZW1lbnRzLiR0YWJzLmNoaWxkcmVuKCcuYWN0aXZlJykuaW5kZXgoKTtcclxuXHJcbiAgICAkY29udGVudC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkdGFicy5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICBpZiAodGFic0FjdGl2ZUluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgJCgkY29udGVudFsxXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICQoJHRhYnNbMV0pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIH0gZWxzZSBpZiAodGFic0FjdGl2ZUluZGV4ID09PSAxKSB7XHJcbiAgICAgICAgJCgkY29udGVudFswXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICQoJHRhYnNbMF0pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGFscy5wcm90b3R5cGUuc2xpZGVyQ2F0YWxvZ1F1aWNrVmlldyA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbWVudHMuJHNsaWRlck1haW4gPSB0aGlzLmVsZW1lbnRzLiRxdWlja1NsaWRlci5maW5kKCcuY2F0YWxvZy1xdWljay12aWV3LXNsaWRlcl9fbWFpbicpO1xyXG4gICAgdGhpcy5lbGVtZW50cy4kc2xpZGVyU3ViID0gdGhpcy5lbGVtZW50cy4kcXVpY2tTbGlkZXIuZmluZCgnLmNhdGFsb2ctcXVpY2stdmlldy1zbGlkZXJfX3N1YicpO1xyXG5cclxuICAgIGlmICh0aGlzLmVsZW1lbnRzLiRzbGlkZXJNYWluLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBhcmFtc01haW4gPSB7XHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICBzcGVlZDogNTAwLFxyXG4gICAgICAgIGFzTmF2Rm9yOiBcIi5jYXRhbG9nLXF1aWNrLXZpZXctc2xpZGVyX19zdWJcIlxyXG4gICAgfTtcclxuICAgIHZhciBwYXJhbXNTdWIgPSB7XHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiA0LFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgc3BlZWQ6IDUwMCxcclxuICAgICAgICBhc05hdkZvcjogXCIuY2F0YWxvZy1xdWljay12aWV3LXNsaWRlcl9fbWFpblwiLFxyXG4gICAgICAgIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICAgICAgY2VudGVyUGFkZGluZzogJzBweCdcclxuICAgIH07XHJcblxyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJHNsaWRlck1haW4ub24oJ2luaXQnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoYXQuZWxlbWVudHMuJHF1aWNrU2xpZGVyLmNzcyhcInZpc2liaWxpdHlcIiwgXCJ2aXNpYmxlXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kc2xpZGVyTWFpbi5zbGljayhwYXJhbXNNYWluKTtcclxuICAgIHRoaXMuZWxlbWVudHMuJHNsaWRlclN1Yi5zbGljayhwYXJhbXNTdWIpO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJHNsaWRlck1haW4ub24oJ2FmdGVyQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUpIHtcclxuICAgICAgICB0aGF0LmVsZW1lbnRzLiRzbGlkZXJTdWIuc2xpY2soJ3NsaWNrR29UbycsIGN1cnJlbnRTbGlkZSk7XHJcbiAgICAgICAgdmFyIGN1cnJyZW50TmF2U2xpZGVFbGVtID0gJy5zbGlkZXItbmF2IC5zbGljay1zbGlkZVtkYXRhLXNsaWNrLWluZGV4PVwiJyArIGN1cnJlbnRTbGlkZSArICdcIl0nO1xyXG4gICAgICAgICQoJy5zbGlkZXItbmF2IC5zbGljay1zbGlkZS5pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgJChjdXJycmVudE5hdlNsaWRlRWxlbSkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmVsZW1lbnRzLiRzbGlkZXJTdWIub24oJ2NsaWNrJywgJy5zbGljay1zbGlkZScsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgZ29Ub1NpbmdsZVNsaWRlID0gJCh0aGlzKS5kYXRhKCdzbGljay1pbmRleCcpO1xyXG4gICAgICAgIHRoYXQuZWxlbWVudHMuJHNsaWRlck1haW4uc2xpY2soJ3NsaWNrR29UbycsIGdvVG9TaW5nbGVTbGlkZSk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFscztcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZGFscy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIE9yZGVyQWNjb3JkaW9uIChzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kYWNjb3JkaW9uUGFyZW50ID0gJChzZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuJGFjY29yZGlvblBhcmVudFswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuT3JkZXJBY2NvcmRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRhY2NvcmRJdGVtOiB0aGlzLiRhY2NvcmRpb25QYXJlbnQuZmluZCgnLm9yZGVyLWFjY29yZGlvbi1pdGVtJyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1IZWFkOiB0aGlzLiRhY2NvcmRpb25QYXJlbnQuZmluZCgnLm9yZGVyLWFjY29yZGlvbi1pdGVtX19oZWFkJyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1Cb2R5OiB0aGlzLiRhY2NvcmRpb25QYXJlbnQuZmluZCgnLm9yZGVyLWFjY29yZGlvbi1pdGVtX19ib2R5JyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1CdG46IHRoaXMuJGFjY29yZGlvblBhcmVudC5maW5kKCcub3JkZXItYWNjb3JkaW9uLWl0ZW1fX2FjdGlvbnMgYScpXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIHNldCBpbml0aWFsIHN0YXRlXHJcbiAgICB2YXIgJGluaXRpYWxJdGVtID0gJCh0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtWzBdKTtcclxuICAgIHZhciAkaW5pdGlhbEJvZHkgPSAkKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1Cb2R5WzBdKTtcclxuXHJcbiAgICAkaW5pdGlhbEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJGluaXRpYWxJdGVtLmF0dHIoXCJkYXRhLXZpc2l0ZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJvZHkubm90KCRpbml0aWFsQm9keSkuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcblxyXG4gICAgLy8gYWRkIGV2ZW50c1xyXG4gICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJ0bi5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB2YXIgY2FsbGluZ0VsZW0gPSB0aGlzO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGF0LmFjY29yZGlvbkl0ZW1CdG5BY3Rpb24oY2FsbGluZ0VsZW0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUhlYWQub24oXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY2FsbGluZ0VsZW0gPSB0aGlzO1xyXG4gICAgICAgIHRoYXQuYWNjb3JkaW9uSXRlbUhlYWRBY3Rpb24oY2FsbGluZ0VsZW0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuT3JkZXJBY2NvcmRpb24ucHJvdG90eXBlLmFjY29yZGlvbkl0ZW1CdG5BY3Rpb24gPSBmdW5jdGlvbiAoY2FsbGluZ0VsZW0pIHtcclxuICAgIHZhciBjYWxsaW5nRWxlbVBhcmVudCA9ICQoY2FsbGluZ0VsZW0pLnBhcmVudHMoJy5vcmRlci1hY2NvcmRpb24taXRlbScpO1xyXG4gICAgdmFyIGNhbGxpbmdFbGVtSW5kZXggPSBjYWxsaW5nRWxlbVBhcmVudC5pbmRleCgpO1xyXG4gICAgdmFyICRjYWxsaW5nRWxlbSA9ICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtjYWxsaW5nRWxlbUluZGV4ICsgMV0pO1xyXG5cclxuICAgIC8vIGNsZWFyIHN0YXRlXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1Cb2R5LnNsaWRlVXAoMzAwKTtcclxuXHJcbiAgICAvLyBzZXQgc3RhdGVcclxuICAgICRjYWxsaW5nRWxlbS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkY2FsbGluZ0VsZW0uYXR0cihcImRhdGEtdmlzaXRlZFwiLCBcInRydWVcIik7XHJcbiAgICAkKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1Cb2R5W2NhbGxpbmdFbGVtSW5kZXggKyAxXSkuc2xpZGVEb3duKDMwMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gZ2V0IGVsZW0gcG9zaXRpb25cclxuICAgICAgICB2YXIgY2FsbGluZ0VsZW1Qb3NUb3AgPSAkY2FsbGluZ0VsZW0ucG9zaXRpb24oKS50b3A7XHJcblxyXG4gICAgICAgIC8vIHNldCB3aW5kb3cgcG9zaXRpb25cclxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiBjYWxsaW5nRWxlbVBvc1RvcCAtICQoJy5oZWFkZXInKS5vdXRlckhlaWdodCgpIC0gMjB9LCA1MDApO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5PcmRlckFjY29yZGlvbi5wcm90b3R5cGUuYWNjb3JkaW9uSXRlbUhlYWRBY3Rpb24gPSBmdW5jdGlvbihjYWxsaW5nRWxlbSkge1xyXG4gICAgdmFyIGNhbGxpbmdFbGVtUGFyZW50ID0gJChjYWxsaW5nRWxlbSkucGFyZW50cygnLm9yZGVyLWFjY29yZGlvbi1pdGVtJyk7XHJcblxyXG4gICAgaWYgKGNhbGxpbmdFbGVtUGFyZW50LmF0dHIoJ2RhdGEtdmlzaXRlZCcpICYmICFjYWxsaW5nRWxlbVBhcmVudC5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICB2YXIgY2FsbGluZ0VsZW1JbmRleCA9IGNhbGxpbmdFbGVtUGFyZW50LmluZGV4KCk7XHJcblxyXG4gICAgICAgIC8vIGNsZWFyIHN0YXRlXHJcbiAgICAgICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJvZHkuc2xpZGVVcCgzMDApO1xyXG5cclxuICAgICAgICAvLyBzZXQgc3RhdGVcclxuICAgICAgICAkKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1bY2FsbGluZ0VsZW1JbmRleF0pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1Cb2R5W2NhbGxpbmdFbGVtSW5kZXhdKS5zbGlkZURvd24oMzAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gZ2V0IGVsZW0gcG9zaXRpb25cclxuICAgICAgICAgICAgdmFyIGNhbGxpbmdFbGVtUG9zVG9wID0gY2FsbGluZ0VsZW1QYXJlbnQucG9zaXRpb24oKS50b3A7XHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgd2luZG93IHBvc2l0aW9uXHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IGNhbGxpbmdFbGVtUG9zVG9wIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCkgLSAyMH0sIDUwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9yZGVyQWNjb3JkaW9uO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvb3JkZXJBY2NvcmRpb24uanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBPcmRlckZvcm0gKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiRvcmRlckZvcm0gPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kb3JkZXJGb3JtWzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9yZGVyRm9ybS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICQudmFsaWRhdG9yLnNldERlZmF1bHRzKHtcclxuICAgICAgICBpZ25vcmU6IFtdXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB2YWxpZGF0aW9uIGZvcm1cclxuICAgIHRoaXMuJG9yZGVyRm9ybS52YWxpZGF0ZSh7XHJcbiAgICAgICAgZXJyb3JFbGVtZW50OiBcInBcIixcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICAvLyDQmtC+0L3RgtCw0LrRgtC90YvQtSDQtNCw0L3QvdGL0LVcclxuICAgICAgICAgICAgY291bnRyeToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2l0eToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RyZWV0OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBob3VzZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcm9vbToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINCh0L/QvtGB0L7QsSDQtNC+0YHRgtCw0LLQutC4XHJcbiAgICAgICAgICAgIGRlbGl2ZXJ5OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyDQodC/0L7RgdC+0LEg0L/QvtC70LDRgtGLXHJcbiAgICAgICAgICAgIHBheW1lbnQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvLyDQu9C40YfQvdGL0LUg0LTQsNC90L3Ri9C1XHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBob25lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHt9XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9yZGVyRm9ybTtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL29yZGVyRm9ybS5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIE9yZGVyUGF5bWVudCAoc2VsZWN0b3IpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJG9yZGVyUGF5bWVudCA9ICQoc2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLiRvcmRlclBheW1lbnRbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9yZGVyUGF5bWVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbWVudHMgPSB7XHJcbiAgICAgICAgJGhlYWRlcjogJCgnLmhlYWRlcicpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucGFyYW1zID0ge1xyXG4gICAgICAgIG9yZGVyUGF5bWVudFBvczogdGhhdC4kb3JkZXJQYXltZW50LnBvc2l0aW9uKCkudG9wXHJcbiAgICB9O1xyXG5cclxuICAgIHRoYXQudXBkYXRlT25TY3JvbGwoKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhhdC51cGRhdGVPblNjcm9sbCgpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5PcmRlclBheW1lbnQucHJvdG90eXBlLnVwZGF0ZU9uU2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaGVhZGVySGVpZ2h0ID0gdGhpcy5lbGVtZW50cy4kaGVhZGVyLm91dGVySGVpZ2h0KCkgKyAyMDtcclxuICAgIHZhciBzY3JvbGxXaW5kb3cgPSB3aW5kb3cucGFnZVlPZmZzZXQgKyBoZWFkZXJIZWlnaHQ7XHJcblxyXG4gICAgaWYgKHNjcm9sbFdpbmRvdyA+IHRoaXMucGFyYW1zLm9yZGVyUGF5bWVudFBvcykge1xyXG4gICAgICAgIHRoaXMuJG9yZGVyUGF5bWVudC5hZGRDbGFzcygnc3RpY2t5Jyk7XHJcbiAgICAgICAgdGhpcy4kb3JkZXJQYXltZW50LmNzcygndG9wJywgaGVhZGVySGVpZ2h0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kb3JkZXJQYXltZW50LnJlbW92ZUNsYXNzKCdzdGlja3knKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3JkZXJQYXltZW50O1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvb3JkZXJQYXltZW50LmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gb3VyQ2VydGlmaWNhdGVzIChzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kb3VyQ2VydGlmaWNhdGVzID0gJChzZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuJG91ckNlcnRpZmljYXRlc1swXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5vdXJDZXJ0aWZpY2F0ZXMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZWxlbWVudHMgPSB7XHJcbiAgICAgICAgJG91ckNlcnRpZmljYXRlc0xpbms6IHRoaXMuJG91ckNlcnRpZmljYXRlcy5maW5kKCcub3VyLWNlcnRpZmljYXRlc19faXRlbSBhJylcclxuICAgIH07XHJcbiAgICAvLyBtYWduaWZpYyBwb3B1cFxyXG4gICAgdGhpcy5lbGVtZW50cy4kb3VyQ2VydGlmaWNhdGVzTGluay5tYWduaWZpY1BvcHVwKHtcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgICAgIGltYWdlOiB7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsRml0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICB6b29tOiB7XHJcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiAzMDBcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gb3VyQ2VydGlmaWNhdGVzO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9vdXJDZXJ0aWZpY2F0ZXMuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBQYXJhbGxheFJldmlld3MgKHNlbGVjdG9yKSB7XHJcbiAgICB0aGlzLnJldmlld3MgPSBzZWxlY3RvcjtcclxuICAgIHRoaXMuJHJldmlld3MgPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kcmV2aWV3c1swXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5QYXJhbGxheFJldmlld3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICQodGhpcy5yZXZpZXdzKS5wYXJhbGxheCgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXJhbGxheFJldmlld3M7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9wYXJhbGxheFJldmlld3MuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBQaG90b0dhbGxlcnkgKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiRwaG90b0dhbGxlcnkgPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kcGhvdG9HYWxsZXJ5WzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblBob3RvR2FsbGVyeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkcGhvdG9HYWxsZXJ5TGluazogdGhpcy4kcGhvdG9HYWxsZXJ5LmZpbmQoJy5waG90by1nYWxsZXJ5LWl0ZW0gYScpXHJcbiAgICB9O1xyXG4gICAgLy8gbWFnbmlmaWMgcG9wdXBcclxuICAgIHRoaXMuZWxlbWVudHMuJHBob3RvR2FsbGVyeUxpbmsubWFnbmlmaWNQb3B1cCh7XHJcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcclxuICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbEZpdDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgem9vbToge1xyXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogMzAwXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBob3RvR2FsbGVyeTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvcGhvdG9HYWxsZXJ5LmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gU2xpZGVyQmVzdFNhbGVzKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLnNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLnNsaWRlcikge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuU2xpZGVyQmVzdFNhbGVzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtcyA9IHtcclxuICAgICAgICAkYmVzdHNlbGxlcnNTbGlkZXI6ICQodGhpcy5zbGlkZXIpXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBwYXJhbXMgPSB7XHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICBzcGVlZDogNTAwLFxyXG4gICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogMTE4MCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtcy4kYmVzdHNlbGxlcnNTbGlkZXIub24oJ2luaXQnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoYXQuZWxlbXMuJGJlc3RzZWxsZXJzU2xpZGVyLmNzcyhcInZpc2liaWxpdHlcIiwgXCJ2aXNpYmxlXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtcy4kYmVzdHNlbGxlcnNTbGlkZXIuc2xpY2socGFyYW1zKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNsaWRlckJlc3RTYWxlcztcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL3NsaWRlckJlc3RTYWxlcy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIFNsaWRlck1haW4oc2xpZGVyLCBpbnRlbUJnKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiRzbGlkZXIgPSAkKHNsaWRlcik7XHJcbiAgICB0aGlzLmludGVtQmcgPSBpbnRlbUJnO1xyXG5cclxuICAgIGlmICh0aGlzLiRzbGlkZXJbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblNsaWRlck1haW4ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB2YXIgcGFyYW1zID0ge1xyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICBhcnJvd3M6IGZhbHNlLFxyXG4gICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgc3BlZWQ6IDUwMCxcclxuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgICAgICBhdXRvcGxheVNwZWVkOiA1MDAwXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuJHNsaWRlci5vbignaW5pdCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhhdC4kc2xpZGVyLmNzcyhcInZpc2liaWxpdHlcIiwgXCJ2aXNpYmxlXCIpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLiRzbGlkZXIuc2xpY2socGFyYW1zKTtcclxuXHJcbiAgICAvLyDQmNC90LjQt9C40LDQu9C40LfQuNGA0YPQtdGC0YHRjyDQv9Cw0YDQsNC70LvQsNC60YFcclxuICAgIHRoaXMuaW5pdFBhcmFsbGF4KHRoYXQpO1xyXG59O1xyXG5cclxuU2xpZGVyTWFpbi5wcm90b3R5cGUuaW5pdFBhcmFsbGF4ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggPCA3NjgtMTcpKSB7XHJcbiAgICAgICAgdGhpcy5wYXJhbXNQYXJhbGxheCA9IHtcclxuICAgICAgICAgICAgc3BlZWQ6IC0xMCxcclxuICAgICAgICAgICAgY2VudGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgd3JhcHBlcjogbnVsbCxcclxuICAgICAgICAgICAgcm91bmQ6IHRydWUsXHJcbiAgICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxyXG4gICAgICAgICAgICBob3Jpem9udGFsOiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wYXJhbGxheCA9IG5ldyBSZWxsYXgodGhpcy5pbnRlbUJnLCB0aGlzLnBhcmFtc1BhcmFsbGF4KTtcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNsaWRlck1haW47XHJcblxyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvc2xpZGVyTWFpbi5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIFVwbG9hZGVyKHNlbGVjdG9yKSB7XHJcblx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdHRoaXMuJHBhcmVudCA9ICQoc2VsZWN0b3IpO1xyXG5cdGlmICh0aGlzLiRwYXJlbnRbMF0pIHtcclxuXHRcdHRoaXMuaW5pdCh0aGF0KTtcclxuXHR9XHJcbn1cclxuXHJcblVwbG9hZGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHRoYXQpIHtcclxuXHR0aGlzLmVsZW1zID0ge1xyXG5cdFx0JGlucHV0OiB0aGlzLiRwYXJlbnQuZmluZCgnW2RhdGEtdXBsb2FkLWlucHV0XScpLFxyXG5cdFx0JHRleHQ6IHRoaXMuJHBhcmVudC5maW5kKCdbZGF0YS11cGxvYWQtdGV4dF0nKVxyXG5cdH07XHJcblxyXG5cdHRoaXMuZWxlbXMuJGlucHV0Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcblx0XHR0aGF0LmNoYW5nZVRleHQoZSk7XHJcblx0fSlcclxufTtcclxuXHJcblVwbG9hZGVyLnByb3RvdHlwZS5jaGFuZ2VUZXh0ID0gZnVuY3Rpb24oZSkge1xyXG5cdGUucHJldmVudERlZmF1bHQoKTtcclxuXHR2YXIgZmlsZXMgPSB0aGlzLmVsZW1zLiRpbnB1dC5nZXQoMCkuZmlsZXM7XHJcblxyXG5cdGlmIChmaWxlcy5sZW5ndGgpIHtcclxuXHRcdGZpbGVzID0gZmlsZXNbMF07XHJcblx0XHR0aGlzLmVsZW1zLiR0ZXh0LnRleHQoZmlsZXMubmFtZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRoaXMuZWxlbXMuJHRleHQudGV4dCh0aGlzLiRwYXJlbnQuZGF0YSgndXBsb2FkLWRlZmF1bHQnKSk7XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRlcjtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL3VwbG9hZGVyLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gVXNlclRvb2xzRHJvcERvd24gKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiR1c2VyVG9vbHNEcm9wRG93biA9ICQoc2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLiR1c2VyVG9vbHNEcm9wRG93blswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuVXNlclRvb2xzRHJvcERvd24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRkcm9wRG93bkhlYWQ6IHRoaXMuJHVzZXJUb29sc0Ryb3BEb3duLmZpbmQoJy51c2VyLXRvb2xzLWRyb3AtZG93bl9faGVhZCcpLFxyXG4gICAgICAgICRkcm9wRG93bk1lbnU6IHRoaXMuJHVzZXJUb29sc0Ryb3BEb3duLmZpbmQoJy51c2VyLXRvb2xzLWRyb3AtZG93bl9fbWVudScpLFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRkcm9wRG93bkhlYWQub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0aGF0LmNoYW5nZVN0YXRlVG9nZ2xlKHRoYXQsIGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGhhdC5zZXREZWZhdWx0U3RhdGUodGhhdCwgZSk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5Vc2VyVG9vbHNEcm9wRG93bi5wcm90b3R5cGUuY2hhbmdlU3RhdGVUb2dnbGUgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGF0LiR1c2VyVG9vbHNEcm9wRG93bi50b2dnbGVDbGFzcygnb3BlbicpO1xyXG4gICAgdGhhdC5lbGVtZW50cy4kZHJvcERvd25NZW51LnNsaWRlVG9nZ2xlKDIwMCk7XHJcbn07XHJcblxyXG5Vc2VyVG9vbHNEcm9wRG93bi5wcm90b3R5cGUuc2V0RGVmYXVsdFN0YXRlID0gZnVuY3Rpb24odGhhdCwgZSkge1xyXG4gICAgdmFyICR0YXJnZXRFbGVtZW50ID0gJChlLnRhcmdldCk7XHJcbiAgICBpZiAoISgkdGFyZ2V0RWxlbWVudCA9PT0gdGhhdC4kdXNlclRvb2xzRHJvcERvd24gfHwgJHRhcmdldEVsZW1lbnQucGFyZW50cygnLnVzZXItdG9vbHMtZHJvcC1kb3duJylbMF0pKSB7XHJcbiAgICAgICAgdGhhdC4kdXNlclRvb2xzRHJvcERvd24ucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICB0aGF0LmVsZW1lbnRzLiRkcm9wRG93bk1lbnUuc2xpZGVVcCgyMDApO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVc2VyVG9vbHNEcm9wRG93bjtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL3VzZXJUb29sc0Ryb3BEb3duLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gdmFsaWRhdGlvbigpIHtcclxuICAgIC8vINCf0L7QtNC/0LjRgdC60LAg0L3QsCDRgNGL0YHRgdC70LrRg1xyXG4gICAgJChcIi5zdWJzY3JpcHRpb24tZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgZXJyb3JFbGVtZW50OiBcInBcIixcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0JLQstC10LTQuNGC0LUgZW1haWwg0LDQtNGA0LXRgVwiLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1IGVtYWlsINC60L7RgNGA0LXQutGC0L3QvlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiLnJlc3Rvcl9fZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgZXJyb3JFbGVtZW50OiBcInBcIixcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0JLQstC10LTQuNGC0LUgZW1haWwg0LDQtNGA0LXRgVwiLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1IGVtYWlsINC60L7RgNGA0LXQutGC0L3QvlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQktGF0L7QtCDQsiDQm9CaXHJcbiAgICAkKFwiLnNpbmctaW5fX2Zvcm1cIikudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yRWxlbWVudDogXCJwXCIsXHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiA1XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIixcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSBlbWFpbCDQutC+0YDRgNC10LrRgtC90L5cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IFwi0JrQvtGA0L7RgtC60LjQuSDQv9Cw0YDQvtC70YwgKNC80LXQvdC10LUgNSDRgdC40LzQstC+0LvQvtCyKVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINCb0JpcclxuICAgICQoXCIuc2luZy11cF9fZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgaWdub3JlOiBbXSxcclxuICAgICAgICBlcnJvckVsZW1lbnQ6IFwicFwiLFxyXG4gICAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGFzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogNVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb25maXJtX3Bhc3N3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogNSxcclxuICAgICAgICAgICAgICAgIGVxdWFsVG86IFwiI3NpbmctdXAtcGFzc1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdlbmRlcjoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJpdmFjeVBvbGljeToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IFwi0KHQu9C40YjQutC+0Lwg0LrQvtGA0L7RgtC60L7QtSDQuNC80Y9cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IFwi0KHQu9C40YjQutC+0Lwg0LrQvtGA0L7RgtC60LDRjyDRhNCw0LzQuNC70LjRj1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIixcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwINCy0LLQtdC00LjRgtC1IGVtYWlsINC60L7RgNGA0LXQutGC0L3QvlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIixcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogXCLQmtC+0YDQvtGC0LrQuNC5INC/0LDRgNC+0LvRjCAo0LzQtdC90LXQtSA1INGB0LjQvNCy0L7Qu9C+0LIpXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29uZmlybV9wYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IFwi0JrQvtGA0L7RgtC60LjQuSDQv9Cw0YDQvtC70YwgKNC80LXQvdC10LUgNSDRgdC40LzQstC+0LvQvtCyKVwiLFxyXG4gICAgICAgICAgICAgICAgZXF1YWxUbzogXCLQktCy0LXQtNC10L3QvdGL0LUg0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QvtC00LDRjtGCXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2VuZGVyOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQktGL0LHQtdGA0LjRgtC1INCy0LDRiCDQv9C+0LtcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwcml2YWN5UG9saWN5OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINCS0YXQvtC0INCyINCb0JpcclxuICAgICQoXCIjY29udGFjdHNfZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgZXJyb3JFbGVtZW50OiBcInBcIixcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250YWN0OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtZXNzYWdlOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250YWN0OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtZXNzYWdlOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogXCLQrdGC0L4g0L/QvtC70LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3QviDQtNC70Y8g0LfQsNC/0L7Qu9C90LXQvdC40Y9cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vINC40LfQvNC10L3QtdC90LjQtSDQu9C40YfQvdGL0YUg0LTQsNC90L3Ri9GFINCyINCb0JpcclxuICAgICQoXCIudXNlci1kYXRhLWNoYW5nZS1mb3JtXCIpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uKGVycm9yLCBlbGVtZW50KSB7fVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0LjQt9C80LXQvdC10L3QuNC1INC60L7QvdGC0LDQutGC0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQm9CaXHJcbiAgICAkKFwiLmRlbGl2ZXJ5LWNvbnRhY3RzLWNoYW5nZS1mb3JtXCIpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBzdHJlZXQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhvdXNlOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByb29tOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHt9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKFwiLnBhc3N3b3JkLWNoYW5nZS1mb3JtXCIpLnZhbGlkYXRlKHtcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBwYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFzc3dvcmRfbmV3OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogNVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb25maXJtX3Bhc3N3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogNSxcclxuICAgICAgICAgICAgICAgIGVxdWFsVG86IFwiI3VzZXItY2FiLXBhc3NcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvclBsYWNlbWVudDogZnVuY3Rpb24oZXJyb3IsIGVsZW1lbnQpIHt9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGlvbjtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL3ZhbGlkYXRpb24uanNcIixcIi9cIikiXX0=
