(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$GotSvgElement = function (a) {
	return {$: 'GotSvgElement', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $author$project$Main$getSvgDimensions = A2(
	$elm$core$Task$attempt,
	$author$project$Main$GotSvgElement,
	$elm$browser$Browser$Dom$getElement('screen'));
var $author$project$Graphics$BoundingBox = F4(
	function (x, y, w, h) {
		return {h: h, w: w, x: x, y: y};
	});
var $author$project$Main$GameBoard = function (a) {
	return {$: 'GameBoard', a: a};
};
var $author$project$Graphics$Point = F2(
	function (x, y) {
		return {x: x, y: y};
	});
var $author$project$Main$Small = {$: 'Small'};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Graphics$screen = A4($author$project$Graphics$BoundingBox, 0, 0, 240, 135);
var $author$project$Main$getSceneCamera = function (scene) {
	var screen = $author$project$Graphics$screen;
	switch (scene.$) {
		case 'TitleScreen':
			return screen;
		case 'DifficultyMenu':
			return _Utils_update(
				screen,
				{x: 1.2 * screen.w});
		case 'OptionsScreen':
			return _Utils_update(
				screen,
				{x: (-1.2) * screen.w});
		case 'GameBoard':
			return _Utils_update(
				screen,
				{x: 2.4 * screen.w});
		default:
			return _Utils_update(
				screen,
				{y: 1.2 * screen.h});
	}
};
var $mdgriffith$elm_animator$Internal$Timeline$Timeline = function (a) {
	return {$: 'Timeline', a: a};
};
var $mdgriffith$elm_animator$Internal$Timeline$Timetable = function (a) {
	return {$: 'Timetable', a: a};
};
var $ianmackenzie$elm_units$Quantity$Quantity = function (a) {
	return {$: 'Quantity', a: a};
};
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $mdgriffith$elm_animator$Internal$Time$absolute = function (posix) {
	return $ianmackenzie$elm_units$Quantity$Quantity(
		$elm$time$Time$posixToMillis(posix));
};
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $mdgriffith$elm_animator$Animator$init = function (first) {
	return $mdgriffith$elm_animator$Internal$Timeline$Timeline(
		{
			events: $mdgriffith$elm_animator$Internal$Timeline$Timetable(_List_Nil),
			initial: first,
			interruption: _List_Nil,
			now: $mdgriffith$elm_animator$Internal$Time$absolute(
				$elm$time$Time$millisToPosix(0)),
			queued: $elm$core$Maybe$Nothing,
			running: true
		});
};
var $author$project$Palette$Material = {$: 'Material'};
var $author$project$Options$On = {$: 'On'};
var $author$project$Options$init = {backgroundAnimation: $author$project$Options$On, labelState: $author$project$Options$On, palette: $author$project$Palette$Material, titleAnimation: $author$project$Options$On};
var $author$project$Main$initialModel = {
	mousePos: A2($author$project$Graphics$Point, 0, 0),
	options: $author$project$Options$init,
	scene: $author$project$Main$GameBoard($author$project$Main$Small),
	svgDimensions: A4($author$project$Graphics$BoundingBox, 0, 0, 0, 0),
	viewBox: $mdgriffith$elm_animator$Animator$init(
		$author$project$Main$getSceneCamera(
			$author$project$Main$GameBoard($author$project$Main$Small)))
};
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2($author$project$Main$initialModel, $author$project$Main$getSvgDimensions);
};
var $author$project$Main$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$Main$WindowResize = F2(
	function (a, b) {
		return {$: 'WindowResize', a: a, b: b};
	});
var $mdgriffith$elm_animator$Internal$Timeline$Animator = F2(
	function (a, b) {
		return {$: 'Animator', a: a, b: b};
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $mdgriffith$elm_animator$Animator$animator = A2(
	$mdgriffith$elm_animator$Internal$Timeline$Animator,
	$elm$core$Basics$always(false),
	F2(
		function (now, model) {
			return model;
		}));
var $mdgriffith$elm_animator$Internal$Timeline$Line = F3(
	function (a, b, c) {
		return {$: 'Line', a: a, b: b, c: c};
	});
var $mdgriffith$elm_animator$Internal$Timeline$Occurring = F3(
	function (a, b, c) {
		return {$: 'Occurring', a: a, b: b, c: c};
	});
var $ianmackenzie$elm_units$Duration$inSeconds = function (_v0) {
	var numSeconds = _v0.a;
	return numSeconds;
};
var $ianmackenzie$elm_units$Duration$inMilliseconds = function (duration) {
	return $ianmackenzie$elm_units$Duration$inSeconds(duration) * 1000;
};
var $ianmackenzie$elm_units$Quantity$plus = F2(
	function (_v0, _v1) {
		var y = _v0.a;
		var x = _v1.a;
		return $ianmackenzie$elm_units$Quantity$Quantity(x + y);
	});
var $mdgriffith$elm_animator$Internal$Time$advanceBy = F2(
	function (dur, time) {
		return A2(
			$ianmackenzie$elm_units$Quantity$plus,
			time,
			$ianmackenzie$elm_units$Quantity$Quantity(
				$ianmackenzie$elm_units$Duration$inMilliseconds(dur)));
	});
var $mdgriffith$elm_animator$Internal$Time$latest = F2(
	function (oneQty, twoQty) {
		var one = oneQty.a;
		var two = twoQty.a;
		return ((one - two) <= 0) ? twoQty : oneQty;
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $mdgriffith$elm_animator$Internal$Timeline$startTime = function (_v0) {
	var time = _v0.b;
	return time;
};
var $elm$core$Basics$ge = _Utils_ge;
var $mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat = F2(
	function (_v0, _v1) {
		var _this = _v0.a;
		var that = _v1.a;
		return (_this - that) >= 0;
	});
var $mdgriffith$elm_animator$Internal$Time$thisAfterThat = F2(
	function (_v0, _v1) {
		var _this = _v0.a;
		var that = _v1.a;
		return (_this - that) > 0;
	});
var $mdgriffith$elm_animator$Internal$Timeline$toOccurring = F2(
	function (_v0, _v1) {
		var duration = _v0.a;
		var event = _v0.b;
		var maybeDwell = _v0.c;
		var now = _v1.a;
		var events = _v1.b;
		var occursAt = A2($mdgriffith$elm_animator$Internal$Time$advanceBy, duration, now);
		var endsAt = function () {
			if (maybeDwell.$ === 'Nothing') {
				return occursAt;
			} else {
				var dwell = maybeDwell.a;
				return A2($mdgriffith$elm_animator$Internal$Time$advanceBy, dwell, occursAt);
			}
		}();
		if (!events.b) {
			return _Utils_Tuple2(
				endsAt,
				_List_fromArray(
					[
						A3($mdgriffith$elm_animator$Internal$Timeline$Occurring, event, occursAt, endsAt)
					]));
		} else {
			var prev = events.a;
			var remain = events.b;
			return _Utils_eq(
				$mdgriffith$elm_animator$Internal$Timeline$startTime(prev),
				occursAt) ? _Utils_Tuple2(
				endsAt,
				A2(
					$elm$core$List$cons,
					A3($mdgriffith$elm_animator$Internal$Timeline$Occurring, event, occursAt, endsAt),
					remain)) : _Utils_Tuple2(
				endsAt,
				A2(
					$elm$core$List$cons,
					A3($mdgriffith$elm_animator$Internal$Timeline$Occurring, event, occursAt, endsAt),
					events));
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$addEventsToLine = F3(
	function (now, _v0, _v1) {
		var delay = _v0.a;
		var scheduledStartingEvent = _v0.b;
		var reverseQueued = _v0.c;
		var startLineAt = _v1.a;
		var startingEvent = _v1.b;
		var events = _v1.c;
		var start = A2($mdgriffith$elm_animator$Internal$Time$advanceBy, delay, now);
		var reversedEvents = $elm$core$List$reverse(events);
		var queued = A2(
			$elm$core$List$cons,
			scheduledStartingEvent,
			$elm$core$List$reverse(reverseQueued));
		if (!reversedEvents.b) {
			var startingEventWithDwell = function () {
				var ev = startingEvent.a;
				var lastEventTime = startingEvent.b;
				return A2($mdgriffith$elm_animator$Internal$Time$thisAfterThat, start, lastEventTime) ? A3($mdgriffith$elm_animator$Internal$Timeline$Occurring, ev, lastEventTime, start) : A3($mdgriffith$elm_animator$Internal$Timeline$Occurring, ev, lastEventTime, lastEventTime);
			}();
			var startNewEventsAt = A2(
				$mdgriffith$elm_animator$Internal$Time$latest,
				$mdgriffith$elm_animator$Internal$Timeline$startTime(startingEvent),
				start);
			return A3(
				$mdgriffith$elm_animator$Internal$Timeline$Line,
				startLineAt,
				startingEventWithDwell,
				$elm$core$List$reverse(
					A3(
						$elm$core$List$foldl,
						$mdgriffith$elm_animator$Internal$Timeline$toOccurring,
						_Utils_Tuple2(startNewEventsAt, _List_Nil),
						queued).b));
		} else {
			var _v4 = reversedEvents.a;
			var lastEvent = _v4.a;
			var lastEventTime = _v4.b;
			var eventTail = reversedEvents.b;
			var startNewEventsAt = A2($mdgriffith$elm_animator$Internal$Time$latest, lastEventTime, start);
			var newEvents = $elm$core$List$reverse(
				A3(
					$elm$core$List$foldl,
					$mdgriffith$elm_animator$Internal$Timeline$toOccurring,
					_Utils_Tuple2(startNewEventsAt, _List_Nil),
					queued).b);
			if (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, start, lastEventTime)) {
				var newLastEvent = A3(
					$mdgriffith$elm_animator$Internal$Timeline$Occurring,
					lastEvent,
					lastEventTime,
					A2($mdgriffith$elm_animator$Internal$Time$thisAfterThat, start, lastEventTime) ? start : lastEventTime);
				return A3(
					$mdgriffith$elm_animator$Internal$Timeline$Line,
					startLineAt,
					startingEvent,
					_Utils_ap(
						$elm$core$List$reverse(
							A2($elm$core$List$cons, newLastEvent, eventTail)),
						newEvents));
			} else {
				return A3(
					$mdgriffith$elm_animator$Internal$Timeline$Line,
					startLineAt,
					startingEvent,
					_Utils_ap(events, newEvents));
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$createLine = F2(
	function (now, _v0) {
		var _v1 = _v0.b;
		var dur = _v1.a;
		var startEvent = _v1.b;
		var maybeDwell = _v1.c;
		var reverseQueued = _v0.c;
		var start = A2($mdgriffith$elm_animator$Internal$Time$advanceBy, dur, now);
		var startNextEvent = function () {
			if (maybeDwell.$ === 'Nothing') {
				return start;
			} else {
				var dwell = maybeDwell.a;
				return A2($mdgriffith$elm_animator$Internal$Time$advanceBy, dwell, start);
			}
		}();
		var events = $elm$core$List$reverse(
			A3(
				$elm$core$List$foldl,
				$mdgriffith$elm_animator$Internal$Timeline$toOccurring,
				_Utils_Tuple2(startNextEvent, _List_Nil),
				$elm$core$List$reverse(reverseQueued)).b);
		return A3(
			$mdgriffith$elm_animator$Internal$Timeline$Line,
			now,
			A3($mdgriffith$elm_animator$Internal$Timeline$Occurring, startEvent, start, startNextEvent),
			events);
	});
var $mdgriffith$elm_animator$Internal$Timeline$addToCurrentLine = F3(
	function (now, scheduled, lines) {
		var onCurrent = function (timelines) {
			if (!timelines.b) {
				return _List_fromArray(
					[
						A2($mdgriffith$elm_animator$Internal$Timeline$createLine, now, scheduled)
					]);
			} else {
				if (!timelines.b.b) {
					var _v1 = timelines.a;
					var startOne = _v1.a;
					var startEvent = _v1.b;
					var one = _v1.c;
					return _List_fromArray(
						[
							A3(
							$mdgriffith$elm_animator$Internal$Timeline$addEventsToLine,
							now,
							scheduled,
							A3($mdgriffith$elm_animator$Internal$Timeline$Line, startOne, startEvent, one))
						]);
				} else {
					var _v2 = timelines.a;
					var startOne = _v2.a;
					var startEventOne = _v2.b;
					var one = _v2.c;
					var _v3 = timelines.b;
					var _v4 = _v3.a;
					var startTwo = _v4.a;
					var startEventTwo = _v4.b;
					var two = _v4.c;
					var remaining = _v3.b;
					return (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, now, startOne) && A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, startTwo, now)) ? A2(
						$elm$core$List$cons,
						A3(
							$mdgriffith$elm_animator$Internal$Timeline$addEventsToLine,
							now,
							scheduled,
							A3($mdgriffith$elm_animator$Internal$Timeline$Line, startOne, startEventOne, one)),
						A2(
							$elm$core$List$cons,
							A3($mdgriffith$elm_animator$Internal$Timeline$Line, startTwo, startEventTwo, two),
							remaining)) : A2(
						$elm$core$List$cons,
						A3($mdgriffith$elm_animator$Internal$Timeline$Line, startOne, startEventOne, one),
						onCurrent(
							A2(
								$elm$core$List$cons,
								A3($mdgriffith$elm_animator$Internal$Timeline$Line, startTwo, startEventTwo, two),
								remaining)));
				}
			}
		};
		return onCurrent(lines);
	});
var $mdgriffith$elm_animator$Internal$Timeline$enqueue = F3(
	function (timeline, now, scheduled) {
		var _v0 = timeline.events;
		var lines = _v0.a;
		return $mdgriffith$elm_animator$Internal$Timeline$Timetable(
			A3($mdgriffith$elm_animator$Internal$Timeline$addToCurrentLine, now, scheduled, lines));
	});
var $mdgriffith$elm_animator$Internal$Timeline$LastTwoEvents = F4(
	function (a, b, c, d) {
		return {$: 'LastTwoEvents', a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_animator$Internal$Timeline$endTime = function (_v0) {
	var end = _v0.c;
	return end;
};
var $mdgriffith$elm_animator$Internal$Time$thisBeforeThat = F2(
	function (_v0, _v1) {
		var _this = _v0.a;
		var that = _v1.a;
		return (_this - that) < 0;
	});
var $mdgriffith$elm_animator$Internal$Timeline$beforeEventEnd = F2(
	function (time, events) {
		beforeEventEnd:
		while (true) {
			if (!events.b) {
				return false;
			} else {
				var top = events.a;
				var remain = events.b;
				if (A2(
					$mdgriffith$elm_animator$Internal$Time$thisBeforeThat,
					time,
					$mdgriffith$elm_animator$Internal$Timeline$endTime(top))) {
					return true;
				} else {
					var $temp$time = time,
						$temp$events = remain;
					time = $temp$time;
					events = $temp$events;
					continue beforeEventEnd;
				}
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Time$thisBeforeOrEqualThat = F2(
	function (_v0, _v1) {
		var _this = _v0.a;
		var that = _v1.a;
		return (_this - that) <= 0;
	});
var $mdgriffith$elm_animator$Internal$Timeline$beforeLineEnd = F2(
	function (time, _v0) {
		var lineStartAt = _v0.a;
		var startingEvent = _v0.b;
		var trailing = _v0.c;
		if (A2($mdgriffith$elm_animator$Internal$Time$thisBeforeOrEqualThat, time, lineStartAt)) {
			return true;
		} else {
			if (!trailing.b) {
				return A2(
					$mdgriffith$elm_animator$Internal$Time$thisBeforeThat,
					time,
					$mdgriffith$elm_animator$Internal$Timeline$endTime(startingEvent));
			} else {
				return A2($mdgriffith$elm_animator$Internal$Timeline$beforeEventEnd, time, trailing);
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$getEvent = function (_v0) {
	var ev = _v0.a;
	return ev;
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$getTransitionAt = F3(
	function (interruptionTime, startEvent, trailing) {
		getTransitionAt:
		while (true) {
			if (!trailing.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var next = trailing.a;
				var remain = trailing.b;
				var prev = A2(
					$elm$core$Maybe$withDefault,
					startEvent,
					$elm$core$List$head(remain));
				if (A2(
					$mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat,
					interruptionTime,
					$mdgriffith$elm_animator$Internal$Timeline$endTime(prev)) && A2(
					$mdgriffith$elm_animator$Internal$Time$thisBeforeThat,
					interruptionTime,
					$mdgriffith$elm_animator$Internal$Timeline$startTime(next))) {
					return $elm$core$Maybe$Just(
						A4(
							$mdgriffith$elm_animator$Internal$Timeline$LastTwoEvents,
							$mdgriffith$elm_animator$Internal$Timeline$endTime(prev),
							$mdgriffith$elm_animator$Internal$Timeline$getEvent(prev),
							$mdgriffith$elm_animator$Internal$Timeline$startTime(next),
							$mdgriffith$elm_animator$Internal$Timeline$getEvent(next)));
				} else {
					var $temp$interruptionTime = interruptionTime,
						$temp$startEvent = startEvent,
						$temp$trailing = remain;
					interruptionTime = $temp$interruptionTime;
					startEvent = $temp$startEvent;
					trailing = $temp$trailing;
					continue getTransitionAt;
				}
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$Schedule = F3(
	function (a, b, c) {
		return {$: 'Schedule', a: a, b: b, c: c};
	});
var $mdgriffith$elm_animator$Internal$Timeline$Event = F3(
	function (a, b, c) {
		return {$: 'Event', a: a, b: b, c: c};
	});
var $mdgriffith$elm_animator$Internal$Timeline$adjustScheduledDuration = F2(
	function (fn, _v0) {
		var dur = _v0.a;
		var ev = _v0.b;
		var maybeDwell = _v0.c;
		return A3(
			$mdgriffith$elm_animator$Internal$Timeline$Event,
			fn(dur),
			ev,
			maybeDwell);
	});
var $mdgriffith$elm_animator$Internal$Timeline$getScheduledEvent = function (_v0) {
	var ev = _v0.b;
	return ev;
};
var $ianmackenzie$elm_units$Quantity$multiplyBy = F2(
	function (scale, _v0) {
		var value = _v0.a;
		return $ianmackenzie$elm_units$Quantity$Quantity(scale * value);
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $mdgriffith$elm_animator$Internal$Time$progress = F3(
	function (_v0, _v1, _v2) {
		var start = _v0.a;
		var end = _v1.a;
		var current = _v2.a;
		var total = $elm$core$Basics$abs(end - start);
		return (!total) ? 0 : A2(
			$elm$core$Basics$min,
			1,
			A2($elm$core$Basics$max, 0, (current - start) / total));
	});
var $mdgriffith$elm_animator$Internal$Timeline$interruptAtExactly = F3(
	function (startInterruption, scheduled, _v0) {
		var penultimateTime = _v0.a;
		var penultimate = _v0.b;
		var lastEventTime = _v0.c;
		var lastEvent = _v0.d;
		var delay_ = scheduled.a;
		var startingEvent = scheduled.b;
		var reverseQueued = scheduled.c;
		var amountProgress = A3($mdgriffith$elm_animator$Internal$Time$progress, penultimateTime, lastEventTime, startInterruption);
		var newStartingEvent = _Utils_eq(
			penultimate,
			$mdgriffith$elm_animator$Internal$Timeline$getScheduledEvent(startingEvent)) ? A2(
			$mdgriffith$elm_animator$Internal$Timeline$adjustScheduledDuration,
			$ianmackenzie$elm_units$Quantity$multiplyBy(amountProgress),
			startingEvent) : startingEvent;
		return A2(
			$mdgriffith$elm_animator$Internal$Timeline$createLine,
			startInterruption,
			A3($mdgriffith$elm_animator$Internal$Timeline$Schedule, delay_, newStartingEvent, reverseQueued));
	});
var $mdgriffith$elm_animator$Internal$Timeline$interruptLine = F4(
	function (startInterruption, scheduled, line, future) {
		var start = line.a;
		var startEvent = line.b;
		var trailing = line.c;
		if (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, startInterruption, start)) {
			if (!future.b) {
				var _v2 = A3($mdgriffith$elm_animator$Internal$Timeline$getTransitionAt, startInterruption, startEvent, trailing);
				if (_v2.$ === 'Nothing') {
					return A2($mdgriffith$elm_animator$Internal$Timeline$beforeLineEnd, startInterruption, line) ? $elm$core$Maybe$Just(
						_List_fromArray(
							[
								A2($mdgriffith$elm_animator$Internal$Timeline$createLine, startInterruption, scheduled)
							])) : $elm$core$Maybe$Nothing;
				} else {
					var last2Events = _v2.a;
					return $elm$core$Maybe$Just(
						_List_fromArray(
							[
								A3($mdgriffith$elm_animator$Internal$Timeline$interruptAtExactly, startInterruption, scheduled, last2Events)
							]));
				}
			} else {
				var _v3 = future.a;
				var nextStart = _v3.a;
				var next = _v3.b;
				var nextEvents = _v3.c;
				var futureRemaining = future.b;
				return (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, startInterruption, nextStart) && A2(
					$mdgriffith$elm_animator$Internal$Time$thisBeforeOrEqualThat,
					startInterruption,
					$mdgriffith$elm_animator$Internal$Timeline$startTime(next))) ? $elm$core$Maybe$Just(
					A2(
						$elm$core$List$cons,
						A3($mdgriffith$elm_animator$Internal$Timeline$Line, nextStart, next, nextEvents),
						A2(
							$elm$core$List$cons,
							A3(
								$mdgriffith$elm_animator$Internal$Timeline$interruptAtExactly,
								startInterruption,
								scheduled,
								A4(
									$mdgriffith$elm_animator$Internal$Timeline$LastTwoEvents,
									$mdgriffith$elm_animator$Internal$Timeline$endTime(startEvent),
									$mdgriffith$elm_animator$Internal$Timeline$getEvent(startEvent),
									$mdgriffith$elm_animator$Internal$Timeline$startTime(next),
									$mdgriffith$elm_animator$Internal$Timeline$getEvent(next))),
							futureRemaining))) : $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$lineStartTime = function (_v0) {
	var start = _v0.a;
	return start;
};
var $mdgriffith$elm_animator$Internal$Timeline$interruptionHappensLater = F2(
	function (startInterruption, remaining) {
		if (!remaining.b) {
			return false;
		} else {
			var top = remaining.a;
			return A2(
				$mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat,
				startInterruption,
				$mdgriffith$elm_animator$Internal$Timeline$lineStartTime(top));
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$interruptLines = F5(
	function (now, startInterruption, scheduled, pastLines, lines) {
		interruptLines:
		while (true) {
			if (!lines.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var startLine = lines.a;
				var remaining = lines.b;
				if (A2($mdgriffith$elm_animator$Internal$Timeline$interruptionHappensLater, startInterruption, remaining)) {
					var $temp$now = now,
						$temp$startInterruption = startInterruption,
						$temp$scheduled = scheduled,
						$temp$pastLines = A2($elm$core$List$cons, startLine, pastLines),
						$temp$lines = remaining;
					now = $temp$now;
					startInterruption = $temp$startInterruption;
					scheduled = $temp$scheduled;
					pastLines = $temp$pastLines;
					lines = $temp$lines;
					continue interruptLines;
				} else {
					var _v1 = A4($mdgriffith$elm_animator$Internal$Timeline$interruptLine, startInterruption, scheduled, startLine, remaining);
					if (_v1.$ === 'Nothing') {
						var $temp$now = now,
							$temp$startInterruption = startInterruption,
							$temp$scheduled = scheduled,
							$temp$pastLines = A2($elm$core$List$cons, startLine, pastLines),
							$temp$lines = remaining;
						now = $temp$now;
						startInterruption = $temp$startInterruption;
						scheduled = $temp$scheduled;
						pastLines = $temp$pastLines;
						lines = $temp$lines;
						continue interruptLines;
					} else {
						var interruption = _v1.a;
						return (_Utils_eq(
							startInterruption,
							$mdgriffith$elm_animator$Internal$Timeline$lineStartTime(startLine)) && A2($mdgriffith$elm_animator$Internal$Time$thisAfterThat, startInterruption, now)) ? $elm$core$Maybe$Just(
							_Utils_ap(
								$elm$core$List$reverse(pastLines),
								interruption)) : $elm$core$Maybe$Just(
							_Utils_ap(
								$elm$core$List$reverse(pastLines),
								A2($elm$core$List$cons, startLine, interruption)));
					}
				}
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$interrupt = F3(
	function (details, startAt, scheduled) {
		var _v0 = details.events;
		var lines = _v0.a;
		var _v1 = A5($mdgriffith$elm_animator$Internal$Timeline$interruptLines, details.now, startAt, scheduled, _List_Nil, lines);
		if (_v1.$ === 'Nothing') {
			return A3($mdgriffith$elm_animator$Internal$Timeline$enqueue, details, startAt, scheduled);
		} else {
			var interrupted = _v1.a;
			return $mdgriffith$elm_animator$Internal$Timeline$Timetable(interrupted);
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$applyInterruptionHelper = F2(
	function (interrupts, timeline) {
		applyInterruptionHelper:
		while (true) {
			if (!interrupts.b) {
				return timeline;
			} else {
				var inter = interrupts.a;
				var remaining = interrupts.b;
				var delay = function () {
					var d = inter.a;
					return d;
				}();
				var newEvents = A3(
					$mdgriffith$elm_animator$Internal$Timeline$interrupt,
					timeline,
					A2($mdgriffith$elm_animator$Internal$Time$advanceBy, delay, timeline.now),
					inter);
				var $temp$interrupts = remaining,
					$temp$timeline = _Utils_update(
					timeline,
					{events: newEvents});
				interrupts = $temp$interrupts;
				timeline = $temp$timeline;
				continue applyInterruptionHelper;
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$applyInterruptions = function (timeline) {
	var _v0 = timeline.interruption;
	if (!_v0.b) {
		return timeline;
	} else {
		return A2(
			$mdgriffith$elm_animator$Internal$Timeline$applyInterruptionHelper,
			timeline.interruption,
			_Utils_update(
				timeline,
				{interruption: _List_Nil}));
	}
};
var $mdgriffith$elm_animator$Internal$Timeline$applyQueued = function (timeline) {
	var _v0 = timeline.queued;
	if (_v0.$ === 'Nothing') {
		return timeline;
	} else {
		var queued = _v0.a;
		return _Utils_update(
			timeline,
			{
				events: A3($mdgriffith$elm_animator$Internal$Timeline$enqueue, timeline, timeline.now, queued),
				queued: $elm$core$Maybe$Nothing
			});
	}
};
var $mdgriffith$elm_animator$Internal$Timeline$dwellingAt = F2(
	function (now, event) {
		var eventStartTime = $mdgriffith$elm_animator$Internal$Timeline$startTime(event);
		var eventEndTime = $mdgriffith$elm_animator$Internal$Timeline$endTime(event);
		return A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, now, eventStartTime) && A2($mdgriffith$elm_animator$Internal$Time$thisBeforeOrEqualThat, now, eventEndTime);
	});
var $mdgriffith$elm_animator$Internal$Timeline$Captured = function (a) {
	return {$: 'Captured', a: a};
};
var $mdgriffith$elm_animator$Internal$Timeline$NothingCaptured = {$: 'NothingCaptured'};
var $mdgriffith$elm_animator$Internal$Timeline$hewLine = F2(
	function (now, events) {
		hewLine:
		while (true) {
			if (!events.b) {
				return $mdgriffith$elm_animator$Internal$Timeline$NothingCaptured;
			} else {
				var top = events.a;
				var remaining = events.b;
				if (A2($mdgriffith$elm_animator$Internal$Timeline$dwellingAt, now, top)) {
					return $mdgriffith$elm_animator$Internal$Timeline$Captured(
						A3(
							$mdgriffith$elm_animator$Internal$Timeline$Line,
							$mdgriffith$elm_animator$Internal$Timeline$startTime(top),
							top,
							remaining));
				} else {
					if (A2(
						$mdgriffith$elm_animator$Internal$Time$thisAfterThat,
						now,
						$mdgriffith$elm_animator$Internal$Timeline$endTime(top))) {
						var $temp$now = now,
							$temp$events = remaining;
						now = $temp$now;
						events = $temp$events;
						continue hewLine;
					} else {
						return $mdgriffith$elm_animator$Internal$Timeline$NothingCaptured;
					}
				}
			}
		}
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$garbageCollectOldEvents = F3(
	function (now, droppable, lines) {
		garbageCollectOldEvents:
		while (true) {
			if (!lines.b) {
				return $elm$core$List$reverse(droppable);
			} else {
				var _v1 = lines.a;
				var startAt = _v1.a;
				var startingEvent = _v1.b;
				var events = _v1.c;
				var remaining = lines.b;
				if (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, startAt, now)) {
					return _Utils_ap(
						$elm$core$List$reverse(droppable),
						lines);
				} else {
					if (A2($mdgriffith$elm_animator$Internal$Timeline$dwellingAt, now, startingEvent)) {
						return lines;
					} else {
						var maybeInterruptionTime = A2(
							$elm$core$Maybe$map,
							$mdgriffith$elm_animator$Internal$Timeline$lineStartTime,
							$elm$core$List$head(remaining));
						var interrupted = function () {
							if (maybeInterruptionTime.$ === 'Nothing') {
								return false;
							} else {
								var interruptionTime = maybeInterruptionTime.a;
								return A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, now, interruptionTime);
							}
						}();
						if (interrupted) {
							var $temp$now = now,
								$temp$droppable = A2(
								$elm$core$List$cons,
								A3($mdgriffith$elm_animator$Internal$Timeline$Line, startAt, startingEvent, events),
								droppable),
								$temp$lines = remaining;
							now = $temp$now;
							droppable = $temp$droppable;
							lines = $temp$lines;
							continue garbageCollectOldEvents;
						} else {
							var _v2 = A2($mdgriffith$elm_animator$Internal$Timeline$hewLine, now, events);
							if (_v2.$ === 'NothingCaptured') {
								return _Utils_ap(
									$elm$core$List$reverse(droppable),
									lines);
							} else {
								var capturedLine = _v2.a;
								return A2($elm$core$List$cons, capturedLine, remaining);
							}
						}
					}
				}
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$linesAreActive = F2(
	function (now, lines) {
		linesAreActive:
		while (true) {
			if (!lines.b) {
				return false;
			} else {
				var _v1 = lines.a;
				var startAt = _v1.a;
				var startingEvent = _v1.b;
				var events = _v1.c;
				var remaining = lines.b;
				if (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, startAt, now)) {
					return true;
				} else {
					var maybeInterruption = function () {
						var _v5 = $elm$core$List$head(remaining);
						if (_v5.$ === 'Nothing') {
							return $elm$core$Maybe$Nothing;
						} else {
							var _v6 = _v5.a;
							var interruptionTime = _v6.a;
							return $elm$core$Maybe$Just(interruptionTime);
						}
					}();
					var last = A2(
						$elm$core$Maybe$withDefault,
						startingEvent,
						$elm$core$List$head(
							$elm$core$List$reverse(events)));
					if (maybeInterruption.$ === 'Just') {
						var interruptTime = maybeInterruption.a;
						if (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, interruptTime, now)) {
							return true;
						} else {
							var time = last.b;
							if (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, time, now)) {
								return true;
							} else {
								var $temp$now = now,
									$temp$lines = remaining;
								now = $temp$now;
								lines = $temp$lines;
								continue linesAreActive;
							}
						}
					} else {
						var time = last.b;
						if (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, time, now)) {
							return true;
						} else {
							var $temp$now = now,
								$temp$lines = remaining;
							now = $temp$now;
							lines = $temp$lines;
							continue linesAreActive;
						}
					}
				}
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$clean = F2(
	function (runGC, details) {
		var running = function () {
			var _v1 = details.events;
			var lines = _v1.a;
			return A2($mdgriffith$elm_animator$Internal$Timeline$linesAreActive, details.now, lines);
		}();
		var events = function () {
			var _v0 = details.events;
			var evs = _v0.a;
			return evs;
		}();
		return _Utils_update(
			details,
			{
				events: runGC ? $mdgriffith$elm_animator$Internal$Timeline$Timetable(
					A3($mdgriffith$elm_animator$Internal$Timeline$garbageCollectOldEvents, details.now, _List_Nil, events)) : details.events,
				running: running
			});
	});
var $ianmackenzie$elm_units$Quantity$max = F2(
	function (_v0, _v1) {
		var x = _v0.a;
		var y = _v1.a;
		return $ianmackenzie$elm_units$Quantity$Quantity(
			A2($elm$core$Basics$max, x, y));
	});
var $mdgriffith$elm_animator$Internal$Timeline$update = F2(
	function (possiblyNow, _v0) {
		var timeline = _v0.a;
		var now = A2(
			$ianmackenzie$elm_units$Quantity$max,
			$mdgriffith$elm_animator$Internal$Time$absolute(possiblyNow),
			timeline.now);
		return _Utils_eq(
			timeline.events,
			$mdgriffith$elm_animator$Internal$Timeline$Timetable(_List_Nil)) ? $mdgriffith$elm_animator$Internal$Timeline$Timeline(
			A2(
				$mdgriffith$elm_animator$Internal$Timeline$clean,
				true,
				$mdgriffith$elm_animator$Internal$Timeline$applyInterruptions(
					$mdgriffith$elm_animator$Internal$Timeline$applyQueued(
						_Utils_update(
							timeline,
							{
								events: function () {
									var firstOccurring = A3($mdgriffith$elm_animator$Internal$Timeline$Occurring, timeline.initial, now, now);
									return $mdgriffith$elm_animator$Internal$Timeline$Timetable(
										_List_fromArray(
											[
												A3($mdgriffith$elm_animator$Internal$Timeline$Line, now, firstOccurring, _List_Nil)
											]));
								}(),
								now: now
							}))))) : $mdgriffith$elm_animator$Internal$Timeline$Timeline(
			A2(
				$mdgriffith$elm_animator$Internal$Timeline$clean,
				true,
				$mdgriffith$elm_animator$Internal$Timeline$applyInterruptions(
					$mdgriffith$elm_animator$Internal$Timeline$applyQueued(
						_Utils_update(
							timeline,
							{now: now})))));
	});
var $mdgriffith$elm_animator$Animator$watching = F3(
	function (get, set, _v0) {
		var isRunning = _v0.a;
		var updateModel = _v0.b;
		return A2(
			$mdgriffith$elm_animator$Internal$Timeline$Animator,
			$elm$core$Basics$always(true),
			F2(
				function (now, model) {
					var newModel = A2(updateModel, now, model);
					return A2(
						set,
						A2(
							$mdgriffith$elm_animator$Internal$Timeline$update,
							now,
							get(newModel)),
						newModel);
				}));
	});
var $author$project$Main$animator = A3(
	$mdgriffith$elm_animator$Animator$watching,
	function ($) {
		return $.viewBox;
	},
	F2(
		function (_new, model) {
			return _Utils_update(
				model,
				{viewBox: _new});
		}),
	$mdgriffith$elm_animator$Animator$animator);
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$browser$Browser$Events$Window = {$: 'Window'};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		$elm$browser$Browser$Events$Window,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.request;
		var oldTime = _v0.oldTime;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 'Nothing') {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.subs;
		var oldTime = _v0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Time(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrame = $elm$browser$Browser$AnimationManager$onAnimationFrame;
var $mdgriffith$elm_animator$Animator$toSubscription = F3(
	function (toMsg, model, _v0) {
		var isRunning = _v0.a;
		return isRunning(model) ? $elm$browser$Browser$Events$onAnimationFrame(toMsg) : $elm$core$Platform$Sub$none;
	});
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onResize($author$project$Main$WindowResize),
				A3($mdgriffith$elm_animator$Animator$toSubscription, $author$project$Main$Tick, model, $author$project$Main$animator)
			]));
};
var $mdgriffith$elm_animator$Animator$TransitionTo = F2(
	function (a, b) {
		return {$: 'TransitionTo', a: a, b: b};
	});
var $mdgriffith$elm_animator$Animator$event = $mdgriffith$elm_animator$Animator$TransitionTo;
var $mdgriffith$elm_animator$Animator$initializeSchedule = F2(
	function (waiting, steps) {
		initializeSchedule:
		while (true) {
			if (!steps.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				if (steps.a.$ === 'Wait') {
					var additionalWait = steps.a.a;
					var moreSteps = steps.b;
					var $temp$waiting = A2($ianmackenzie$elm_units$Quantity$plus, waiting, additionalWait),
						$temp$steps = moreSteps;
					waiting = $temp$waiting;
					steps = $temp$steps;
					continue initializeSchedule;
				} else {
					var _v1 = steps.a;
					var dur = _v1.a;
					var checkpoint = _v1.b;
					var moreSteps = steps.b;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							A3(
								$mdgriffith$elm_animator$Internal$Timeline$Schedule,
								waiting,
								A3($mdgriffith$elm_animator$Internal$Timeline$Event, dur, checkpoint, $elm$core$Maybe$Nothing),
								_List_Nil),
							moreSteps));
				}
			}
		}
	});
var $ianmackenzie$elm_units$Duration$seconds = function (numSeconds) {
	return $ianmackenzie$elm_units$Quantity$Quantity(numSeconds);
};
var $ianmackenzie$elm_units$Duration$milliseconds = function (numMilliseconds) {
	return $ianmackenzie$elm_units$Duration$seconds(0.001 * numMilliseconds);
};
var $mdgriffith$elm_animator$Animator$millis = $ianmackenzie$elm_units$Duration$milliseconds;
var $mdgriffith$elm_animator$Internal$Timeline$addToDwell = F2(
	function (duration, maybeDwell) {
		if (!$ianmackenzie$elm_units$Duration$inMilliseconds(duration)) {
			return maybeDwell;
		} else {
			if (maybeDwell.$ === 'Nothing') {
				return $elm$core$Maybe$Just(duration);
			} else {
				var existing = maybeDwell.a;
				return $elm$core$Maybe$Just(
					A2($ianmackenzie$elm_units$Quantity$plus, duration, existing));
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$extendEventDwell = F2(
	function (extendBy, thisEvent) {
		var at = thisEvent.a;
		var ev = thisEvent.b;
		var maybeDwell = thisEvent.c;
		return (!$ianmackenzie$elm_units$Duration$inMilliseconds(extendBy)) ? thisEvent : A3(
			$mdgriffith$elm_animator$Internal$Timeline$Event,
			at,
			ev,
			A2($mdgriffith$elm_animator$Internal$Timeline$addToDwell, extendBy, maybeDwell));
	});
var $mdgriffith$elm_animator$Animator$stepsToEvents = F2(
	function (currentStep, _v0) {
		var delay = _v0.a;
		var startEvent = _v0.b;
		var events = _v0.c;
		if (!events.b) {
			if (currentStep.$ === 'Wait') {
				var waiting = currentStep.a;
				return A3(
					$mdgriffith$elm_animator$Internal$Timeline$Schedule,
					delay,
					A2($mdgriffith$elm_animator$Internal$Timeline$extendEventDwell, waiting, startEvent),
					events);
			} else {
				var dur = currentStep.a;
				var checkpoint = currentStep.b;
				return A3(
					$mdgriffith$elm_animator$Internal$Timeline$Schedule,
					delay,
					startEvent,
					_List_fromArray(
						[
							A3($mdgriffith$elm_animator$Internal$Timeline$Event, dur, checkpoint, $elm$core$Maybe$Nothing)
						]));
			}
		} else {
			var _v3 = events.a;
			var durationTo = _v3.a;
			var recentEvent = _v3.b;
			var maybeDwell = _v3.c;
			var remaining = events.b;
			if (currentStep.$ === 'Wait') {
				var dur = currentStep.a;
				return A3(
					$mdgriffith$elm_animator$Internal$Timeline$Schedule,
					delay,
					startEvent,
					A2(
						$elm$core$List$cons,
						A3(
							$mdgriffith$elm_animator$Internal$Timeline$Event,
							durationTo,
							recentEvent,
							A2($mdgriffith$elm_animator$Internal$Timeline$addToDwell, dur, maybeDwell)),
						remaining));
			} else {
				var dur = currentStep.a;
				var checkpoint = currentStep.b;
				return _Utils_eq(checkpoint, recentEvent) ? A3(
					$mdgriffith$elm_animator$Internal$Timeline$Schedule,
					delay,
					startEvent,
					A2(
						$elm$core$List$cons,
						A3(
							$mdgriffith$elm_animator$Internal$Timeline$Event,
							durationTo,
							recentEvent,
							A2($mdgriffith$elm_animator$Internal$Timeline$addToDwell, dur, maybeDwell)),
						remaining)) : A3(
					$mdgriffith$elm_animator$Internal$Timeline$Schedule,
					delay,
					startEvent,
					A2(
						$elm$core$List$cons,
						A3($mdgriffith$elm_animator$Internal$Timeline$Event, dur, checkpoint, $elm$core$Maybe$Nothing),
						events));
			}
		}
	});
var $mdgriffith$elm_animator$Animator$interrupt = F2(
	function (steps, _v0) {
		var tl = _v0.a;
		return $mdgriffith$elm_animator$Internal$Timeline$Timeline(
			_Utils_update(
				tl,
				{
					interruption: function () {
						var _v1 = A2(
							$mdgriffith$elm_animator$Animator$initializeSchedule,
							$mdgriffith$elm_animator$Animator$millis(0),
							steps);
						if (_v1.$ === 'Nothing') {
							return tl.interruption;
						} else {
							var _v2 = _v1.a;
							var schedule = _v2.a;
							var otherSteps = _v2.b;
							return A2(
								$elm$core$List$cons,
								A3($elm$core$List$foldl, $mdgriffith$elm_animator$Animator$stepsToEvents, schedule, otherSteps),
								tl.interruption);
						}
					}(),
					running: true
				}));
	});
var $mdgriffith$elm_animator$Animator$go = F3(
	function (duration, ev, timeline) {
		return A2(
			$mdgriffith$elm_animator$Animator$interrupt,
			_List_fromArray(
				[
					A2($mdgriffith$elm_animator$Animator$event, duration, ev)
				]),
			timeline);
	});
var $elm$core$Debug$log = _Debug_log;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Graphics$scale = F3(
	function (_v0, elementBb, camera) {
		var x = _v0.a;
		var y = _v0.b;
		var _v1 = _Utils_Tuple2(elementBb.w / $author$project$Graphics$screen.w, elementBb.h / $author$project$Graphics$screen.h);
		var cw = _v1.a;
		var ch = _v1.b;
		var c = A2($elm$core$Basics$min, cw, ch);
		var margin = F2(
			function (virtualSize, actualSize) {
				return ((actualSize / c) - virtualSize) / 2;
			});
		var _v2 = _Utils_eq(c, cw) ? _Utils_Tuple2(
			(camera.x + elementBb.x) + (x / c),
			((camera.y + elementBb.y) + (y / c)) - A2(margin, $author$project$Graphics$screen.h, elementBb.h)) : _Utils_Tuple2(
			((camera.x + elementBb.x) + (x / c)) - A2(margin, $author$project$Graphics$screen.w, elementBb.w),
			(camera.y + elementBb.y) + (y / c));
		var newX = _v2.a;
		var newY = _v2.b;
		return A2($author$project$Graphics$Point, newX, newY);
	});
var $mdgriffith$elm_animator$Animator$slowly = $mdgriffith$elm_animator$Animator$millis(400);
var $mdgriffith$elm_animator$Animator$update = F3(
	function (newTime, _v0, model) {
		var updateModel = _v0.b;
		return A2(updateModel, newTime, model);
	});
var $author$project$Options$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'SetBackgroundAnimation':
				var state = msg.a;
				return _Utils_update(
					model,
					{backgroundAnimation: state});
			case 'SetTitleAnimation':
				var state = msg.a;
				return _Utils_update(
					model,
					{titleAnimation: state});
			case 'SetLabelState':
				var state = msg.a;
				return _Utils_update(
					model,
					{labelState: state});
			default:
				var state = msg.a;
				return _Utils_update(
					model,
					{palette: state});
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'WindowResize':
				return _Utils_Tuple2(model, $author$project$Main$getSvgDimensions);
			case 'GotSvgElement':
				var result = msg.a;
				if (result.$ === 'Err') {
					var str = result.a.a;
					var _v2 = A2($elm$core$Debug$log, 'Error getting screen element', str);
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var element = result.a.element;
					var box = A2(
						$elm$core$Debug$log,
						'resizing to',
						A4($author$project$Graphics$BoundingBox, element.x, element.y, element.width, element.height));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{svgDimensions: box}),
						$elm$core$Platform$Cmd$none);
				}
			case 'MouseMove':
				var pagePos = msg.a;
				var point = A3(
					$author$project$Graphics$scale,
					pagePos,
					model.svgDimensions,
					$author$project$Main$getSceneCamera(model.scene));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{mousePos: point}),
					$elm$core$Platform$Cmd$none);
			case 'Tick':
				var newTime = msg.a;
				return _Utils_Tuple2(
					A3($mdgriffith$elm_animator$Animator$update, newTime, $author$project$Main$animator, model),
					$elm$core$Platform$Cmd$none);
			case 'ChangeScene':
				var newScene = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							scene: newScene,
							viewBox: A3(
								$mdgriffith$elm_animator$Animator$go,
								$mdgriffith$elm_animator$Animator$slowly,
								$author$project$Main$getSceneCamera(newScene),
								model.viewBox)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var optionMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							options: A2($author$project$Options$update, optionMsg, model.options)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$MouseMove = function (a) {
	return {$: 'MouseMove', a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $mdgriffith$elm_animator$Internal$Interpolate$FullDefault = {$: 'FullDefault'};
var $mdgriffith$elm_animator$Internal$Interpolate$Position = F2(
	function (a, b) {
		return {$: 'Position', a: a, b: b};
	});
var $mdgriffith$elm_animator$Animator$at = $mdgriffith$elm_animator$Internal$Interpolate$Position($mdgriffith$elm_animator$Internal$Interpolate$FullDefault);
var $elm$core$String$fromFloat = _String_fromNumber;
var $ianmackenzie$elm_units$Quantity$greaterThan = F2(
	function (_v0, _v1) {
		var y = _v0.a;
		var x = _v1.a;
		return _Utils_cmp(x, y) > 0;
	});
var $mdgriffith$elm_animator$Internal$Time$inMilliseconds = function (_v0) {
	var ms = _v0.a;
	return ms;
};
var $mdgriffith$elm_animator$Internal$Time$duration = F2(
	function (one, two) {
		return A2($ianmackenzie$elm_units$Quantity$greaterThan, two, one) ? $ianmackenzie$elm_units$Duration$milliseconds(
			A2(
				$elm$core$Basics$max,
				0,
				$mdgriffith$elm_animator$Internal$Time$inMilliseconds(one) - $mdgriffith$elm_animator$Internal$Time$inMilliseconds(two))) : $ianmackenzie$elm_units$Duration$milliseconds(
			A2(
				$elm$core$Basics$max,
				0,
				$mdgriffith$elm_animator$Internal$Time$inMilliseconds(two) - $mdgriffith$elm_animator$Internal$Time$inMilliseconds(one)));
	});
var $mdgriffith$elm_animator$Internal$Timeline$endTimeAdj = F4(
	function (lookup, getAdjustment, _v0, _v1) {
		var cur = _v0.a;
		var curEnd = _v0.c;
		var next = _v1.a;
		var nextStartTime = _v1.b;
		var totalDuration = A2($mdgriffith$elm_animator$Internal$Time$duration, curEnd, nextStartTime);
		var nextAdjustment = getAdjustment(
			lookup(next));
		var adjustment = getAdjustment(
			lookup(cur));
		var totalPortions = A2($elm$core$Basics$max, adjustment.leavingLate + nextAdjustment.arrivingEarly, 1);
		var lateBy = A2($ianmackenzie$elm_units$Quantity$multiplyBy, adjustment.leavingLate / totalPortions, totalDuration);
		return A2($mdgriffith$elm_animator$Internal$Time$advanceBy, lateBy, curEnd);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $mdgriffith$elm_animator$Internal$Timeline$hasDwell = function (_v0) {
	var start = _v0.b.a;
	var end = _v0.c.a;
	return !(!(start - end));
};
var $elm$core$Basics$not = _Basics_not;
var $ianmackenzie$elm_units$Quantity$minus = F2(
	function (_v0, _v1) {
		var y = _v0.a;
		var x = _v1.a;
		return $ianmackenzie$elm_units$Quantity$Quantity(x - y);
	});
var $mdgriffith$elm_animator$Internal$Time$rollbackBy = F2(
	function (dur, time) {
		return A2(
			$ianmackenzie$elm_units$Quantity$minus,
			$ianmackenzie$elm_units$Quantity$Quantity(
				$ianmackenzie$elm_units$Duration$inMilliseconds(dur)),
			time);
	});
var $mdgriffith$elm_animator$Internal$Timeline$startTimeAdj = F4(
	function (lookup, getAdjustment, _v0, _v1) {
		var prev = _v0.a;
		var prevEnd = _v0.c;
		var cur = _v1.a;
		var curStartTime = _v1.b;
		var totalDuration = A2($mdgriffith$elm_animator$Internal$Time$duration, prevEnd, curStartTime);
		var prevAdjustment = getAdjustment(
			lookup(prev));
		var adjustment = getAdjustment(
			lookup(cur));
		var totalPortions = A2($elm$core$Basics$max, prevAdjustment.leavingLate + adjustment.arrivingEarly, 1);
		var earlyBy = A2($ianmackenzie$elm_units$Quantity$multiplyBy, adjustment.arrivingEarly / totalPortions, totalDuration);
		return A2($mdgriffith$elm_animator$Internal$Time$rollbackBy, earlyBy, curStartTime);
	});
var $mdgriffith$elm_animator$Internal$Timeline$overLines = F7(
	function (fn, lookup, details, maybePreviousEvent, _v0, futureLines, state) {
		overLines:
		while (true) {
			var lineStart = _v0.a;
			var lineStartEv = _v0.b;
			var lineRemain = _v0.c;
			var transition = function (newState) {
				if (!futureLines.b) {
					return newState;
				} else {
					var future = futureLines.a;
					var futureStart = future.a;
					var futureStartEv = future.b;
					var futureRemain = future.c;
					var restOfFuture = futureLines.b;
					return A2($mdgriffith$elm_animator$Internal$Time$thisBeforeOrEqualThat, futureStart, details.now) ? A7($mdgriffith$elm_animator$Internal$Timeline$overLines, fn, lookup, details, $elm$core$Maybe$Nothing, future, restOfFuture, newState) : newState;
				}
			};
			var now = function () {
				if (!futureLines.b) {
					return details.now;
				} else {
					var _v11 = futureLines.a;
					var futureStart = _v11.a;
					var futureStartEv = _v11.b;
					var futureRemain = _v11.c;
					var restOfFuture = futureLines.b;
					return A2($mdgriffith$elm_animator$Internal$Time$thisBeforeThat, futureStart, details.now) ? futureStart : details.now;
				}
			}();
			var eventStartTime = function () {
				if (maybePreviousEvent.$ === 'Nothing') {
					return $mdgriffith$elm_animator$Internal$Timeline$startTime(lineStartEv);
				} else {
					var prev = maybePreviousEvent.a;
					return A4($mdgriffith$elm_animator$Internal$Timeline$startTimeAdj, lookup, fn.adjustor, prev, lineStartEv);
				}
			}();
			if (A2($mdgriffith$elm_animator$Internal$Time$thisBeforeThat, now, eventStartTime)) {
				return transition(
					A7(
						fn.lerp,
						$mdgriffith$elm_animator$Internal$Time$inMilliseconds(lineStart),
						$elm$core$Maybe$Just(
							lookup(details.initial)),
						lookup(
							$mdgriffith$elm_animator$Internal$Timeline$getEvent(lineStartEv)),
						$mdgriffith$elm_animator$Internal$Time$inMilliseconds(eventStartTime),
						$mdgriffith$elm_animator$Internal$Time$inMilliseconds(now),
						function () {
							if (!lineRemain.b) {
								return $elm$core$Maybe$Nothing;
							} else {
								var upcoming = lineRemain.a;
								return $elm$core$Maybe$Just(
									{
										anchor: lookup(
											$mdgriffith$elm_animator$Internal$Timeline$getEvent(upcoming)),
										resting: !$mdgriffith$elm_animator$Internal$Timeline$hasDwell(upcoming),
										time: $mdgriffith$elm_animator$Internal$Time$inMilliseconds(
											A4($mdgriffith$elm_animator$Internal$Timeline$startTimeAdj, lookup, fn.adjustor, lineStartEv, upcoming))
									});
							}
						}(),
						state));
			} else {
				var eventEndTime = function () {
					if (!lineRemain.b) {
						return $mdgriffith$elm_animator$Internal$Timeline$endTime(lineStartEv);
					} else {
						var upcoming = lineRemain.a;
						return A4($mdgriffith$elm_animator$Internal$Timeline$endTimeAdj, lookup, fn.adjustor, lineStartEv, upcoming);
					}
				}();
				if (A2($mdgriffith$elm_animator$Internal$Time$thisAfterOrEqualThat, now, eventEndTime)) {
					if (!lineRemain.b) {
						return transition(
							A2(
								fn.dwellFor,
								lookup(
									$mdgriffith$elm_animator$Internal$Timeline$getEvent(lineStartEv)),
								A2($mdgriffith$elm_animator$Internal$Time$duration, eventStartTime, now)));
					} else {
						var next = lineRemain.a;
						var lineRemain2 = lineRemain.b;
						var nextStartTime = A4($mdgriffith$elm_animator$Internal$Timeline$startTimeAdj, lookup, fn.adjustor, lineStartEv, next);
						var nextEndTime = function () {
							if (!lineRemain2.b) {
								return $mdgriffith$elm_animator$Internal$Timeline$endTime(next);
							} else {
								var upcoming = lineRemain2.a;
								return A4($mdgriffith$elm_animator$Internal$Timeline$endTimeAdj, lookup, fn.adjustor, next, upcoming);
							}
						}();
						if (A2($mdgriffith$elm_animator$Internal$Time$thisBeforeThat, now, nextStartTime)) {
							return transition(
								A7(
									fn.lerp,
									$mdgriffith$elm_animator$Internal$Time$inMilliseconds(eventEndTime),
									$elm$core$Maybe$Just(
										lookup(
											$mdgriffith$elm_animator$Internal$Timeline$getEvent(lineStartEv))),
									lookup(
										$mdgriffith$elm_animator$Internal$Timeline$getEvent(next)),
									$mdgriffith$elm_animator$Internal$Time$inMilliseconds(nextStartTime),
									$mdgriffith$elm_animator$Internal$Time$inMilliseconds(now),
									function () {
										if (!lineRemain2.b) {
											return $elm$core$Maybe$Nothing;
										} else {
											var upcoming = lineRemain2.a;
											return $elm$core$Maybe$Just(
												{
													anchor: lookup(
														$mdgriffith$elm_animator$Internal$Timeline$getEvent(upcoming)),
													resting: !$mdgriffith$elm_animator$Internal$Timeline$hasDwell(upcoming),
													time: $mdgriffith$elm_animator$Internal$Time$inMilliseconds(
														A4($mdgriffith$elm_animator$Internal$Timeline$startTimeAdj, lookup, fn.adjustor, next, upcoming))
												});
										}
									}(),
									$mdgriffith$elm_animator$Internal$Timeline$hasDwell(lineStartEv) ? A2(
										fn.dwellFor,
										lookup(
											$mdgriffith$elm_animator$Internal$Timeline$getEvent(lineStartEv)),
										A2($mdgriffith$elm_animator$Internal$Time$duration, eventStartTime, eventEndTime)) : state));
						} else {
							if (A2($mdgriffith$elm_animator$Internal$Time$thisBeforeThat, now, nextEndTime)) {
								return transition(
									A2(
										fn.dwellFor,
										lookup(
											$mdgriffith$elm_animator$Internal$Timeline$getEvent(next)),
										A2($mdgriffith$elm_animator$Internal$Time$duration, nextStartTime, now)));
							} else {
								if (!lineRemain2.b) {
									return transition(
										A2(
											fn.dwellFor,
											lookup(
												$mdgriffith$elm_animator$Internal$Timeline$getEvent(next)),
											A2($mdgriffith$elm_animator$Internal$Time$duration, nextStartTime, now)));
								} else {
									var next2 = lineRemain2.a;
									var lineRemain3 = lineRemain2.b;
									var next2StartTime = A4($mdgriffith$elm_animator$Internal$Timeline$startTimeAdj, lookup, fn.adjustor, next, next2);
									var next2EndTime = function () {
										if (!lineRemain3.b) {
											return $mdgriffith$elm_animator$Internal$Timeline$endTime(next2);
										} else {
											var upcoming = lineRemain3.a;
											return A4($mdgriffith$elm_animator$Internal$Timeline$endTimeAdj, lookup, fn.adjustor, next2, upcoming);
										}
									}();
									if (A2($mdgriffith$elm_animator$Internal$Time$thisBeforeThat, now, next2StartTime)) {
										var after = $mdgriffith$elm_animator$Internal$Timeline$hasDwell(next) ? A2(
											fn.dwellFor,
											lookup(
												$mdgriffith$elm_animator$Internal$Timeline$getEvent(next)),
											A2($mdgriffith$elm_animator$Internal$Time$duration, nextStartTime, nextEndTime)) : A3(fn.after, lookup, next, lineRemain2);
										return transition(
											A7(
												fn.lerp,
												$mdgriffith$elm_animator$Internal$Time$inMilliseconds(nextEndTime),
												$elm$core$Maybe$Just(
													lookup(
														$mdgriffith$elm_animator$Internal$Timeline$getEvent(next))),
												lookup(
													$mdgriffith$elm_animator$Internal$Timeline$getEvent(next2)),
												$mdgriffith$elm_animator$Internal$Time$inMilliseconds(next2StartTime),
												$mdgriffith$elm_animator$Internal$Time$inMilliseconds(now),
												function () {
													if (!lineRemain3.b) {
														return $elm$core$Maybe$Nothing;
													} else {
														var upcoming = lineRemain3.a;
														return $elm$core$Maybe$Just(
															{
																anchor: lookup(
																	$mdgriffith$elm_animator$Internal$Timeline$getEvent(upcoming)),
																resting: !$mdgriffith$elm_animator$Internal$Timeline$hasDwell(upcoming),
																time: $mdgriffith$elm_animator$Internal$Time$inMilliseconds(
																	A4($mdgriffith$elm_animator$Internal$Timeline$startTimeAdj, lookup, fn.adjustor, next2, upcoming))
															});
													}
												}(),
												after));
									} else {
										if (A2($mdgriffith$elm_animator$Internal$Time$thisBeforeThat, now, next2EndTime)) {
											return transition(
												A2(
													fn.dwellFor,
													lookup(
														$mdgriffith$elm_animator$Internal$Timeline$getEvent(next2)),
													A2($mdgriffith$elm_animator$Internal$Time$duration, next2StartTime, now)));
										} else {
											var after = $mdgriffith$elm_animator$Internal$Timeline$hasDwell(next2) ? A2(
												fn.dwellFor,
												lookup(
													$mdgriffith$elm_animator$Internal$Timeline$getEvent(next2)),
												A2($mdgriffith$elm_animator$Internal$Time$duration, next2StartTime, next2EndTime)) : A3(fn.after, lookup, next2, lineRemain3);
											var $temp$fn = fn,
												$temp$lookup = lookup,
												$temp$details = details,
												$temp$maybePreviousEvent = $elm$core$Maybe$Just(next),
												$temp$_v0 = A3($mdgriffith$elm_animator$Internal$Timeline$Line, nextEndTime, next2, lineRemain3),
												$temp$futureLines = futureLines,
												$temp$state = after;
											fn = $temp$fn;
											lookup = $temp$lookup;
											details = $temp$details;
											maybePreviousEvent = $temp$maybePreviousEvent;
											_v0 = $temp$_v0;
											futureLines = $temp$futureLines;
											state = $temp$state;
											continue overLines;
										}
									}
								}
							}
						}
					}
				} else {
					return transition(
						A2(
							fn.dwellFor,
							lookup(
								$mdgriffith$elm_animator$Internal$Timeline$getEvent(lineStartEv)),
							A2($mdgriffith$elm_animator$Internal$Time$duration, eventStartTime, now)));
				}
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$foldp = F3(
	function (lookup, fn, _v0) {
		var timelineDetails = _v0.a;
		var _v1 = timelineDetails.events;
		var timetable = _v1.a;
		var start = fn.start(
			lookup(timelineDetails.initial));
		if (!timetable.b) {
			return start;
		} else {
			var firstLine = timetable.a;
			var remainingLines = timetable.b;
			return A7($mdgriffith$elm_animator$Internal$Timeline$overLines, fn, lookup, timelineDetails, $elm$core$Maybe$Nothing, firstLine, remainingLines, start);
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$adjustTiming = function (m) {
	if (m.$ === 'Osc') {
		var departure = m.a;
		var arrival = m.b;
		return {arrivingEarly: arrival.early, leavingLate: departure.late};
	} else {
		var departure = m.a;
		var arrival = m.b;
		return {arrivingEarly: arrival.early, leavingLate: departure.late};
	}
};
var $ianmackenzie$elm_units$Pixels$pixels = function (numPixels) {
	return $ianmackenzie$elm_units$Quantity$Quantity(numPixels);
};
var $ianmackenzie$elm_units$Quantity$divideBy = F2(
	function (divisor, _v0) {
		var value = _v0.a;
		return $ianmackenzie$elm_units$Quantity$Quantity(value / divisor);
	});
var $ianmackenzie$elm_units$Quantity$per = F2(
	function (_v0, _v1) {
		var independentValue = _v0.a;
		var dependentValue = _v1.a;
		return $ianmackenzie$elm_units$Quantity$Quantity(dependentValue / independentValue);
	});
var $mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing = F3(
	function (ease, period, target) {
		var targetPixels = $ianmackenzie$elm_units$Pixels$pixels(
			ease(target));
		var sampleSize = 16;
		var deltaSample = sampleSize / $ianmackenzie$elm_units$Duration$inMilliseconds(period);
		var next = $ianmackenzie$elm_units$Pixels$pixels(
			ease(target + deltaSample));
		var dx2 = A2($ianmackenzie$elm_units$Quantity$minus, targetPixels, next);
		var prev = $ianmackenzie$elm_units$Pixels$pixels(
			ease(target - deltaSample));
		var dx1 = A2($ianmackenzie$elm_units$Quantity$minus, prev, targetPixels);
		var dx = A2(
			$ianmackenzie$elm_units$Quantity$divideBy,
			2,
			A2($ianmackenzie$elm_units$Quantity$plus, dx1, dx2));
		return A2(
			$ianmackenzie$elm_units$Quantity$per,
			$ianmackenzie$elm_units$Duration$milliseconds(sampleSize),
			dx);
	});
var $ianmackenzie$elm_units$Pixels$pixelsPerSecond = function (numPixelsPerSecond) {
	return $ianmackenzie$elm_units$Quantity$Quantity(numPixelsPerSecond);
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $ianmackenzie$elm_units$Quantity$isInfinite = function (_v0) {
	var value = _v0.a;
	return $elm$core$Basics$isInfinite(value);
};
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $ianmackenzie$elm_units$Quantity$isNaN = function (_v0) {
	var value = _v0.a;
	return $elm$core$Basics$isNaN(value);
};
var $ianmackenzie$elm_units$Quantity$zero = $ianmackenzie$elm_units$Quantity$Quantity(0);
var $mdgriffith$elm_animator$Internal$Interpolate$velocityBetween = F4(
	function (one, oneTime, two, twoTime) {
		var duration = A2($mdgriffith$elm_animator$Internal$Time$duration, oneTime, twoTime);
		var distance = A2($ianmackenzie$elm_units$Quantity$minus, one, two);
		var vel = A2($ianmackenzie$elm_units$Quantity$per, duration, distance);
		return ($ianmackenzie$elm_units$Quantity$isNaN(vel) || $ianmackenzie$elm_units$Quantity$isInfinite(vel)) ? $ianmackenzie$elm_units$Quantity$zero : vel;
	});
var $mdgriffith$elm_animator$Internal$Interpolate$velocityAtTarget = F3(
	function (lookup, t, maybeLookAhead) {
		var target = t.a;
		var targetTime = t.b;
		var targetEndTime = t.c;
		if (_Utils_eq(targetEndTime, targetTime)) {
			if (maybeLookAhead.$ === 'Nothing') {
				var _v1 = lookup(target);
				if (_v1.$ === 'Pos') {
					return $ianmackenzie$elm_units$Pixels$pixelsPerSecond(0);
				} else {
					var period = _v1.c;
					var toX = _v1.d;
					if (period.$ === 'Loop') {
						var dur = period.a;
						return A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, dur, 0);
					} else {
						var n = period.a;
						var dur = period.b;
						return (!n) ? $ianmackenzie$elm_units$Pixels$pixelsPerSecond(0) : A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, dur, 0);
					}
				}
			} else {
				var _v3 = maybeLookAhead.a;
				var lookAhead = _v3.a;
				var aheadTime = _v3.b;
				var aheadEndTime = _v3.c;
				var targetPosition = function () {
					var _v6 = lookup(target);
					if (_v6.$ === 'Osc') {
						var toX = _v6.d;
						return $ianmackenzie$elm_units$Pixels$pixels(
							toX(0));
					} else {
						var x = _v6.c;
						return $ianmackenzie$elm_units$Pixels$pixels(x);
					}
				}();
				var _v4 = lookup(lookAhead);
				if (_v4.$ === 'Pos') {
					var aheadPosition = _v4.c;
					return A4(
						$mdgriffith$elm_animator$Internal$Interpolate$velocityBetween,
						targetPosition,
						targetTime,
						$ianmackenzie$elm_units$Pixels$pixels(aheadPosition),
						aheadTime);
				} else {
					var period = _v4.c;
					var toX = _v4.d;
					if (_Utils_eq(aheadEndTime, aheadTime)) {
						return A4(
							$mdgriffith$elm_animator$Internal$Interpolate$velocityBetween,
							targetPosition,
							targetTime,
							$ianmackenzie$elm_units$Pixels$pixels(
								toX(0)),
							aheadTime);
					} else {
						if (period.$ === 'Loop') {
							var periodDuration = period.a;
							return A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, 0);
						} else {
							var n = period.a;
							var periodDuration = period.b;
							return A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, 0);
						}
					}
				}
			}
		} else {
			var _v7 = lookup(target);
			if (_v7.$ === 'Pos') {
				return $ianmackenzie$elm_units$Pixels$pixelsPerSecond(0);
			} else {
				var period = _v7.c;
				var toX = _v7.d;
				if (period.$ === 'Loop') {
					var periodDuration = period.a;
					return A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, 0);
				} else {
					var n = period.a;
					var periodDuration = period.b;
					return A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, 0);
				}
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$afterMove = F3(
	function (lookup, target, future) {
		return {
			position: function () {
				var _v0 = lookup(
					$mdgriffith$elm_animator$Internal$Timeline$getEvent(target));
				if (_v0.$ === 'Osc') {
					var depart = _v0.a;
					var arrive = _v0.b;
					var period = _v0.c;
					var toX = _v0.d;
					return $ianmackenzie$elm_units$Pixels$pixels(
						toX(0));
				} else {
					var x = _v0.c;
					return $ianmackenzie$elm_units$Pixels$pixels(x);
				}
			}(),
			velocity: A3(
				$mdgriffith$elm_animator$Internal$Interpolate$velocityAtTarget,
				lookup,
				target,
				$elm$core$List$head(future))
		};
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$round = _Basics_round;
var $mdgriffith$elm_animator$Internal$Interpolate$wrapUnitAfter = F2(
	function (dur, total) {
		var totalDuration = $elm$core$Basics$round(
			$ianmackenzie$elm_units$Duration$inMilliseconds(total));
		var periodDuration = $elm$core$Basics$round(
			$ianmackenzie$elm_units$Duration$inMilliseconds(dur));
		if ((!periodDuration) || (!totalDuration)) {
			return 0;
		} else {
			var remaining = A2($elm$core$Basics$modBy, periodDuration, totalDuration);
			return (!remaining) ? 1 : (remaining / periodDuration);
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$dwellFor = F2(
	function (movement, duration) {
		if (movement.$ === 'Pos') {
			var pos = movement.c;
			return {
				position: $ianmackenzie$elm_units$Pixels$pixels(pos),
				velocity: $ianmackenzie$elm_units$Pixels$pixelsPerSecond(0)
			};
		} else {
			var period = movement.c;
			var toX = movement.d;
			if (period.$ === 'Loop') {
				var periodDuration = period.a;
				var progress = A2($mdgriffith$elm_animator$Internal$Interpolate$wrapUnitAfter, periodDuration, duration);
				return {
					position: $ianmackenzie$elm_units$Pixels$pixels(
						toX(progress)),
					velocity: A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, progress)
				};
			} else {
				var n = period.a;
				var periodDuration = period.b;
				var totalMS = $ianmackenzie$elm_units$Duration$inMilliseconds(duration);
				var iterationTimeMS = $ianmackenzie$elm_units$Duration$inMilliseconds(periodDuration);
				var iteration = $elm$core$Basics$floor(totalMS / iterationTimeMS);
				if (_Utils_cmp(iteration, n) > -1) {
					return {
						position: $ianmackenzie$elm_units$Pixels$pixels(
							toX(1)),
						velocity: $ianmackenzie$elm_units$Pixels$pixelsPerSecond(0)
					};
				} else {
					var progress = A2($mdgriffith$elm_animator$Internal$Interpolate$wrapUnitAfter, periodDuration, duration);
					return {
						position: $ianmackenzie$elm_units$Pixels$pixels(
							toX(progress)),
						velocity: A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, progress)
					};
				}
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$dwellPeriod = function (movement) {
	if (movement.$ === 'Pos') {
		return $elm$core$Maybe$Nothing;
	} else {
		var period = movement.c;
		return $elm$core$Maybe$Just(period);
	}
};
var $ianmackenzie$elm_units$Pixels$inPixels = function (_v0) {
	var numPixels = _v0.a;
	return numPixels;
};
var $ianmackenzie$elm_units$Pixels$inPixelsPerSecond = function (_v0) {
	var numPixelsPerSecond = _v0.a;
	return numPixelsPerSecond;
};
var $mdgriffith$elm_animator$Internal$Interpolate$Spline = F4(
	function (a, b, c, d) {
		return {$: 'Spline', a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_animator$Internal$Interpolate$zeroPoint = {x: 0, y: 0};
var $mdgriffith$elm_animator$Internal$Interpolate$createSpline = function (config) {
	var totalX = config.end.x - config.start.x;
	var startVelScale = 1 / (config.startVelocity.x / totalX);
	var startVelocity = (!config.departure.slowly) ? config.startVelocity : (((!(config.startVelocity.x - $mdgriffith$elm_animator$Internal$Interpolate$zeroPoint.x)) && (!(config.startVelocity.y - $mdgriffith$elm_animator$Internal$Interpolate$zeroPoint.y))) ? {x: totalX * (config.departure.slowly * 3), y: 0} : {x: (startVelScale * config.startVelocity.x) * (config.departure.slowly * 3), y: (startVelScale * config.startVelocity.y) * (config.departure.slowly * 3)});
	var endVelScale = 1 / (config.endVelocity.x / totalX);
	var endVelocity = (!config.arrival.slowly) ? config.endVelocity : (((!(config.endVelocity.x - $mdgriffith$elm_animator$Internal$Interpolate$zeroPoint.x)) && (!(config.endVelocity.y - $mdgriffith$elm_animator$Internal$Interpolate$zeroPoint.y))) ? {x: totalX * (config.arrival.slowly * 3), y: 0} : {x: (endVelScale * config.endVelocity.x) * (config.arrival.slowly * 3), y: (endVelScale * config.endVelocity.y) * (config.arrival.slowly * 3)});
	return A4(
		$mdgriffith$elm_animator$Internal$Interpolate$Spline,
		config.start,
		{x: config.start.x + ((1 / 3) * startVelocity.x), y: config.start.y + ((1 / 3) * startVelocity.y)},
		{x: config.end.x + (((-1) / 3) * endVelocity.x), y: config.end.y + (((-1) / 3) * endVelocity.y)},
		config.end);
};
var $mdgriffith$elm_animator$Internal$Interpolate$findAtXOnSpline = F6(
	function (spline, desiredX, tolerance, jumpSize, t, depth) {
		findAtXOnSpline:
		while (true) {
			var p1 = spline.a;
			var p2 = spline.b;
			var p3 = spline.c;
			var p4 = spline.d;
			var point = function () {
				if (t <= 0.5) {
					var q3 = {x: p3.x + (t * (p4.x - p3.x)), y: p3.y + (t * (p4.y - p3.y))};
					var q2 = {x: p2.x + (t * (p3.x - p2.x)), y: p2.y + (t * (p3.y - p2.y))};
					var r2 = {x: q2.x + (t * (q3.x - q2.x)), y: q2.y + (t * (q3.y - q2.y))};
					var q1 = {x: p1.x + (t * (p2.x - p1.x)), y: p1.y + (t * (p2.y - p1.y))};
					var r1 = {x: q1.x + (t * (q2.x - q1.x)), y: q1.y + (t * (q2.y - q1.y))};
					return {x: r1.x + (t * (r2.x - r1.x)), y: r1.y + (t * (r2.y - r1.y))};
				} else {
					var q3 = {x: p4.x + ((1 - t) * (p3.x - p4.x)), y: p4.y + ((1 - t) * (p3.y - p4.y))};
					var q2 = {x: p3.x + ((1 - t) * (p2.x - p3.x)), y: p3.y + ((1 - t) * (p2.y - p3.y))};
					var r2 = {x: q3.x + ((1 - t) * (q2.x - q3.x)), y: q3.y + ((1 - t) * (q2.y - q3.y))};
					var q1 = {x: p2.x + ((1 - t) * (p1.x - p2.x)), y: p2.y + ((1 - t) * (p1.y - p2.y))};
					var r1 = {x: q2.x + ((1 - t) * (q1.x - q2.x)), y: q2.y + ((1 - t) * (q1.y - q2.y))};
					return {x: r2.x + ((1 - t) * (r1.x - r2.x)), y: r2.y + ((1 - t) * (r1.y - r2.y))};
				}
			}();
			if (depth === 10) {
				return {point: point, t: t};
			} else {
				if (($elm$core$Basics$abs(point.x - desiredX) < 1) && ($elm$core$Basics$abs(point.x - desiredX) >= 0)) {
					return {point: point, t: t};
				} else {
					if ((point.x - desiredX) > 0) {
						var $temp$spline = spline,
							$temp$desiredX = desiredX,
							$temp$tolerance = tolerance,
							$temp$jumpSize = jumpSize / 2,
							$temp$t = t - jumpSize,
							$temp$depth = depth + 1;
						spline = $temp$spline;
						desiredX = $temp$desiredX;
						tolerance = $temp$tolerance;
						jumpSize = $temp$jumpSize;
						t = $temp$t;
						depth = $temp$depth;
						continue findAtXOnSpline;
					} else {
						var $temp$spline = spline,
							$temp$desiredX = desiredX,
							$temp$tolerance = tolerance,
							$temp$jumpSize = jumpSize / 2,
							$temp$t = t + jumpSize,
							$temp$depth = depth + 1;
						spline = $temp$spline;
						desiredX = $temp$desiredX;
						tolerance = $temp$tolerance;
						jumpSize = $temp$jumpSize;
						t = $temp$t;
						depth = $temp$depth;
						continue findAtXOnSpline;
					}
				}
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$interpolateValue = F3(
	function (start, end, t) {
		return (t <= 0.5) ? (start + (t * (end - start))) : (end + ((1 - t) * (start - end)));
	});
var $mdgriffith$elm_animator$Internal$Interpolate$firstDerivativeOnSpline = F2(
	function (_v0, proportion) {
		var p1 = _v0.a;
		var p2 = _v0.b;
		var p3 = _v0.c;
		var p4 = _v0.d;
		var vy3 = p4.y - p3.y;
		var vy2 = p3.y - p2.y;
		var wy2 = A3($mdgriffith$elm_animator$Internal$Interpolate$interpolateValue, vy2, vy3, proportion);
		var vy1 = p2.y - p1.y;
		var wy1 = A3($mdgriffith$elm_animator$Internal$Interpolate$interpolateValue, vy1, vy2, proportion);
		var vx3 = p4.x - p3.x;
		var vx2 = p3.x - p2.x;
		var wx2 = A3($mdgriffith$elm_animator$Internal$Interpolate$interpolateValue, vx2, vx3, proportion);
		var vx1 = p2.x - p1.x;
		var wx1 = A3($mdgriffith$elm_animator$Internal$Interpolate$interpolateValue, vx1, vx2, proportion);
		return {
			x: 3 * A3($mdgriffith$elm_animator$Internal$Interpolate$interpolateValue, wx1, wx2, proportion),
			y: 3 * A3($mdgriffith$elm_animator$Internal$Interpolate$interpolateValue, wy1, wy2, proportion)
		};
	});
var $mdgriffith$elm_animator$Internal$Time$millis = function (ms) {
	return $ianmackenzie$elm_units$Quantity$Quantity(ms);
};
var $mdgriffith$elm_animator$Internal$Interpolate$newVelocityAtTarget = F3(
	function (target, targetTime, lookAhead) {
		var targetPosition = function () {
			if (target.$ === 'Osc') {
				var toX = target.d;
				return $ianmackenzie$elm_units$Pixels$pixels(
					toX(0));
			} else {
				var x = target.c;
				return $ianmackenzie$elm_units$Pixels$pixels(x);
			}
		}();
		var _v0 = lookAhead.anchor;
		if (_v0.$ === 'Pos') {
			var aheadPosition = _v0.c;
			return A4(
				$mdgriffith$elm_animator$Internal$Interpolate$velocityBetween,
				targetPosition,
				$mdgriffith$elm_animator$Internal$Time$millis(targetTime),
				$ianmackenzie$elm_units$Pixels$pixels(aheadPosition),
				$mdgriffith$elm_animator$Internal$Time$millis(lookAhead.time));
		} else {
			var period = _v0.c;
			var toX = _v0.d;
			if (lookAhead.resting) {
				if (period.$ === 'Loop') {
					var periodDuration = period.a;
					return A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, 0);
				} else {
					var n = period.a;
					var periodDuration = period.b;
					return A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, 0);
				}
			} else {
				return A4(
					$mdgriffith$elm_animator$Internal$Interpolate$velocityBetween,
					targetPosition,
					$mdgriffith$elm_animator$Internal$Time$millis(targetTime),
					$ianmackenzie$elm_units$Pixels$pixels(
						toX(0)),
					$mdgriffith$elm_animator$Internal$Time$millis(lookAhead.time));
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$nullDeparture = {late: 0, slowly: 0};
var $mdgriffith$elm_animator$Internal$Interpolate$interpolateBetween = F7(
	function (startTimeInMs, maybePrevious, target, targetTimeInMs, now, maybeLookAhead, state) {
		var targetVelocity = function () {
			if (maybeLookAhead.$ === 'Nothing') {
				if (target.$ === 'Pos') {
					return 0;
				} else {
					var period = target.c;
					var toX = target.d;
					if (period.$ === 'Loop') {
						var periodDuration = period.a;
						return $ianmackenzie$elm_units$Pixels$inPixelsPerSecond(
							A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, 0));
					} else {
						var n = period.a;
						var periodDuration = period.b;
						return $ianmackenzie$elm_units$Pixels$inPixelsPerSecond(
							A3($mdgriffith$elm_animator$Internal$Interpolate$derivativeOfEasing, toX, periodDuration, 0));
					}
				}
			} else {
				var lookAhead = maybeLookAhead.a;
				return $ianmackenzie$elm_units$Pixels$inPixelsPerSecond(
					A3($mdgriffith$elm_animator$Internal$Interpolate$newVelocityAtTarget, target, targetTimeInMs, lookAhead));
			}
		}();
		var targetPosition = function () {
			if (target.$ === 'Osc') {
				var toX = target.d;
				return $ianmackenzie$elm_units$Pixels$pixels(
					toX(0));
			} else {
				var x = target.c;
				return $ianmackenzie$elm_units$Pixels$pixels(x);
			}
		}();
		var curve = $mdgriffith$elm_animator$Internal$Interpolate$createSpline(
			{
				arrival: function () {
					if (target.$ === 'Pos') {
						var arrival = target.b;
						return arrival;
					} else {
						var arrival = target.b;
						return arrival;
					}
				}(),
				departure: function () {
					if (maybePrevious.$ === 'Nothing') {
						return $mdgriffith$elm_animator$Internal$Interpolate$nullDeparture;
					} else {
						if (maybePrevious.a.$ === 'Pos') {
							var _v2 = maybePrevious.a;
							var departure = _v2.a;
							return departure;
						} else {
							var _v3 = maybePrevious.a;
							var departure = _v3.a;
							return departure;
						}
					}
				}(),
				end: {
					x: targetTimeInMs,
					y: $ianmackenzie$elm_units$Pixels$inPixels(targetPosition)
				},
				endVelocity: {x: 1000, y: targetVelocity},
				start: {
					x: startTimeInMs,
					y: $ianmackenzie$elm_units$Pixels$inPixels(state.position)
				},
				startVelocity: {
					x: 1000,
					y: $ianmackenzie$elm_units$Pixels$inPixelsPerSecond(state.velocity)
				}
			});
		var current = A6($mdgriffith$elm_animator$Internal$Interpolate$findAtXOnSpline, curve, now, 1, 0.25, 0.5, 0);
		var firstDerivative = A2($mdgriffith$elm_animator$Internal$Interpolate$firstDerivativeOnSpline, curve, current.t);
		return {
			position: $ianmackenzie$elm_units$Pixels$pixels(current.point.y),
			velocity: $ianmackenzie$elm_units$Pixels$pixelsPerSecond(1000 * (firstDerivative.y / firstDerivative.x))
		};
	});
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $mdgriffith$elm_animator$Internal$Spring$criticalDamping = F2(
	function (k, m) {
		return 2 * $elm$core$Basics$sqrt(k * m);
	});
var $elm$core$Basics$e = _Basics_e;
var $mdgriffith$elm_animator$Internal$Spring$toleranceForSpringSettleTimeCalculation = (-1) * A2($elm$core$Basics$logBase, $elm$core$Basics$e, 0.005);
var $mdgriffith$elm_animator$Internal$Spring$settlesAt = function (_v0) {
	var stiffness = _v0.stiffness;
	var damping = _v0.damping;
	var mass = _v0.mass;
	var m = mass;
	var k = stiffness;
	var springAspect = $elm$core$Basics$sqrt(k / m);
	var cCritical = A2($mdgriffith$elm_animator$Internal$Spring$criticalDamping, k, m);
	var c = damping;
	if (_Utils_eq(
		$elm$core$Basics$round(c),
		$elm$core$Basics$round(cCritical))) {
		return 1000 * (8.5 / springAspect);
	} else {
		if ((c - cCritical) > 0) {
			var dampingAspect = c / cCritical;
			return 1000 * ($mdgriffith$elm_animator$Internal$Spring$toleranceForSpringSettleTimeCalculation / (dampingAspect * springAspect));
		} else {
			var dampingAspect = c / cCritical;
			return 1000 * ($mdgriffith$elm_animator$Internal$Spring$toleranceForSpringSettleTimeCalculation / (dampingAspect * springAspect));
		}
	}
};
var $mdgriffith$elm_animator$Internal$Spring$mapToRange = F3(
	function (minimum, maximum, x) {
		var total = maximum - minimum;
		return minimum + (x * total);
	});
var $mdgriffith$elm_animator$Internal$Spring$wobble2Ratio = F2(
	function (wobble, duration) {
		var ms = $ianmackenzie$elm_units$Duration$inMilliseconds(duration);
		var scalingBelowDur = ms / 350;
		var top = A2(
			$elm$core$Basics$max,
			0.43,
			0.8 * A2($elm$core$Basics$min, 1, scalingBelowDur));
		var bounded = A2(
			$elm$core$Basics$min,
			1,
			A2($elm$core$Basics$max, 0, wobble));
		return A3($mdgriffith$elm_animator$Internal$Spring$mapToRange, 0.43, top, 1 - bounded);
	});
var $mdgriffith$elm_animator$Internal$Spring$wobble2Damping = F4(
	function (wobble, k, m, duration) {
		return A2($mdgriffith$elm_animator$Internal$Spring$wobble2Ratio, wobble, duration) * A2($mdgriffith$elm_animator$Internal$Spring$criticalDamping, k, m);
	});
var $mdgriffith$elm_animator$Internal$Spring$select = F2(
	function (wobbliness, duration) {
		var k = 150;
		var durMS = $ianmackenzie$elm_units$Duration$inMilliseconds(duration);
		var damping = A4($mdgriffith$elm_animator$Internal$Spring$wobble2Damping, wobbliness, k, 1, duration);
		var initiallySettlesAt = $mdgriffith$elm_animator$Internal$Spring$settlesAt(
			{damping: damping, mass: 1, stiffness: k});
		var newCritical = A2($mdgriffith$elm_animator$Internal$Spring$criticalDamping, k, durMS / initiallySettlesAt);
		return {damping: damping, mass: durMS / initiallySettlesAt, stiffness: k};
	});
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $mdgriffith$elm_animator$Internal$Spring$step = F4(
	function (target, _v0, dtms, motion) {
		var stiffness = _v0.stiffness;
		var damping = _v0.damping;
		var mass = _v0.mass;
		var fspring = stiffness * (target - motion.position);
		var fdamper = ((-1) * damping) * motion.velocity;
		var dt = dtms / 1000;
		var a = (fspring + fdamper) / mass;
		var newVelocity = motion.velocity + (a * dt);
		var newPos = motion.position + (newVelocity * dt);
		return {position: newPos, velocity: newVelocity};
	});
var $mdgriffith$elm_animator$Internal$Spring$stepOver = F4(
	function (duration, params, target, state) {
		var durMS = $ianmackenzie$elm_units$Duration$inMilliseconds(duration);
		var frames = durMS / 16;
		var remainder = 16 * (frames - $elm$core$Basics$floor(frames));
		var steps = (remainder > 0) ? A2(
			$elm$core$List$cons,
			remainder,
			A2(
				$elm$core$List$repeat,
				($elm$core$Basics$floor(durMS) / 16) | 0,
				16)) : A2(
			$elm$core$List$repeat,
			($elm$core$Basics$floor(durMS) / 16) | 0,
			16);
		return A3(
			$elm$core$List$foldl,
			A2($mdgriffith$elm_animator$Internal$Spring$step, target, params),
			state,
			steps);
	});
var $mdgriffith$elm_animator$Internal$Interpolate$springInterpolation = F7(
	function (prevEndTime, _v0, target, targetTime, now, _v1, state) {
		var wobble = function () {
			if (target.$ === 'Osc') {
				var arrival = target.b;
				return arrival.wobbliness;
			} else {
				var arrival = target.b;
				return arrival.wobbliness;
			}
		}();
		var targetPos = function () {
			if (target.$ === 'Osc') {
				var toX = target.d;
				return toX(0);
			} else {
				var x = target.c;
				return x;
			}
		}();
		var duration = A2(
			$mdgriffith$elm_animator$Internal$Time$duration,
			$mdgriffith$elm_animator$Internal$Time$millis(prevEndTime),
			$mdgriffith$elm_animator$Internal$Time$millis(targetTime));
		var params = A2($mdgriffith$elm_animator$Internal$Spring$select, wobble, duration);
		var _new = A4(
			$mdgriffith$elm_animator$Internal$Spring$stepOver,
			A2(
				$mdgriffith$elm_animator$Internal$Time$duration,
				$mdgriffith$elm_animator$Internal$Time$millis(prevEndTime),
				$mdgriffith$elm_animator$Internal$Time$millis(now)),
			params,
			targetPos,
			{
				position: $ianmackenzie$elm_units$Pixels$inPixels(state.position),
				velocity: $ianmackenzie$elm_units$Pixels$inPixelsPerSecond(state.velocity)
			});
		return {
			position: $ianmackenzie$elm_units$Pixels$pixels(_new.position),
			velocity: $ianmackenzie$elm_units$Pixels$pixelsPerSecond(_new.velocity)
		};
	});
var $mdgriffith$elm_animator$Internal$Interpolate$lerp = F7(
	function (prevEndTime, maybePrev, target, targetTime, now, maybeLookAhead, state) {
		var wobble = function () {
			if (target.$ === 'Osc') {
				var arrival = target.b;
				return arrival.wobbliness;
			} else {
				var arrival = target.b;
				return arrival.wobbliness;
			}
		}();
		var nothingHappened = function () {
			if (target.$ === 'Osc') {
				return false;
			} else {
				var x = target.c;
				return _Utils_eq(
					x,
					$ianmackenzie$elm_units$Pixels$inPixels(state.position)) && (!$ianmackenzie$elm_units$Pixels$inPixelsPerSecond(state.velocity));
			}
		}();
		if (nothingHappened) {
			return state;
		} else {
			if (maybeLookAhead.$ === 'Nothing') {
				return (!(!wobble)) ? A7($mdgriffith$elm_animator$Internal$Interpolate$springInterpolation, prevEndTime, maybePrev, target, targetTime, now, maybeLookAhead, state) : A7($mdgriffith$elm_animator$Internal$Interpolate$interpolateBetween, prevEndTime, maybePrev, target, targetTime, now, maybeLookAhead, state);
			} else {
				return A7($mdgriffith$elm_animator$Internal$Interpolate$interpolateBetween, prevEndTime, maybePrev, target, targetTime, now, maybeLookAhead, state);
			}
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$startMoving = function (movement) {
	return {
		position: function () {
			if (movement.$ === 'Osc') {
				var toX = movement.d;
				return $ianmackenzie$elm_units$Pixels$pixels(
					toX(0));
			} else {
				var depart = movement.a;
				var arrive = movement.b;
				var x = movement.c;
				return $ianmackenzie$elm_units$Pixels$pixels(x);
			}
		}(),
		velocity: $ianmackenzie$elm_units$Pixels$pixelsPerSecond(0)
	};
};
var $mdgriffith$elm_animator$Internal$Interpolate$moving = {adjustor: $mdgriffith$elm_animator$Internal$Interpolate$adjustTiming, after: $mdgriffith$elm_animator$Internal$Interpolate$afterMove, dwellFor: $mdgriffith$elm_animator$Internal$Interpolate$dwellFor, dwellPeriod: $mdgriffith$elm_animator$Internal$Interpolate$dwellPeriod, lerp: $mdgriffith$elm_animator$Internal$Interpolate$lerp, start: $mdgriffith$elm_animator$Internal$Interpolate$startMoving};
var $mdgriffith$elm_animator$Internal$Interpolate$unwrapUnits = function (_v0) {
	var position = _v0.position;
	var velocity = _v0.velocity;
	return {
		position: function () {
			var val = position.a;
			return val;
		}(),
		velocity: function () {
			var val = velocity.a;
			return val;
		}()
	};
};
var $mdgriffith$elm_animator$Internal$Interpolate$details = F2(
	function (timeline, lookup) {
		return $mdgriffith$elm_animator$Internal$Interpolate$unwrapUnits(
			A3($mdgriffith$elm_animator$Internal$Timeline$foldp, lookup, $mdgriffith$elm_animator$Internal$Interpolate$moving, timeline));
	});
var $mdgriffith$elm_animator$Internal$Interpolate$Osc = F4(
	function (a, b, c, d) {
		return {$: 'Osc', a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_animator$Internal$Interpolate$Pos = F3(
	function (a, b, c) {
		return {$: 'Pos', a: a, b: b, c: c};
	});
var $mdgriffith$elm_animator$Internal$Interpolate$withDefault = F2(
	function (def, defaultOr) {
		if (defaultOr.$ === 'Default') {
			return def;
		} else {
			var specified = defaultOr.a;
			return specified;
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$fillDefaults = F2(
	function (builtInDefault, specified) {
		if (specified.$ === 'FullDefault') {
			return builtInDefault;
		} else {
			var partial = specified.a;
			return {
				arriveEarly: A2($mdgriffith$elm_animator$Internal$Interpolate$withDefault, builtInDefault.arriveEarly, partial.arriveEarly),
				arriveSlowly: A2($mdgriffith$elm_animator$Internal$Interpolate$withDefault, builtInDefault.arriveSlowly, partial.arriveSlowly),
				departLate: A2($mdgriffith$elm_animator$Internal$Interpolate$withDefault, builtInDefault.departLate, partial.departLate),
				departSlowly: A2($mdgriffith$elm_animator$Internal$Interpolate$withDefault, builtInDefault.departSlowly, partial.departSlowly),
				wobbliness: A2($mdgriffith$elm_animator$Internal$Interpolate$withDefault, builtInDefault.wobbliness, partial.wobbliness)
			};
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$standardDefault = {arriveEarly: 0, arriveSlowly: 0.8, departLate: 0, departSlowly: 0.4, wobbliness: 0};
var $mdgriffith$elm_animator$Internal$Interpolate$withStandardDefault = function (defMovement) {
	if (defMovement.$ === 'Oscillate') {
		var specifiedPersonality = defMovement.a;
		var period = defMovement.b;
		var fn = defMovement.c;
		var personality = A2($mdgriffith$elm_animator$Internal$Interpolate$fillDefaults, $mdgriffith$elm_animator$Internal$Interpolate$standardDefault, specifiedPersonality);
		return A4(
			$mdgriffith$elm_animator$Internal$Interpolate$Osc,
			{late: personality.departLate, slowly: personality.departSlowly},
			{early: personality.arriveEarly, slowly: personality.arriveSlowly, wobbliness: personality.wobbliness},
			period,
			fn);
	} else {
		var specifiedPersonality = defMovement.a;
		var p = defMovement.b;
		var personality = A2($mdgriffith$elm_animator$Internal$Interpolate$fillDefaults, $mdgriffith$elm_animator$Internal$Interpolate$standardDefault, specifiedPersonality);
		return A3(
			$mdgriffith$elm_animator$Internal$Interpolate$Pos,
			{late: personality.departLate, slowly: personality.departSlowly},
			{early: personality.arriveEarly, slowly: personality.arriveSlowly, wobbliness: personality.wobbliness},
			p);
	}
};
var $mdgriffith$elm_animator$Animator$move = F2(
	function (timeline, lookup) {
		return A2(
			$mdgriffith$elm_animator$Internal$Interpolate$details,
			timeline,
			A2($elm$core$Basics$composeL, $mdgriffith$elm_animator$Internal$Interpolate$withStandardDefault, lookup)).position;
	});
var $author$project$Main$getViewBox = function (viewBox) {
	var y = A2(
		$mdgriffith$elm_animator$Animator$move,
		viewBox,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.y;
			},
			$mdgriffith$elm_animator$Animator$at));
	var x = A2(
		$mdgriffith$elm_animator$Animator$move,
		viewBox,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.x;
			},
			$mdgriffith$elm_animator$Animator$at));
	var w = A2(
		$mdgriffith$elm_animator$Animator$move,
		viewBox,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.w;
			},
			$mdgriffith$elm_animator$Animator$at));
	var h = A2(
		$mdgriffith$elm_animator$Animator$move,
		viewBox,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.h;
			},
			$mdgriffith$elm_animator$Animator$at));
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$map,
			$elm$core$String$fromFloat,
			_List_fromArray(
				[x, y, w, h])));
};
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {preventDefault: true, stopPropagation: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {button: button, clientPos: clientPos, keys: keys, offsetPos: offsetPos, pagePos: pagePos, screenPos: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = {$: 'BackButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = {$: 'ErrorButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = {$: 'ForwardButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = {$: 'MainButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = {$: 'MiddleButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = {$: 'SecondButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton;
		case 1:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton;
		case 2:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton;
		case 3:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton;
		case 4:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton;
		default:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton;
	}
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	$elm$json$Json$Decode$map,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $mpizenberg$elm_pointer_events$Internal$Decode$clientPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$Keys = F3(
	function (alt, ctrl, shift) {
		return {alt: alt, ctrl: ctrl, shift: shift};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	$elm$json$Json$Decode$map3,
	$mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$pagePos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$screenPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'screenX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'screenY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder = A7($elm$json$Json$Decode$map6, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event, $mpizenberg$elm_pointer_events$Internal$Decode$keys, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder, $mpizenberg$elm_pointer_events$Internal$Decode$clientPos, $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos, $mpizenberg$elm_pointer_events$Internal$Decode$pagePos, $mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousemove', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $elm$svg$Svg$Attributes$preserveAspectRatio = _VirtualDom_attribute('preserveAspectRatio');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Main$viewBackground = function (state) {
	var animClass = function () {
		if (state.$ === 'On') {
			return $elm$svg$Svg$Attributes$class('');
		} else {
			return $elm$svg$Svg$Attributes$class('stopped');
		}
	}();
	var _v0 = _Utils_Tuple2((-2.4) * $author$project$Graphics$screen.w, (-2.4) * $author$project$Graphics$screen.h);
	var x = _v0.a;
	var y = _v0.b;
	var _v1 = _Utils_Tuple2(7.2 * $author$project$Graphics$screen.w, 7.2 * $author$project$Graphics$screen.h);
	var w = _v1.a;
	var h = _v1.b;
	return A2(
		$elm$svg$Svg$g,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill('url(#bggradient)'),
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(w)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(h))
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$rect,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill('url(#bgpattern)'),
						$elm$svg$Svg$Attributes$class('bgpattern'),
						animClass,
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$String$fromFloat(y)),
						$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(w)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(h))
					]),
				_List_Nil)
			]));
};
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$Attributes$gradientTransform = _VirtualDom_attribute('gradientTransform');
var $elm$svg$Svg$linearGradient = $elm$svg$Svg$trustedNode('linearGradient');
var $elm$svg$Svg$Attributes$offset = _VirtualDom_attribute('offset');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$pattern = $elm$svg$Svg$trustedNode('pattern');
var $elm$svg$Svg$Attributes$patternUnits = _VirtualDom_attribute('patternUnits');
var $elm$svg$Svg$stop = $elm$svg$Svg$trustedNode('stop');
var $elm$svg$Svg$Attributes$stopColor = _VirtualDom_attribute('stop-color');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeLinecap = _VirtualDom_attribute('stroke-linecap');
var $elm$svg$Svg$Attributes$strokeLinejoin = _VirtualDom_attribute('stroke-linejoin');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $author$project$Main$viewDefs = A2(
	$elm$svg$Svg$defs,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$pattern,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$id('bgpattern'),
					$elm$svg$Svg$Attributes$x('0'),
					$elm$svg$Svg$Attributes$y('0'),
					$elm$svg$Svg$Attributes$width('80'),
					$elm$svg$Svg$Attributes$height('46'),
					$elm$svg$Svg$Attributes$patternUnits('userSpaceOnUse'),
					$elm$svg$Svg$Attributes$viewBox('-6 -10 12.125 20'),
					$elm$svg$Svg$Attributes$preserveAspectRatio('xMidYMid slice')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M -4 0 L -8 0'),
							$elm$svg$Svg$Attributes$strokeWidth('0.15'),
							$elm$svg$Svg$Attributes$stroke('#4fc3f7'),
							$elm$svg$Svg$Attributes$strokeLinecap('butt'),
							$elm$svg$Svg$Attributes$fill('transparent')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 4 0 L 2 -3.5 L -2 -3.5 L -4 0 L -2 3.5 L 2 3.5 Z'),
							$elm$svg$Svg$Attributes$strokeWidth('0.2'),
							$elm$svg$Svg$Attributes$stroke('#4fc3f7'),
							$elm$svg$Svg$Attributes$strokeLinejoin('bevel'),
							$elm$svg$Svg$Attributes$fill('transparent')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d('M 4 0 L 8 0'),
							$elm$svg$Svg$Attributes$strokeWidth('0.15'),
							$elm$svg$Svg$Attributes$stroke('#4fc3f7'),
							$elm$svg$Svg$Attributes$strokeLinecap('butt'),
							$elm$svg$Svg$Attributes$fill('transparent')
						]),
					_List_Nil)
				])),
			A2(
			$elm$svg$Svg$linearGradient,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$id('bggradient'),
					$elm$svg$Svg$Attributes$gradientTransform('rotate(30)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$stop,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$offset('10%'),
							$elm$svg$Svg$Attributes$stopColor('#03a9f4')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$stop,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$offset('100%'),
							$elm$svg$Svg$Attributes$stopColor('#9c27b0')
						]),
					_List_Nil)
				]))
		]));
var $author$project$Main$AboutScreen = {$: 'AboutScreen'};
var $author$project$Main$DifficultyMenu = {$: 'DifficultyMenu'};
var $author$project$Main$OptionsScreen = {$: 'OptionsScreen'};
var $author$project$Main$TitleScreen = {$: 'TitleScreen'};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$Main$translate = F2(
	function (x, y) {
		return 'translate(' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y) + ')')));
	});
var $author$project$Main$Left = {$: 'Left'};
var $author$project$Title$aboutLetters = _List_fromArray(
	['A', 'B', 'O', 'U', 'T']);
var $author$project$Title$aboutPositions = _List_fromArray(
	['91.2', '105.3', '119.6', '134.5', '149.2']);
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Title$about = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$aboutLetters, $author$project$Title$aboutPositions);
var $author$project$Main$ChangeScene = function (a) {
	return {$: 'ChangeScene', a: a};
};
var $author$project$Graphics$middle = A2($author$project$Graphics$Point, $author$project$Graphics$screen.w / 2, $author$project$Graphics$screen.h / 2);
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $author$project$Main$viewBackButton = function (scene) {
	return A2(
		$elm$svg$Svg$text_,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('back'),
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat($author$project$Graphics$middle.x)),
				$elm$svg$Svg$Attributes$y('125'),
				$elm$html$Html$Events$onClick(
				$author$project$Main$ChangeScene(scene))
			]),
		_List_fromArray(
			[
				$elm$svg$Svg$text('BACK')
			]));
};
var $author$project$Main$alignToClass = function (align) {
	if (align.$ === 'Left') {
		return $elm$svg$Svg$Attributes$class('left');
	} else {
		return $elm$svg$Svg$Attributes$class('center');
	}
};
var $author$project$Main$viewText = F3(
	function (label, _v0, align) {
		var x = _v0.x;
		var y = _v0.y;
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('text'),
					$author$project$Main$alignToClass(align),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(x)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(y))
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(label)
				]));
	});
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$sin = _Basics_sin;
var $author$project$Main$sineSteps = F2(
	function (steps, scale) {
		var toSin = function (i) {
			return $elm$core$Basics$sin((i * (2 / steps)) * $elm$core$Basics$pi);
		};
		return A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				toSin,
				$elm$core$Basics$mul(-scale)),
			A2($elm$core$List$range, 0, steps));
	});
var $author$project$Main$sineValues = A2(
	$elm$core$String$join,
	';',
	A2(
		$elm$core$List$map,
		$elm$core$String$fromFloat,
		A2($author$project$Main$sineSteps, 20, 5)));
var $elm$svg$Svg$animate = $elm$svg$Svg$trustedNode('animate');
var $elm$svg$Svg$Attributes$attributeName = _VirtualDom_attribute('attributeName');
var $elm$svg$Svg$Attributes$begin = _VirtualDom_attribute('begin');
var $elm$svg$Svg$Attributes$dur = _VirtualDom_attribute('dur');
var $elm$svg$Svg$Attributes$repeatCount = _VirtualDom_attribute('repeatCount');
var $elm$svg$Svg$Attributes$values = function (value) {
	return A2(
		_VirtualDom_attribute,
		'values',
		_VirtualDom_noJavaScriptUri(value));
};
var $author$project$Main$viewTitleLetter = F4(
	function (state, animValues, _v0, index) {
		var letter = _v0.a;
		var xPos = _v0.b;
		var animate = function () {
			if (state.$ === 'On') {
				return A2(
					$elm$svg$Svg$animate,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$dur('3s'),
							$elm$svg$Svg$Attributes$repeatCount('indefinite'),
							$elm$svg$Svg$Attributes$begin(
							$elm$core$String$fromFloat(index / 10) + 's'),
							$elm$svg$Svg$Attributes$attributeName('y'),
							$elm$svg$Svg$Attributes$values(animValues)
						]),
					_List_Nil);
			} else {
				return $elm$svg$Svg$text('');
			}
		}();
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(xPos),
					$elm$svg$Svg$Attributes$y('0')
				]),
			_List_fromArray(
				[
					animate,
					$elm$svg$Svg$text(letter)
				]));
	});
var $author$project$Main$viewTitle = F2(
	function (state, title) {
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('title'),
					$elm$svg$Svg$Attributes$x('0'),
					$elm$svg$Svg$Attributes$y('0'),
					$elm$svg$Svg$Attributes$transform('translate(0 30)')
				]),
			A3(
				$elm$core$List$map2,
				A2($author$project$Main$viewTitleLetter, state, $author$project$Main$sineValues),
				title,
				A2(
					$elm$core$List$range,
					0,
					$elm$core$List$length(title))));
	});
var $author$project$Main$viewAbout = function (titleAnimation) {
	return _List_fromArray(
		[
			A2($author$project$Main$viewTitle, titleAnimation, $author$project$Title$about),
			A3(
			$author$project$Main$viewText,
			'Hexasperate is an edge-matching puzzle',
			A2($author$project$Graphics$Point, 25.8, 55),
			$author$project$Main$Left),
			A3(
			$author$project$Main$viewText,
			'game inspired by the classic game TetraVex',
			A2($author$project$Graphics$Point, 25.8, 65),
			$author$project$Main$Left),
			A3(
			$author$project$Main$viewText,
			'by Scott Ferguson, which first appeared',
			A2($author$project$Graphics$Point, 25.8, 75),
			$author$project$Main$Left),
			A3(
			$author$project$Main$viewText,
			'in Microsoft Entertainment Pack 3 in 1991.',
			A2($author$project$Graphics$Point, 25.8, 85),
			$author$project$Main$Left),
			A3(
			$author$project$Main$viewText,
			'Hexasperate was created by Tom Smilack.',
			A2($author$project$Graphics$Point, 25.8, 105),
			$author$project$Main$Left),
			$author$project$Main$viewBackButton($author$project$Main$TitleScreen)
		]);
};
var $author$project$Main$Large = {$: 'Large'};
var $author$project$Main$Medium = {$: 'Medium'};
var $author$project$Title$playLetters = _List_fromArray(
	['P', 'L', 'A', 'Y']);
var $author$project$Title$playPositions = _List_fromArray(
	['101.1', '113.3', '126.8', '138.3']);
var $author$project$Title$play = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$playLetters, $author$project$Title$playPositions);
var $author$project$Main$viewMenuOption = F3(
	function (label, center, action) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('menu-option'),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(center.x)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(center.y)),
					$elm$html$Html$Events$onClick(action)
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(label)
				]));
	});
var $author$project$Main$viewDifficultyMenu = function (titleAnimation) {
	return _List_fromArray(
		[
			A2($author$project$Main$viewTitle, titleAnimation, $author$project$Title$play),
			A3(
			$author$project$Main$viewMenuOption,
			'SMALL',
			A2($author$project$Graphics$Point, $author$project$Graphics$middle.x, 67),
			$author$project$Main$ChangeScene(
				$author$project$Main$GameBoard($author$project$Main$Small))),
			A3(
			$author$project$Main$viewMenuOption,
			'MEDIUM',
			A2($author$project$Graphics$Point, $author$project$Graphics$middle.x, 85),
			$author$project$Main$ChangeScene(
				$author$project$Main$GameBoard($author$project$Main$Medium))),
			A3(
			$author$project$Main$viewMenuOption,
			'LARGE',
			A2($author$project$Graphics$Point, $author$project$Graphics$middle.x, 103),
			$author$project$Main$ChangeScene(
				$author$project$Main$GameBoard($author$project$Main$Large))),
			$author$project$Main$viewBackButton($author$project$Main$TitleScreen)
		]);
};
var $author$project$Label$Eight = {$: 'Eight'};
var $author$project$Label$Five = {$: 'Five'};
var $author$project$Label$Four = {$: 'Four'};
var $author$project$HexList$HexList = F6(
	function (i, ii, iii, iv, v, vi) {
		return {i: i, ii: ii, iii: iii, iv: iv, v: v, vi: vi};
	});
var $author$project$Label$Nine = {$: 'Nine'};
var $author$project$Label$One = {$: 'One'};
var $author$project$Label$Seven = {$: 'Seven'};
var $author$project$Label$Six = {$: 'Six'};
var $author$project$Label$Three = {$: 'Three'};
var $author$project$Label$Two = {$: 'Two'};
var $author$project$Label$Zero = {$: 'Zero'};
var $author$project$Hex$Hex = F2(
	function (wedges, zoom) {
		return {wedges: wedges, zoom: zoom};
	});
var $elm$core$Basics$cos = _Basics_cos;
var $author$project$Wedge$Triangle = F3(
	function (a, b, c) {
		return {$: 'Triangle', a: a, b: b, c: c};
	});
var $author$project$Wedge$Wedge = F2(
	function (label, points) {
		return {label: label, points: points};
	});
var $author$project$Wedge$create = F3(
	function (label, b, c) {
		return A2(
			$author$project$Wedge$Wedge,
			label,
			A3(
				$author$project$Wedge$Triangle,
				A2($author$project$Graphics$Point, 0, 0),
				b,
				c));
	});
var $author$project$Hex$create = F2(
	function (zoom, labels) {
		var si = 20 * $elm$core$Basics$sin($elm$core$Basics$pi / 3);
		var co = 20 * $elm$core$Basics$cos($elm$core$Basics$pi / 3);
		var coords = A6(
			$author$project$HexList$HexList,
			A2($author$project$Graphics$Point, 20, 0),
			A2($author$project$Graphics$Point, co, -si),
			A2($author$project$Graphics$Point, -co, -si),
			A2($author$project$Graphics$Point, -20, 0),
			A2($author$project$Graphics$Point, -co, si),
			A2($author$project$Graphics$Point, co, si));
		var wedges = A6(
			$author$project$HexList$HexList,
			A3($author$project$Wedge$create, labels.i, coords.i, coords.ii),
			A3($author$project$Wedge$create, labels.ii, coords.ii, coords.iii),
			A3($author$project$Wedge$create, labels.iii, coords.iii, coords.iv),
			A3($author$project$Wedge$create, labels.iv, coords.iv, coords.v),
			A3($author$project$Wedge$create, labels.v, coords.v, coords.vi),
			A3($author$project$Wedge$create, labels.vi, coords.vi, coords.i));
		return A2($author$project$Hex$Hex, wedges, zoom);
	});
var $author$project$Palette$Palette = function (zero) {
	return function (one) {
		return function (two) {
			return function (three) {
				return function (four) {
					return function (five) {
						return function (six) {
							return function (seven) {
								return function (eight) {
									return function (nine) {
										return {eight: eight, five: five, four: four, nine: nine, one: one, seven: seven, six: six, three: three, two: two, zero: zero};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Palette$allSame = $author$project$Palette$Palette('#858585')('#858585')('#858585')('#858585')('#858585')('#858585')('#858585')('#858585')('#858585')('#858585');
var $author$project$Palette$colorblind = $author$project$Palette$Palette('#323232')('#bf3465')('#50b29e')('#d9d9d9')('#731683')('#1c6ccc')('#21bcff')('#dfa5e5')('#db6d1b')('#f4e345');
var $author$project$Palette$grayscale = $author$project$Palette$Palette('#000000')('#1e1e1e')('#353535')('#4e4e4e')('#696969')('#858585')('#a2a2a2')('#c0c0c0')('#dfdfdf')('#ffffff');
var $author$project$Palette$material = $author$project$Palette$Palette('#F44336')('#E91E63')('#9C27B0')('#3F51B5')('#2196F3')('#00897B')('#4CAF50')('#FFEB3B')('#FF9800')('#795548');
var $author$project$Palette$resistors = $author$project$Palette$Palette('#000000')('#884400')('#ff0000')('#ff8800')('#ffff00')('#00ee00')('#1122ff')('#8800ff')('#888888')('#ffffff');
var $author$project$Palette$transparent = $author$project$Palette$Palette('transparent')('transparent')('transparent')('transparent')('transparent')('transparent')('transparent')('transparent')('transparent')('transparent');
var $author$project$Palette$get = function (option) {
	switch (option.$) {
		case 'Resistors':
			return $author$project$Palette$resistors;
		case 'Material':
			return $author$project$Palette$material;
		case 'ColorBlind':
			return $author$project$Palette$colorblind;
		case 'Grayscale':
			return $author$project$Palette$grayscale;
		case 'AllSame':
			return $author$project$Palette$allSame;
		default:
			return $author$project$Palette$transparent;
	}
};
var $author$project$HexList$I = {$: 'I'};
var $author$project$HexList$II = {$: 'II'};
var $author$project$HexList$III = {$: 'III'};
var $author$project$HexList$IV = {$: 'IV'};
var $author$project$HexList$V = {$: 'V'};
var $author$project$HexList$VI = {$: 'VI'};
var $author$project$HexList$indexedMap = F2(
	function (fn, _v0) {
		var i = _v0.i;
		var ii = _v0.ii;
		var iii = _v0.iii;
		var iv = _v0.iv;
		var v = _v0.v;
		var vi = _v0.vi;
		return A3(
			$elm$core$List$map2,
			fn,
			_List_fromArray(
				[$author$project$HexList$I, $author$project$HexList$II, $author$project$HexList$III, $author$project$HexList$IV, $author$project$HexList$V, $author$project$HexList$VI]),
			_List_fromArray(
				[i, ii, iii, iv, v, vi]));
	});
var $author$project$Hex$transform = F3(
	function (x, y, zoom) {
		return 'translate(' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y) + (') scale(' + ($elm$core$String$fromFloat(zoom) + ')')))));
	});
var $author$project$Wedge$adjustCenter = F2(
	function (index, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		switch (index.$) {
			case 'I':
				return A2($author$project$Graphics$Point, x + 0, y + 0.5);
			case 'II':
				return A2($author$project$Graphics$Point, x + 0, y + 0.7);
			case 'III':
				return A2($author$project$Graphics$Point, x + 0, y + 0.5);
			case 'IV':
				return A2($author$project$Graphics$Point, x + 0, y + 0.8);
			case 'V':
				return A2($author$project$Graphics$Point, x + 0, y + 0.5);
			default:
				return A2($author$project$Graphics$Point, x + 0, y + 0.8);
		}
	});
var $author$project$Wedge$center = function (_v0) {
	var b = _v0.b;
	var c = _v0.c;
	return A2($author$project$Graphics$Point, (b.x + c.x) / 3, (b.y + c.y) / 3);
};
var $author$project$Palette$color = F2(
	function (label, palette) {
		switch (label.$) {
			case 'Zero':
				return palette.zero;
			case 'One':
				return palette.one;
			case 'Two':
				return palette.two;
			case 'Three':
				return palette.three;
			case 'Four':
				return palette.four;
			case 'Five':
				return palette.five;
			case 'Six':
				return palette.six;
			case 'Seven':
				return palette.seven;
			case 'Eight':
				return palette.eight;
			default:
				return palette.nine;
		}
	});
var $author$project$Wedge$triangleToPath = function (_v0) {
	var a = _v0.a;
	var b = _v0.b;
	var c = _v0.c;
	var str = function (_v1) {
		var x = _v1.x;
		var y = _v1.y;
		return $elm$core$String$fromFloat(x) + (' ' + $elm$core$String$fromFloat(y));
	};
	return 'M ' + (str(a) + (' L ' + (str(b) + (' L ' + (str(c) + ' Z')))));
};
var $author$project$Label$adjustCenter = F2(
	function (label, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		switch (label.$) {
			case 'Zero':
				return A2($author$project$Graphics$Point, x + 0, y + 0);
			case 'One':
				return A2($author$project$Graphics$Point, x - 0.3, y + 0);
			case 'Two':
				return A2($author$project$Graphics$Point, x + 0, y + 0);
			case 'Three':
				return A2($author$project$Graphics$Point, x + 0, y + 0);
			case 'Four':
				return A2($author$project$Graphics$Point, x + 0, y + 0);
			case 'Five':
				return A2($author$project$Graphics$Point, x + 0, y + 0);
			case 'Six':
				return A2($author$project$Graphics$Point, x + 0.1, y + 0);
			case 'Seven':
				return A2($author$project$Graphics$Point, x + 0.1, y + 0);
			case 'Eight':
				return A2($author$project$Graphics$Point, x + 0, y + 0);
			default:
				return A2($author$project$Graphics$Point, x + 0, y + 0);
		}
	});
var $author$project$Label$toString = function (label) {
	switch (label.$) {
		case 'Zero':
			return '0';
		case 'One':
			return '1';
		case 'Two':
			return '2';
		case 'Three':
			return '3';
		case 'Four':
			return '4';
		case 'Five':
			return '5';
		case 'Six':
			return '6';
		case 'Seven':
			return '7';
		case 'Eight':
			return '8';
		default:
			return '9';
	}
};
var $author$project$Label$view = F2(
	function (center, label) {
		var _v0 = A2($author$project$Label$adjustCenter, label, center);
		var x = _v0.x;
		var y = _v0.y;
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(x)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(y)),
					$elm$svg$Svg$Attributes$class('label center')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(
					$author$project$Label$toString(label))
				]));
	});
var $author$project$Wedge$view = F4(
	function (palette, labels, index, wedge) {
		var fill = A2($author$project$Palette$color, wedge.label, palette);
		var strokeClass = (fill === 'transparent') ? 'transparent' : '';
		var c_ = $author$project$Wedge$center(wedge.points);
		var c = A2($author$project$Wedge$adjustCenter, index, c_);
		var text = function () {
			if (labels.$ === 'On') {
				return A2($author$project$Label$view, c, wedge.label);
			} else {
				return $elm$svg$Svg$text('');
			}
		}();
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d(
							$author$project$Wedge$triangleToPath(wedge.points)),
							$elm$svg$Svg$Attributes$fill(fill),
							$elm$svg$Svg$Attributes$class('wedge'),
							$elm$svg$Svg$Attributes$class(strokeClass)
						]),
					_List_Nil),
					text
				]));
	});
var $author$project$Hex$view = F4(
	function (palette, labels, _v0, _v1) {
		var x = _v0.x;
		var y = _v0.y;
		var wedges = _v1.wedges;
		var zoom = _v1.zoom;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					A3($author$project$Hex$transform, x, y, zoom)),
					$elm$svg$Svg$Attributes$class('hex')
				]),
			A2(
				$author$project$HexList$indexedMap,
				A2($author$project$Wedge$view, palette, labels),
				wedges));
	});
var $author$project$Main$viewGame = F2(
	function (model, difficulty) {
		var palette = $author$project$Palette$get(model.options.palette);
		var hex4 = A2(
			$author$project$Hex$create,
			1,
			A6($author$project$HexList$HexList, $author$project$Label$Seven, $author$project$Label$Eight, $author$project$Label$Nine, $author$project$Label$Zero, $author$project$Label$One, $author$project$Label$Two));
		var hex3 = A2(
			$author$project$Hex$create,
			1,
			A6($author$project$HexList$HexList, $author$project$Label$Five, $author$project$Label$Six, $author$project$Label$Seven, $author$project$Label$Eight, $author$project$Label$Nine, $author$project$Label$Zero));
		var hex2 = A2(
			$author$project$Hex$create,
			1,
			A6($author$project$HexList$HexList, $author$project$Label$One, $author$project$Label$Two, $author$project$Label$Three, $author$project$Label$Four, $author$project$Label$Five, $author$project$Label$Six));
		var hex1 = A2(
			$author$project$Hex$create,
			1,
			A6($author$project$HexList$HexList, $author$project$Label$Zero, $author$project$Label$One, $author$project$Label$Two, $author$project$Label$Three, $author$project$Label$Four, $author$project$Label$Five));
		return _List_fromArray(
			[
				$author$project$Main$viewBackButton($author$project$Main$DifficultyMenu),
				A4(
				$author$project$Hex$view,
				palette,
				model.options.labelState,
				A2($author$project$Graphics$Point, 80, 30),
				hex1),
				A4(
				$author$project$Hex$view,
				palette,
				model.options.labelState,
				A2($author$project$Graphics$Point, 160, 30),
				hex2),
				A4(
				$author$project$Hex$view,
				palette,
				model.options.labelState,
				A2($author$project$Graphics$Point, 80, 90),
				hex3),
				A4(
				$author$project$Hex$view,
				palette,
				model.options.labelState,
				A2($author$project$Graphics$Point, 160, 90),
				hex4)
			]);
	});
var $author$project$Main$ChangeOption = function (a) {
	return {$: 'ChangeOption', a: a};
};
var $author$project$Title$optionsLetters = _List_fromArray(
	['O', 'P', 'T', 'I', 'O', 'N', 'S']);
var $author$project$Title$optionsPositions = _List_fromArray(
	['83.4', '97.5', '110.3', '120.2', '130.5', '145.4', '158.5']);
var $author$project$Title$options = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$optionsLetters, $author$project$Title$optionsPositions);
var $author$project$Options$SetBackgroundAnimation = function (a) {
	return {$: 'SetBackgroundAnimation', a: a};
};
var $author$project$Options$SetLabelState = function (a) {
	return {$: 'SetLabelState', a: a};
};
var $author$project$Options$SetPalette = function (a) {
	return {$: 'SetPalette', a: a};
};
var $author$project$Options$SetTitleAnimation = function (a) {
	return {$: 'SetTitleAnimation', a: a};
};
var $author$project$Options$animationStateNames = function (onOff) {
	if (onOff.$ === 'On') {
		return 'Animated';
	} else {
		return 'Stopped';
	}
};
var $author$project$Options$Off = {$: 'Off'};
var $author$project$Options$onOffVariants = _List_fromArray(
	[$author$project$Options$On, $author$project$Options$Off]);
var $author$project$Options$animationStates = _Utils_Tuple2($author$project$Options$onOffVariants, $author$project$Options$animationStateNames);
var $author$project$Options$onOffStateNames = function (onOff) {
	if (onOff.$ === 'On') {
		return 'On';
	} else {
		return 'Off';
	}
};
var $author$project$Options$onOffStates = _Utils_Tuple2($author$project$Options$onOffVariants, $author$project$Options$onOffStateNames);
var $author$project$Palette$optionNames = function (option) {
	switch (option.$) {
		case 'Resistors':
			return 'Resistors';
		case 'Material':
			return 'Material';
		case 'ColorBlind':
			return 'Color Blind';
		case 'Grayscale':
			return 'Grayscale';
		case 'AllSame':
			return 'All Same';
		default:
			return 'Transparent';
	}
};
var $author$project$Palette$AllSame = {$: 'AllSame'};
var $author$project$Palette$ColorBlind = {$: 'ColorBlind'};
var $author$project$Palette$Grayscale = {$: 'Grayscale'};
var $author$project$Palette$Resistors = {$: 'Resistors'};
var $author$project$Palette$Transparent = {$: 'Transparent'};
var $author$project$Palette$options = _List_fromArray(
	[$author$project$Palette$Resistors, $author$project$Palette$Material, $author$project$Palette$ColorBlind, $author$project$Palette$Grayscale, $author$project$Palette$AllSame, $author$project$Palette$Transparent]);
var $author$project$Options$palettes = _Utils_Tuple2($author$project$Palette$options, $author$project$Palette$optionNames);
var $author$project$Options$viewHardMode = F2(
	function (palette, onoff) {
		var hardMode = A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat($author$project$Graphics$middle.x)),
					$elm$svg$Svg$Attributes$y('112'),
					$elm$svg$Svg$Attributes$class('text hard-mode')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text('Hard mode unlocked!')
				]));
		var _v0 = _Utils_Tuple2(palette, onoff);
		_v0$2:
		while (true) {
			if (_v0.b.$ === 'Off') {
				switch (_v0.a.$) {
					case 'AllSame':
						var _v1 = _v0.a;
						var _v2 = _v0.b;
						return hardMode;
					case 'Transparent':
						var _v3 = _v0.a;
						var _v4 = _v0.b;
						return hardMode;
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return $elm$svg$Svg$text('');
	});
var $author$project$Label$viewPreview = function (_v0) {
	var x = _v0.x;
	var y = _v0.y;
	return A2(
		$elm$svg$Svg$text_,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('label center'),
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat(x)),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat(y))
			]),
		_List_fromArray(
			[
				$elm$svg$Svg$text('0123456789')
			]));
};
var $author$project$Options$viewLabels = F2(
	function (point, state) {
		if (state.$ === 'On') {
			return $author$project$Label$viewPreview(point);
		} else {
			return $elm$svg$Svg$text('');
		}
	});
var $author$project$Options$nextOption = F2(
	function (current, list) {
		var next = F3(
			function (cur, def, rest) {
				next:
				while (true) {
					if (!rest.b) {
						return def;
					} else {
						if (!rest.b.b) {
							var val = rest.a;
							return def;
						} else {
							var val1 = rest.a;
							var _v1 = rest.b;
							var val2 = _v1.a;
							var vals = _v1.b;
							if (_Utils_eq(cur, val1)) {
								return val2;
							} else {
								var $temp$cur = cur,
									$temp$def = def,
									$temp$rest = A2($elm$core$List$cons, val2, vals);
								cur = $temp$cur;
								def = $temp$def;
								rest = $temp$rest;
								continue next;
							}
						}
					}
				}
			});
		if (!list.b) {
			return current;
		} else {
			var _default = list.a;
			var vals = list.b;
			return A3(next, current, _default, list);
		}
	});
var $author$project$Options$viewOptionName = function (label) {
	return A2(
		$elm$svg$Svg$text_,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('text left'),
				$elm$svg$Svg$Attributes$x('0'),
				$elm$svg$Svg$Attributes$y('0')
			]),
		_List_fromArray(
			[
				$elm$svg$Svg$text(label)
			]));
};
var $author$project$Options$viewOptionValue = F2(
	function (label, msg) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('option left'),
					$elm$svg$Svg$Attributes$x('70'),
					$elm$svg$Svg$Attributes$y('0'),
					$elm$html$Html$Events$onClick(msg)
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(label)
				]));
	});
var $author$project$Options$viewOption = F5(
	function (label, y, _v0, current, msg) {
		var allVals = _v0.a;
		var valToStr = _v0.b;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					'translate(50 ' + ($elm$core$String$fromFloat(y) + ')'))
				]),
			_List_fromArray(
				[
					$author$project$Options$viewOptionName(label),
					A2(
					$author$project$Options$viewOptionValue,
					valToStr(current),
					msg(
						A2($author$project$Options$nextOption, current, allVals)))
				]));
	});
var $author$project$Palette$colors = function (_v0) {
	var zero = _v0.zero;
	var one = _v0.one;
	var two = _v0.two;
	var three = _v0.three;
	var four = _v0.four;
	var five = _v0.five;
	var six = _v0.six;
	var seven = _v0.seven;
	var eight = _v0.eight;
	var nine = _v0.nine;
	return _List_fromArray(
		[zero, one, two, three, four, five, six, seven, eight, nine]);
};
var $author$project$Options$viewColor = F2(
	function (i, color) {
		var w = 7.1;
		var x = A2(
			$elm$core$Basics$modBy,
			5 * $elm$core$Basics$round(w),
			$elm$core$Basics$round(w) * i);
		var y = $elm$core$Basics$round(w) * ((i / 5) | 0);
		return A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromInt(x)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromInt(y)),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(w)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(w)),
					$elm$svg$Svg$Attributes$fill(color)
				]),
			_List_Nil);
	});
var $author$project$Options$viewPalette = F2(
	function (_v0, palette) {
		var x = _v0.x;
		var y = _v0.y;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					'translate(' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y) + ')'))))
				]),
			A2(
				$elm$core$List$indexedMap,
				$author$project$Options$viewColor,
				$author$project$Palette$colors(palette)));
	});
var $author$project$Options$view = F2(
	function (parentMsg, model) {
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A5(
					$author$project$Options$viewOption,
					'Background',
					55,
					$author$project$Options$animationStates,
					model.backgroundAnimation,
					A2($elm$core$Basics$composeR, $author$project$Options$SetBackgroundAnimation, parentMsg)),
					A5(
					$author$project$Options$viewOption,
					'Titles',
					70,
					$author$project$Options$animationStates,
					model.titleAnimation,
					A2($elm$core$Basics$composeR, $author$project$Options$SetTitleAnimation, parentMsg)),
					A5(
					$author$project$Options$viewOption,
					'Color Palette',
					85,
					$author$project$Options$palettes,
					model.palette,
					A2($elm$core$Basics$composeR, $author$project$Options$SetPalette, parentMsg)),
					A2(
					$author$project$Options$viewPalette,
					A2($author$project$Graphics$Point, 172, 76.9),
					$author$project$Palette$get(model.palette)),
					A5(
					$author$project$Options$viewOption,
					'Labels',
					100,
					$author$project$Options$onOffStates,
					model.labelState,
					A2($elm$core$Basics$composeR, $author$project$Options$SetLabelState, parentMsg)),
					A2(
					$author$project$Options$viewLabels,
					A2($author$project$Graphics$Point, 189.5, 100),
					model.labelState),
					A2($author$project$Options$viewHardMode, model.palette, model.labelState)
				]));
	});
var $author$project$Main$viewOptions = function (options) {
	return _List_fromArray(
		[
			A2($author$project$Main$viewTitle, options.titleAnimation, $author$project$Title$options),
			A2($author$project$Options$view, $author$project$Main$ChangeOption, options),
			$author$project$Main$viewBackButton($author$project$Main$TitleScreen)
		]);
};
var $author$project$Title$hexasperateLetters = _List_fromArray(
	['H', 'E', 'X', 'A', 'S', 'P', 'E', 'R', 'A', 'T', 'E']);
var $author$project$Title$hexasperatePositions = _List_fromArray(
	['55', '68', '81.8', '96.9', '110', '122.1', '134.8', '147.5', '161.7', '171.9', '185.5']);
var $author$project$Title$hexasperate = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$hexasperateLetters, $author$project$Title$hexasperatePositions);
var $author$project$Main$viewTitleScreen = function (titleAnimation) {
	return _List_fromArray(
		[
			A2($author$project$Main$viewTitle, titleAnimation, $author$project$Title$hexasperate),
			A3(
			$author$project$Main$viewMenuOption,
			'PLAY',
			A2($author$project$Graphics$Point, $author$project$Graphics$middle.x, 67),
			$author$project$Main$ChangeScene($author$project$Main$DifficultyMenu)),
			A3(
			$author$project$Main$viewMenuOption,
			'OPTIONS',
			A2($author$project$Graphics$Point, $author$project$Graphics$middle.x, 85),
			$author$project$Main$ChangeScene($author$project$Main$OptionsScreen)),
			A3(
			$author$project$Main$viewMenuOption,
			'ABOUT',
			A2($author$project$Graphics$Point, $author$project$Graphics$middle.x, 103),
			$author$project$Main$ChangeScene($author$project$Main$AboutScreen))
		]);
};
var $author$project$Main$viewScene = function (model) {
	var titleCam = $author$project$Main$getSceneCamera($author$project$Main$TitleScreen);
	var optsCam = $author$project$Main$getSceneCamera($author$project$Main$OptionsScreen);
	var game = function () {
		var _v0 = model.scene;
		if (_v0.$ === 'GameBoard') {
			var difficulty = _v0.a;
			var gameCam = $author$project$Main$getSceneCamera(model.scene);
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$transform(
						A2($author$project$Main$translate, gameCam.x, gameCam.y))
					]),
				A2($author$project$Main$viewGame, model, difficulty));
		} else {
			return $elm$svg$Svg$text('');
		}
	}();
	var diffCam = $author$project$Main$getSceneCamera($author$project$Main$DifficultyMenu);
	var aboutCam = $author$project$Main$getSceneCamera($author$project$Main$AboutScreen);
	return _List_fromArray(
		[
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					A2($author$project$Main$translate, titleCam.x, titleCam.y))
				]),
			$author$project$Main$viewTitleScreen(model.options.titleAnimation)),
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					A2($author$project$Main$translate, diffCam.x, diffCam.y))
				]),
			$author$project$Main$viewDifficultyMenu(model.options.titleAnimation)),
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					A2($author$project$Main$translate, optsCam.x, optsCam.y))
				]),
			$author$project$Main$viewOptions(model.options)),
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					A2($author$project$Main$translate, aboutCam.x, aboutCam.y))
				]),
			$author$project$Main$viewAbout(model.options.titleAnimation)),
			game
		]);
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox(
				$author$project$Main$getViewBox(model.viewBox)),
				$elm$svg$Svg$Attributes$id('screen'),
				$elm$svg$Svg$Attributes$preserveAspectRatio('xMidYMid meet'),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.pagePos;
					},
					$author$project$Main$MouseMove))
			]),
		_Utils_ap(
			_List_fromArray(
				[
					$author$project$Main$viewDefs,
					$author$project$Main$viewBackground(model.options.backgroundAnimation)
				]),
			$author$project$Main$viewScene(model)));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));