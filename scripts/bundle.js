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

}).call(this,require("qC859L"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_f793f8dc.js","/")
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
    var scrollWindow = window.pageYOffset + this.elements.$header.outerHeight();

    if (scrollWindow > this.params.orderPaymentPos) {
        this.$orderPayment.addClass('sticky');
    } else {
        this.$orderPayment.removeClass('sticky');
    }

    // console.log("scrollWindow", scrollWindow, "that.params.orderPaymentPos", that.params.orderPaymentPos);
    // console.log("window", window.pageYOffset);
    // console.log(this);
    // console.log("this", that.$orderPayment.position().top);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxzaXRlc1xcYnJ1bW1pXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9zaXRlcy9icnVtbWkvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiQzovc2l0ZXMvYnJ1bW1pL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJDOi9zaXRlcy9icnVtbWkvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJDOi9zaXRlcy9icnVtbWkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL2FjY2VwdENvb2tpZXMuanMiLCJDOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9hZHZhbnRhZ2VzVGFicy5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL2Jhc2tldC5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL2NhdGFsb2dEZXRhaWxTbGlkZXIuanMiLCJDOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9jb250YWN0c01hcC5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL2N1c3RvbUlucHV0Q291bnQuanMiLCJDOi9zaXRlcy9icnVtbWkvc2NyaXB0cy9mYWtlX2Y3OTNmOGRjLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvZmFxQWNjb3JkaW9uLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvaGVhZGVyUGx1Z2luLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvaGlzdG9yeU9yZGVycy5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL21vZGFscy5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL29yZGVyQWNjb3JkaW9uLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvb3JkZXJGb3JtLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvb3JkZXJQYXltZW50LmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvb3VyQ2VydGlmaWNhdGVzLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvcGFyYWxsYXhSZXZpZXdzLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvcGhvdG9HYWxsZXJ5LmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvc2xpZGVyQmVzdFNhbGVzLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvc2xpZGVyTWFpbi5qcyIsIkM6L3NpdGVzL2JydW1taS9zY3JpcHRzL3VwbG9hZGVyLmpzIiwiQzovc2l0ZXMvYnJ1bW1pL3NjcmlwdHMvdXNlclRvb2xzRHJvcERvd24uanMiLCJDOi9zaXRlcy9icnVtbWkvc2NyaXB0cy92YWxpZGF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcYmFzZTY0LWpzXFxcXGxpYlxcXFxiNjQuanNcIixcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcYmFzZTY0LWpzXFxcXGxpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclxcXFxpbmRleC5qc1wiLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxidWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi5cXFxcbm9kZV9tb2R1bGVzXFxcXGllZWU3NTRcXFxcaW5kZXguanNcIixcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxcaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uXFxcXG5vZGVfbW9kdWxlc1xcXFxwcm9jZXNzXFxcXGJyb3dzZXIuanNcIixcIi8uLlxcXFxub2RlX21vZHVsZXNcXFxccHJvY2Vzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIEFjY2VwdENvb2tpZXMoc2VsZWN0b3IpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJHBhcmVudCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgaWYgKHRoaXMuJHBhcmVudFswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuQWNjZXB0Q29va2llcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1zID0ge1xyXG4gICAgICAgICRhY3Rpb25CdG46IHRoaXMuJHBhcmVudC5maW5kKCcuYWNjZXB0LWNvb2tpZXNfX2FjdGlvbicpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZWxlbXMuJGFjdGlvbkJ0bi5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhhdC5oaWRlQmxvY2soZSk7XHJcbiAgICB9KVxyXG59O1xyXG5BY2NlcHRDb29raWVzLnByb3RvdHlwZS5oaWRlQmxvY2sgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0aGlzLiRwYXJlbnQuZmFkZU91dCg0MDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjY2VwdENvb2tpZXM7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9hY2NlcHRDb29raWVzLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gQWR2YW50YWdlc1RhYnMgKHBhcmVudCkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICB0aGlzLiRwYXJlbnQgPSAkKHBhcmVudCk7XHJcblxyXG4gICAgaWYgKHRoaXMuJHBhcmVudFswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuQWR2YW50YWdlc1RhYnMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAodGhhdCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkYWR2TmF2SXRlbTogICAgICAgICAgIHRoaXMuJHBhcmVudC5maW5kKFwiLmFkdmFudGFnZXMtbmF2IGxpXCIpLFxyXG4gICAgICAgICRhZHZJdGVtczogICAgICAgICAgICAgdGhpcy4kcGFyZW50LmZpbmQoXCIuYWR2YW50YWdlcy1pdGVtc1wiKSxcclxuICAgICAgICAkYWR2SXRlbTogICAgICAgICAgICAgIHRoaXMuJHBhcmVudC5maW5kKFwiLmFkdmFudGFnZXMtaXRlbVwiKSxcclxuICAgICAgICAkYWR2Qm90dG9tQ2hhbmdlOiAgICAgIHRoaXMuJHBhcmVudC5maW5kKFwiLmFkdmFudGFnZXMtaXRlbV9fYWN0aW9uXCIpXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMucGFyYW1zID0ge1xyXG4gICAgICAgIHRhYnNMZW5ndGg6ICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kYWR2SXRlbXMubGVuZ3RoXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJGFkdk5hdkl0ZW0uY2hpbGRyZW4oJ2EnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhhdC5jaGFuZ2VTdGF0ZSh0aGF0LCBlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuJGFkdkJvdHRvbUNoYW5nZS5jaGlsZHJlbignYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB0aGF0LmNoYW5nZVN0YXRlQnV0dG9tKHRoYXQsIGUpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5BZHZhbnRhZ2VzVGFicy5wcm90b3R5cGUuY2hhbmdlU3RhdGUgPSBmdW5jdGlvbih0aGF0LCBlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdmFyIHRhcmdldExpbmsgPSBlLnRhcmdldDtcclxuICAgIHZhciB0YXJnZXRMaW5rSW5kZXggPSAkKHRhcmdldExpbmspLnBhcmVudHMoJ2xpJykuaW5kZXgoKTtcclxuXHJcbiAgICAvLyBjaGFuZ2VOYXYgc3RhdGVcclxuICAgIHRoYXQuZWxlbWVudHMuJGFkdk5hdkl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCh0YXJnZXRMaW5rKS5wYXJlbnRzKCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAvLyBjaGFuZ2UgY29udGVudFxyXG4gICAgdGhhdC5lbGVtZW50cy4kYWR2SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkKHRoYXQuZWxlbWVudHMuJGFkdkl0ZW1bdGFyZ2V0TGlua0luZGV4XSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG59O1xyXG5cclxuQWR2YW50YWdlc1RhYnMucHJvdG90eXBlLmNoYW5nZVN0YXRlQnV0dG9tID0gZnVuY3Rpb24odGhhdCwgZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHZhciBpdGVtQWN0aXZlSW5kZXggPSB0aGF0LmVsZW1lbnRzLiRhZHZJdGVtcy5maW5kKCcuYWN0aXZlJykuaW5kZXgoKTtcclxuICAgIHRoYXQuZWxlbWVudHMuJGFkdk5hdkl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgdGhhdC5lbGVtZW50cy4kYWR2SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgaWYgKGl0ZW1BY3RpdmVJbmRleCA8IHRoYXQucGFyYW1zLnRhYnNMZW5ndGgpIHtcclxuICAgICAgICAkKHRoYXQuZWxlbWVudHMuJGFkdk5hdkl0ZW1baXRlbUFjdGl2ZUluZGV4ICsgMV0pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKHRoYXQuZWxlbWVudHMuJGFkdkl0ZW1baXRlbUFjdGl2ZUluZGV4ICsgMV0pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICQodGhhdC5lbGVtZW50cy4kYWR2TmF2SXRlbVswXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICQodGhhdC5lbGVtZW50cy4kYWR2SXRlbVswXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWR2YW50YWdlc1RhYnM7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2FkdmFudGFnZXNUYWJzLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gQmFza2V0IChzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kYmFza2V0ID0gJChzZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuJGJhc2tldFswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5CYXNrZXQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZWxlbWVudHMgPSB7XHJcbiAgICAgICAgJGJhc2tldFpvb21CdG46IHRoaXMuJGJhc2tldC5maW5kKCcuYmFza2V0LWl0ZW1fX3pvb20nKVxyXG4gICAgfTtcclxuICAgIC8vIG1hZ25pZmljIHBvcHVwXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRiYXNrZXRab29tQnRuLm1hZ25pZmljUG9wdXAoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgdmVydGljYWxGaXQ6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gem9vbToge1xyXG4gICAgICAgIC8vICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgIC8vICAgICBkdXJhdGlvbjogMzAwXHJcbiAgICAgICAgLy8gfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2tldDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvYmFza2V0LmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gQ2F0YWxvZ0RldGFpbFNsaWRlcihzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy5zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgIHRoaXMuJHNsaWRlciA9ICQoc2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLiRzbGlkZXJbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNhdGFsb2dEZXRhaWxTbGlkZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1zID0ge1xyXG4gICAgICAgICRzbGlkZXJNYWluOiB0aGlzLiRzbGlkZXIuZmluZCgnLmNhdGFsb2ctZGV0YWlsLXNsaWRlcl9fbWFpbicpLFxyXG4gICAgICAgICRzbGlkZXJTdWI6IHRoaXMuJHNsaWRlci5maW5kKCcuY2F0YWxvZy1kZXRhaWwtc2xpZGVyX19zdWInKVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcGFyYW1zTWFpbiA9IHtcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgIHNwZWVkOiA1MDAsXHJcbiAgICAgICAgYXNOYXZGb3I6IFwiLmNhdGFsb2ctZGV0YWlsLXNsaWRlcl9fc3ViXCJcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHBhcmFtc1N1YiA9IHtcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICBzcGVlZDogNTAwLFxyXG4gICAgICAgIGFzTmF2Rm9yOiBcIi5jYXRhbG9nLWRldGFpbC1zbGlkZXJfX21haW5cIixcclxuICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgIGNlbnRlclBhZGRpbmc6ICcwcHgnXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZWxlbXMuJHNsaWRlck1haW4ub24oJ2luaXQnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoYXQuJHNsaWRlci5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwidmlzaWJsZVwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbXMuJHNsaWRlck1haW4uc2xpY2socGFyYW1zTWFpbik7XHJcbiAgICB0aGlzLmVsZW1zLiRzbGlkZXJTdWIuc2xpY2socGFyYW1zU3ViKTtcclxuXHJcbiAgICB0aGlzLmVsZW1zLiRzbGlkZXJNYWluLm9uKCdhZnRlckNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlKSB7XHJcbiAgICAgICAgdGhhdC5lbGVtcy4kc2xpZGVyU3ViLnNsaWNrKCdzbGlja0dvVG8nLCBjdXJyZW50U2xpZGUpO1xyXG4gICAgICAgIHZhciBjdXJycmVudE5hdlNsaWRlRWxlbSA9ICcuc2xpZGVyLW5hdiAuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicgKyBjdXJyZW50U2xpZGUgKyAnXCJdJztcclxuICAgICAgICAkKCcuc2xpZGVyLW5hdiAuc2xpY2stc2xpZGUuaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gICAgICAgICQoY3VycnJlbnROYXZTbGlkZUVsZW0pLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5lbGVtcy4kc2xpZGVyU3ViLm9uKCdjbGljaycsICcuc2xpY2stc2xpZGUnLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyIGdvVG9TaW5nbGVTbGlkZSA9ICQodGhpcykuZGF0YSgnc2xpY2staW5kZXgnKTtcclxuICAgICAgICB0aGF0LmVsZW1zLiRzbGlkZXJNYWluLnNsaWNrKCdzbGlja0dvVG8nLCBnb1RvU2luZ2xlU2xpZGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJCgnLmNhdGFsb2ctZGV0YWlsLXNsaWRlcl9fem9vbS1idG4nKSk7XHJcblxyXG4gICAgLy8gbWFnbmlmaWMgcG9wdXBcclxuICAgICQoJy5jYXRhbG9nLWRldGFpbC1zbGlkZXJfX3pvb20tYnRuJykubWFnbmlmaWNQb3B1cCh7XHJcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcclxuICAgICAgICAvLyBjbG9zZU9uQ29udGVudENsaWNrOiB0cnVlLFxyXG4gICAgICAgIC8vIGNsb3NlQnRuSW5zaWRlOiBmYWxzZSxcclxuICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbEZpdDogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB6b29tOiB7XHJcbiAgICAgICAgLy8gICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgLy8gICAgIGR1cmF0aW9uOiAzMDAgLy8gZG9uJ3QgZm9nZXQgdG8gY2hhbmdlIHRoZSBkdXJhdGlvbiBhbHNvIGluIENTU1xyXG4gICAgICAgIC8vIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXRhbG9nRGV0YWlsU2xpZGVyO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvY2F0YWxvZ0RldGFpbFNsaWRlci5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIENvbnRhY3RzTWFwKHNlbGVjdG9yKSB7XHJcblx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdHRoaXMuJHBhcmVudCA9ICQoc2VsZWN0b3IpO1xyXG5cdGlmICh0aGlzLiRwYXJlbnRbMF0pIHtcclxuXHRcdHRoaXMuaW5pdCh0aGF0KTtcclxuXHR9XHJcbn1cclxuXHJcbkNvbnRhY3RzTWFwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKHRoYXQpIHtcclxuXHRpZiAodGhpcy4kcGFyZW50Lmxlbmd0aCkge1xyXG5cdFx0dGhpcy5lbGVtcyA9IHtcclxuXHRcdFx0bWFwOiB0aGlzLiRwYXJlbnQuZ2V0KDApXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMub3B0aW9ucyA9IHtcclxuXHRcdFx0Y2VudGVyOiBbNTQuOTg4OTIyNDUsIDgyLjg4NTQ4Mjc1XSxcclxuXHRcdFx0cGxhY2VtYXJrOiAnL2ltYWdlcy9tYXAvcGxhY2VtYXJrLnBuZydcclxuXHRcdH07XHJcblxyXG5cdFx0eW1hcHMucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgbXlNYXAgPSBuZXcgeW1hcHMuTWFwKHRoYXQuZWxlbXMubWFwLmdldEF0dHJpYnV0ZSgnaWQnKSwge1xyXG5cdFx0XHRcdFx0Y2VudGVyOiB0aGF0Lm9wdGlvbnMuY2VudGVyLFxyXG5cdFx0XHRcdFx0em9vbTogMTcsXHJcblx0XHRcdFx0XHRjb250cm9sczogW11cclxuXHRcdFx0XHR9KSxcclxuXHRcdFx0XHRteVBsYWNlbWFyayA9IG5ldyB5bWFwcy5QbGFjZW1hcmsobXlNYXAuZ2V0Q2VudGVyKCksIHt9LCB7XHJcblx0XHRcdFx0XHRpY29uTGF5b3V0OiAnZGVmYXVsdCNpbWFnZScsXHJcblx0XHRcdFx0XHRpY29uSW1hZ2VIcmVmOiB0aGF0Lm9wdGlvbnMucGxhY2VtYXJrLFxyXG5cdFx0XHRcdFx0aWNvbkltYWdlU2l6ZTogWzg1LCAxMDBdLFxyXG5cdFx0XHRcdFx0aWNvbkltYWdlT2Zmc2V0OiBbLTQyLjQsIC0xMDBdXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRteU1hcC5nZW9PYmplY3RzXHJcblx0XHRcdFx0LmFkZChteVBsYWNlbWFyayk7XHJcblx0XHR9KVxyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29udGFjdHNNYXA7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9jb250YWN0c01hcC5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIEN1c3RvbUlucHV0Q291bnQoc2VsZWN0b3IpIHtcclxuICAgIHRoaXMuJGNvdW50ZXIgPSAkKHNlbGVjdG9yKTtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIGlmICh0aGlzLiRjb3VudGVyWzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DdXN0b21JbnB1dENvdW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtcyA9IHtcclxuICAgICAgICAkYnRuTWludXM6IHRoaXMuJGNvdW50ZXIuZmluZCgnLm1pbnVzJyksXHJcbiAgICAgICAgJGJ0blBsdXM6IHRoaXMuJGNvdW50ZXIuZmluZCgnLnBsdXMnKVxyXG4gICAgfTtcclxuICAgIHRoaXMuZWxlbXMuJGJ0bk1pbnVzLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jykuc3RlcERvd24oKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5lbGVtcy4kYnRuUGx1cy5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoaXMucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnN0ZXBVcCgpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEN1c3RvbUlucHV0Q291bnQ7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2N1c3RvbUlucHV0Q291bnQuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgSGVhZGVyUGx1Z2luID0gcmVxdWlyZSgnLi9oZWFkZXJQbHVnaW4nKTtcclxudmFyIFVzZXJUb29sc0Ryb3BEb3duID0gcmVxdWlyZSgnLi91c2VyVG9vbHNEcm9wRG93bicpO1xyXG52YXIgdmFsaWRhdGlvbiA9IHJlcXVpcmUoJy4vdmFsaWRhdGlvbicpO1xyXG52YXIgU2xpZGVyTWFpbiA9IHJlcXVpcmUoJy4vc2xpZGVyTWFpbicpO1xyXG52YXIgU2xpZGVyQmVzdFNhbGVzID0gcmVxdWlyZSgnLi9zbGlkZXJCZXN0U2FsZXMnKTtcclxudmFyIE9yZGVyQWNjb3JkaW9uID0gcmVxdWlyZSgnLi9vcmRlckFjY29yZGlvbicpO1xyXG52YXIgT3JkZXJQYXltZW50ID0gcmVxdWlyZSgnLi9vcmRlclBheW1lbnQnKTtcclxudmFyIE9yZWRlckZvcm0gPSByZXF1aXJlKCcuL29yZGVyRm9ybScpO1xyXG52YXIgRmFxQWNjb3JkaW9uID0gcmVxdWlyZSgnLi9mYXFBY2NvcmRpb24nKTtcclxudmFyIEFkdmFudGFnZXNUYWJzID0gcmVxdWlyZSgnLi9hZHZhbnRhZ2VzVGFicycpO1xyXG52YXIgQ2F0YWxvZ0RldGFpbFNsaWRlciA9IHJlcXVpcmUoJy4vY2F0YWxvZ0RldGFpbFNsaWRlcicpO1xyXG52YXIgUGFyYWxsYXhSZXZpZXdzID0gcmVxdWlyZSgnLi9wYXJhbGxheFJldmlld3MnKTtcclxudmFyIE1vZGFsID0gcmVxdWlyZSgnLi9tb2RhbHMnKTtcclxudmFyIEN1c3RvbUlucHV0Q291bnQgPSByZXF1aXJlKCcuL2N1c3RvbUlucHV0Q291bnQnKTtcclxudmFyIFBob3RvR2FsbGVyeSA9IHJlcXVpcmUoJy4vcGhvdG9HYWxsZXJ5Jyk7XHJcbnZhciBIaXN0b3J5T3JkZXJzID0gcmVxdWlyZSgnLi9oaXN0b3J5T3JkZXJzJyk7XHJcbnZhciBPdXJDZXJ0aWZpY2F0ZXMgPSByZXF1aXJlKCcuL291ckNlcnRpZmljYXRlcycpO1xyXG52YXIgQ29udGFjdHNNYXAgPSByZXF1aXJlKCcuL2NvbnRhY3RzTWFwJyk7XHJcbnZhciBCYXNrZXQgPSByZXF1aXJlKCcuL2Jhc2tldCcpO1xyXG52YXIgVXBsb2FkZXIgPSByZXF1aXJlKCcuL3VwbG9hZGVyJyk7XHJcbnZhciBBY2NlcHRDb29raWVzID0gcmVxdWlyZSgnLi9hY2NlcHRDb29raWVzJyk7XHJcblxyXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy8g0KjQsNC/0LrQsFxyXG4gICAgbmV3IEhlYWRlclBsdWdpbignLmhlYWRlcicpO1xyXG5cclxuICAgIC8vIHVzZXItdG9vbHNcclxuICAgIG5ldyBVc2VyVG9vbHNEcm9wRG93bignLnVzZXItdG9vbHMtZHJvcC1kb3duJyk7XHJcblxyXG4gICAgLy8g0J/QsNGA0LDQu9C70LDQutGBXHJcbiAgICBuZXcgUGFyYWxsYXhSZXZpZXdzKCcucmV2aWV3cy1zZWN0aW9uJyk7XHJcblxyXG4gICAgLy8g0KHQu9Cw0LnQtNC10YDRi1xyXG4gICAgbmV3IFNsaWRlck1haW4oJy5zbGlkZXItbWFpbl9fbGlzdCcsICcuc2xpZGVyLW1haW4taXRlbV9fYmcnKTtcclxuICAgIG5ldyBTbGlkZXJCZXN0U2FsZXMoJy5iZXN0c2VsbGVycy1zbGlkZXInKTtcclxuICAgIG5ldyBDYXRhbG9nRGV0YWlsU2xpZGVyKCcuY2F0YWxvZy1kZXRhaWwtc2xpZGVyJyk7XHJcblxyXG4gICAgLy8g0JDQutC60L7RgNC00LXQvtC90YtcclxuICAgIG5ldyBGYXFBY2NvcmRpb24oJy5mYXEtY2F0ZWdvcmllcycpO1xyXG5cclxuICAgIC8vINGE0L7RgtC+0LPQsNC70LvQtdGA0LXRj1xyXG4gICAgbmV3IFBob3RvR2FsbGVyeSgnLnBob3RvLWdhbGxlcnknKTtcclxuXHJcbiAgICAvLyDQn9GA0LXQuNC80YPRidC10YHRgtCy0LBcclxuICAgIG5ldyBBZHZhbnRhZ2VzVGFicygnLmFkdmFudGFnZXMnKTtcclxuXHJcbiAgICAvLyDQndCw0YjQuCDRgdC10YDRgtC40YTQuNC60LDRgtGLXHJcbiAgICBuZXcgT3VyQ2VydGlmaWNhdGVzKCcub3VyLWNlcnRpZmljYXRlcycpO1xyXG5cclxuICAgIC8vINCY0YHRgtC+0YDQuNGPINC30LDQutCw0LfQvtCyINCyINCb0JpcclxuICAgIG5ldyBIaXN0b3J5T3JkZXJzKCcuaGlzdG9yeS1vcmRlcnMnKTtcclxuXHJcbiAgICAvLyDQl9Cw0LrQsNC30YtcclxuICAgIG5ldyBPcmVkZXJGb3JtKCcub3JkZXItZm9ybScpO1xyXG4gICAgbmV3IE9yZGVyQWNjb3JkaW9uKCcub3JkZXItYWNjb3JkaW9uJyk7XHJcbiAgICBuZXcgT3JkZXJQYXltZW50KCcub3JkZXItcGF5bWVudCcpO1xyXG5cclxuICAgIC8vINCa0L7RgNC30LjQvdCwXHJcbiAgICBuZXcgQmFza2V0KCcuYmFza2V0Jyk7XHJcblxyXG4gICAgLy8g0JzQvtC00LDQu9C60LhcclxuICAgIG5ldyBNb2RhbCgnLm1vZGFsLWF1dGgnLCAnLnNob3dBdXRoJyk7XHJcbiAgICBuZXcgTW9kYWwoJy5tb2RhbC1yZXN0b3InLCAnLnNob3dSZXN0b3InKTtcclxuICAgIG5ldyBNb2RhbCgnLm1vZGFsLWZpbHRlci1tJywgJy5zaG93RmlsdGVyTScpO1xyXG4gICAgbmV3IE1vZGFsKCcubW9kYWwtY2F0YWxvZy1xdWljay12aWV3JywgJy5jYXRhbG9nLWNhcmRfX3F1aWNrLXZpZXcnKTtcclxuXHJcbiAgICAvLyDRgdGH0LXRgtGH0LjQuiDQutC+0LvQu9C40YfQtdGB0YLQstCwINGC0L7QstCw0YDQsFxyXG4gICAgbmV3IEN1c3RvbUlucHV0Q291bnQoJy5jdXN0b20taW5wdXQtY291bnQnKTtcclxuXHJcbiAgICAvLyDQn9C+0LTRgtCy0YLQtdGA0LbQtNC10L3QuNC1INC40YHQv9C+0LvRjNCy0LDQvdC40Y8g0LrRg9C6XHJcbiAgICBuZXcgQWNjZXB0Q29va2llcygnLmFjY2VwdC1jb29raWVzJyk7XHJcblxyXG4gICAgLy8g0JrQsNGA0YLQsCDQsiDQutC+0L3RgtCw0LrRgtCw0YVcclxuICAgIG5ldyBDb250YWN0c01hcCgnI2NvbnRhY3RfbWFwJyk7XHJcblxyXG4gICAgLy8g0JfQsNCz0YDRg9C30YfQuNC6INGE0LDQudC70L7QsiAo0LrQvtC90YLQsNC60YLRiylcclxuICAgIG5ldyBVcGxvYWRlcignW2RhdGEtdXBsb2FkXScpO1xyXG5cclxuICAgIC8vINCS0LDQu9C40LTQsNGG0LjRj1xyXG4gICAgdmFsaWRhdGlvbigpO1xyXG59O1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV9mNzkzZjhkYy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIEZhcUFjY29yZGlvbihhY2NvcmRpb25QYXJlbnQpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuYWNjb3JkaW9uUGFyZW50ID0gJChhY2NvcmRpb25QYXJlbnQpO1xyXG4gICAgaWYgKHRoaXMuYWNjb3JkaW9uUGFyZW50WzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5GYXFBY2NvcmRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRhY2NvcmRJdGVtOiB0aGlzLmFjY29yZGlvblBhcmVudC5maW5kKCcuZmFxLWNhdGVnb3J5X19pdGVtJyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1IZWFkOiB0aGlzLmFjY29yZGlvblBhcmVudC5maW5kKCcuZmFxLWNhdGVnb3J5X19oZWFkJyksXHJcbiAgICAgICAgJGFjY29yZEl0ZW1Db250ZW50OiB0aGlzLmFjY29yZGlvblBhcmVudC5maW5kKCcuZmFxLWNhdGVnb3J5X19jb250ZW50JylcclxuICAgIH07XHJcbiAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtSGVhZC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjYWxsaW5nRWxlbSA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC5hY2NvcmRJdGVtQWN0aW9uKGNhbGxpbmdFbGVtKVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5GYXFBY2NvcmRpb24ucHJvdG90eXBlLmFjY29yZEl0ZW1BY3Rpb24gPSBmdW5jdGlvbihjYWxsaW5nRWxlbSkge1xyXG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1IZWFkW25dID09PSBjYWxsaW5nRWxlbSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtuXS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtW25dLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtQ29udGVudFtuXSkuc2xpZGVVcCg1MDApO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIXRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1bbl0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtuXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUNvbnRlbnRbbl0pLnNsaWRlRG93big1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtuXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtQ29udGVudFtuXSkuc2xpZGVVcCg1MDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmFxQWNjb3JkaW9uO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFxQWNjb3JkaW9uLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gSGVhZGVyUGx1Z2luKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLmhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgdGhpcy4kaGVhZGVyID0gJChzZWxlY3Rvcik7XHJcbiAgICBpZiAodGhpcy4kaGVhZGVyWzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5IZWFkZXJQbHVnaW4ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbih0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRoZWFkZXJOYXZNb2JpbGU6IHRoaXMuJGhlYWRlci5maW5kKCcuaGVhZGVyLW5hdi1tb2JpbGUnKSxcclxuICAgICAgICAkaGVhZGVyTmF2TW9iaWxlTGlzdDogdGhpcy4kaGVhZGVyLmZpbmQoJy5oZWFkZXItbmF2LW1vYmlsZV9fbGlzdCcpLFxyXG4gICAgICAgICRoZWFkZXJOYXZNb2JpbGVCdG46IHRoaXMuJGhlYWRlci5maW5kKCcuaGVhZGVyLW5hdi1tb2JpbGVfX2J0bicpLFxyXG4gICAgICAgICRoZWFkZXJFeHBhbmQ6IHRoaXMuJGhlYWRlci5maW5kKCcuaGVhZGVyX19leHBhbmQnKSxcclxuICAgICAgICAkbG9nbzogdGhpcy4kaGVhZGVyLmZpbmQoJy5sb2dvJyksXHJcbiAgICAgICAgJGJvZHk6ICQoJ2JvZHknKVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZU9uU2Nyb2xsKCk7XHJcbiAgICB0aGlzLnVwZGF0ZU9uUmVzaXplKCk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kaGVhZGVyTmF2TW9iaWxlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoYXQubmF2VG9nZ2xlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhhdC51cGRhdGVPblNjcm9sbCgpO1xyXG4gICAgfSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhhdC51cGRhdGVPblJlc2l6ZSgpO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuSGVhZGVyUGx1Z2luLnByb3RvdHlwZS51cGRhdGVPblNjcm9sbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGhlYWRlckhlaWdodCA9IHRoaXMuaGVhZGVyLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID49IGhlYWRlckhlaWdodCAvIDEuNSkge1xyXG4gICAgICAgIHRoaXMuJGhlYWRlci5hZGRDbGFzcyhcInN0aWNreVwiKTtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIDwgNzY4LTE3KSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuZWxlbWVudHMuJGxvZ28uc2xpZGVEb3duKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRoZWFkZXIucmVtb3ZlQ2xhc3MoXCJzdGlja3lcIik7XHJcbiAgICB9XHJcbiAgICAvLyB0aGlzLmVsZW1lbnRzLiRib2R5LmNzcyhcInBhZGRpbmctdG9wXCIsIGhlYWRlckhlaWdodCk7XHJcbn07XHJcblxyXG5IZWFkZXJQbHVnaW4ucHJvdG90eXBlLnVwZGF0ZU9uUmVzaXplID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgaGVhZGVySGVpZ2h0ID0gdGhpcy5oZWFkZXIub2Zmc2V0SGVpZ2h0O1xyXG4gICAgdmFyIGdldFdpbmRvd1dpZHRoID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xyXG5cclxuICAgIGlmIChnZXRXaW5kb3dXaWR0aCA8IDExODAgLSAxNykge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHMuJGJvZHkuY3NzKFwicGFkZGluZy10b3BcIiwgaGVhZGVySGVpZ2h0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cy4kYm9keS5jc3MoXCJwYWRkaW5nLXRvcFwiLCAwKTtcclxuICAgIH1cclxufTtcclxuXHJcbkhlYWRlclBsdWdpbi5wcm90b3R5cGUubmF2VG9nZ2xlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzLiRoZWFkZXJOYXZNb2JpbGUudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgdGhpcy5lbGVtZW50cy4kaGVhZGVyTmF2TW9iaWxlTGlzdC5zbGlkZVRvZ2dsZSgyNTApO1xyXG5cclxuICAgIGlmICghKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA8IDc2OC0xNykpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGlmICh0aGlzLmVsZW1lbnRzLiRoZWFkZXJOYXZNb2JpbGUuaGFzQ2xhc3MoJ2FjdGl2ZScpICYmICF0aGlzLmhlYWRlci5jbGFzc0xpc3QuY29udGFpbnMoJ3N0aWNreScpKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cy4kaGVhZGVyRXhwYW5kLnNsaWRlVXAoMzAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cy4kaGVhZGVyRXhwYW5kLnNsaWRlRG93bigzMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyUGx1Z2luO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvaGVhZGVyUGx1Z2luLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gSGlzdG9yeU9yZGVycyhwYXJlbnQpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJGhpc3RvcnlPcmRlcnNQYXJlbnQgPSAkKHBhcmVudCk7XHJcbiAgICBpZiAodGhpcy4kaGlzdG9yeU9yZGVyc1BhcmVudFswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuSGlzdG9yeU9yZGVycy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbWVudHMgPSB7XHJcbiAgICAgICAgJGhpc3RvcnlPcmRlcnNMaXN0OiB0aGlzLiRoaXN0b3J5T3JkZXJzUGFyZW50LmZpbmQoJy5oaXN0b3J5LW9yZGVycy1saXN0JyksXHJcbiAgICAgICAgJGhpc3RvcnlPcmRlcnNMaXN0SGVhZDogdGhpcy4kaGlzdG9yeU9yZGVyc1BhcmVudC5maW5kKCcuaGlzdG9yeS1vcmRlcnMtbGlzdF9faGVhZCBoMycpLFxyXG4gICAgICAgICRoaXN0b3J5T3JkZXJzTGlzdEJvZHk6IHRoaXMuJGhpc3RvcnlPcmRlcnNQYXJlbnQuZmluZCgnLmhpc3Rvcnktb3JkZXJzLWxpc3RfX2JvZHknKSxcclxuICAgICAgICAkaGlzdG9yeU9yZGVyc0l0ZW06IHRoaXMuJGhpc3RvcnlPcmRlcnNQYXJlbnQuZmluZCgnLmhpc3Rvcnktb3JkZXJzLWl0ZW1fX3pvb20nKVxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gbWFnbmlmaWMgcG9wdXBcclxuICAgIHRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNJdGVtLm1hZ25pZmljUG9wdXAoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgdmVydGljYWxGaXQ6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBhY2NvcmRpb25cclxuICAgIHRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0SGVhZC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjYWxsaW5nRWxlbSA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC5hY2NvcmRJdGVtQWN0aW9uKGNhbGxpbmdFbGVtLCB0aGF0KVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5IaXN0b3J5T3JkZXJzLnByb3RvdHlwZS5hY2NvcmRJdGVtQWN0aW9uID0gZnVuY3Rpb24oY2FsbGluZ0VsZW0sIHRoYXQpIHtcclxuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgdGhpcy5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3QubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3RIZWFkW25dID09PSBjYWxsaW5nRWxlbSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3Rbbl0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdEJvZHlbbl0pLnNsaWRlVXAoNTAwKTtcclxuICAgICAgICAgICAgICAgIHRoYXQuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0W25dLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIXRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0W25dLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHMuJGhpc3RvcnlPcmRlcnNMaXN0W25dLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdEJvZHlbbl0pLnNsaWRlRG93big1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnRzLiRoaXN0b3J5T3JkZXJzTGlzdEJvZHlbbl0pLnNsaWRlVXAoNTAwKTtcclxuICAgICAgICAgICAgdGhhdC5lbGVtZW50cy4kaGlzdG9yeU9yZGVyc0xpc3Rbbl0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIaXN0b3J5T3JkZXJzO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvaGlzdG9yeU9yZGVycy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIE1vZGFscyAobW9kYWwsIGRlZmlhbnRFbGVtKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLm1vZGFsID0gbW9kYWw7XHJcbiAgICB0aGlzLiRtb2RhbCA9ICQobW9kYWwpO1xyXG5cclxuICAgIGlmICh0aGlzLiRtb2RhbFswXSkge1xyXG4gICAgICAgIHRoaXMuZGVmaWFudEVsZW0gPSBkZWZpYW50RWxlbTtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk1vZGFscy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0aGF0KSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRtb2RhbDogICAgICAgICAgICAgIHRoaXMuJG1vZGFsLFxyXG4gICAgICAgICRjbG9zZUJ0bjogICAgICAgICAgIHRoaXMuJG1vZGFsLmZpbmQoXCIubW9kYWwtY2xvc2VcIiksXHJcbiAgICAgICAgJHRhYnM6ICAgICAgICAgICAgICAgdGhpcy4kbW9kYWwuZmluZChcIi5tb2RhbF9fdGFic1wiKSxcclxuICAgICAgICAkbW9kYWxDb250ZW50OiAgICAgICB0aGlzLiRtb2RhbC5maW5kKFwiLm1vZGFsX19jb250ZW50XCIpLFxyXG4gICAgICAgICRtb2RhbE1vYmlsZTogICAgICAgIHRoaXMuJG1vZGFsLmZpbmQoXCIubW9kYWxfX21vYmlsZVwiKSxcclxuICAgICAgICAkcXVpY2tTbGlkZXI6ICAgICAgICB0aGlzLiRtb2RhbC5maW5kKFwiLmNhdGFsb2ctcXVpY2stdmlldy1zbGlkZXJcIilcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIHNob3cgbW9kYWxcclxuICAgICQodGhpcy5kZWZpYW50RWxlbSkub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhhdC5zaG93TW9kYWwodGhhdCk7XHJcbiAgICAgICAgaWYgKHRoYXQuZWxlbWVudHMuJHF1aWNrU2xpZGVyWzBdKSB7XHJcbiAgICAgICAgICAgIHRoYXQuc2xpZGVyQ2F0YWxvZ1F1aWNrVmlldyh0aGF0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kY2xvc2VCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhhdC5oaWRlTW9kYWwodGhhdCwgZSlcclxuICAgIH0pO1xyXG4gICAgLy8gaGlkZSBtb2RhbFxyXG4gICAgdGhpcy5lbGVtZW50cy4kbW9kYWwub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB0aGF0LmhpZGVNb2RhbCh0aGF0LCBlKVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gY2hhbmdlIHN0YXRlIG1vZGFsXHJcbiAgICB0aGlzLmVsZW1lbnRzLiR0YWJzLmNoaWxkcmVuKCdkaXYnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhhdC5jaGFuZ2VTdGF0ZSh0aGF0LCBlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGNoYW5nZSBzdGF0ZSBtb2RhbCBtb2JpbGVcclxuICAgIHRoaXMuZWxlbWVudHMuJG1vZGFsTW9iaWxlLmNoaWxkcmVuKCdhJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoYXQuY2hhbmdlU3RhdGVNb2JpbGUodGhhdCwgZSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk1vZGFscy5wcm90b3R5cGUuc2hvd01vZGFsID0gZnVuY3Rpb24gKHRoYXQpIHtcclxuXHJcbiAgICAkKCcubW9kYWwnKS5mYWRlT3V0KDMwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpLmFkZENsYXNzKCdjbG9zZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoYXQuZWxlbWVudHMuJG1vZGFsLmZhZGVJbigzMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5hZGRDbGFzcygnb3BlbmVkJyk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk1vZGFscy5wcm90b3R5cGUuaGlkZU1vZGFsID0gZnVuY3Rpb24gKHRoYXQsIGUpIHtcclxuICAgIHZhciBtb2RhbCA9IHRoYXQuZWxlbWVudHMuJG1vZGFsO1xyXG4gICAgdmFyIGN1cnJUYXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignY2xhc3MnKTtcclxuXHJcbiAgICBpZiAoZS50YXJnZXQgPT09IG1vZGFsWzBdIHx8IGN1cnJUYXJnZXQgPT09ICdtb2RhbC1jbG9zZScpIHtcclxuICAgICAgICBtb2RhbC5mYWRlT3V0KDMwMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW4nKS5hZGRDbGFzcygnY2xvc2VkJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbHMucHJvdG90eXBlLmNoYW5nZVN0YXRlID0gZnVuY3Rpb24odGhhdCwgZSkge1xyXG4gICAgdmFyIHRhcmdldERpdiA9IGUudGFyZ2V0O1xyXG5cclxuICAgIC8vIGNoYW5nZVRhYlxyXG4gICAgdGhhdC5lbGVtZW50cy4kdGFicy5jaGlsZHJlbignZGl2JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCh0YXJnZXREaXYpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAvLyBjaGFuZ2VDb250ZW50XHJcbiAgICB2YXIgYWN0aXZlVGFiID0gdGhhdC5lbGVtZW50cy4kdGFicy5jaGlsZHJlbignZGl2JykuaW5kZXgodGFyZ2V0RGl2KTtcclxuICAgIGNvbnNvbGUubG9nKGFjdGl2ZVRhYik7XHJcbiAgICB0aGF0LmVsZW1lbnRzLiRtb2RhbENvbnRlbnQuY2hpbGRyZW4oJ2RpdicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICQodGhhdC5lbGVtZW50cy4kbW9kYWxDb250ZW50LmNoaWxkcmVuKCdkaXYnKVthY3RpdmVUYWJdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbn07XHJcblxyXG5Nb2RhbHMucHJvdG90eXBlLmNoYW5nZVN0YXRlTW9iaWxlID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdmFyICR0YWJzID0gdGhhdC5lbGVtZW50cy4kdGFicy5jaGlsZHJlbignZGl2Jyk7XHJcbiAgICB2YXIgJGNvbnRlbnQgPSB0aGF0LmVsZW1lbnRzLiRtb2RhbENvbnRlbnQuY2hpbGRyZW4oJ2RpdicpO1xyXG4gICAgdmFyIHRhYnNBY3RpdmVJbmRleCA9IHRoYXQuZWxlbWVudHMuJHRhYnMuY2hpbGRyZW4oJy5hY3RpdmUnKS5pbmRleCgpO1xyXG5cclxuICAgICRjb250ZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICR0YWJzLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgIGlmICh0YWJzQWN0aXZlSW5kZXggPT09IDApIHtcclxuICAgICAgICAkKCRjb250ZW50WzFdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCgkdGFic1sxXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfSBlbHNlIGlmICh0YWJzQWN0aXZlSW5kZXggPT09IDEpIHtcclxuICAgICAgICAkKCRjb250ZW50WzBdKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgJCgkdGFic1swXSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWxzLnByb3RvdHlwZS5zbGlkZXJDYXRhbG9nUXVpY2tWaWV3ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtZW50cy4kc2xpZGVyTWFpbiA9IHRoaXMuZWxlbWVudHMuJHF1aWNrU2xpZGVyLmZpbmQoJy5jYXRhbG9nLXF1aWNrLXZpZXctc2xpZGVyX19tYWluJyk7XHJcbiAgICB0aGlzLmVsZW1lbnRzLiRzbGlkZXJTdWIgPSB0aGlzLmVsZW1lbnRzLiRxdWlja1NsaWRlci5maW5kKCcuY2F0YWxvZy1xdWljay12aWV3LXNsaWRlcl9fc3ViJyk7XHJcblxyXG4gICAgaWYgKHRoaXMuZWxlbWVudHMuJHNsaWRlck1haW4uaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFyYW1zTWFpbiA9IHtcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgIHNwZWVkOiA1MDAsXHJcbiAgICAgICAgYXNOYXZGb3I6IFwiLmNhdGFsb2ctcXVpY2stdmlldy1zbGlkZXJfX3N1YlwiXHJcbiAgICB9O1xyXG4gICAgdmFyIHBhcmFtc1N1YiA9IHtcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDQsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICBzcGVlZDogNTAwLFxyXG4gICAgICAgIGFzTmF2Rm9yOiBcIi5jYXRhbG9nLXF1aWNrLXZpZXctc2xpZGVyX19tYWluXCIsXHJcbiAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMHB4J1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kc2xpZGVyTWFpbi5vbignaW5pdCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhhdC5lbGVtZW50cy4kcXVpY2tTbGlkZXIuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRzbGlkZXJNYWluLnNsaWNrKHBhcmFtc01haW4pO1xyXG4gICAgdGhpcy5lbGVtZW50cy4kc2xpZGVyU3ViLnNsaWNrKHBhcmFtc1N1Yik7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kc2xpZGVyTWFpbi5vbignYWZ0ZXJDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSkge1xyXG4gICAgICAgIHRoYXQuZWxlbWVudHMuJHNsaWRlclN1Yi5zbGljaygnc2xpY2tHb1RvJywgY3VycmVudFNsaWRlKTtcclxuICAgICAgICB2YXIgY3VycnJlbnROYXZTbGlkZUVsZW0gPSAnLnNsaWRlci1uYXYgLnNsaWNrLXNsaWRlW2RhdGEtc2xpY2staW5kZXg9XCInICsgY3VycmVudFNsaWRlICsgJ1wiXSc7XHJcbiAgICAgICAgJCgnLnNsaWRlci1uYXYgLnNsaWNrLXNsaWRlLmlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICAkKGN1cnJyZW50TmF2U2xpZGVFbGVtKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZWxlbWVudHMuJHNsaWRlclN1Yi5vbignY2xpY2snLCAnLnNsaWNrLXNsaWRlJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBnb1RvU2luZ2xlU2xpZGUgPSAkKHRoaXMpLmRhdGEoJ3NsaWNrLWluZGV4Jyk7XHJcbiAgICAgICAgdGhhdC5lbGVtZW50cy4kc2xpZGVyTWFpbi5zbGljaygnc2xpY2tHb1RvJywgZ29Ub1NpbmdsZVNsaWRlKTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kYWxzO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kYWxzLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gT3JkZXJBY2NvcmRpb24gKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICB0aGlzLiRhY2NvcmRpb25QYXJlbnQgPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kYWNjb3JkaW9uUGFyZW50WzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PcmRlckFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbWVudHMgPSB7XHJcbiAgICAgICAgJGFjY29yZEl0ZW06IHRoaXMuJGFjY29yZGlvblBhcmVudC5maW5kKCcub3JkZXItYWNjb3JkaW9uLWl0ZW0nKSxcclxuICAgICAgICAkYWNjb3JkSXRlbUhlYWQ6IHRoaXMuJGFjY29yZGlvblBhcmVudC5maW5kKCcub3JkZXItYWNjb3JkaW9uLWl0ZW1fX2hlYWQnKSxcclxuICAgICAgICAkYWNjb3JkSXRlbUJvZHk6IHRoaXMuJGFjY29yZGlvblBhcmVudC5maW5kKCcub3JkZXItYWNjb3JkaW9uLWl0ZW1fX2JvZHknKSxcclxuICAgICAgICAkYWNjb3JkSXRlbUJ0bjogdGhpcy4kYWNjb3JkaW9uUGFyZW50LmZpbmQoJy5vcmRlci1hY2NvcmRpb24taXRlbV9fYWN0aW9ucyBhJylcclxuICAgIH07XHJcblxyXG4gICAgLy8gc2V0IGluaXRpYWwgc3RhdGVcclxuICAgIHZhciAkaW5pdGlhbEl0ZW0gPSAkKHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW1bMF0pO1xyXG4gICAgdmFyICRpbml0aWFsQm9keSA9ICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJvZHlbMF0pO1xyXG5cclxuICAgICRpbml0aWFsSXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAkaW5pdGlhbEl0ZW0uYXR0cihcImRhdGEtdmlzaXRlZFwiLCBcInRydWVcIik7XHJcbiAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtQm9keS5ub3QoJGluaXRpYWxCb2R5KS5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxuXHJcbiAgICAvLyBhZGQgZXZlbnRzXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtQnRuLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHZhciBjYWxsaW5nRWxlbSA9IHRoaXM7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRoYXQuYWNjb3JkaW9uSXRlbUJ0bkFjdGlvbihjYWxsaW5nRWxlbSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtSGVhZC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjYWxsaW5nRWxlbSA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC5hY2NvcmRpb25JdGVtSGVhZEFjdGlvbihjYWxsaW5nRWxlbSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5PcmRlckFjY29yZGlvbi5wcm90b3R5cGUuYWNjb3JkaW9uSXRlbUJ0bkFjdGlvbiA9IGZ1bmN0aW9uIChjYWxsaW5nRWxlbSkge1xyXG4gICAgdmFyIGNhbGxpbmdFbGVtUGFyZW50ID0gJChjYWxsaW5nRWxlbSkucGFyZW50cygnLm9yZGVyLWFjY29yZGlvbi1pdGVtJyk7XHJcbiAgICB2YXIgY2FsbGluZ0VsZW1JbmRleCA9IGNhbGxpbmdFbGVtUGFyZW50LmluZGV4KCk7XHJcbiAgICB2YXIgJGNhbGxpbmdFbGVtID0gJCh0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtW2NhbGxpbmdFbGVtSW5kZXggKyAxXSk7XHJcblxyXG4gICAgLy8gY2xlYXIgc3RhdGVcclxuICAgIHRoaXMuZWxlbWVudHMuJGFjY29yZEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgdGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJvZHkuc2xpZGVVcCgzMDApO1xyXG5cclxuICAgIC8vIHNldCBzdGF0ZVxyXG4gICAgJGNhbGxpbmdFbGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICRjYWxsaW5nRWxlbS5hdHRyKFwiZGF0YS12aXNpdGVkXCIsIFwidHJ1ZVwiKTtcclxuICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJvZHlbY2FsbGluZ0VsZW1JbmRleCArIDFdKS5zbGlkZURvd24oMzAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyBnZXQgZWxlbSBwb3NpdGlvblxyXG4gICAgICAgIHZhciBjYWxsaW5nRWxlbVBvc1RvcCA9ICRjYWxsaW5nRWxlbS5wb3NpdGlvbigpLnRvcDtcclxuXHJcbiAgICAgICAgLy8gc2V0IHdpbmRvdyBwb3NpdGlvblxyXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtzY3JvbGxUb3A6IGNhbGxpbmdFbGVtUG9zVG9wIC0gJCgnLmhlYWRlcicpLm91dGVySGVpZ2h0KCkgLSAyMH0sIDUwMCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbk9yZGVyQWNjb3JkaW9uLnByb3RvdHlwZS5hY2NvcmRpb25JdGVtSGVhZEFjdGlvbiA9IGZ1bmN0aW9uKGNhbGxpbmdFbGVtKSB7XHJcbiAgICB2YXIgY2FsbGluZ0VsZW1QYXJlbnQgPSAkKGNhbGxpbmdFbGVtKS5wYXJlbnRzKCcub3JkZXItYWNjb3JkaW9uLWl0ZW0nKTtcclxuXHJcbiAgICBpZiAoY2FsbGluZ0VsZW1QYXJlbnQuYXR0cignZGF0YS12aXNpdGVkJykgJiYgIWNhbGxpbmdFbGVtUGFyZW50Lmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgIHZhciBjYWxsaW5nRWxlbUluZGV4ID0gY2FsbGluZ0VsZW1QYXJlbnQuaW5kZXgoKTtcclxuXHJcbiAgICAgICAgLy8gY2xlYXIgc3RhdGVcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLiRhY2NvcmRJdGVtQm9keS5zbGlkZVVwKDMwMCk7XHJcblxyXG4gICAgICAgIC8vIHNldCBzdGF0ZVxyXG4gICAgICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbVtjYWxsaW5nRWxlbUluZGV4XSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICQodGhpcy5lbGVtZW50cy4kYWNjb3JkSXRlbUJvZHlbY2FsbGluZ0VsZW1JbmRleF0pLnNsaWRlRG93bigzMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBnZXQgZWxlbSBwb3NpdGlvblxyXG4gICAgICAgICAgICB2YXIgY2FsbGluZ0VsZW1Qb3NUb3AgPSBjYWxsaW5nRWxlbVBhcmVudC5wb3NpdGlvbigpLnRvcDtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldCB3aW5kb3cgcG9zaXRpb25cclxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogY2FsbGluZ0VsZW1Qb3NUb3AgLSAkKCcuaGVhZGVyJykub3V0ZXJIZWlnaHQoKSAtIDIwfSwgNTAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3JkZXJBY2NvcmRpb247XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9vcmRlckFjY29yZGlvbi5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIE9yZGVyRm9ybSAoc2VsZWN0b3IpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJG9yZGVyRm9ybSA9ICQoc2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLiRvcmRlckZvcm1bMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuT3JkZXJGb3JtLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgJC52YWxpZGF0b3Iuc2V0RGVmYXVsdHMoe1xyXG4gICAgICAgIGlnbm9yZTogW11cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHZhbGlkYXRpb24gZm9ybVxyXG4gICAgdGhpcy4kb3JkZXJGb3JtLnZhbGlkYXRlKHtcclxuICAgICAgICBlcnJvckVsZW1lbnQ6IFwicFwiLFxyXG4gICAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgICAgIC8vINCa0L7QvdGC0LDQutGC0L3Ri9C1INC00LDQvdC90YvQtVxyXG4gICAgICAgICAgICBjb3VudHJ5OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjaXR5OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdHJlZXQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhvdXNlOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByb29tOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8g0KHQv9C+0YHQvtCxINC00L7RgdGC0LDQstC60LhcclxuICAgICAgICAgICAgZGVsaXZlcnk6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vINCh0L/QvtGB0L7QsSDQv9C+0LvQsNGC0YtcclxuICAgICAgICAgICAgcGF5bWVudDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vINC70LjRh9C90YvQtSDQtNCw0L3QvdGL0LVcclxuICAgICAgICAgICAgbGFzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZpcnN0bmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbihlcnJvciwgZWxlbWVudCkge31cclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3JkZXJGb3JtO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvb3JkZXJGb3JtLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gT3JkZXJQYXltZW50IChzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kb3JkZXJQYXltZW50ID0gJChzZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuJG9yZGVyUGF5bWVudFswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCh0aGF0KTtcclxuICAgIH1cclxufVxyXG5cclxuT3JkZXJQYXltZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkaGVhZGVyOiAkKCcuaGVhZGVyJylcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5wYXJhbXMgPSB7XHJcbiAgICAgICAgb3JkZXJQYXltZW50UG9zOiB0aGF0LiRvcmRlclBheW1lbnQucG9zaXRpb24oKS50b3BcclxuICAgIH07XHJcblxyXG4gICAgdGhhdC51cGRhdGVPblNjcm9sbCgpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGF0LnVwZGF0ZU9uU2Nyb2xsKCk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcblxyXG5PcmRlclBheW1lbnQucHJvdG90eXBlLnVwZGF0ZU9uU2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2Nyb2xsV2luZG93ID0gd2luZG93LnBhZ2VZT2Zmc2V0ICsgdGhpcy5lbGVtZW50cy4kaGVhZGVyLm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgaWYgKHNjcm9sbFdpbmRvdyA+IHRoaXMucGFyYW1zLm9yZGVyUGF5bWVudFBvcykge1xyXG4gICAgICAgIHRoaXMuJG9yZGVyUGF5bWVudC5hZGRDbGFzcygnc3RpY2t5Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJG9yZGVyUGF5bWVudC5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coXCJzY3JvbGxXaW5kb3dcIiwgc2Nyb2xsV2luZG93LCBcInRoYXQucGFyYW1zLm9yZGVyUGF5bWVudFBvc1wiLCB0aGF0LnBhcmFtcy5vcmRlclBheW1lbnRQb3MpO1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJ3aW5kb3dcIiwgd2luZG93LnBhZ2VZT2Zmc2V0KTtcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgLy8gY29uc29sZS5sb2coXCJ0aGlzXCIsIHRoYXQuJG9yZGVyUGF5bWVudC5wb3NpdGlvbigpLnRvcCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9yZGVyUGF5bWVudDtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL29yZGVyUGF5bWVudC5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIG91ckNlcnRpZmljYXRlcyAoc2VsZWN0b3IpIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuJG91ckNlcnRpZmljYXRlcyA9ICQoc2VsZWN0b3IpO1xyXG5cclxuICAgIGlmICh0aGlzLiRvdXJDZXJ0aWZpY2F0ZXNbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxub3VyQ2VydGlmaWNhdGVzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmVsZW1lbnRzID0ge1xyXG4gICAgICAgICRvdXJDZXJ0aWZpY2F0ZXNMaW5rOiB0aGlzLiRvdXJDZXJ0aWZpY2F0ZXMuZmluZCgnLm91ci1jZXJ0aWZpY2F0ZXNfX2l0ZW0gYScpXHJcbiAgICB9O1xyXG4gICAgLy8gbWFnbmlmaWMgcG9wdXBcclxuICAgIHRoaXMuZWxlbWVudHMuJG91ckNlcnRpZmljYXRlc0xpbmsubWFnbmlmaWNQb3B1cCh7XHJcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcclxuICAgICAgICBpbWFnZToge1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbEZpdDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgem9vbToge1xyXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogMzAwXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG91ckNlcnRpZmljYXRlcztcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvb3VyQ2VydGlmaWNhdGVzLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gUGFyYWxsYXhSZXZpZXdzIChzZWxlY3Rvcikge1xyXG4gICAgdGhpcy5yZXZpZXdzID0gc2VsZWN0b3I7XHJcbiAgICB0aGlzLiRyZXZpZXdzID0gJChzZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuJHJldmlld3NbMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuUGFyYWxsYXhSZXZpZXdzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAkKHRoaXMucmV2aWV3cykucGFyYWxsYXgoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFyYWxsYXhSZXZpZXdzO1xyXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwicUM4NTlMXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvcGFyYWxsYXhSZXZpZXdzLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZnVuY3Rpb24gUGhvdG9HYWxsZXJ5IChzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kcGhvdG9HYWxsZXJ5ID0gJChzZWxlY3Rvcik7XHJcblxyXG4gICAgaWYgKHRoaXMuJHBob3RvR2FsbGVyeVswXSkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5QaG90b0dhbGxlcnkucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZWxlbWVudHMgPSB7XHJcbiAgICAgICAgJHBob3RvR2FsbGVyeUxpbms6IHRoaXMuJHBob3RvR2FsbGVyeS5maW5kKCcucGhvdG8tZ2FsbGVyeS1pdGVtIGEnKVxyXG4gICAgfTtcclxuICAgIC8vIG1hZ25pZmljIHBvcHVwXHJcbiAgICB0aGlzLmVsZW1lbnRzLiRwaG90b0dhbGxlcnlMaW5rLm1hZ25pZmljUG9wdXAoe1xyXG4gICAgICAgIHR5cGU6ICdpbWFnZScsXHJcbiAgICAgICAgaW1hZ2U6IHtcclxuICAgICAgICAgICAgdmVydGljYWxGaXQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHpvb206IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgZHVyYXRpb246IDMwMFxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQaG90b0dhbGxlcnk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL3Bob3RvR2FsbGVyeS5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIFNsaWRlckJlc3RTYWxlcyhzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy5zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy5zbGlkZXIpIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblNsaWRlckJlc3RTYWxlcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHRoYXQpIHtcclxuICAgIHRoaXMuZWxlbXMgPSB7XHJcbiAgICAgICAgJGJlc3RzZWxsZXJzU2xpZGVyOiAkKHRoaXMuc2xpZGVyKVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcGFyYW1zID0ge1xyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMyxcclxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgc3BlZWQ6IDUwMCxcclxuICAgICAgICByZXNwb25zaXZlOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDExODAsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcclxuICAgICAgICAgICAgICAgICAgICBhcnJvd3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNzY4LFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZWxlbXMuJGJlc3RzZWxsZXJzU2xpZGVyLm9uKCdpbml0JywgZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGF0LmVsZW1zLiRiZXN0c2VsbGVyc1NsaWRlci5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwidmlzaWJsZVwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbXMuJGJlc3RzZWxsZXJzU2xpZGVyLnNsaWNrKHBhcmFtcyk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTbGlkZXJCZXN0U2FsZXM7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9zbGlkZXJCZXN0U2FsZXMuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBTbGlkZXJNYWluKHNsaWRlciwgaW50ZW1CZykge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kc2xpZGVyID0gJChzbGlkZXIpO1xyXG4gICAgdGhpcy5pbnRlbUJnID0gaW50ZW1CZztcclxuXHJcbiAgICBpZiAodGhpcy4kc2xpZGVyWzBdKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KHRoYXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5TbGlkZXJNYWluLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdmFyIHBhcmFtcyA9IHtcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgYXJyb3dzOiBmYWxzZSxcclxuICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgICAgIHNwZWVkOiA1MDAsXHJcbiAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICAgICAgYXV0b3BsYXlTcGVlZDogNTAwMFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLiRzbGlkZXIub24oJ2luaXQnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoYXQuJHNsaWRlci5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwidmlzaWJsZVwiKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy4kc2xpZGVyLnNsaWNrKHBhcmFtcyk7XHJcblxyXG4gICAgLy8g0JjQvdC40LfQuNCw0LvQuNC30LjRgNGD0LXRgtGB0Y8g0L/QsNGA0LDQu9C70LDQutGBXHJcbiAgICB0aGlzLmluaXRQYXJhbGxheCh0aGF0KTtcclxufTtcclxuXHJcblNsaWRlck1haW4ucHJvdG90eXBlLmluaXRQYXJhbGxheCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCEoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIDwgNzY4LTE3KSkge1xyXG4gICAgICAgIHRoaXMucGFyYW1zUGFyYWxsYXggPSB7XHJcbiAgICAgICAgICAgIHNwZWVkOiAtMTAsXHJcbiAgICAgICAgICAgIGNlbnRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIHdyYXBwZXI6IG51bGwsXHJcbiAgICAgICAgICAgIHJvdW5kOiB0cnVlLFxyXG4gICAgICAgICAgICB2ZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgICAgICAgaG9yaXpvbnRhbDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucGFyYWxsYXggPSBuZXcgUmVsbGF4KHRoaXMuaW50ZW1CZywgdGhpcy5wYXJhbXNQYXJhbGxheCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTbGlkZXJNYWluO1xyXG5cclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInFDODU5TFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL3NsaWRlck1haW4uanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5mdW5jdGlvbiBVcGxvYWRlcihzZWxlY3Rvcikge1xyXG5cdHZhciB0aGF0ID0gdGhpcztcclxuXHR0aGlzLiRwYXJlbnQgPSAkKHNlbGVjdG9yKTtcclxuXHRpZiAodGhpcy4kcGFyZW50WzBdKSB7XHJcblx0XHR0aGlzLmluaXQodGhhdCk7XHJcblx0fVxyXG59XHJcblxyXG5VcGxvYWRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICh0aGF0KSB7XHJcblx0dGhpcy5lbGVtcyA9IHtcclxuXHRcdCRpbnB1dDogdGhpcy4kcGFyZW50LmZpbmQoJ1tkYXRhLXVwbG9hZC1pbnB1dF0nKSxcclxuXHRcdCR0ZXh0OiB0aGlzLiRwYXJlbnQuZmluZCgnW2RhdGEtdXBsb2FkLXRleHRdJylcclxuXHR9O1xyXG5cclxuXHR0aGlzLmVsZW1zLiRpbnB1dC5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0dGhhdC5jaGFuZ2VUZXh0KGUpO1xyXG5cdH0pXHJcbn07XHJcblxyXG5VcGxvYWRlci5wcm90b3R5cGUuY2hhbmdlVGV4dCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0dmFyIGZpbGVzID0gdGhpcy5lbGVtcy4kaW5wdXQuZ2V0KDApLmZpbGVzO1xyXG5cclxuXHRpZiAoZmlsZXMubGVuZ3RoKSB7XHJcblx0XHRmaWxlcyA9IGZpbGVzWzBdO1xyXG5cdFx0dGhpcy5lbGVtcy4kdGV4dC50ZXh0KGZpbGVzLm5hbWUpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aGlzLmVsZW1zLiR0ZXh0LnRleHQodGhpcy4kcGFyZW50LmRhdGEoJ3VwbG9hZC1kZWZhdWx0JykpO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXBsb2FkZXI7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi91cGxvYWRlci5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIFVzZXJUb29sc0Ryb3BEb3duIChzZWxlY3Rvcikge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy4kdXNlclRvb2xzRHJvcERvd24gPSAkKHNlbGVjdG9yKTtcclxuXHJcbiAgICBpZiAodGhpcy4kdXNlclRvb2xzRHJvcERvd25bMF0pIHtcclxuICAgICAgICB0aGlzLmluaXQodGhhdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblVzZXJUb29sc0Ryb3BEb3duLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IHtcclxuICAgICAgICAkZHJvcERvd25IZWFkOiB0aGlzLiR1c2VyVG9vbHNEcm9wRG93bi5maW5kKCcudXNlci10b29scy1kcm9wLWRvd25fX2hlYWQnKSxcclxuICAgICAgICAkZHJvcERvd25NZW51OiB0aGlzLiR1c2VyVG9vbHNEcm9wRG93bi5maW5kKCcudXNlci10b29scy1kcm9wLWRvd25fX21lbnUnKSxcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5lbGVtZW50cy4kZHJvcERvd25IZWFkLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhhdC5jaGFuZ2VTdGF0ZVRvZ2dsZSh0aGF0LCBlKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHRoYXQuc2V0RGVmYXVsdFN0YXRlKHRoYXQsIGUpO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG5cclxuVXNlclRvb2xzRHJvcERvd24ucHJvdG90eXBlLmNoYW5nZVN0YXRlVG9nZ2xlID0gZnVuY3Rpb24odGhhdCkge1xyXG4gICAgdGhhdC4kdXNlclRvb2xzRHJvcERvd24udG9nZ2xlQ2xhc3MoJ29wZW4nKTtcclxuICAgIHRoYXQuZWxlbWVudHMuJGRyb3BEb3duTWVudS5zbGlkZVRvZ2dsZSgyMDApO1xyXG59O1xyXG5cclxuVXNlclRvb2xzRHJvcERvd24ucHJvdG90eXBlLnNldERlZmF1bHRTdGF0ZSA9IGZ1bmN0aW9uKHRoYXQsIGUpIHtcclxuICAgIHZhciAkdGFyZ2V0RWxlbWVudCA9ICQoZS50YXJnZXQpO1xyXG4gICAgaWYgKCEoJHRhcmdldEVsZW1lbnQgPT09IHRoYXQuJHVzZXJUb29sc0Ryb3BEb3duIHx8ICR0YXJnZXRFbGVtZW50LnBhcmVudHMoJy51c2VyLXRvb2xzLWRyb3AtZG93bicpWzBdKSkge1xyXG4gICAgICAgIHRoYXQuJHVzZXJUb29sc0Ryb3BEb3duLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcbiAgICAgICAgdGhhdC5lbGVtZW50cy4kZHJvcERvd25NZW51LnNsaWRlVXAoMjAwKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXNlclRvb2xzRHJvcERvd247XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi91c2VyVG9vbHNEcm9wRG93bi5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmZ1bmN0aW9uIHZhbGlkYXRpb24oKSB7XHJcbiAgICAvLyDQn9C+0LTQv9C40YHQutCwINC90LAg0YDRi9GB0YHQu9C60YNcclxuICAgICQoXCIuc3Vic2NyaXB0aW9uLWZvcm1cIikudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yRWxlbWVudDogXCJwXCIsXHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBcItCS0LLQtdC00LjRgtC1IGVtYWlsINCw0LTRgNC10YFcIixcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSBlbWFpbCDQutC+0YDRgNC10LrRgtC90L5cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5yZXN0b3JfX2Zvcm1cIikudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yRWxlbWVudDogXCJwXCIsXHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgZW1haWw6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBcItCS0LLQtdC00LjRgtC1IGVtYWlsINCw0LTRgNC10YFcIixcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSBlbWFpbCDQutC+0YDRgNC10LrRgtC90L5cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0JLRhdC+0LQg0LIg0JvQmlxyXG4gICAgJChcIi5zaW5nLWluX19mb3JtXCIpLnZhbGlkYXRlKHtcclxuICAgICAgICBlcnJvckVsZW1lbnQ6IFwicFwiLFxyXG4gICAgICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogNVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0LLQstC10LTQuNGC0LUgZW1haWwg0LrQvtGA0YDQtdC60YLQvdC+XCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBcItCt0YLQviDQv9C+0LvQtSDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+INC00LvRjyDQt9Cw0L/QvtC70L3QtdC90LjRj1wiLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiBcItCa0L7RgNC+0YLQutC40Lkg0L/QsNGA0L7Qu9GMICjQvNC10L3QtdC1IDUg0YHQuNC80LLQvtC70L7QsilcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0KDQtdCz0LjRgdGC0YDQsNGG0LjRjyDQm9CaXHJcbiAgICAkKFwiLnNpbmctdXBfX2Zvcm1cIikudmFsaWRhdGUoe1xyXG4gICAgICAgIGlnbm9yZTogW10sXHJcbiAgICAgICAgZXJyb3JFbGVtZW50OiBcInBcIixcclxuICAgICAgICBydWxlczoge1xyXG4gICAgICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxhc3RuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29uZmlybV9wYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDUsXHJcbiAgICAgICAgICAgICAgICBlcXVhbFRvOiBcIiNzaW5nLXVwLXBhc3NcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZW5kZXI6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHByaXZhY3lQb2xpY3k6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICBmaXJzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBcItCt0YLQviDQv9C+0LvQtSDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+INC00LvRjyDQt9Cw0L/QvtC70L3QtdC90LjRj1wiLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiBcItCh0LvQuNGI0LrQvtC8INC60L7RgNC+0YLQutC+0LUg0LjQvNGPXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGFzdG5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBcItCt0YLQviDQv9C+0LvQtSDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+INC00LvRjyDQt9Cw0L/QvtC70L3QtdC90LjRj1wiLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiBcItCh0LvQuNGI0LrQvtC8INC60L7RgNC+0YLQutCw0Y8g0YTQsNC80LjQu9C40Y9cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbWFpbDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBlbWFpbDogXCLQn9C+0LbQsNC70YPQudGB0YLQsCDQstCy0LXQtNC40YLQtSBlbWFpbCDQutC+0YDRgNC10LrRgtC90L5cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCIsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IFwi0JrQvtGA0L7RgtC60LjQuSDQv9Cw0YDQvtC70YwgKNC80LXQvdC10LUgNSDRgdC40LzQstC+0LvQvtCyKVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbmZpcm1fcGFzc3dvcmQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBcItCt0YLQviDQv9C+0LvQtSDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+INC00LvRjyDQt9Cw0L/QvtC70L3QtdC90LjRj1wiLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiBcItCa0L7RgNC+0YLQutC40Lkg0L/QsNGA0L7Qu9GMICjQvNC10L3QtdC1IDUg0YHQuNC80LLQvtC70L7QsilcIixcclxuICAgICAgICAgICAgICAgIGVxdWFsVG86IFwi0JLQstC10LTQtdC90L3Ri9C1INC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0L7QtNCw0Y7RglwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdlbmRlcjoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0JLRi9Cx0LXRgNC40YLQtSDQstCw0Ygg0L/QvtC7XCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJpdmFjeVBvbGljeToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQktGF0L7QtCDQsiDQm9CaXHJcbiAgICAkKFwiI2NvbnRhY3RzX2Zvcm1cIikudmFsaWRhdGUoe1xyXG4gICAgICAgIGVycm9yRWxlbWVudDogXCJwXCIsXHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udGFjdDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWVzc2FnZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbWVzc2FnZXM6IHtcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29udGFjdDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbWVzc2FnZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwi0K3RgtC+INC/0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyDQuNC30LzQtdC90LXQvdC40LUg0LvQuNGH0L3Ri9GFINC00LDQvdC90YvRhSDQsiDQm9CaXHJcbiAgICAkKFwiLnVzZXItZGF0YS1jaGFuZ2UtZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgZmlyc3RuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1pbmxlbmd0aDogMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsYXN0bmFtZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGhvbmU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVtYWlsOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVtYWlsOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yUGxhY2VtZW50OiBmdW5jdGlvbihlcnJvciwgZWxlbWVudCkge31cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINC40LfQvNC10L3QtdC90LjQtSDQutC+0L3RgtCw0LrRgtC90YvRhSDQtNCw0L3QvdGL0YUg0LIg0JvQmlxyXG4gICAgJChcIi5kZWxpdmVyeS1jb250YWN0cy1jaGFuZ2UtZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgc3RyZWV0OiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBob3VzZToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcm9vbToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uKGVycm9yLCBlbGVtZW50KSB7fVxyXG4gICAgfSk7XHJcblxyXG4gICAgJChcIi5wYXNzd29yZC1jaGFuZ2UtZm9ybVwiKS52YWxpZGF0ZSh7XHJcbiAgICAgICAgcnVsZXM6IHtcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWlubGVuZ3RoOiA1XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBhc3N3b3JkX25ldzoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY29uZmlybV9wYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6IDUsXHJcbiAgICAgICAgICAgICAgICBlcXVhbFRvOiBcIiN1c2VyLWNhYi1wYXNzXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3JQbGFjZW1lbnQ6IGZ1bmN0aW9uKGVycm9yLCBlbGVtZW50KSB7fVxyXG4gICAgfSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHZhbGlkYXRpb247XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJxQzg1OUxcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi92YWxpZGF0aW9uLmpzXCIsXCIvXCIpIl19
