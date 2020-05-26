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



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
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
var $author$project$BestTimes$BestTimes = F4(
	function (small, medium, large, huge) {
		return {huge: huge, large: large, medium: medium, small: small};
	});
var $author$project$BestTimes$init = A4($author$project$BestTimes$BestTimes, _List_Nil, _List_Nil, _List_Nil, _List_Nil);
var $author$project$Options$BluePurple = {$: 'BluePurple'};
var $author$project$Palette$Material = {$: 'Material'};
var $author$project$Options$On = {$: 'On'};
var $author$project$Options$init = {backgroundAnimation: $author$project$Options$On, backgroundColor: $author$project$Options$BluePurple, backgroundPattern: $author$project$Options$On, labelState: $author$project$Options$On, palette: $author$project$Palette$Material, titleAnimation: $author$project$Options$On};
var $author$project$Puzzle$Small = {$: 'Small'};
var $author$project$Puzzle$Incomplete = {$: 'Incomplete'};
var $author$project$Puzzle$NotDraggedYet = function (a) {
	return {$: 'NotDraggedYet', a: a};
};
var $author$project$Puzzle$NotDragging = {$: 'NotDragging'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = {$: 'SecondButton'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$HexPlacements$empty = $elm$core$Dict$empty;
var $author$project$HexGrid$HexGrid = F3(
	function (a, b, c) {
		return {$: 'HexGrid', a: a, b: b, c: c};
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm_community$list_extra$List$Extra$andThen = $elm$core$List$concatMap;
var $elm_community$list_extra$List$Extra$lift3 = F4(
	function (f, la, lb, lc) {
		return A2(
			$elm_community$list_extra$List$Extra$andThen,
			function (a) {
				return A2(
					$elm_community$list_extra$List$Extra$andThen,
					function (b) {
						return A2(
							$elm_community$list_extra$List$Extra$andThen,
							function (c) {
								return _List_fromArray(
									[
										A3(f, a, b, c)
									]);
							},
							lc);
					},
					lb);
			},
			la);
	});
var $author$project$HexGrid$toAxial = function (_v0) {
	var x = _v0.a;
	var z = _v0.c;
	return _Utils_Tuple2(x, z);
};
var $author$project$HexGrid$inRange = F3(
	function (_v0, _v1, _v2) {
		var minX = _v0.a;
		var maxX = _v0.b;
		var minY = _v1.a;
		var maxY = _v1.b;
		var minZ = _v2.a;
		var maxZ = _v2.b;
		var valid = function (_v3) {
			var x = _v3.a;
			var y = _v3.b;
			var z = _v3.c;
			return !((x + y) + z);
		};
		var cube = F3(
			function (x, y, z) {
				return _Utils_Tuple3(x, y, z);
			});
		var possible = A4(
			$elm_community$list_extra$List$Extra$lift3,
			cube,
			A2($elm$core$List$range, minX, maxX),
			A2($elm$core$List$range, minY, maxY),
			A2($elm$core$List$range, minZ, maxZ));
		var cubes = A2($elm$core$List$filter, valid, possible);
		return A2($elm$core$List$map, $author$project$HexGrid$toAxial, cubes);
	});
var $author$project$HexGrid$create = F3(
	function (zoom, centerPoint, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		var z = _v0.z;
		return A3(
			$author$project$HexGrid$HexGrid,
			zoom,
			centerPoint,
			A3($author$project$HexGrid$inRange, x, y, z));
	});
var $author$project$Graphics$screen = A4($author$project$Graphics$BoundingBox, 0, 0, 240, 135);
var $author$project$Graphics$middle = _Utils_Tuple2($author$project$Graphics$screen.w / 2, $author$project$Graphics$screen.h / 2);
var $author$project$HexGrid$Range = F3(
	function (x, y, z) {
		return {x: x, y: y, z: z};
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Puzzle$rangeFor = function (size) {
	switch (size.$) {
		case 'Small':
			return A3(
				$author$project$HexGrid$Range,
				_Utils_Tuple2(-1, 1),
				_Utils_Tuple2(-1, 1),
				_Utils_Tuple2(-1, 1));
		case 'Medium':
			return A3(
				$author$project$HexGrid$Range,
				_Utils_Tuple2(-2, 2),
				_Utils_Tuple2(-1, 2),
				_Utils_Tuple2(-2, 1));
		case 'Large':
			return A3(
				$author$project$HexGrid$Range,
				_Utils_Tuple2(-2, 2),
				_Utils_Tuple2(-2, 2),
				_Utils_Tuple2(-2, 2));
		default:
			return A3(
				$author$project$HexGrid$Range,
				_Utils_Tuple2(-3, 3),
				_Utils_Tuple2(-3, 3),
				_Utils_Tuple2(-3, 3));
	}
};
var $author$project$Puzzle$zoomFor = function (size) {
	switch (size.$) {
		case 'Small':
			return 1;
		case 'Medium':
			return 0.8;
		case 'Large':
			return 0.7;
		default:
			return 0.5;
	}
};
var $author$project$Puzzle$gridFor = function (size) {
	return A3(
		$author$project$HexGrid$create,
		$author$project$Puzzle$zoomFor(size),
		$author$project$Graphics$middle,
		$author$project$Puzzle$rangeFor(size));
};
var $author$project$HexPositions$init = $mdgriffith$elm_animator$Animator$init($elm$core$Dict$empty);
var $author$project$Timer$init = {
	lastTime: $elm$time$Time$millisToPosix(0),
	running: false,
	time: 0
};
var $author$project$Puzzle$new = function (size) {
	var grid = $author$project$Puzzle$gridFor(size);
	return {
		complete: false,
		drag: $author$project$Puzzle$NotDragging,
		dropTarget: $author$project$Puzzle$NotDraggedYet($author$project$HexPlacements$empty),
		grid: grid,
		groupDragButton: $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton,
		hexes: _List_Nil,
		paused: false,
		placements: $author$project$HexPlacements$empty,
		positions: $author$project$HexPositions$init,
		size: size,
		timer: $author$project$Timer$init,
		verified: $author$project$Puzzle$Incomplete
	};
};
var $author$project$Puzzle$init = $author$project$Puzzle$new($author$project$Puzzle$Small);
var $author$project$Main$TitleScreen = {$: 'TitleScreen'};
var $author$project$Main$initialScene = $author$project$Main$TitleScreen;
var $author$project$Main$initialModel = {
	bestTimes: $author$project$BestTimes$init,
	mousePos: _Utils_Tuple2(0, 0),
	options: $author$project$Options$init,
	puzzle: $author$project$Puzzle$init,
	scene: $mdgriffith$elm_animator$Animator$init($author$project$Main$initialScene),
	svgDimensions: A4($author$project$Graphics$BoundingBox, 0, 0, 0, 0)
};
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2($author$project$Main$initialModel, $author$project$Main$getSvgDimensions);
};
var $author$project$Main$LoadBestTimes = function (a) {
	return {$: 'LoadBestTimes', a: a};
};
var $author$project$Main$OptionMsg = function (a) {
	return {$: 'OptionMsg', a: a};
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
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Main$setPuzzlePositions = F2(
	function (_new, model) {
		var puzzle = model.puzzle;
		var newPuzzle = _Utils_update(
			puzzle,
			{positions: _new});
		return _Utils_update(
			model,
			{puzzle: newPuzzle});
	});
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
	A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.puzzle;
		},
		function ($) {
			return $.positions;
		}),
	$author$project$Main$setPuzzlePositions,
	A3(
		$mdgriffith$elm_animator$Animator$watching,
		function ($) {
			return $.scene;
		},
		F2(
			function (_new, model) {
				return _Utils_update(
					model,
					{scene: _new});
			}),
		$mdgriffith$elm_animator$Animator$animator));
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$map = _Platform_map;
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
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$BestTimes$deserialize = function (json) {
	return A2(
		$elm$json$Json$Decode$decodeValue,
		A5(
			$elm$json$Json$Decode$map4,
			$author$project$BestTimes$BestTimes,
			A2(
				$elm$json$Json$Decode$field,
				'small',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
			A2(
				$elm$json$Json$Decode$field,
				'medium',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
			A2(
				$elm$json$Json$Decode$field,
				'large',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
			A2(
				$elm$json$Json$Decode$field,
				'huge',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$int))),
		json);
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$BestTimes$loadTimes = _Platform_incomingPort('loadTimes', $elm$json$Json$Decode$value);
var $author$project$BestTimes$subscriptions = function (msg) {
	return $author$project$BestTimes$loadTimes(
		A2($elm$core$Basics$composeR, $author$project$BestTimes$deserialize, msg));
};
var $author$project$Options$LoadOptions = function (a) {
	return {$: 'LoadOptions', a: a};
};
var $author$project$Options$Model = F6(
	function (backgroundAnimation, backgroundPattern, backgroundColor, titleAnimation, palette, labelState) {
		return {backgroundAnimation: backgroundAnimation, backgroundColor: backgroundColor, backgroundPattern: backgroundPattern, labelState: labelState, palette: palette, titleAnimation: titleAnimation};
	});
var $author$project$Options$DarkMode = {$: 'DarkMode'};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Options$backgroundColorDecoder = function () {
	var getBgColor = function (val) {
		switch (val) {
			case 'BluePurple':
				return $elm$json$Json$Decode$succeed($author$project$Options$BluePurple);
			case 'DarkMode':
				return $elm$json$Json$Decode$succeed($author$project$Options$DarkMode);
			default:
				return $elm$json$Json$Decode$fail('Invalid Background Color');
		}
	};
	return A2($elm$json$Json$Decode$andThen, getBgColor, $elm$json$Json$Decode$string);
}();
var $elm$json$Json$Decode$map6 = _Json_map6;
var $author$project$Options$Off = {$: 'Off'};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Options$onOffDecoder = function () {
	var boolToOnOff = function (b) {
		return b ? $author$project$Options$On : $author$project$Options$Off;
	};
	return A2($elm$json$Json$Decode$map, boolToOnOff, $elm$json$Json$Decode$bool);
}();
var $author$project$Palette$Classic = {$: 'Classic'};
var $author$project$Palette$ColorBlind = {$: 'ColorBlind'};
var $author$project$Palette$Grayscale = {$: 'Grayscale'};
var $author$project$Palette$Mondrian = {$: 'Mondrian'};
var $author$project$Palette$Resistors = {$: 'Resistors'};
var $author$project$Palette$Transparent = {$: 'Transparent'};
var $author$project$Palette$nameToOption = function (str) {
	switch (str) {
		case 'Resistors':
			return $elm$core$Maybe$Just($author$project$Palette$Resistors);
		case 'Mondrian':
			return $elm$core$Maybe$Just($author$project$Palette$Mondrian);
		case 'Material':
			return $elm$core$Maybe$Just($author$project$Palette$Material);
		case 'Color Blind':
			return $elm$core$Maybe$Just($author$project$Palette$ColorBlind);
		case 'Grayscale':
			return $elm$core$Maybe$Just($author$project$Palette$Grayscale);
		case 'Classic':
			return $elm$core$Maybe$Just($author$project$Palette$Classic);
		case 'Transparent':
			return $elm$core$Maybe$Just($author$project$Palette$Transparent);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Options$paletteDecoder = function () {
	var getPalette = function (val) {
		var _v0 = $author$project$Palette$nameToOption(val);
		if (_v0.$ === 'Just') {
			var palette = _v0.a;
			return $elm$json$Json$Decode$succeed(palette);
		} else {
			return $elm$json$Json$Decode$fail('Invalid Palette');
		}
	};
	return A2($elm$json$Json$Decode$andThen, getPalette, $elm$json$Json$Decode$string);
}();
var $author$project$Options$deserialize = function (json) {
	return A2(
		$elm$json$Json$Decode$decodeValue,
		A7(
			$elm$json$Json$Decode$map6,
			$author$project$Options$Model,
			A2($elm$json$Json$Decode$field, 'backgroundAnimation', $author$project$Options$onOffDecoder),
			A2($elm$json$Json$Decode$field, 'backgroundPattern', $author$project$Options$onOffDecoder),
			A2($elm$json$Json$Decode$field, 'backgroundColor', $author$project$Options$backgroundColorDecoder),
			A2($elm$json$Json$Decode$field, 'titleAnimation', $author$project$Options$onOffDecoder),
			A2($elm$json$Json$Decode$field, 'palette', $author$project$Options$paletteDecoder),
			A2($elm$json$Json$Decode$field, 'labelState', $author$project$Options$onOffDecoder)),
		json);
};
var $author$project$Options$loadOptions = _Platform_incomingPort('loadOptions', $elm$json$Json$Decode$value);
var $author$project$Options$subscriptions = function (_v0) {
	return $author$project$Options$loadOptions(
		A2($elm$core$Basics$composeR, $author$project$Options$deserialize, $author$project$Options$LoadOptions));
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
				A3($mdgriffith$elm_animator$Animator$toSubscription, $author$project$Main$Tick, model, $author$project$Main$animator),
				A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$OptionMsg,
				$author$project$Options$subscriptions(model.options)),
				$author$project$BestTimes$subscriptions($author$project$Main$LoadBestTimes)
			]));
};
var $author$project$Main$ChangeScene = function (a) {
	return {$: 'ChangeScene', a: a};
};
var $author$project$Main$DifficultyMenu = {$: 'DifficultyMenu'};
var $author$project$Main$GameBoard = {$: 'GameBoard'};
var $author$project$Puzzle$MovePointer = function (a) {
	return {$: 'MovePointer', a: a};
};
var $author$project$Puzzle$PauseGame = {$: 'PauseGame'};
var $author$project$Puzzle$StartDragging = F3(
	function (a, b, c) {
		return {$: 'StartDragging', a: a, b: b, c: c};
	});
var $author$project$Puzzle$StartGame = function (a) {
	return {$: 'StartGame', a: a};
};
var $author$project$Puzzle$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $author$project$BestTimes$get = F2(
	function (size, _v0) {
		var small = _v0.small;
		var medium = _v0.medium;
		var large = _v0.large;
		var huge = _v0.huge;
		switch (size.$) {
			case 'Small':
				return small;
			case 'Medium':
				return medium;
			case 'Large':
				return large;
			default:
				return huge;
		}
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$BestTimes$saveTimes = _Platform_outgoingPort('saveTimes', $elm$json$Json$Encode$string);
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$BestTimes$toJson = function (times) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'small',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, times.small)),
				_Utils_Tuple2(
				'medium',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, times.medium)),
				_Utils_Tuple2(
				'large',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, times.large)),
				_Utils_Tuple2(
				'huge',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, times.huge))
			]));
};
var $author$project$BestTimes$serialize = function (times) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$author$project$BestTimes$toJson(times));
};
var $author$project$BestTimes$set = F3(
	function (size, newTimes, times) {
		switch (size.$) {
			case 'Small':
				return _Utils_update(
					times,
					{small: newTimes});
			case 'Medium':
				return _Utils_update(
					times,
					{medium: newTimes});
			case 'Large':
				return _Utils_update(
					times,
					{large: newTimes});
			default:
				return _Utils_update(
					times,
					{huge: newTimes});
		}
	});
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$BestTimes$add = F3(
	function (size, time, times) {
		var withNewTime = A2(
			$elm$core$List$take,
			5,
			$elm$core$List$sort(
				A2(
					$elm$core$List$cons,
					time,
					A2($author$project$BestTimes$get, size, times))));
		var newTimes = A3($author$project$BestTimes$set, size, withNewTime, times);
		return _Utils_Tuple2(
			newTimes,
			$author$project$BestTimes$saveTimes(
				$author$project$BestTimes$serialize(newTimes)));
	});
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
var $ianmackenzie$elm_units$Duration$seconds = function (numSeconds) {
	return $ianmackenzie$elm_units$Quantity$Quantity(numSeconds);
};
var $ianmackenzie$elm_units$Duration$milliseconds = function (numMilliseconds) {
	return $ianmackenzie$elm_units$Duration$seconds(0.001 * numMilliseconds);
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
var $mdgriffith$elm_animator$Internal$Timeline$pass = F7(
	function (_v0, _v1, target, _v2, _v3, _v4, _v5) {
		return target;
	});
var $mdgriffith$elm_animator$Internal$Timeline$current = function (timeline) {
	var details = timeline.a;
	return A3(
		$mdgriffith$elm_animator$Internal$Timeline$foldp,
		$elm$core$Basics$identity,
		{
			adjustor: function (_v0) {
				return {arrivingEarly: 0, leavingLate: 0};
			},
			after: F3(
				function (lookup, target, future) {
					return $mdgriffith$elm_animator$Internal$Timeline$getEvent(target);
				}),
			dwellFor: F2(
				function (cur, duration) {
					return cur;
				}),
			dwellPeriod: function (_v1) {
				return $elm$core$Maybe$Nothing;
			},
			lerp: $mdgriffith$elm_animator$Internal$Timeline$pass,
			start: function (_v2) {
				return details.initial;
			}
		},
		timeline);
};
var $mdgriffith$elm_animator$Animator$current = $mdgriffith$elm_animator$Internal$Timeline$current;
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
		case 'AboutScreen':
			return _Utils_update(
				screen,
				{y: 1.2 * screen.h});
		case 'LicenseScreen':
			return _Utils_update(
				screen,
				{x: (-1.2) * screen.w, y: 1.2 * screen.h});
		case 'BestTimes':
			return _Utils_update(
				screen,
				{y: (-1.2) * screen.h});
		default:
			return _Utils_update(
				screen,
				{x: 1.2 * screen.w, y: 1.2 * screen.h});
	}
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
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$PausePuzzle = {$: 'PausePuzzle'};
var $author$project$Main$PuzzleMsg = function (a) {
	return {$: 'PuzzleMsg', a: a};
};
var $author$project$Main$PuzzleReady = function (a) {
	return {$: 'PuzzleReady', a: a};
};
var $author$project$Main$PuzzleSolved = F2(
	function (a, b) {
		return {$: 'PuzzleSolved', a: a, b: b};
	});
var $author$project$Main$StartDraggingHex = F3(
	function (a, b, c) {
		return {$: 'StartDraggingHex', a: a, b: b, c: c};
	});
var $author$project$Puzzle$translator = F2(
	function (_v0, msg) {
		var onInternalMsg = _v0.onInternalMsg;
		var onPuzzleReady = _v0.onPuzzleReady;
		var onStartDraggingHex = _v0.onStartDraggingHex;
		var onPausePuzzle = _v0.onPausePuzzle;
		var onPuzzleSolved = _v0.onPuzzleSolved;
		if (msg.$ === 'ForSelf') {
			var internal = msg.a;
			return onInternalMsg(internal);
		} else {
			switch (msg.a.$) {
				case 'PuzzleReady':
					var model = msg.a.a;
					return onPuzzleReady(model);
				case 'StartDraggingHex':
					var _v2 = msg.a;
					var hex = _v2.a;
					var button = _v2.b;
					var pagePos = _v2.c;
					return A3(onStartDraggingHex, hex, button, pagePos);
				case 'PausePuzzle':
					var _v3 = msg.a;
					return onPausePuzzle;
				default:
					var _v4 = msg.a;
					var size = _v4.a;
					var time = _v4.b;
					return A2(onPuzzleSolved, size, time);
			}
		}
	});
var $author$project$Main$puzzleTranslator = $author$project$Puzzle$translator(
	{onInternalMsg: $author$project$Main$PuzzleMsg, onPausePuzzle: $author$project$Main$PausePuzzle, onPuzzleReady: $author$project$Main$PuzzleReady, onPuzzleSolved: $author$project$Main$PuzzleSolved, onStartDraggingHex: $author$project$Main$StartDraggingHex});
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
		return _Utils_Tuple2(newX, newY);
	});
var $mdgriffith$elm_animator$Animator$slowly = $mdgriffith$elm_animator$Animator$millis(400);
var $mdgriffith$elm_animator$Animator$update = F3(
	function (newTime, _v0, model) {
		var updateModel = _v0.b;
		return A2(updateModel, newTime, model);
	});
var $author$project$Options$saveOptions = _Platform_outgoingPort('saveOptions', $elm$json$Json$Encode$string);
var $author$project$Options$encodeBackgroundColor = function (backgroundColor) {
	if (backgroundColor.$ === 'BluePurple') {
		return $elm$json$Json$Encode$string('BluePurple');
	} else {
		return $elm$json$Json$Encode$string('DarkMode');
	}
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Options$encodeOnOff = function (onOff) {
	if (onOff.$ === 'On') {
		return $elm$json$Json$Encode$bool(true);
	} else {
		return $elm$json$Json$Encode$bool(false);
	}
};
var $author$project$Palette$optionNames = function (option) {
	switch (option.$) {
		case 'Resistors':
			return 'Resistors';
		case 'Mondrian':
			return 'Mondrian';
		case 'Material':
			return 'Material';
		case 'ColorBlind':
			return 'Color Blind';
		case 'Grayscale':
			return 'Grayscale';
		case 'Classic':
			return 'Classic';
		default:
			return 'Transparent';
	}
};
var $author$project$Options$encodePalette = function (palette) {
	return $elm$json$Json$Encode$string(
		$author$project$Palette$optionNames(palette));
};
var $author$project$Options$toJson = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'backgroundAnimation',
				$author$project$Options$encodeOnOff(model.backgroundAnimation)),
				_Utils_Tuple2(
				'backgroundPattern',
				$author$project$Options$encodeOnOff(model.backgroundPattern)),
				_Utils_Tuple2(
				'backgroundColor',
				$author$project$Options$encodeBackgroundColor(model.backgroundColor)),
				_Utils_Tuple2(
				'titleAnimation',
				$author$project$Options$encodeOnOff(model.titleAnimation)),
				_Utils_Tuple2(
				'palette',
				$author$project$Options$encodePalette(model.palette)),
				_Utils_Tuple2(
				'labelState',
				$author$project$Options$encodeOnOff(model.labelState))
			]));
};
var $author$project$Options$serialize = function (model) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$author$project$Options$toJson(model));
};
var $author$project$Options$update = F2(
	function (msg, model) {
		var newModel = function () {
			switch (msg.$) {
				case 'SetBackgroundAnimation':
					var state = msg.a;
					return _Utils_update(
						model,
						{backgroundAnimation: state});
				case 'SetBackgroundPattern':
					var state = msg.a;
					return _Utils_update(
						model,
						{backgroundPattern: state});
				case 'SetBackgroundColor':
					var state = msg.a;
					return _Utils_update(
						model,
						{backgroundColor: state});
				case 'SetTitleAnimation':
					var state = msg.a;
					return _Utils_update(
						model,
						{titleAnimation: state});
				case 'SetPalette':
					var state = msg.a;
					return _Utils_update(
						model,
						{palette: state});
				case 'SetLabelState':
					var state = msg.a;
					return _Utils_update(
						model,
						{labelState: state});
				default:
					var result = msg.a;
					if (result.$ === 'Err') {
						var err = result.a;
						var _v3 = A2($elm$core$Debug$log, 'Error loading options', err);
						return model;
					} else {
						var loadedOptions = result.a;
						return loadedOptions;
					}
			}
		}();
		var cmd = function () {
			if (msg.$ === 'LoadOptions') {
				return $elm$core$Platform$Cmd$none;
			} else {
				return $author$project$Options$saveOptions(
					$author$project$Options$serialize(newModel));
			}
		}();
		return _Utils_Tuple2(newModel, cmd);
	});
var $author$project$Puzzle$EndGame = {$: 'EndGame'};
var $author$project$Puzzle$GridCell = function (a) {
	return {$: 'GridCell', a: a};
};
var $author$project$Puzzle$OffGrid = {$: 'OffGrid'};
var $author$project$Puzzle$VerifyPuzzle = {$: 'VerifyPuzzle'};
var $author$project$Puzzle$ForSelf = function (a) {
	return {$: 'ForSelf', a: a};
};
var $author$project$Puzzle$Ready = function (a) {
	return {$: 'Ready', a: a};
};
var $mdgriffith$elm_animator$Animator$immediately = $mdgriffith$elm_animator$Animator$millis(0);
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $mdgriffith$elm_animator$Animator$queue = F2(
	function (steps, _v0) {
		var tl = _v0.a;
		return $mdgriffith$elm_animator$Internal$Timeline$Timeline(
			_Utils_update(
				tl,
				{
					queued: function () {
						var _v1 = tl.queued;
						if (_v1.$ === 'Nothing') {
							var _v2 = A2(
								$mdgriffith$elm_animator$Animator$initializeSchedule,
								$mdgriffith$elm_animator$Animator$millis(0),
								steps);
							if (_v2.$ === 'Nothing') {
								return tl.queued;
							} else {
								var _v3 = _v2.a;
								var schedule = _v3.a;
								var otherSteps = _v3.b;
								return $elm$core$Maybe$Just(
									A3($elm$core$List$foldl, $mdgriffith$elm_animator$Animator$stepsToEvents, schedule, otherSteps));
							}
						} else {
							var queued = _v1.a;
							return $elm$core$Maybe$Just(
								A3($elm$core$List$foldl, $mdgriffith$elm_animator$Animator$stepsToEvents, queued, steps));
						}
					}(),
					running: true
				}));
	});
var $mdgriffith$elm_animator$Animator$Wait = function (a) {
	return {$: 'Wait', a: a};
};
var $mdgriffith$elm_animator$Animator$wait = $mdgriffith$elm_animator$Animator$Wait;
var $author$project$HexPositions$glideAll = F6(
	function (hexes, from, to, glideDelay, glideDuration, dict) {
		var ids = A2(
			$elm$core$List$map,
			function ($) {
				return $.id;
			},
			hexes);
		var current = $mdgriffith$elm_animator$Animator$current(dict);
		var next = A2(
			$elm$core$Dict$union,
			$elm$core$Dict$fromList(
				A3($elm$core$List$map2, $elm$core$Tuple$pair, ids, from)),
			current);
		var last = A2(
			$elm$core$Dict$union,
			$elm$core$Dict$fromList(
				A3($elm$core$List$map2, $elm$core$Tuple$pair, ids, to)),
			next);
		return A2(
			$mdgriffith$elm_animator$Animator$queue,
			_List_fromArray(
				[
					A2($mdgriffith$elm_animator$Animator$event, $mdgriffith$elm_animator$Animator$immediately, next),
					$mdgriffith$elm_animator$Animator$wait(
					$mdgriffith$elm_animator$Animator$millis(glideDelay)),
					A2(
					$mdgriffith$elm_animator$Animator$event,
					$mdgriffith$elm_animator$Animator$millis(glideDuration),
					last)
				]),
			dict);
	});
var $author$project$Puzzle$glideDurationFor = function (size) {
	switch (size.$) {
		case 'Small':
			return 1250;
		case 'Medium':
			return 2000;
		case 'Large':
			return 2750;
		default:
			return 4500;
	}
};
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
var $author$project$Puzzle$scale = F2(
	function (zoom, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(x / zoom, y / zoom);
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$HexGrid$root3 = $elm$core$Basics$sqrt(3);
var $author$project$HexGrid$toPoint = F2(
	function (zoom, _v0) {
		var q = _v0.a;
		var r = _v0.b;
		return _Utils_Tuple2(((zoom * q) * 3) / 2, zoom * ((($author$project$HexGrid$root3 * q) / 2) + ($author$project$HexGrid$root3 * r)));
	});
var $author$project$HexGrid$gridCenter = F2(
	function (zoom, axs) {
		var points = A2(
			$elm$core$List$map,
			$author$project$HexGrid$toPoint(zoom),
			axs);
		var minY = $elm$core$List$minimum(
			A2($elm$core$List$map, $elm$core$Tuple$second, points));
		var minX = $elm$core$List$minimum(
			A2($elm$core$List$map, $elm$core$Tuple$first, points));
		var maxY = $elm$core$List$maximum(
			A2($elm$core$List$map, $elm$core$Tuple$second, points));
		var maxX = $elm$core$List$maximum(
			A2($elm$core$List$map, $elm$core$Tuple$first, points));
		return _Utils_Tuple2(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A3($elm$core$Maybe$map2, $elm$core$Basics$add, maxX, minX)) / 2,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A3($elm$core$Maybe$map2, $elm$core$Basics$add, maxY, minY)) / 2);
	});
var $author$project$HexGrid$absolutePoint = F3(
	function (puzzleZoom, ax, _v0) {
		var zoom = _v0.a;
		var _v1 = _v0.b;
		var sceneCx = _v1.a;
		var sceneCy = _v1.b;
		var axs = _v0.c;
		var _v2 = A2($author$project$HexGrid$toPoint, 20 * zoom, ax);
		var hexCx = _v2.a;
		var hexCy = _v2.b;
		var _v3 = A2($author$project$HexGrid$gridCenter, 20 * zoom, axs);
		var gridCx = _v3.a;
		var gridCy = _v3.b;
		return _Utils_Tuple2(((sceneCx + hexCx) - gridCx) / puzzleZoom, ((sceneCy + hexCy) - gridCy) / puzzleZoom);
	});
var $author$project$Puzzle$startingPositionsFor = function (size) {
	var _v0 = function () {
		switch (size.$) {
			case 'Small':
				return _Utils_Tuple2(
					A3(
						$author$project$HexGrid$create,
						1.1,
						$author$project$Graphics$middle,
						A3(
							$author$project$HexGrid$Range,
							_Utils_Tuple2(-3, 3),
							_Utils_Tuple2(-3, 3),
							_Utils_Tuple2(-3, 3))),
					_List_fromArray(
						[
							_Utils_Tuple2(-3, 1),
							_Utils_Tuple2(-2, 0),
							_Utils_Tuple2(2, -2),
							_Utils_Tuple2(3, -2),
							_Utils_Tuple2(-3, 2),
							_Utils_Tuple2(-2, 1),
							_Utils_Tuple2(2, -1)
						]));
			case 'Medium':
				return _Utils_Tuple2(
					A3(
						$author$project$HexGrid$create,
						0.85,
						$author$project$Graphics$middle,
						A3(
							$author$project$HexGrid$Range,
							_Utils_Tuple2(-4, 4),
							_Utils_Tuple2(-3, 4),
							_Utils_Tuple2(-4, 3))),
					_List_fromArray(
						[
							_Utils_Tuple2(-2, -1),
							_Utils_Tuple2(2, -3),
							_Utils_Tuple2(-4, 1),
							_Utils_Tuple2(-3, 0),
							_Utils_Tuple2(3, -3),
							_Utils_Tuple2(4, -3),
							_Utils_Tuple2(-4, 2),
							_Utils_Tuple2(-3, 1),
							_Utils_Tuple2(3, -2),
							_Utils_Tuple2(4, -2),
							_Utils_Tuple2(-3, 2),
							_Utils_Tuple2(3, -1),
							_Utils_Tuple2(-2, 2),
							_Utils_Tuple2(2, 0)
						]));
			case 'Large':
				return _Utils_Tuple2(
					A3(
						$author$project$HexGrid$create,
						0.75,
						$author$project$Graphics$middle,
						A3(
							$author$project$HexGrid$Range,
							_Utils_Tuple2(-4, 4),
							_Utils_Tuple2(-4, 4),
							_Utils_Tuple2(-4, 4))),
					_List_fromArray(
						[
							_Utils_Tuple2(-2, -1),
							_Utils_Tuple2(2, -3),
							_Utils_Tuple2(4, -4),
							_Utils_Tuple2(-4, 1),
							_Utils_Tuple2(-3, 0),
							_Utils_Tuple2(3, -3),
							_Utils_Tuple2(4, -3),
							_Utils_Tuple2(-4, 2),
							_Utils_Tuple2(-3, 1),
							_Utils_Tuple2(3, -2),
							_Utils_Tuple2(4, -2),
							_Utils_Tuple2(-4, 3),
							_Utils_Tuple2(-3, 2),
							_Utils_Tuple2(3, -1),
							_Utils_Tuple2(4, -1),
							_Utils_Tuple2(-3, 3),
							_Utils_Tuple2(3, 0),
							_Utils_Tuple2(-2, 3),
							_Utils_Tuple2(2, 1)
						]));
			default:
				return _Utils_Tuple2(
					A3(
						$author$project$HexGrid$create,
						0.55,
						$author$project$Graphics$middle,
						A3(
							$author$project$HexGrid$Range,
							_Utils_Tuple2(-4, 4),
							_Utils_Tuple2(-4, 4),
							_Utils_Tuple2(-4, 4))),
					_List_fromArray(
						[
							_Utils_Tuple2(-4, -1),
							_Utils_Tuple2(4, -5),
							_Utils_Tuple2(6, -6),
							_Utils_Tuple2(-6, 1),
							_Utils_Tuple2(-5, 0),
							_Utils_Tuple2(-4, 0),
							_Utils_Tuple2(-3, -1),
							_Utils_Tuple2(3, -4),
							_Utils_Tuple2(4, -4),
							_Utils_Tuple2(5, -5),
							_Utils_Tuple2(6, -5),
							_Utils_Tuple2(-6, 2),
							_Utils_Tuple2(-5, 1),
							_Utils_Tuple2(-4, 1),
							_Utils_Tuple2(4, -3),
							_Utils_Tuple2(5, -4),
							_Utils_Tuple2(6, -4),
							_Utils_Tuple2(-6, 3),
							_Utils_Tuple2(-5, 2),
							_Utils_Tuple2(-4, 2),
							_Utils_Tuple2(4, -2),
							_Utils_Tuple2(5, -3),
							_Utils_Tuple2(6, -3),
							_Utils_Tuple2(-6, 4),
							_Utils_Tuple2(-5, 3),
							_Utils_Tuple2(-4, 3),
							_Utils_Tuple2(4, -1),
							_Utils_Tuple2(5, -2),
							_Utils_Tuple2(6, -2),
							_Utils_Tuple2(-6, 5),
							_Utils_Tuple2(-5, 4),
							_Utils_Tuple2(-4, 4),
							_Utils_Tuple2(-3, 4),
							_Utils_Tuple2(4, 0),
							_Utils_Tuple2(5, -1),
							_Utils_Tuple2(6, -1),
							_Utils_Tuple2(3, 1)
						]));
		}
	}();
	var grid = _v0.a;
	var axs = _v0.b;
	return A2(
		$elm$core$List$map,
		function (a) {
			return A3(
				$author$project$HexGrid$absolutePoint,
				$author$project$Puzzle$zoomFor(size),
				a,
				grid);
		},
		axs);
};
var $author$project$Puzzle$assignPositionsAndStart = F2(
	function (model, hexes) {
		var size = model.size;
		var start = A2(
			$elm$core$List$repeat,
			$elm$core$List$length(hexes),
			A2(
				$author$project$Puzzle$scale,
				$author$project$Puzzle$zoomFor(size),
				$author$project$Graphics$middle));
		var points = $author$project$Puzzle$startingPositionsFor(size);
		var positions = A6(
			$author$project$HexPositions$glideAll,
			hexes,
			start,
			points,
			750,
			$author$project$Puzzle$glideDurationFor(size),
			model.positions);
		var newModel = _Utils_update(
			model,
			{hexes: hexes, positions: positions});
		return $author$project$Puzzle$ForSelf(
			$author$project$Puzzle$Ready(newModel));
	});
var $author$project$Label$Zero = {$: 'Zero'};
var $author$project$HexList$get = F2(
	function (index, _v0) {
		var i = _v0.i;
		var ii = _v0.ii;
		var iii = _v0.iii;
		var iv = _v0.iv;
		var v = _v0.v;
		var vi = _v0.vi;
		switch (index.$) {
			case 'I':
				return i;
			case 'II':
				return ii;
			case 'III':
				return iii;
			case 'IV':
				return iv;
			case 'V':
				return v;
			default:
				return vi;
		}
	});
var $author$project$HexList$I = {$: 'I'};
var $author$project$HexList$II = {$: 'II'};
var $author$project$HexList$III = {$: 'III'};
var $author$project$HexList$IV = {$: 'IV'};
var $author$project$HexList$V = {$: 'V'};
var $author$project$HexList$VI = {$: 'VI'};
var $author$project$HexList$indices = _List_fromArray(
	[$author$project$HexList$I, $author$project$HexList$II, $author$project$HexList$III, $author$project$HexList$IV, $author$project$HexList$V, $author$project$HexList$VI]);
var $author$project$HexList$HexList = F6(
	function (i, ii, iii, iv, v, vi) {
		return {i: i, ii: ii, iii: iii, iv: iv, v: v, vi: vi};
	});
var $author$project$HexList$repeat = function (val) {
	return A6($author$project$HexList$HexList, val, val, val, val, val, val);
};
var $author$project$HexList$set = F3(
	function (i, val, list) {
		switch (i.$) {
			case 'I':
				return _Utils_update(
					list,
					{i: val});
			case 'II':
				return _Utils_update(
					list,
					{ii: val});
			case 'III':
				return _Utils_update(
					list,
					{iii: val});
			case 'IV':
				return _Utils_update(
					list,
					{iv: val});
			case 'V':
				return _Utils_update(
					list,
					{v: val});
			default:
				return _Utils_update(
					list,
					{vi: val});
		}
	});
var $author$project$HexList$absorb = F3(
	function (sourceList, defaultValue, imperfectList) {
		var setIndex = F4(
			function (indexes, source, imperfect, perfect) {
				setIndex:
				while (true) {
					if (!indexes.b) {
						return _Utils_Tuple2(perfect, source);
					} else {
						var idx = indexes.a;
						var idxs = indexes.b;
						var _v1 = A2($author$project$HexList$get, idx, imperfect);
						if (_v1.$ === 'Just') {
							var val = _v1.a;
							var $temp$indexes = idxs,
								$temp$source = source,
								$temp$imperfect = imperfect,
								$temp$perfect = A3($author$project$HexList$set, idx, val, perfect);
							indexes = $temp$indexes;
							source = $temp$source;
							imperfect = $temp$imperfect;
							perfect = $temp$perfect;
							continue setIndex;
						} else {
							if (!source.b) {
								var $temp$indexes = idxs,
									$temp$source = source,
									$temp$imperfect = imperfect,
									$temp$perfect = perfect;
								indexes = $temp$indexes;
								source = $temp$source;
								imperfect = $temp$imperfect;
								perfect = $temp$perfect;
								continue setIndex;
							} else {
								var src = source.a;
								var srcs = source.b;
								var $temp$indexes = idxs,
									$temp$source = srcs,
									$temp$imperfect = imperfect,
									$temp$perfect = A3($author$project$HexList$set, idx, src, perfect);
								indexes = $temp$indexes;
								source = $temp$source;
								imperfect = $temp$imperfect;
								perfect = $temp$perfect;
								continue setIndex;
							}
						}
					}
				}
			});
		return A4(
			setIndex,
			$author$project$HexList$indices,
			sourceList,
			imperfectList,
			$author$project$HexList$repeat(defaultValue));
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Hex$Hex = F3(
	function (id, wedges, outline) {
		return {id: id, outline: outline, wedges: wedges};
	});
var $author$project$Hex$Triangle = F3(
	function (a, b, c) {
		return {$: 'Triangle', a: a, b: b, c: c};
	});
var $elm$core$Basics$cos = _Basics_cos;
var $author$project$Hex$Wedge = F3(
	function (label, points, path) {
		return {label: label, path: path, points: points};
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$StrUtil$spaceDelimit2 = F2(
	function (x, y) {
		return $elm$core$String$fromFloat(x) + (' ' + $elm$core$String$fromFloat(y));
	});
var $author$project$StrUtil$simplePath = function (coords) {
	var apply = F2(
		function (fn, _v0) {
			var x = _v0.a;
			var y = _v0.b;
			return A2(fn, x, y);
		});
	return 'M ' + (A2(
		$elm$core$String$join,
		' L ',
		A2(
			$elm$core$List$map,
			apply($author$project$StrUtil$spaceDelimit2),
			coords)) + ' Z');
};
var $author$project$Hex$createWedge = F2(
	function (label, points) {
		var a = points.a;
		var b = points.b;
		var c = points.c;
		return A3(
			$author$project$Hex$Wedge,
			label,
			points,
			$author$project$StrUtil$simplePath(
				_List_fromArray(
					[a, b, c])));
	});
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$sin = _Basics_sin;
var $author$project$HexList$toList = function (_v0) {
	var i = _v0.i;
	var ii = _v0.ii;
	var iii = _v0.iii;
	var iv = _v0.iv;
	var v = _v0.v;
	var vi = _v0.vi;
	return _List_fromArray(
		[i, ii, iii, iv, v, vi]);
};
var $author$project$Hex$create = F2(
	function (id, labels) {
		var si = 20 * $elm$core$Basics$sin($elm$core$Basics$pi / 3);
		var co = 20 * $elm$core$Basics$cos($elm$core$Basics$pi / 3);
		var coords = A6(
			$author$project$HexList$HexList,
			_Utils_Tuple2(20, 0),
			_Utils_Tuple2(co, -si),
			_Utils_Tuple2(-co, -si),
			_Utils_Tuple2(-20, 0),
			_Utils_Tuple2(-co, si),
			_Utils_Tuple2(co, si));
		var wedges = A6(
			$author$project$HexList$HexList,
			A2(
				$author$project$Hex$createWedge,
				labels.i,
				A3(
					$author$project$Hex$Triangle,
					_Utils_Tuple2(0, 0),
					coords.i,
					coords.ii)),
			A2(
				$author$project$Hex$createWedge,
				labels.ii,
				A3(
					$author$project$Hex$Triangle,
					_Utils_Tuple2(0, 0),
					coords.ii,
					coords.iii)),
			A2(
				$author$project$Hex$createWedge,
				labels.iii,
				A3(
					$author$project$Hex$Triangle,
					_Utils_Tuple2(0, 0),
					coords.iii,
					coords.iv)),
			A2(
				$author$project$Hex$createWedge,
				labels.iv,
				A3(
					$author$project$Hex$Triangle,
					_Utils_Tuple2(0, 0),
					coords.iv,
					coords.v)),
			A2(
				$author$project$Hex$createWedge,
				labels.v,
				A3(
					$author$project$Hex$Triangle,
					_Utils_Tuple2(0, 0),
					coords.v,
					coords.vi)),
			A2(
				$author$project$Hex$createWedge,
				labels.vi,
				A3(
					$author$project$Hex$Triangle,
					_Utils_Tuple2(0, 0),
					coords.vi,
					coords.i)));
		return A3(
			$author$project$Hex$Hex,
			id,
			wedges,
			$author$project$StrUtil$simplePath(
				$author$project$HexList$toList(coords)));
	});
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $author$project$Puzzle$getHexIfExists = F2(
	function (knownCells, cell) {
		var partitioned = A2(
			$elm$core$List$partition,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$first,
				$elm$core$Basics$eq(cell)),
			knownCells);
		if (partitioned.a.b) {
			var _v1 = partitioned.a;
			var x = _v1.a;
			return $elm$core$Maybe$Just(x.b);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$HexList$invert = function (i) {
	switch (i.$) {
		case 'I':
			return $author$project$HexList$IV;
		case 'II':
			return $author$project$HexList$V;
		case 'III':
			return $author$project$HexList$VI;
		case 'IV':
			return $author$project$HexList$I;
		case 'V':
			return $author$project$HexList$II;
		default:
			return $author$project$HexList$III;
	}
};
var $author$project$Puzzle$getMatchingLabel = F2(
	function (index, hex) {
		var wedge = A2(
			$author$project$HexList$get,
			$author$project$HexList$invert(index),
			hex.wedges);
		return wedge.label;
	});
var $author$project$HexList$indexedMap = F2(
	function (fn, _v0) {
		var i = _v0.i;
		var ii = _v0.ii;
		var iii = _v0.iii;
		var iv = _v0.iv;
		var v = _v0.v;
		var vi = _v0.vi;
		return A6(
			$author$project$HexList$HexList,
			A2(fn, $author$project$HexList$I, i),
			A2(fn, $author$project$HexList$II, ii),
			A2(fn, $author$project$HexList$III, iii),
			A2(fn, $author$project$HexList$IV, iv),
			A2(fn, $author$project$HexList$V, v),
			A2(fn, $author$project$HexList$VI, vi));
	});
var $author$project$HexList$map = F2(
	function (fn, _v0) {
		var i = _v0.i;
		var ii = _v0.ii;
		var iii = _v0.iii;
		var iv = _v0.iv;
		var v = _v0.v;
		var vi = _v0.vi;
		return A6(
			$author$project$HexList$HexList,
			fn(i),
			fn(ii),
			fn(iii),
			fn(iv),
			fn(v),
			fn(vi));
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$HexGrid$neighbors = F2(
	function (_v0, _v1) {
		var q = _v0.a;
		var r = _v0.b;
		var axs = _v1.c;
		var filterOutOfBounds = function (ax) {
			return A2($elm$core$List$member, ax, axs) ? $elm$core$Maybe$Just(ax) : $elm$core$Maybe$Nothing;
		};
		return A6(
			$author$project$HexList$HexList,
			filterOutOfBounds(
				_Utils_Tuple2(q + 1, r - 1)),
			filterOutOfBounds(
				_Utils_Tuple2(q, r - 1)),
			filterOutOfBounds(
				_Utils_Tuple2(q - 1, r)),
			filterOutOfBounds(
				_Utils_Tuple2(q - 1, r + 1)),
			filterOutOfBounds(
				_Utils_Tuple2(q, r + 1)),
			filterOutOfBounds(
				_Utils_Tuple2(q + 1, r)));
	});
var $author$project$Puzzle$addHexToGrid = F5(
	function (grid, hexIds, labels, axials, hexes) {
		addHexToGrid:
		while (true) {
			var _v0 = _Utils_Tuple2(hexIds, axials);
			if (_v0.a.b && _v0.b.b) {
				var _v1 = _v0.a;
				var id = _v1.a;
				var ids = _v1.b;
				var _v2 = _v0.b;
				var ax = _v2.a;
				var axs = _v2.b;
				var mNeighbors = A2(
					$author$project$HexList$map,
					$elm$core$Maybe$andThen(
						$author$project$Puzzle$getHexIfExists(hexes)),
					A2($author$project$HexGrid$neighbors, ax, grid));
				var knownWedges = A2(
					$author$project$HexList$indexedMap,
					F2(
						function (i, h) {
							return A2(
								$elm$core$Maybe$map,
								$author$project$Puzzle$getMatchingLabel(i),
								h);
						}),
					mNeighbors);
				var _v3 = A3($author$project$HexList$absorb, labels, $author$project$Label$Zero, knownWedges);
				var wedges = _v3.a;
				var labs = _v3.b;
				var hex = A2($author$project$Hex$create, id, wedges);
				var $temp$grid = grid,
					$temp$hexIds = ids,
					$temp$labels = labs,
					$temp$axials = axs,
					$temp$hexes = A2(
					$elm$core$List$cons,
					_Utils_Tuple2(ax, hex),
					hexes);
				grid = $temp$grid;
				hexIds = $temp$hexIds;
				labels = $temp$labels;
				axials = $temp$axials;
				hexes = $temp$hexes;
				continue addHexToGrid;
			} else {
				return hexes;
			}
		}
	});
var $author$project$HexGrid$cells = function (_v0) {
	var axs = _v0.c;
	return axs;
};
var $author$project$Puzzle$createHexes = F3(
	function (labelList, hexIds, _v0) {
		var grid = _v0.grid;
		var size = _v0.size;
		return A5(
			$author$project$Puzzle$addHexToGrid,
			grid,
			hexIds,
			labelList,
			$author$project$HexGrid$cells(grid),
			_List_Nil);
	});
var $elm$random$Random$Generate = function (a) {
	return {$: 'Generate', a: a};
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v1 = genA(seed0);
				var a = _v1.a;
				var seed1 = _v1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0.a;
		return $elm$random$Random$Generate(
			A2($elm$random$Random$map, func, generator));
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			$elm$random$Random$Generate(
				A2($elm$random$Random$map, tagger, generator)));
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
			});
	});
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $owanturist$elm_union_find$UnionFind$findFast = F2(
	function (id, dict) {
		findFast:
		while (true) {
			var _v0 = A2($elm$core$Dict$get, id, dict);
			if (_v0.$ === 'Nothing') {
				return id;
			} else {
				var cursor = _v0.a;
				if (_Utils_eq(id, cursor)) {
					return id;
				} else {
					var $temp$id = cursor,
						$temp$dict = dict;
					id = $temp$id;
					dict = $temp$dict;
					continue findFast;
				}
			}
		}
	});
var $owanturist$elm_union_find$UnionFind$find = F2(
	function (id, _v0) {
		var dict = _v0.b;
		return A2($owanturist$elm_union_find$UnionFind$findFast, id, dict);
	});
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Array$isEmpty = function (_v0) {
	var len = _v0.a;
	return !len;
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $owanturist$elm_union_find$UnionFind$QuickUnionPathCompression = F2(
	function (a, b) {
		return {$: 'QuickUnionPathCompression', a: a, b: b};
	});
var $owanturist$elm_union_find$UnionFind$quickUnionPathCompression = A2($owanturist$elm_union_find$UnionFind$QuickUnionPathCompression, 0, $elm$core$Dict$empty);
var $owanturist$elm_union_find$UnionFind$findCompressed = F2(
	function (id, dict) {
		var _v0 = A2($elm$core$Dict$get, id, dict);
		if (_v0.$ === 'Nothing') {
			return _Utils_Tuple2(
				id,
				A3($elm$core$Dict$insert, id, id, dict));
		} else {
			var cursor = _v0.a;
			if (_Utils_eq(id, cursor)) {
				return _Utils_Tuple2(id, dict);
			} else {
				var _v1 = A2($owanturist$elm_union_find$UnionFind$findCompressed, cursor, dict);
				var parent = _v1.a;
				var nextDict = _v1.b;
				return _Utils_Tuple2(
					parent,
					A3($elm$core$Dict$insert, id, parent, nextDict));
			}
		}
	});
var $owanturist$elm_union_find$UnionFind$union = F3(
	function (left, right, _v0) {
		var count_ = _v0.a;
		var dict = _v0.b;
		var _v1 = A2($owanturist$elm_union_find$UnionFind$findCompressed, left, dict);
		var leftRoot = _v1.a;
		var leftDict = _v1.b;
		var _v2 = A2($owanturist$elm_union_find$UnionFind$findCompressed, right, leftDict);
		var rightRoot = _v2.a;
		var rightDict = _v2.b;
		return _Utils_eq(leftRoot, rightRoot) ? A2($owanturist$elm_union_find$UnionFind$QuickUnionPathCompression, count_, rightDict) : A2(
			$owanturist$elm_union_find$UnionFind$QuickUnionPathCompression,
			count_ + 1,
			A3($elm$core$Dict$insert, leftRoot, rightRoot, rightDict));
	});
var $elm_community$random_extra$Utils$selectUniqByIndexes = F2(
	function (values, randomIndexes) {
		var modByLength = $elm$core$Basics$modBy(
			$elm$core$Array$length(values));
		var step = F2(
			function (randomIndex, _v1) {
				var uf = _v1.a;
				var acc = _v1.b;
				var leaderOfElement = A2($owanturist$elm_union_find$UnionFind$find, randomIndex, uf);
				var leaderOfNextElement = A2(
					$owanturist$elm_union_find$UnionFind$find,
					modByLength(leaderOfElement + 1),
					uf);
				var _v0 = A2($elm$core$Array$get, leaderOfElement, values);
				if (_v0.$ === 'Nothing') {
					return _Utils_Tuple2(uf, acc);
				} else {
					var value = _v0.a;
					return _Utils_Tuple2(
						A3($owanturist$elm_union_find$UnionFind$union, leaderOfElement, leaderOfNextElement, uf),
						A2($elm$core$List$cons, value, acc));
				}
			});
		return $elm$core$Array$isEmpty(values) ? _List_Nil : A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2($owanturist$elm_union_find$UnionFind$quickUnionPathCompression, _List_Nil),
			randomIndexes).b;
	});
var $elm_community$random_extra$Random$List$shuffle = function (list) {
	var values = $elm$core$Array$fromList(list);
	var length = $elm$core$Array$length(values);
	return A2(
		$elm$random$Random$map,
		$elm_community$random_extra$Utils$selectUniqByIndexes(values),
		A2(
			$elm$random$Random$list,
			length,
			A2($elm$random$Random$int, 0, length - 1)));
};
var $author$project$Puzzle$createAndShuffleHexesAndPositions = F3(
	function (labels, hexIds, model) {
		var unshuffledHexes = A2(
			$elm$core$List$map,
			$elm$core$Tuple$second,
			A3($author$project$Puzzle$createHexes, labels, hexIds, model));
		return A2(
			$elm$random$Random$generate,
			$author$project$Puzzle$assignPositionsAndStart(model),
			$elm_community$random_extra$Random$List$shuffle(unshuffledHexes));
	});
var $author$project$Puzzle$ForParent = function (a) {
	return {$: 'ForParent', a: a};
};
var $author$project$Puzzle$PuzzleSolved = F2(
	function (a, b) {
		return {$: 'PuzzleSolved', a: a, b: b};
	});
var $author$project$Puzzle$endGame = F2(
	function (size, time) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$always(
				$author$project$Puzzle$ForParent(
					A2($author$project$Puzzle$PuzzleSolved, size, time))),
			$elm$core$Task$succeed(_Utils_Tuple0));
	});
var $author$project$Label$Eight = {$: 'Eight'};
var $author$project$Label$Five = {$: 'Five'};
var $author$project$Label$Four = {$: 'Four'};
var $author$project$Puzzle$LabelsGeneratedAndIdsShuffled = function (a) {
	return {$: 'LabelsGeneratedAndIdsShuffled', a: a};
};
var $author$project$Label$Nine = {$: 'Nine'};
var $author$project$Label$One = {$: 'One'};
var $author$project$Label$Seven = {$: 'Seven'};
var $author$project$Label$Six = {$: 'Six'};
var $author$project$Label$Three = {$: 'Three'};
var $author$project$Label$Two = {$: 'Two'};
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0.a;
		var genB = _v1.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v2 = genA(seed0);
				var a = _v2.a;
				var seed1 = _v2.b;
				var _v3 = genB(seed1);
				var b = _v3.a;
				var seed2 = _v3.b;
				return _Utils_Tuple2(
					A2(func, a, b),
					seed2);
			});
	});
var $elm$random$Random$addOne = function (value) {
	return _Utils_Tuple2(1, value);
};
var $elm$random$Random$float = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var seed1 = $elm$random$Random$next(seed0);
				var range = $elm$core$Basics$abs(b - a);
				var n1 = $elm$random$Random$peel(seed1);
				var n0 = $elm$random$Random$peel(seed0);
				var lo = (134217727 & n1) * 1.0;
				var hi = (67108863 & n0) * 1.0;
				var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
				var scaled = (val * range) + a;
				return _Utils_Tuple2(
					scaled,
					$elm$random$Random$next(seed1));
			});
	});
var $elm$random$Random$getByWeight = F3(
	function (_v0, others, countdown) {
		getByWeight:
		while (true) {
			var weight = _v0.a;
			var value = _v0.b;
			if (!others.b) {
				return value;
			} else {
				var second = others.a;
				var otherOthers = others.b;
				if (_Utils_cmp(
					countdown,
					$elm$core$Basics$abs(weight)) < 1) {
					return value;
				} else {
					var $temp$_v0 = second,
						$temp$others = otherOthers,
						$temp$countdown = countdown - $elm$core$Basics$abs(weight);
					_v0 = $temp$_v0;
					others = $temp$others;
					countdown = $temp$countdown;
					continue getByWeight;
				}
			}
		}
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$random$Random$weighted = F2(
	function (first, others) {
		var normalize = function (_v0) {
			var weight = _v0.a;
			return $elm$core$Basics$abs(weight);
		};
		var total = normalize(first) + $elm$core$List$sum(
			A2($elm$core$List$map, normalize, others));
		return A2(
			$elm$random$Random$map,
			A2($elm$random$Random$getByWeight, first, others),
			A2($elm$random$Random$float, 0, total));
	});
var $elm$random$Random$uniform = F2(
	function (value, valueList) {
		return A2(
			$elm$random$Random$weighted,
			$elm$random$Random$addOne(value),
			A2($elm$core$List$map, $elm$random$Random$addOne, valueList));
	});
var $author$project$Puzzle$valueCountFor = function (size) {
	switch (size.$) {
		case 'Small':
			return 30;
		case 'Medium':
			return 55;
		case 'Large':
			return 72;
		default:
			return 132;
	}
};
var $author$project$Puzzle$generateLabelsAndShuffleIds = function (size) {
	var tailLabels = _List_fromArray(
		[$author$project$Label$One, $author$project$Label$Two, $author$project$Label$Three, $author$project$Label$Four, $author$project$Label$Five, $author$project$Label$Six, $author$project$Label$Seven, $author$project$Label$Eight, $author$project$Label$Nine]);
	var hexIds = A2(
		$elm$core$List$range,
		1,
		$elm$core$List$length(
			$author$project$HexGrid$cells(
				$author$project$Puzzle$gridFor(size))));
	var headLabel = $author$project$Label$Zero;
	return A2(
		$elm$random$Random$generate,
		A2($elm$core$Basics$composeR, $author$project$Puzzle$LabelsGeneratedAndIdsShuffled, $author$project$Puzzle$ForSelf),
		A3(
			$elm$random$Random$map2,
			$elm$core$Tuple$pair,
			A2(
				$elm$random$Random$list,
				$author$project$Puzzle$valueCountFor(size),
				A2($elm$random$Random$uniform, headLabel, tailLabels)),
			$elm_community$random_extra$Random$List$shuffle(hexIds)));
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $author$project$HexPlacements$available = F2(
	function (axial, placements) {
		return !$elm$core$Dict$size(
			A2(
				$elm$core$Dict$filter,
				F2(
					function (_v0, v) {
						return _Utils_eq(v, axial);
					}),
				placements));
	});
var $author$project$HexGrid$inBounds = F2(
	function (ax, _v0) {
		var axs = _v0.c;
		return A2($elm$core$List$member, ax, axs);
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
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
var $elm$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2($elm$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});
var $author$project$HexPlacements$removeAll = F2(
	function (hexes, placements) {
		var fakePlacements = A2(
			$elm$core$List$map,
			function (id) {
				return _Utils_Tuple2(
					id,
					_Utils_Tuple2(0, 0));
			},
			A2(
				$elm$core$List$map,
				function ($) {
					return $.id;
				},
				hexes));
		return A2(
			$elm$core$Dict$diff,
			placements,
			$elm$core$Dict$fromList(fakePlacements));
	});
var $author$project$HexGrid$sum = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var z1 = _v0.b;
		var x2 = _v1.a;
		var z2 = _v1.b;
		return _Utils_Tuple2(x1 + x2, z1 + z2);
	});
var $author$project$Puzzle$placeHexes = F4(
	function (axial, grid, placements, draggedHexes) {
		var remainingPlaces = A2(
			$author$project$HexPlacements$removeAll,
			A2(
				$elm$core$List$map,
				function ($) {
					return $.hex;
				},
				draggedHexes),
			placements);
		var place = function (_v1) {
			var hex = _v1.hex;
			var axialOffset = _v1.axialOffset;
			return _Utils_Tuple2(
				hex.id,
				A2($author$project$HexGrid$sum, axial, axialOffset));
		};
		var newPlaces = A2($elm$core$List$map, place, draggedHexes);
		var canPlace = function (_v0) {
			var ax = _v0.b;
			return A2($author$project$HexPlacements$available, ax, remainingPlaces) && A2($author$project$HexGrid$inBounds, ax, grid);
		};
		return A2($elm$core$List$all, canPlace, newPlaces) ? A2(
			$elm$core$Dict$union,
			$elm$core$Dict$fromList(newPlaces),
			remainingPlaces) : placements;
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $author$project$HexPositions$moveAll = F2(
	function (pairs, dict) {
		var current = $mdgriffith$elm_animator$Animator$current(dict);
		var _new = A2(
			$elm$core$Dict$union,
			$elm$core$Dict$fromList(pairs),
			current);
		return A2(
			$mdgriffith$elm_animator$Animator$queue,
			_List_fromArray(
				[
					A2($mdgriffith$elm_animator$Animator$event, $mdgriffith$elm_animator$Animator$immediately, _new)
				]),
			dict);
	});
var $author$project$Puzzle$placementsToPositions = F4(
	function (zoom, placements, grid, positions) {
		var placeToPos = function (place) {
			return A3($author$project$HexGrid$absolutePoint, zoom, place, grid);
		};
		var positionList = A2(
			$elm$core$List$map,
			$elm$core$Tuple$mapSecond(placeToPos),
			$elm$core$Dict$toList(placements));
		return A2($author$project$HexPositions$moveAll, positionList, positions);
	});
var $author$project$Puzzle$handleDrop = F2(
	function (draggedHexes, model) {
		var _v0 = model.dropTarget;
		switch (_v0.$) {
			case 'NotDraggedYet':
				var returnTargets = _v0.a;
				return _Utils_update(
					model,
					{
						placements: A2($elm$core$Dict$union, returnTargets, model.placements)
					});
			case 'OffGrid':
				var placements = A2(
					$author$project$HexPlacements$removeAll,
					A2(
						$elm$core$List$map,
						function ($) {
							return $.hex;
						},
						draggedHexes),
					model.placements);
				return _Utils_update(
					model,
					{placements: placements});
			default:
				var axial = _v0.a;
				var placements = A4($author$project$Puzzle$placeHexes, axial, model.grid, model.placements, draggedHexes);
				var positions = A4(
					$author$project$Puzzle$placementsToPositions,
					$author$project$Puzzle$zoomFor(model.size),
					placements,
					model.grid,
					model.positions);
				return _Utils_update(
					model,
					{placements: placements, positions: positions});
		}
	});
var $mdgriffith$elm_animator$Internal$Interpolate$FullDefault = {$: 'FullDefault'};
var $mdgriffith$elm_animator$Internal$Interpolate$Position = F2(
	function (a, b) {
		return {$: 'Position', a: a, b: b};
	});
var $mdgriffith$elm_animator$Animator$at = $mdgriffith$elm_animator$Internal$Interpolate$Position($mdgriffith$elm_animator$Internal$Interpolate$FullDefault);
var $author$project$HexPositions$getPos = F2(
	function (id, state) {
		var _v0 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, 0),
			A2($elm$core$Dict$get, id, state));
		var x = _v0.a;
		var y = _v0.b;
		return {
			x: $mdgriffith$elm_animator$Animator$at(x),
			y: $mdgriffith$elm_animator$Animator$at(y)
		};
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
var $mdgriffith$elm_animator$Animator$unwrapUnits = function (_v0) {
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
var $mdgriffith$elm_animator$Animator$xy = F2(
	function (timeline, lookup) {
		return {
			x: $mdgriffith$elm_animator$Animator$unwrapUnits(
				A3(
					$mdgriffith$elm_animator$Internal$Timeline$foldp,
					A2(
						$elm$core$Basics$composeR,
						lookup,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.x;
							},
							$mdgriffith$elm_animator$Internal$Interpolate$withStandardDefault)),
					$mdgriffith$elm_animator$Internal$Interpolate$moving,
					timeline)).position,
			y: $mdgriffith$elm_animator$Animator$unwrapUnits(
				A3(
					$mdgriffith$elm_animator$Internal$Timeline$foldp,
					A2(
						$elm$core$Basics$composeR,
						lookup,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.y;
							},
							$mdgriffith$elm_animator$Internal$Interpolate$withStandardDefault)),
					$mdgriffith$elm_animator$Internal$Interpolate$moving,
					timeline)).position
		};
	});
var $author$project$HexPositions$get = F2(
	function (_v0, dict) {
		var id = _v0.id;
		var _v1 = A2(
			$mdgriffith$elm_animator$Animator$xy,
			dict,
			$author$project$HexPositions$getPos(id));
		var x = _v1.x;
		var y = _v1.y;
		return _Utils_Tuple2(x, y);
	});
var $author$project$Puzzle$notIn = F2(
	function (list, item) {
		return !A2($elm$core$List$member, item, list);
	});
var $author$project$Puzzle$organizeUnplaced = function (model) {
	var unplaced = A2(
		$elm$core$List$filter,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.id;
			},
			$author$project$Puzzle$notIn(
				$elm$core$Dict$keys(model.placements))),
		model.hexes);
	var starts = A2(
		$elm$core$List$map,
		function (h) {
			return A2($author$project$HexPositions$get, h, model.positions);
		},
		unplaced);
	var ends = $author$project$Puzzle$startingPositionsFor(model.size);
	var positions = A6(
		$author$project$HexPositions$glideAll,
		unplaced,
		starts,
		ends,
		0,
		100 * $elm$core$List$length(unplaced),
		model.positions);
	return _Utils_update(
		model,
		{positions: positions});
};
var $author$project$Timer$start = function (timer) {
	return _Utils_update(
		timer,
		{running: true, time: 0});
};
var $author$project$Puzzle$Drag = function (a) {
	return {$: 'Drag', a: a};
};
var $author$project$HexPlacements$extract = F2(
	function (hexes, placements) {
		var get = function (hex) {
			return _Utils_Tuple2(
				hex.id,
				A2($elm$core$Dict$get, hex.id, placements));
		};
		var exists = function (_v1) {
			var id = _v1.a;
			var mPoint = _v1.b;
			if (mPoint.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var point = mPoint.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(id, point));
			}
		};
		return $elm$core$Dict$fromList(
			A2(
				$elm$core$List$filterMap,
				exists,
				A2($elm$core$List$map, get, hexes)));
	});
var $author$project$HexPlacements$at = F3(
	function (axial, hexes, placements) {
		var idToHex = function (id) {
			var _v2 = A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.id;
					},
					$elm$core$Basics$eq(id)),
				hexes);
			if (_v2.b) {
				var h = _v2.a;
				return $elm$core$Maybe$Just(h);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var getHexAt = function (ax) {
			var _v0 = A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$second,
					$elm$core$Basics$eq(ax)),
				$elm$core$Dict$toList(placements));
			if (_v0.b) {
				var _v1 = _v0.a;
				var id = _v1.a;
				return $elm$core$Maybe$Just(id);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		return A2(
			$elm$core$Maybe$andThen,
			idToHex,
			getHexAt(axial));
	});
var $author$project$HexList$compact = function (list) {
	var add = F2(
		function (values, keep) {
			add:
			while (true) {
				if (!values.b) {
					return keep;
				} else {
					var val = values.a;
					var vals = values.b;
					if (val.$ === 'Nothing') {
						var $temp$values = vals,
							$temp$keep = keep;
						values = $temp$values;
						keep = $temp$keep;
						continue add;
					} else {
						var v = val.a;
						var $temp$values = vals,
							$temp$keep = _Utils_ap(
							keep,
							_List_fromArray(
								[v]));
						values = $temp$values;
						keep = $temp$keep;
						continue add;
					}
				}
			}
		});
	return A2(
		add,
		$author$project$HexList$toList(list),
		_List_Nil);
};
var $author$project$HexGrid$offset = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var z1 = _v0.b;
		var x2 = _v1.a;
		var z2 = _v1.b;
		return _Utils_Tuple2(x2 - x1, z2 - z1);
	});
var $author$project$Puzzle$getContiguousHexes = F4(
	function (hexes, placements, grid, hex) {
		var addNeighbor = F4(
			function (toCheck, checked, neighbors, ax) {
				addNeighbor:
				while (true) {
					var uncheckedNeighbors = A2(
						$elm$core$List$filter,
						$author$project$Puzzle$notIn(
							_Utils_ap(toCheck, checked)),
						$author$project$HexList$compact(
							A2($author$project$HexGrid$neighbors, ax, grid)));
					var _v0 = function () {
						var _v1 = A3($author$project$HexPlacements$at, ax, hexes, placements);
						if (_v1.$ === 'Nothing') {
							return _Utils_Tuple2(_List_Nil, _List_Nil);
						} else {
							var h = _v1.a;
							return _Utils_Tuple2(
								_List_fromArray(
									[
										_Utils_Tuple2(h, ax)
									]),
								uncheckedNeighbors);
						}
					}();
					var _this = _v0.a;
					var alsoCheck = _v0.b;
					var newNeighbors = _Utils_ap(neighbors, _this);
					var _v2 = _Utils_ap(toCheck, alsoCheck);
					if (_v2.b) {
						var next = _v2.a;
						var rest = _v2.b;
						var $temp$toCheck = rest,
							$temp$checked = A2($elm$core$List$cons, ax, checked),
							$temp$neighbors = newNeighbors,
							$temp$ax = next;
						toCheck = $temp$toCheck;
						checked = $temp$checked;
						neighbors = $temp$neighbors;
						ax = $temp$ax;
						continue addNeighbor;
					} else {
						return newNeighbors;
					}
				}
			});
		var _v3 = A2($elm$core$Dict$get, hex.id, placements);
		if (_v3.$ === 'Nothing') {
			return _List_fromArray(
				[
					_Utils_Tuple2(
					hex,
					_Utils_Tuple2(0, 0))
				]);
		} else {
			var axial = _v3.a;
			return A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond(
					$author$project$HexGrid$offset(axial)),
				A4(addNeighbor, _List_Nil, _List_Nil, _List_Nil, axial));
		}
	});
var $author$project$Puzzle$DraggedHex = F4(
	function (hex, position, offset, axialOffset) {
		return {axialOffset: axialOffset, hex: hex, offset: offset, position: position};
	});
var $author$project$Graphics$difference = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		return _Utils_Tuple2(x1 - x2, y1 - y2);
	});
var $author$project$Puzzle$startDraggingHex = F4(
	function (zoom, positions, mouse, _v0) {
		var hex = _v0.a;
		var axialOffset = _v0.b;
		var start = A2($author$project$HexPositions$get, hex, positions);
		var offset = A2(
			$author$project$Graphics$difference,
			A2($author$project$Puzzle$scale, zoom, mouse),
			start);
		return A4($author$project$Puzzle$DraggedHex, hex, start, offset, axialOffset);
	});
var $author$project$Puzzle$startDraggingHexes = F4(
	function (hex, button, mousePos, model) {
		var hexesAndOffsets = _Utils_eq(button, model.groupDragButton) ? A4($author$project$Puzzle$getContiguousHexes, model.hexes, model.placements, model.grid, hex) : _List_fromArray(
			[
				_Utils_Tuple2(
				hex,
				_Utils_Tuple2(0, 0))
			]);
		var hexes = A2($elm$core$List$map, $elm$core$Tuple$first, hexesAndOffsets);
		var draggedHexes = A2(
			$elm$core$List$map,
			A3(
				$author$project$Puzzle$startDraggingHex,
				$author$project$Puzzle$zoomFor(model.size),
				model.positions,
				mousePos),
			hexesAndOffsets);
		return _Utils_update(
			model,
			{
				drag: $author$project$Puzzle$Drag(draggedHexes),
				dropTarget: $author$project$Puzzle$NotDraggedYet(
					A2($author$project$HexPlacements$extract, hexes, model.placements)),
				hexes: A2(
					$elm$core$List$filter,
					$author$project$Puzzle$notIn(hexes),
					model.hexes)
			});
	});
var $author$project$Puzzle$PuzzleReady = function (a) {
	return {$: 'PuzzleReady', a: a};
};
var $author$project$Puzzle$startGame = function (model) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$always(
			$author$project$Puzzle$ForParent(
				$author$project$Puzzle$PuzzleReady(model))),
		$elm$core$Task$succeed(_Utils_Tuple0));
};
var $author$project$Puzzle$StartTimer = {$: 'StartTimer'};
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Puzzle$startTimerAfter = function (delay) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$always(
			$author$project$Puzzle$ForSelf($author$project$Puzzle$StartTimer)),
		$elm$core$Process$sleep(delay));
};
var $author$project$Timer$stop = function (timer) {
	return _Utils_update(
		timer,
		{running: false});
};
var $author$project$Puzzle$timerDelayFor = A2(
	$elm$core$Basics$composeR,
	$author$project$Puzzle$glideDurationFor,
	$elm$core$Basics$add(750));
var $author$project$Timer$update = F2(
	function (newTime, timer) {
		var running = timer.running;
		var time = timer.time;
		var lastTime = timer.lastTime;
		return running ? _Utils_update(
			timer,
			{
				lastTime: newTime,
				time: time + ($elm$time$Time$posixToMillis(newTime) - $elm$time$Time$posixToMillis(lastTime))
			}) : _Utils_update(
			timer,
			{lastTime: newTime});
	});
var $author$project$Puzzle$updateDraggedHex = F3(
	function (zoom, mousePos, drag) {
		var hex = drag.hex;
		var offset = drag.offset;
		var newPosition = A2(
			$author$project$Graphics$difference,
			A2($author$project$Puzzle$scale, zoom, mousePos),
			offset);
		return _Utils_update(
			drag,
			{position: newPosition});
	});
var $author$project$Puzzle$updateDraggedHexes = F3(
	function (mousePos, hexes, model) {
		var movedHexes = A2(
			$elm$core$List$map,
			A2(
				$author$project$Puzzle$updateDraggedHex,
				$author$project$Puzzle$zoomFor(model.size),
				mousePos),
			hexes);
		var newPositions = A2(
			$elm$core$List$map,
			function (_v0) {
				var hex = _v0.hex;
				var position = _v0.position;
				return _Utils_Tuple2(hex.id, position);
			},
			movedHexes);
		return _Utils_update(
			model,
			{
				drag: $author$project$Puzzle$Drag(movedHexes),
				positions: A2($author$project$HexPositions$moveAll, newPositions, model.positions)
			});
	});
var $author$project$Puzzle$Incorrect = {$: 'Incorrect'};
var $author$project$Puzzle$Solved = {$: 'Solved'};
var $author$project$HexList$all = F2(
	function (fn, list) {
		return A2(
			$elm$core$List$all,
			fn,
			$author$project$HexList$toList(list));
	});
var $author$project$Puzzle$getNeighbor = F3(
	function (placementList, hexes, ax) {
		var _v0 = A2(
			$elm$core$List$partition,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$second,
				$elm$core$Basics$eq(ax)),
			placementList);
		if (!_v0.a.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!_v0.a.b.b) {
				var _v1 = _v0.a;
				var _v2 = _v1.a;
				var id = _v2.a;
				return A2($elm$core$Dict$get, id, hexes);
			} else {
				var _v3 = _v0.a;
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Puzzle$match = F3(
	function (neighbors, index, label) {
		var _v0 = A2($author$project$HexList$get, index, neighbors);
		if (_v0.$ === 'Nothing') {
			return true;
		} else {
			var hex = _v0.a;
			var wedge = A2(
				$author$project$HexList$get,
				$author$project$HexList$invert(index),
				hex.wedges);
			return _Utils_eq(label, wedge.label);
		}
	});
var $author$project$Puzzle$matched = F4(
	function (hexes, placements, grid, hex) {
		var _v0 = A2($elm$core$Dict$get, hex.id, placements);
		if (_v0.$ === 'Nothing') {
			return false;
		} else {
			var axial = _v0.a;
			var neighborCoords = A2($author$project$HexGrid$neighbors, axial, grid);
			var neighbors = A2(
				$author$project$HexList$map,
				$elm$core$Maybe$andThen(
					A2(
						$author$project$Puzzle$getNeighbor,
						$elm$core$Dict$toList(placements),
						hexes)),
				neighborCoords);
			var labels = A2(
				$author$project$HexList$map,
				function ($) {
					return $.label;
				},
				hex.wedges);
			return A2(
				$author$project$HexList$all,
				$elm$core$Basics$identity,
				A2(
					$author$project$HexList$indexedMap,
					$author$project$Puzzle$match(neighbors),
					labels));
		}
	});
var $author$project$Puzzle$verify = F3(
	function (hexes, placements, grid) {
		var hexDict = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (h) {
					return _Utils_Tuple2(h.id, h);
				},
				hexes));
		var allPlaced = _Utils_eq(
			$elm$core$List$length(hexes),
			$elm$core$Dict$size(placements));
		var allMatched = A2(
			$elm$core$List$all,
			A3($author$project$Puzzle$matched, hexDict, placements, grid),
			hexes);
		return allPlaced ? (allMatched ? $author$project$Puzzle$Solved : $author$project$Puzzle$Incorrect) : $author$project$Puzzle$Incomplete;
	});
var $author$project$Puzzle$update = F2(
	function (msg, model) {
		update:
		while (true) {
			switch (msg.$) {
				case 'StartGame':
					var size = msg.a;
					return _Utils_Tuple2(
						$author$project$Puzzle$new(size),
						$author$project$Puzzle$generateLabelsAndShuffleIds(size));
				case 'LabelsGeneratedAndIdsShuffled':
					var _v1 = msg.a;
					var labels = _v1.a;
					var hexIds = _v1.b;
					return _Utils_Tuple2(
						model,
						A3($author$project$Puzzle$createAndShuffleHexesAndPositions, labels, hexIds, model));
				case 'Ready':
					var newModel = msg.a;
					return _Utils_Tuple2(
						newModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Puzzle$startTimerAfter(
									$author$project$Puzzle$timerDelayFor(newModel.size)),
									$author$project$Puzzle$startGame(newModel)
								])));
				case 'StartTimer':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								timer: $author$project$Timer$start(model.timer)
							}),
						$elm$core$Platform$Cmd$none);
				case 'Tick':
					var newTime = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								timer: A2($author$project$Timer$update, newTime, model.timer)
							}),
						$elm$core$Platform$Cmd$none);
				case 'StartDragging':
					var hex = msg.a;
					var button = msg.b;
					var mousePos = msg.c;
					return _Utils_Tuple2(
						A4($author$project$Puzzle$startDraggingHexes, hex, button, mousePos, model),
						$elm$core$Platform$Cmd$none);
				case 'MovePointer':
					var mousePos = msg.a;
					var _v2 = model.drag;
					if (_v2.$ === 'NotDragging') {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var hexes = _v2.a;
						return _Utils_Tuple2(
							A3($author$project$Puzzle$updateDraggedHexes, mousePos, hexes, model),
							$elm$core$Platform$Cmd$none);
					}
				case 'HoverGridSpace':
					var axial = msg.a;
					var _v3 = model.drag;
					if (_v3.$ === 'NotDragging') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									dropTarget: $author$project$Puzzle$NotDraggedYet($author$project$HexPlacements$empty)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									dropTarget: $author$project$Puzzle$GridCell(axial)
								}),
							$elm$core$Platform$Cmd$none);
					}
				case 'HoverOffGrid':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{dropTarget: $author$project$Puzzle$OffGrid}),
						$elm$core$Platform$Cmd$none);
				case 'StopDraggingHex':
					var _v4 = model.drag;
					if (_v4.$ === 'NotDragging') {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var draggedHexes = _v4.a;
						var newModel = A2($author$project$Puzzle$handleDrop, draggedHexes, model);
						var $temp$msg = $author$project$Puzzle$VerifyPuzzle,
							$temp$model = _Utils_update(
							newModel,
							{
								drag: $author$project$Puzzle$NotDragging,
								hexes: _Utils_ap(
									A2(
										$elm$core$List$map,
										function ($) {
											return $.hex;
										},
										draggedHexes),
									newModel.hexes)
							});
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					}
				case 'VerifyPuzzle':
					var newModel = _Utils_update(
						model,
						{
							verified: A3($author$project$Puzzle$verify, model.hexes, model.placements, model.grid)
						});
					var _v5 = newModel.verified;
					if (_v5.$ === 'Solved') {
						var $temp$msg = $author$project$Puzzle$EndGame,
							$temp$model = newModel;
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					} else {
						return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
					}
				case 'EndGame':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								complete: true,
								timer: $author$project$Timer$stop(model.timer)
							}),
						A2($author$project$Puzzle$endGame, model.size, model.timer.time));
				case 'PauseGame':
					var paused = model.complete ? false : true;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{paused: paused}),
						$elm$core$Platform$Cmd$none);
				case 'PreventContextMenu':
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				default:
					return _Utils_Tuple2(
						$author$project$Puzzle$organizeUnplaced(model),
						$elm$core$Platform$Cmd$none);
			}
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		update:
		while (true) {
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
				case 'Tick':
					var newTime = msg.a;
					var _v3 = A2(
						$author$project$Puzzle$update,
						$author$project$Puzzle$Tick(newTime),
						model.puzzle);
					var newPuzzle = _v3.a;
					var cmd = _v3.b;
					return _Utils_Tuple2(
						A3(
							$mdgriffith$elm_animator$Animator$update,
							newTime,
							$author$project$Main$animator,
							_Utils_update(
								model,
								{puzzle: newPuzzle})),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$puzzleTranslator, cmd));
				case 'LoadBestTimes':
					var result = msg.a;
					if (result.$ === 'Err') {
						var err = result.a;
						var _v5 = A2($elm$core$Debug$log, 'Error loading times', err);
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var times = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{bestTimes: times}),
							$elm$core$Platform$Cmd$none);
					}
				case 'MouseMove':
					var pagePos = msg.a;
					var scaledPoint = A3(
						$author$project$Graphics$scale,
						pagePos,
						model.svgDimensions,
						A4($author$project$Graphics$BoundingBox, 0, 0, 0, 0));
					var mousePoint = A3(
						$author$project$Graphics$scale,
						pagePos,
						model.svgDimensions,
						$author$project$Main$getSceneCamera(
							$mdgriffith$elm_animator$Animator$current(model.scene)));
					var _v6 = A2(
						$author$project$Puzzle$update,
						$author$project$Puzzle$MovePointer(scaledPoint),
						model.puzzle);
					var newPuzzle = _v6.a;
					var cmd = _v6.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{mousePos: mousePoint, puzzle: newPuzzle}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$puzzleTranslator, cmd));
				case 'ChangeScene':
					var newScene = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								scene: A3($mdgriffith$elm_animator$Animator$go, $mdgriffith$elm_animator$Animator$slowly, newScene, model.scene)
							}),
						$elm$core$Platform$Cmd$none);
				case 'OptionMsg':
					var optionMsg = msg.a;
					var _v7 = A2($author$project$Options$update, optionMsg, model.options);
					var options = _v7.a;
					var cmd = _v7.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{options: options}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$OptionMsg, cmd));
				case 'StartDraggingHex':
					var hex = msg.a;
					var button = msg.b;
					var pagePos = msg.c;
					var scaledPoint = A3(
						$author$project$Graphics$scale,
						pagePos,
						model.svgDimensions,
						A4($author$project$Graphics$BoundingBox, 0, 0, 0, 0));
					var _v8 = A2(
						$author$project$Puzzle$update,
						A3($author$project$Puzzle$StartDragging, hex, button, scaledPoint),
						model.puzzle);
					var newPuzzle = _v8.a;
					var cmd = _v8.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{puzzle: newPuzzle}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$puzzleTranslator, cmd));
				case 'CreatePuzzle':
					var size = msg.a;
					var _v9 = A2(
						$author$project$Puzzle$update,
						$author$project$Puzzle$StartGame(size),
						model.puzzle);
					var newPuzzle = _v9.a;
					var cmd = _v9.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{puzzle: newPuzzle}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$puzzleTranslator, cmd));
				case 'PuzzleMsg':
					var internal = msg.a;
					var _v10 = A2($author$project$Puzzle$update, internal, model.puzzle);
					var newPuzzle = _v10.a;
					var cmd = _v10.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{puzzle: newPuzzle}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$puzzleTranslator, cmd));
				case 'PuzzleReady':
					var puzzle = msg.a;
					var _v11 = A2(
						$author$project$Main$update,
						$author$project$Main$ChangeScene($author$project$Main$GameBoard),
						_Utils_update(
							model,
							{puzzle: puzzle}));
					var newModel = _v11.a;
					var cmd = _v11.b;
					return _Utils_Tuple2(newModel, cmd);
				case 'PausePuzzle':
					var _v12 = A2($author$project$Puzzle$update, $author$project$Puzzle$PauseGame, model.puzzle);
					var newPuzzle = _v12.a;
					var $temp$msg = $author$project$Main$ChangeScene($author$project$Main$DifficultyMenu),
						$temp$model = _Utils_update(
						model,
						{puzzle: newPuzzle});
					msg = $temp$msg;
					model = $temp$model;
					continue update;
				case 'ResumePuzzle':
					var $temp$msg = $author$project$Main$ChangeScene($author$project$Main$GameBoard),
						$temp$model = model;
					msg = $temp$msg;
					model = $temp$model;
					continue update;
				default:
					var size = msg.a;
					var time = msg.b;
					var _v13 = A3($author$project$BestTimes$add, size, time, model.bestTimes);
					var newBestTimes = _v13.a;
					var cmd = _v13.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bestTimes: newBestTimes}),
						cmd);
			}
		}
	});
var $author$project$Main$MouseMove = function (a) {
	return {$: 'MouseMove', a: a};
};
var $author$project$Puzzle$StopDraggingHex = {$: 'StopDraggingHex'};
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
var $mdgriffith$elm_animator$Animator$move = F2(
	function (timeline, lookup) {
		return A2(
			$mdgriffith$elm_animator$Internal$Interpolate$details,
			timeline,
			A2($elm$core$Basics$composeL, $mdgriffith$elm_animator$Internal$Interpolate$withStandardDefault, lookup)).position;
	});
var $author$project$StrUtil$spaceDelimit4 = F4(
	function (x, y, w, h) {
		return A2($author$project$StrUtil$spaceDelimit2, x, y) + (' ' + A2($author$project$StrUtil$spaceDelimit2, w, h));
	});
var $author$project$Main$getViewBox = function (scene) {
	var y = A2(
		$mdgriffith$elm_animator$Animator$move,
		scene,
		A2(
			$elm$core$Basics$composeR,
			$author$project$Main$getSceneCamera,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.y;
				},
				$mdgriffith$elm_animator$Animator$at)));
	var x = A2(
		$mdgriffith$elm_animator$Animator$move,
		scene,
		A2(
			$elm$core$Basics$composeR,
			$author$project$Main$getSceneCamera,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.x;
				},
				$mdgriffith$elm_animator$Animator$at)));
	var w = A2(
		$mdgriffith$elm_animator$Animator$move,
		scene,
		A2(
			$elm$core$Basics$composeR,
			$author$project$Main$getSceneCamera,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.w;
				},
				$mdgriffith$elm_animator$Animator$at)));
	var h = A2(
		$mdgriffith$elm_animator$Animator$move,
		scene,
		A2(
			$elm$core$Basics$composeR,
			$author$project$Main$getSceneCamera,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.h;
				},
				$mdgriffith$elm_animator$Animator$at)));
	return A4($author$project$StrUtil$spaceDelimit4, x, y, w, h);
};
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
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
var $elm$json$Json$Decode$map3 = _Json_map3;
var $mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	$elm$json$Json$Decode$map3,
	$mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
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
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mouseup', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
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
var $author$project$Main$viewBackground = F3(
	function (animation, pattern, color) {
		var patternClass = function () {
			if (pattern.$ === 'On') {
				return '';
			} else {
				return 'hidden';
			}
		}();
		var fillColor = function () {
			if (color.$ === 'BluePurple') {
				return 'url(#bggradient';
			} else {
				return '#2d2d2d';
			}
		}();
		var animationClass = function () {
			if (animation.$ === 'On') {
				return '';
			} else {
				return 'stopped';
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
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('background')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill(fillColor),
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
							$elm$svg$Svg$Attributes$class(patternClass),
							$elm$svg$Svg$Attributes$class(animationClass),
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
	});
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
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$svg$Svg$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNodeNS('http://www.w3.org/2000/svg');
var $mdgriffith$elm_animator$Internal$Timeline$getPrev = F7(
	function (_v0, maybePrevious, target, _v1, _v2, _v3, _v4) {
		if (maybePrevious.$ === 'Just') {
			var p = maybePrevious.a;
			return p;
		} else {
			return target;
		}
	});
var $mdgriffith$elm_animator$Internal$Timeline$previous = function (timeline) {
	var details = timeline.a;
	return A3(
		$mdgriffith$elm_animator$Internal$Timeline$foldp,
		$elm$core$Basics$identity,
		{
			adjustor: function (_v0) {
				return {arrivingEarly: 0, leavingLate: 0};
			},
			after: F3(
				function (lookup, target, future) {
					return $mdgriffith$elm_animator$Internal$Timeline$getEvent(target);
				}),
			dwellFor: F2(
				function (cur, duration) {
					return cur;
				}),
			dwellPeriod: function (_v1) {
				return $elm$core$Maybe$Nothing;
			},
			lerp: $mdgriffith$elm_animator$Internal$Timeline$getPrev,
			start: function (_v2) {
				return details.initial;
			}
		},
		timeline);
};
var $mdgriffith$elm_animator$Animator$previous = $mdgriffith$elm_animator$Internal$Timeline$previous;
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$StrUtil$translate = F2(
	function (x, y) {
		return 'translate(' + (A2($author$project$StrUtil$spaceDelimit2, x, y) + ')');
	});
var $author$project$Main$LicenseScreen = {$: 'LicenseScreen'};
var $author$project$Title$aboutLetters = _List_fromArray(
	['A', 'B', 'O', 'U', 'T']);
var $author$project$Title$aboutPositions = _List_fromArray(
	['91.2', '105.3', '119.6', '134.5', '149.2']);
var $author$project$Title$about = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$aboutLetters, $author$project$Title$aboutPositions);
var $author$project$Title$sineSteps = F2(
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
var $author$project$Title$sineValues = A2(
	$elm$core$String$join,
	';',
	A2(
		$elm$core$List$map,
		$elm$core$String$fromFloat,
		A2($author$project$Title$sineSteps, 20, 5)));
var $elm$svg$Svg$animate = $elm$svg$Svg$trustedNode('animate');
var $elm$svg$Svg$Attributes$attributeName = _VirtualDom_attribute('attributeName');
var $elm$svg$Svg$Attributes$begin = _VirtualDom_attribute('begin');
var $elm$svg$Svg$Attributes$dur = _VirtualDom_attribute('dur');
var $elm$svg$Svg$Attributes$repeatCount = _VirtualDom_attribute('repeatCount');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$values = function (value) {
	return A2(
		_VirtualDom_attribute,
		'values',
		_VirtualDom_noJavaScriptUri(value));
};
var $author$project$Title$viewLetter = F4(
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
var $author$project$Title$view = F2(
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
				A2($author$project$Title$viewLetter, state, $author$project$Title$sineValues),
				title,
				A2(
					$elm$core$List$range,
					0,
					$elm$core$List$length(title))));
	});
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
var $author$project$Main$viewBackButton = function (scene) {
	return A2(
		$elm$svg$Svg$text_,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('back'),
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat($author$project$Graphics$middle.a)),
				$elm$svg$Svg$Attributes$y('125'),
				$elm$html$Html$Events$onClick(
				$author$project$Main$ChangeScene(scene))
			]),
		_List_fromArray(
			[
				$elm$svg$Svg$text('BACK')
			]));
};
var $author$project$Main$viewMenuOption = F3(
	function (label, _v0, action) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('menu-option'),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(x)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(y)),
					$elm$html$Html$Events$onClick(action)
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(label)
				]));
	});
var $author$project$Main$viewText = F2(
	function (label, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('text left'),
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
var $author$project$Main$viewAbout = function (titleAnimation) {
	return _List_fromArray(
		[
			A2($author$project$Title$view, titleAnimation, $author$project$Title$about),
			A2(
			$author$project$Main$viewText,
			'Hexasperate is an edge-matching puzzle',
			_Utils_Tuple2(25.8, 50)),
			A2(
			$author$project$Main$viewText,
			'game inspired by the classic game TetraVex',
			_Utils_Tuple2(25.8, 59.5)),
			A2(
			$author$project$Main$viewText,
			'by Scott Ferguson, which first appeared',
			_Utils_Tuple2(25.8, 69)),
			A2(
			$author$project$Main$viewText,
			'in Microsoft Entertainment Pack 3 in 1991.',
			_Utils_Tuple2(25.8, 78.5)),
			A2(
			$author$project$Main$viewText,
			'Hexasperate was created by Tom Smilack.',
			_Utils_Tuple2(25.8, 93)),
			A3(
			$author$project$Main$viewMenuOption,
			'FINE PRINT',
			_Utils_Tuple2(120, 110),
			$author$project$Main$ChangeScene($author$project$Main$LicenseScreen)),
			$author$project$Main$viewBackButton($author$project$Main$TitleScreen)
		]);
};
var $author$project$Main$CreatePuzzle = function (a) {
	return {$: 'CreatePuzzle', a: a};
};
var $author$project$Puzzle$Huge = {$: 'Huge'};
var $author$project$Puzzle$Large = {$: 'Large'};
var $author$project$Puzzle$Medium = {$: 'Medium'};
var $author$project$Main$ResumePuzzle = {$: 'ResumePuzzle'};
var $author$project$Title$playLetters = _List_fromArray(
	['P', 'L', 'A', 'Y']);
var $author$project$Title$playPositions = _List_fromArray(
	['101.1', '113.3', '126.8', '138.3']);
var $author$project$Title$play = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$playLetters, $author$project$Title$playPositions);
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $elm$html$Html$Lazy$lazy2 = $elm$virtual_dom$VirtualDom$lazy2;
var $author$project$Puzzle$previewGrids = {
	huge: A3(
		$author$project$HexGrid$create,
		0.19,
		_Utils_Tuple2(($author$project$Graphics$middle.a * 3) / 2, 96.5),
		$author$project$Puzzle$rangeFor($author$project$Puzzle$Huge)),
	large: A3(
		$author$project$HexGrid$create,
		0.19,
		_Utils_Tuple2(($author$project$Graphics$middle.a * 3) / 2, 55.5),
		$author$project$Puzzle$rangeFor($author$project$Puzzle$Large)),
	medium: A3(
		$author$project$HexGrid$create,
		0.19,
		_Utils_Tuple2($author$project$Graphics$middle.a / 2, 96.5),
		$author$project$Puzzle$rangeFor($author$project$Puzzle$Medium)),
	small: A3(
		$author$project$HexGrid$create,
		0.19,
		_Utils_Tuple2($author$project$Graphics$middle.a / 2, 55.5),
		$author$project$Puzzle$rangeFor($author$project$Puzzle$Small))
};
var $author$project$Puzzle$previewMsgAttrs = $elm$core$Basics$always(
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('static')
		]));
var $elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var $elm$html$Html$Lazy$lazy = $elm$virtual_dom$VirtualDom$lazy;
var $author$project$HexGrid$hexPoints = F2(
	function (zoom, ax) {
		var r = 20 * zoom;
		var si = r * $elm$core$Basics$sin($elm$core$Basics$pi / 3);
		var co = r * $elm$core$Basics$cos($elm$core$Basics$pi / 3);
		var _v0 = A2($author$project$HexGrid$toPoint, r, ax);
		var x = _v0.a;
		var y = _v0.b;
		return A6(
			$author$project$HexList$HexList,
			_Utils_Tuple2(x + r, y + 0),
			_Utils_Tuple2(x + co, y - si),
			_Utils_Tuple2(x - co, y - si),
			_Utils_Tuple2(x - r, y + 0),
			_Utils_Tuple2(x - co, y + si),
			_Utils_Tuple2(x + co, y + si));
	});
var $author$project$HexGrid$viewHex = F3(
	function (mouseEvents, zoom, ax) {
		var points = A2($author$project$HexGrid$hexPoints, zoom, ax);
		var coords = $author$project$HexList$toList(points);
		return A2(
			$elm$svg$Svg$path,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('grid-hex'),
						$elm$svg$Svg$Attributes$d(
						$author$project$StrUtil$simplePath(coords))
					]),
				mouseEvents(ax)),
			_List_Nil);
	});
var $author$project$HexGrid$viewHexGrid = F3(
	function (mouseEvents, zoom, axs) {
		return A2(
			$elm$core$List$map,
			A2($author$project$HexGrid$viewHex, mouseEvents, zoom),
			axs);
	});
var $elm$core$Basics$atan2 = _Basics_atan2;
var $author$project$HexList$map2 = F3(
	function (fn, a, b) {
		return A6(
			$author$project$HexList$HexList,
			A2(fn, a.i, b.i),
			A2(fn, a.ii, b.ii),
			A2(fn, a.iii, b.iii),
			A2(fn, a.iv, b.iv),
			A2(fn, a.v, b.v),
			A2(fn, a.vi, b.vi));
	});
var $author$project$HexList$sieve = F2(
	function (list1, list2) {
		var filter = F2(
			function (a, b) {
				if (b.$ === 'Nothing') {
					return $elm$core$Maybe$Just(a);
				} else {
					return $elm$core$Maybe$Nothing;
				}
			});
		return A3($author$project$HexList$map2, filter, list1, list2);
	});
var $author$project$HexGrid$viewOutline = function (grid) {
	var zoom = grid.a;
	var axs = grid.c;
	var getOutline = function (ax) {
		return $author$project$HexList$compact(
			A2(
				$author$project$HexList$sieve,
				A2($author$project$HexGrid$hexPoints, zoom, ax),
				A2($author$project$HexGrid$neighbors, ax, grid)));
	};
	var arctan = function (_v0) {
		var x = _v0.a;
		var y = _v0.b;
		return A2($elm$core$Basics$atan2, y, x);
	};
	var points = A2(
		$elm$core$List$sortBy,
		arctan,
		A2($elm$core$List$concatMap, getOutline, axs));
	return A2(
		$elm$svg$Svg$path,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('grid-outline'),
				$elm$svg$Svg$Attributes$d(
				$author$project$StrUtil$simplePath(points))
			]),
		_List_Nil);
};
var $author$project$HexGrid$view = F2(
	function (mouseEvents, grid) {
		var zoom = grid.a;
		var _v0 = grid.b;
		var cx = _v0.a;
		var cy = _v0.b;
		var axs = grid.c;
		var _v1 = A2($author$project$HexGrid$gridCenter, 20 * zoom, axs);
		var gridCx = _v1.a;
		var gridCy = _v1.b;
		var _v2 = _Utils_Tuple2(cx - gridCx, cy - gridCy);
		var x = _v2.a;
		var y = _v2.b;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('grid'),
					$elm$svg$Svg$Attributes$transform(
					A2($author$project$StrUtil$translate, x, y))
				]),
			_Utils_ap(
				A3($author$project$HexGrid$viewHexGrid, mouseEvents, zoom, axs),
				_List_fromArray(
					[
						A2($elm$html$Html$Lazy$lazy, $author$project$HexGrid$viewOutline, grid)
					])));
	});
var $author$project$Puzzle$preview = function (size) {
	switch (size.$) {
		case 'Small':
			return A3($elm$html$Html$Lazy$lazy2, $author$project$HexGrid$view, $author$project$Puzzle$previewMsgAttrs, $author$project$Puzzle$previewGrids.small);
		case 'Medium':
			return A3($elm$html$Html$Lazy$lazy2, $author$project$HexGrid$view, $author$project$Puzzle$previewMsgAttrs, $author$project$Puzzle$previewGrids.medium);
		case 'Large':
			return A3($elm$html$Html$Lazy$lazy2, $author$project$HexGrid$view, $author$project$Puzzle$previewMsgAttrs, $author$project$Puzzle$previewGrids.large);
		default:
			return A3($elm$html$Html$Lazy$lazy2, $author$project$HexGrid$view, $author$project$Puzzle$previewMsgAttrs, $author$project$Puzzle$previewGrids.huge);
	}
};
var $author$project$Puzzle$resumeGrids = {
	huge: A3(
		$author$project$HexGrid$create,
		0.19,
		_Utils_Tuple2($author$project$Graphics$middle.a, 76),
		$author$project$Puzzle$rangeFor($author$project$Puzzle$Huge)),
	large: A3(
		$author$project$HexGrid$create,
		0.19,
		_Utils_Tuple2($author$project$Graphics$middle.a, 76),
		$author$project$Puzzle$rangeFor($author$project$Puzzle$Large)),
	medium: A3(
		$author$project$HexGrid$create,
		0.19,
		_Utils_Tuple2($author$project$Graphics$middle.a, 76),
		$author$project$Puzzle$rangeFor($author$project$Puzzle$Medium)),
	small: A3(
		$author$project$HexGrid$create,
		0.19,
		_Utils_Tuple2($author$project$Graphics$middle.a, 76),
		$author$project$Puzzle$rangeFor($author$project$Puzzle$Small))
};
var $author$project$Puzzle$resume = function (size) {
	switch (size.$) {
		case 'Small':
			return A3($elm$html$Html$Lazy$lazy2, $author$project$HexGrid$view, $author$project$Puzzle$previewMsgAttrs, $author$project$Puzzle$resumeGrids.small);
		case 'Medium':
			return A3($elm$html$Html$Lazy$lazy2, $author$project$HexGrid$view, $author$project$Puzzle$previewMsgAttrs, $author$project$Puzzle$resumeGrids.medium);
		case 'Large':
			return A3($elm$html$Html$Lazy$lazy2, $author$project$HexGrid$view, $author$project$Puzzle$previewMsgAttrs, $author$project$Puzzle$resumeGrids.large);
		default:
			return A3($elm$html$Html$Lazy$lazy2, $author$project$HexGrid$view, $author$project$Puzzle$previewMsgAttrs, $author$project$Puzzle$resumeGrids.huge);
	}
};
var $author$project$Main$viewDifficultyMenu = F2(
	function (titleAnimation, puzzle) {
		var _v0 = $author$project$Graphics$middle;
		var x = _v0.a;
		var _v1 = function () {
			var _v2 = puzzle.paused;
			if (!_v2) {
				return _Utils_Tuple2(
					$elm$svg$Svg$text(''),
					$elm$svg$Svg$text(''));
			} else {
				return _Utils_Tuple2(
					$author$project$Puzzle$resume(puzzle.size),
					A3(
						$author$project$Main$viewMenuOption,
						'RESUME',
						_Utils_Tuple2(x, 77.5),
						$author$project$Main$ResumePuzzle));
			}
		}();
		var resumePreview = _v1.a;
		var resumeText = _v1.b;
		return _List_fromArray(
			[
				A2($author$project$Title$view, titleAnimation, $author$project$Title$play),
				$author$project$Puzzle$preview($author$project$Puzzle$Small),
				A3(
				$author$project$Main$viewMenuOption,
				'SMALL',
				_Utils_Tuple2(x / 2, 57),
				$author$project$Main$CreatePuzzle($author$project$Puzzle$Small)),
				$author$project$Puzzle$preview($author$project$Puzzle$Medium),
				A3(
				$author$project$Main$viewMenuOption,
				'MEDIUM',
				_Utils_Tuple2(x / 2, 98),
				$author$project$Main$CreatePuzzle($author$project$Puzzle$Medium)),
				resumePreview,
				resumeText,
				$author$project$Puzzle$preview($author$project$Puzzle$Large),
				A3(
				$author$project$Main$viewMenuOption,
				'LARGE',
				_Utils_Tuple2((x * 3) / 2, 57),
				$author$project$Main$CreatePuzzle($author$project$Puzzle$Large)),
				$author$project$Puzzle$preview($author$project$Puzzle$Huge),
				A3(
				$author$project$Main$viewMenuOption,
				'HUGE',
				_Utils_Tuple2((x * 3) / 2, 98),
				$author$project$Main$CreatePuzzle($author$project$Puzzle$Huge)),
				$author$project$Main$viewBackButton($author$project$Main$TitleScreen)
			]);
	});
var $author$project$Palette$class = function (option) {
	switch (option.$) {
		case 'Resistors':
			return 'palette-resistors';
		case 'Mondrian':
			return 'palette-mondrian';
		case 'Material':
			return 'palette-material';
		case 'ColorBlind':
			return 'palette-colorblind';
		case 'Grayscale':
			return 'palette-grayscale';
		case 'Classic':
			return 'palette-classic';
		default:
			return 'palette-transparent';
	}
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Puzzle$HoverGridSpace = function (a) {
	return {$: 'HoverGridSpace', a: a};
};
var $author$project$Puzzle$PreventContextMenu = {$: 'PreventContextMenu'};
var $author$project$Puzzle$gridMouseEvents = function (ax) {
	return _List_fromArray(
		[
			$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
			$elm$core$Basics$always(
				$author$project$Puzzle$ForSelf(
					$author$project$Puzzle$HoverGridSpace(ax)))),
			A2(
			$elm$html$Html$Events$custom,
			'contextmenu',
			$elm$json$Json$Decode$succeed(
				{
					message: $author$project$Puzzle$ForSelf($author$project$Puzzle$PreventContextMenu),
					preventDefault: true,
					stopPropagation: true
				}))
		]);
};
var $author$project$StrUtil$scale = function (z) {
	return 'scale(' + ($elm$core$String$fromFloat(z) + ')');
};
var $author$project$Hex$viewHexOutline = function (outline) {
	return A2(
		$elm$svg$Svg$path,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$d(outline),
				$elm$svg$Svg$Attributes$class('hex-outline')
			]),
		_List_Nil);
};
var $author$project$Hex$adjustCenter = F2(
	function (index, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		switch (index.$) {
			case 'I':
				return _Utils_Tuple2(x + 0, y + 0.5);
			case 'II':
				return _Utils_Tuple2(x + 0, y + 0.7);
			case 'III':
				return _Utils_Tuple2(x + 0, y + 0.5);
			case 'IV':
				return _Utils_Tuple2(x + 0, y + 0.8);
			case 'V':
				return _Utils_Tuple2(x + 0, y + 0.5);
			default:
				return _Utils_Tuple2(x + 0, y + 0.8);
		}
	});
var $author$project$Hex$centroid = function (_v0) {
	var _v1 = _v0.b;
	var bx = _v1.a;
	var by = _v1.b;
	var _v2 = _v0.c;
	var cx = _v2.a;
	var cy = _v2.b;
	return _Utils_Tuple2((bx + cx) / 3, (by + cy) / 3);
};
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
var $author$project$Label$class = function (label) {
	return 'label-' + $author$project$Label$toString(label);
};
var $author$project$Label$adjustCenter = F2(
	function (label, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		switch (label.$) {
			case 'Zero':
				return _Utils_Tuple2(x + 0, y + 0);
			case 'One':
				return _Utils_Tuple2(x - 0.3, y + 0);
			case 'Two':
				return _Utils_Tuple2(x + 0, y + 0);
			case 'Three':
				return _Utils_Tuple2(x + 0, y + 0);
			case 'Four':
				return _Utils_Tuple2(x + 0, y + 0);
			case 'Five':
				return _Utils_Tuple2(x + 0, y + 0);
			case 'Six':
				return _Utils_Tuple2(x + 0.1, y + 0);
			case 'Seven':
				return _Utils_Tuple2(x + 0.1, y + 0);
			case 'Eight':
				return _Utils_Tuple2(x + 0, y + 0);
			default:
				return _Utils_Tuple2(x + 0, y + 0);
		}
	});
var $author$project$Label$view = F2(
	function (center, label) {
		var _v0 = A2($author$project$Label$adjustCenter, label, center);
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(x)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(y)),
					$elm$svg$Svg$Attributes$class(
					'center label ' + $author$project$Label$class(label))
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(
					$author$project$Label$toString(label))
				]));
	});
var $author$project$Hex$viewWedge = F2(
	function (index, wedge) {
		var center = A2(
			$author$project$Hex$adjustCenter,
			index,
			$author$project$Hex$centroid(wedge.points));
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(wedge.path),
						$elm$svg$Svg$Attributes$class('wedge'),
						$elm$svg$Svg$Attributes$class(
						$author$project$Label$class(wedge.label))
					]),
				_List_Nil),
				A2($author$project$Label$view, center, wedge.label)
			]);
	});
var $author$project$StrUtil$line = F2(
	function (_v0, _v1) {
		var ax = _v0.a;
		var ay = _v0.b;
		var bx = _v1.a;
		var by = _v1.b;
		return 'M ' + (A2($author$project$StrUtil$spaceDelimit2, ax, ay) + (' L ' + A2($author$project$StrUtil$spaceDelimit2, bx, by)));
	});
var $author$project$Hex$viewWedgeDivider = function (_v0) {
	var a = _v0.a;
	var b = _v0.b;
	return A2(
		$elm$svg$Svg$path,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$d(
				A2($author$project$StrUtil$line, a, b)),
				$elm$svg$Svg$Attributes$class('wedge-outline')
			]),
		_List_Nil);
};
var $author$project$Hex$view = function (_v0) {
	var wedges = _v0.wedges;
	var outline = _v0.outline;
	return A2(
		$elm$svg$Svg$g,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('hex')
			]),
		_Utils_ap(
			$elm$core$List$concat(
				$author$project$HexList$toList(
					A2($author$project$HexList$indexedMap, $author$project$Hex$viewWedge, wedges))),
			_Utils_ap(
				$author$project$HexList$toList(
					A2(
						$author$project$HexList$map,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.points;
							},
							$author$project$Hex$viewWedgeDivider),
						wedges)),
				_List_fromArray(
					[
						$author$project$Hex$viewHexOutline(outline)
					]))));
};
var $author$project$Puzzle$viewDraggedHex = function (_v0) {
	var hex = _v0.hex;
	var position = _v0.position;
	var _v1 = position;
	var x = _v1.a;
	var y = _v1.b;
	return _Utils_Tuple2(
		$elm$core$String$fromInt(hex.id),
		A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					A2($author$project$StrUtil$translate, x, y)),
					$elm$svg$Svg$Attributes$class('hex-container dragging')
				]),
			_List_fromArray(
				[
					$author$project$Hex$view(hex)
				])));
};
var $author$project$Puzzle$viewDraggedHexes = function (drag) {
	if (drag.$ === 'NotDragging') {
		return _List_fromArray(
			[
				_Utils_Tuple2(
				'none',
				$elm$svg$Svg$text(''))
			]);
	} else {
		var hexes = drag.a;
		return A2($elm$core$List$map, $author$project$Puzzle$viewDraggedHex, hexes);
	}
};
var $author$project$Puzzle$StartDraggingHex = F3(
	function (a, b, c) {
		return {$: 'StartDraggingHex', a: a, b: b, c: c};
	});
var $author$project$Puzzle$getClickInfo = F2(
	function (msg, event) {
		return A2(msg, event.button, event.pagePos);
	});
var $mdgriffith$elm_animator$Internal$Interpolate$Specified = function (a) {
	return {$: 'Specified', a: a};
};
var $mdgriffith$elm_animator$Internal$Interpolate$Oscillate = F3(
	function (a, b, c) {
		return {$: 'Oscillate', a: a, b: b, c: c};
	});
var $mdgriffith$elm_animator$Internal$Interpolate$PartialDefault = function (a) {
	return {$: 'PartialDefault', a: a};
};
var $mdgriffith$elm_animator$Internal$Interpolate$Default = {$: 'Default'};
var $mdgriffith$elm_animator$Internal$Interpolate$emptyDefaults = {arriveEarly: $mdgriffith$elm_animator$Internal$Interpolate$Default, arriveSlowly: $mdgriffith$elm_animator$Internal$Interpolate$Default, departLate: $mdgriffith$elm_animator$Internal$Interpolate$Default, departSlowly: $mdgriffith$elm_animator$Internal$Interpolate$Default, wobbliness: $mdgriffith$elm_animator$Internal$Interpolate$Default};
var $mdgriffith$elm_animator$Animator$withDefault = F2(
	function (toDef, currentDefault) {
		if (currentDefault.$ === 'FullDefault') {
			return $mdgriffith$elm_animator$Internal$Interpolate$PartialDefault(
				toDef($mdgriffith$elm_animator$Internal$Interpolate$emptyDefaults));
		} else {
			var thing = currentDefault.a;
			return $mdgriffith$elm_animator$Internal$Interpolate$PartialDefault(
				toDef(thing));
		}
	});
var $mdgriffith$elm_animator$Animator$applyOption = F2(
	function (toOption, movement) {
		if (movement.$ === 'Position') {
			var personality = movement.a;
			var pos = movement.b;
			return A2(
				$mdgriffith$elm_animator$Internal$Interpolate$Position,
				A2($mdgriffith$elm_animator$Animator$withDefault, toOption, personality),
				pos);
		} else {
			var personality = movement.a;
			var dur = movement.b;
			var fn = movement.c;
			return A3(
				$mdgriffith$elm_animator$Internal$Interpolate$Oscillate,
				A2($mdgriffith$elm_animator$Animator$withDefault, toOption, personality),
				dur,
				fn);
		}
	});
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $mdgriffith$elm_animator$Animator$arriveEarly = F2(
	function (p, movement) {
		return A2(
			$mdgriffith$elm_animator$Animator$applyOption,
			function (def) {
				return _Utils_update(
					def,
					{
						arriveEarly: $mdgriffith$elm_animator$Internal$Interpolate$Specified(
							A3($elm$core$Basics$clamp, 0, 1, p))
					});
			},
			movement);
	});
var $mdgriffith$elm_animator$Animator$arriveSmoothly = F2(
	function (s, movement) {
		return A2(
			$mdgriffith$elm_animator$Animator$applyOption,
			function (def) {
				return _Utils_update(
					def,
					{
						arriveSlowly: $mdgriffith$elm_animator$Internal$Interpolate$Specified(
							A3($elm$core$Basics$clamp, 0, 1, s))
					});
			},
			movement);
	});
var $mdgriffith$elm_animator$Animator$leaveLate = F2(
	function (p, movement) {
		return A2(
			$mdgriffith$elm_animator$Animator$applyOption,
			function (def) {
				return _Utils_update(
					def,
					{
						departLate: $mdgriffith$elm_animator$Internal$Interpolate$Specified(
							A3($elm$core$Basics$clamp, 0, 1, p))
					});
			},
			movement);
	});
var $author$project$HexPositions$getPosLagged = F4(
	function (id, leave, arrive, state) {
		var _v0 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, 0),
			A2($elm$core$Dict$get, id, state));
		var x = _v0.a;
		var y = _v0.b;
		return {
			x: A2(
				$mdgriffith$elm_animator$Animator$arriveSmoothly,
				1,
				A2(
					$mdgriffith$elm_animator$Animator$arriveEarly,
					arrive,
					A2(
						$mdgriffith$elm_animator$Animator$leaveLate,
						leave,
						$mdgriffith$elm_animator$Animator$at(x)))),
			y: A2(
				$mdgriffith$elm_animator$Animator$arriveSmoothly,
				1,
				A2(
					$mdgriffith$elm_animator$Animator$arriveEarly,
					arrive,
					A2(
						$mdgriffith$elm_animator$Animator$leaveLate,
						leave,
						$mdgriffith$elm_animator$Animator$at(y))))
		};
	});
var $author$project$HexPositions$getLagged = F4(
	function (_v0, index, count, dict) {
		var id = _v0.id;
		var _v1 = _Utils_Tuple3(index, count, 0.5);
		var i = _v1.a;
		var n = _v1.b;
		var t = _v1.c;
		var arrive = (t * (n - i)) / n;
		var leave = (t * i) / n;
		var _v2 = A2(
			$mdgriffith$elm_animator$Animator$xy,
			dict,
			A3($author$project$HexPositions$getPosLagged, id, leave, arrive));
		var x = _v2.x;
		var y = _v2.y;
		return _Utils_Tuple2(x, y);
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'mousedown', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $author$project$Puzzle$viewHex = F4(
	function (positions, count, index, hex) {
		var _v0 = A4($author$project$HexPositions$getLagged, hex, count - index, count, positions);
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			$elm$core$String$fromInt(hex.id),
			A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('hex-container'),
						$elm$svg$Svg$Attributes$transform(
						A2($author$project$StrUtil$translate, x, y)),
						$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onDown(
						A2(
							$elm$core$Basics$composeR,
							$author$project$Puzzle$getClickInfo(
								$author$project$Puzzle$StartDraggingHex(hex)),
							$author$project$Puzzle$ForParent))
					]),
				_List_fromArray(
					[
						$author$project$Hex$view(hex)
					])));
	});
var $author$project$Puzzle$viewNewGame = F2(
	function (size, complete) {
		var hidden = complete ? '' : 'hidden';
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('new-game'),
					$elm$svg$Svg$Attributes$class(hidden),
					$elm$svg$Svg$Attributes$x('205'),
					$elm$svg$Svg$Attributes$y('130'),
					$elm$html$Html$Events$onClick(
					$author$project$Puzzle$ForSelf(
						$author$project$Puzzle$StartGame(size)))
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text('NEW GAME')
				]));
	});
var $author$project$Puzzle$HoverOffGrid = {$: 'HoverOffGrid'};
var $author$project$Puzzle$viewOffGridTarget = function (drag) {
	if (drag.$ === 'NotDragging') {
		return $elm$svg$Svg$text('');
	} else {
		var _v1 = $author$project$Graphics$screen;
		var w = _v1.w;
		var h = _v1.h;
		return A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('off-grid-target'),
					A2(
					$elm$html$Html$Events$custom,
					'contextmenu',
					$elm$json$Json$Decode$succeed(
						{
							message: $author$project$Puzzle$ForSelf($author$project$Puzzle$PreventContextMenu),
							preventDefault: true,
							stopPropagation: true
						})),
					$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
					$elm$core$Basics$always(
						$author$project$Puzzle$ForSelf($author$project$Puzzle$HoverOffGrid))),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(-w)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$String$fromFloat(-h)),
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(3 * w)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromFloat(3 * h))
				]),
			_List_Nil);
	}
};
var $author$project$Puzzle$OrganizeHexes = {$: 'OrganizeHexes'};
var $author$project$Puzzle$viewOrganize = function (complete) {
	var hidden = complete ? 'hidden' : '';
	return A2(
		$elm$svg$Svg$text_,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('organize'),
				$elm$svg$Svg$Attributes$class(hidden),
				$elm$svg$Svg$Attributes$x('208'),
				$elm$svg$Svg$Attributes$y('130'),
				$elm$html$Html$Events$onClick(
				$author$project$Puzzle$ForSelf($author$project$Puzzle$OrganizeHexes))
			]),
		_List_fromArray(
			[
				$elm$svg$Svg$text('ORGANIZE')
			]));
};
var $author$project$Puzzle$PausePuzzle = {$: 'PausePuzzle'};
var $author$project$Puzzle$viewPauseButton = A2(
	$elm$svg$Svg$text_,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('back center'),
			$elm$svg$Svg$Attributes$x('17'),
			$elm$svg$Svg$Attributes$y('130'),
			$elm$html$Html$Events$onClick(
			$author$project$Puzzle$ForParent($author$project$Puzzle$PausePuzzle))
		]),
	_List_fromArray(
		[
			$elm$svg$Svg$text('BACK')
		]));
var $elm$core$List$map3 = _List_map3;
var $author$project$Puzzle$viewTimer = function (timer) {
	var xs = _List_fromArray(
		[10.2, 3.4, -3.4, -10.2]);
	var thresholds = _List_fromArray(
		[0, 10, 100, 1000]);
	var seconds = (timer.time / 1000) | 0;
	var tens = A2($elm$core$Basics$modBy, 10, (seconds / 10) | 0);
	var thousands = (seconds / 1000) | 0;
	var ones = A2($elm$core$Basics$modBy, 10, seconds);
	var makeText = F3(
		function (x, value, threshold) {
			return (_Utils_cmp(seconds, threshold) > -1) ? A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('timer'),
						$elm$svg$Svg$Attributes$x(
						$elm$core$String$fromFloat(x)),
						$elm$svg$Svg$Attributes$y('0')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						$elm$core$String$fromInt(value))
					])) : $elm$svg$Svg$text('');
		});
	var hundreds = A2($elm$core$Basics$modBy, 10, (seconds / 100) | 0);
	var values = _List_fromArray(
		[ones, tens, hundreds, thousands]);
	return A2(
		$elm$svg$Svg$g,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$transform(
				A2($author$project$StrUtil$translate, 24.5, 7))
			]),
		A4($elm$core$List$map3, makeText, xs, values, thresholds));
};
var $author$project$Puzzle$view = function (model) {
	var status = function () {
		var _v1 = model.verified;
		switch (_v1.$) {
			case 'Solved':
				return 'winner';
			case 'Incorrect':
				return 'incorrect';
			default:
				return '';
		}
	}();
	var mapViewHex = A2(
		$author$project$Puzzle$viewHex,
		model.positions,
		$elm$core$List$length(model.hexes));
	var dragging = function () {
		var _v0 = model.drag;
		if (_v0.$ === 'NotDragging') {
			return '';
		} else {
			return 'dragging';
		}
	}();
	return A2(
		$elm$svg$Svg$g,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('puzzle'),
				$elm$svg$Svg$Attributes$class(status),
				$elm$svg$Svg$Attributes$class(dragging)
			]),
		_List_fromArray(
			[
				$author$project$Puzzle$viewOffGridTarget(model.drag),
				A3($elm$html$Html$Lazy$lazy2, $author$project$HexGrid$view, $author$project$Puzzle$gridMouseEvents, model.grid),
				A3(
				$elm$svg$Svg$Keyed$node,
				'g',
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('puzzle-pieces'),
						$elm$svg$Svg$Attributes$transform(
						$author$project$StrUtil$scale(
							$author$project$Puzzle$zoomFor(model.size)))
					]),
				_Utils_ap(
					A2(
						$elm$core$List$indexedMap,
						mapViewHex,
						$elm$core$List$reverse(model.hexes)),
					$author$project$Puzzle$viewDraggedHexes(model.drag))),
				$author$project$Puzzle$viewTimer(model.timer),
				$author$project$Puzzle$viewPauseButton,
				$author$project$Puzzle$viewOrganize(model.complete),
				A2($author$project$Puzzle$viewNewGame, model.size, model.complete)
			]));
};
var $author$project$Main$viewGame = F2(
	function (options, puzzle) {
		var palette = $author$project$Palette$class(options.palette);
		var labels = function () {
			var _v0 = options.labelState;
			if (_v0.$ === 'On') {
				return '';
			} else {
				return 'no-labels';
			}
		}();
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('palette'),
						$elm$svg$Svg$Attributes$class(palette),
						$elm$svg$Svg$Attributes$class(labels)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$map,
						$author$project$Main$puzzleTranslator,
						$author$project$Puzzle$view(puzzle))
					]))
			]);
	});
var $elm$svg$Svg$animateTransform = $elm$svg$Svg$trustedNode('animateTransform');
var $elm$svg$Svg$Attributes$attributeType = _VirtualDom_attribute('attributeType');
var $elm$svg$Svg$Attributes$calcMode = _VirtualDom_attribute('calcMode');
var $author$project$Title$howToLetters = _List_fromArray(
	['H', 'O', 'W', 'T', 'O', 'P', 'L', 'A', 'Y']);
var $author$project$Title$howToPositions = _List_fromArray(
	['0', '0', '0', '0', '0', '0', '0', '0', '0']);
var $author$project$Title$howTo = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$howToLetters, $author$project$Title$howToPositions);
var $elm$svg$Svg$Attributes$keySplines = _VirtualDom_attribute('keySplines');
var $elm$svg$Svg$Attributes$keyTimes = _VirtualDom_attribute('keyTimes');
var $author$project$StrUtil$transform = F3(
	function (x, y, zoom) {
		return 'translate(' + (A2($author$project$StrUtil$spaceDelimit2, x, y) + (') scale(' + ($elm$core$String$fromFloat(zoom) + ')')));
	});
var $elm$svg$Svg$Attributes$type_ = _VirtualDom_attribute('type');
var $author$project$Main$viewFinePrint = F2(
	function (label, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('fine-print left'),
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
var $author$project$Main$viewHowTo = function (titleAnimation) {
	var hex3 = A2(
		$author$project$Hex$create,
		3,
		A6($author$project$HexList$HexList, $author$project$Label$Six, $author$project$Label$Two, $author$project$Label$One, $author$project$Label$Two, $author$project$Label$Eight, $author$project$Label$Five));
	var hex2 = A2(
		$author$project$Hex$create,
		2,
		A6($author$project$HexList$HexList, $author$project$Label$Four, $author$project$Label$Eight, $author$project$Label$Six, $author$project$Label$Seven, $author$project$Label$Six, $author$project$Label$One));
	var hex1 = A2(
		$author$project$Hex$create,
		1,
		A6($author$project$HexList$HexList, $author$project$Label$Four, $author$project$Label$Two, $author$project$Label$Seven, $author$project$Label$Four, $author$project$Label$Two, $author$project$Label$Seven));
	return _List_fromArray(
		[
			A2($author$project$Title$view, titleAnimation, $author$project$Title$howTo),
			A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x('120'),
					$elm$svg$Svg$Attributes$y('30'),
					$elm$svg$Svg$Attributes$class('title center')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text('HOW TO PLAY')
				])),
			A2(
			$author$project$Main$viewFinePrint,
			'The goal of the game is to place all of the',
			_Utils_Tuple2(3, 45)),
			A2(
			$author$project$Main$viewFinePrint,
			'hexagonal tiles in the grid such that all of',
			_Utils_Tuple2(3, 53)),
			A2(
			$author$project$Main$viewFinePrint,
			'the colors that are touching are matched.',
			_Utils_Tuple2(3, 61)),
			A2(
			$author$project$Main$viewFinePrint,
			'',
			_Utils_Tuple2(3, 69)),
			A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$id('howto'),
					$elm$svg$Svg$Attributes$fill('transparent'),
					$elm$svg$Svg$Attributes$stroke('transparent'),
					$elm$svg$Svg$Attributes$x('0'),
					$elm$svg$Svg$Attributes$y('0'),
					$elm$svg$Svg$Attributes$width('240'),
					$elm$svg$Svg$Attributes$height('135')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('palette palette-material'),
					$elm$svg$Svg$Attributes$transform(
					A3($author$project$StrUtil$transform, 220, 65, 0.67))
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('grid-hex'),
							$elm$svg$Svg$Attributes$d('M 20 -34.6 L 10 -52 L -10 -52 L -20 -34.6 L -10 -17.3 L 10 -17.3 Z')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('grid-hex'),
							$elm$svg$Svg$Attributes$d('M 20 0 L 10 -17.3 L -10 -17.3 L -20 0 L -10 17.3 L 10 17.3 Z')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('grid-hex'),
							$elm$svg$Svg$Attributes$d('M -10 -17.3 L -20 -34.6 L -40 -34.6 L -50 -17.3 L -40 0 L -20 0 Z')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$transform(
							A2($author$project$StrUtil$translate, 0, -34.6))
						]),
					_List_fromArray(
						[
							$author$project$Hex$view(hex1)
						])),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$transform(
							A2($author$project$StrUtil$translate, -30, -17.3))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$animateTransform,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$attributeName('transform'),
									$elm$svg$Svg$Attributes$attributeType('XML'),
									$elm$svg$Svg$Attributes$type_('translate'),
									$elm$svg$Svg$Attributes$values('-75 -17.3 ; -75 -17.3 ; -30 -17.3 ; -30 -17.3'),
									$elm$svg$Svg$Attributes$dur('5s'),
									$elm$svg$Svg$Attributes$repeatCount('indefinite'),
									$elm$svg$Svg$Attributes$keyTimes('0 ; 0.25 ; 0.5 ; 1'),
									$elm$svg$Svg$Attributes$keySplines('0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1'),
									$elm$svg$Svg$Attributes$calcMode('spline'),
									$elm$svg$Svg$Attributes$begin('howto.mouseenter')
								]),
							_List_Nil),
							$author$project$Hex$view(hex2)
						])),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$transform(
							A2($author$project$StrUtil$translate, 0, 0))
						]),
					_List_fromArray(
						[
							$author$project$Hex$view(hex3)
						]))
				])),
			A2(
			$author$project$Main$viewFinePrint,
			'Left click and drag',
			_Utils_Tuple2(3, 81)),
			A2(
			$author$project$Main$viewFinePrint,
			'moves one hex.',
			_Utils_Tuple2(3, 89)),
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('palette palette-material'),
					$elm$svg$Svg$Attributes$transform(
					A3($author$project$StrUtil$transform, 15, 110, 0.67))
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$transform(
							A2($author$project$StrUtil$translate, 0, 0))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$animateTransform,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$attributeName('transform'),
									$elm$svg$Svg$Attributes$attributeType('XML'),
									$elm$svg$Svg$Attributes$type_('translate'),
									$elm$svg$Svg$Attributes$values('0 0 ; 0 0 ; 60 0 ; 60 0'),
									$elm$svg$Svg$Attributes$dur('5s'),
									$elm$svg$Svg$Attributes$repeatCount('indefinite'),
									$elm$svg$Svg$Attributes$keyTimes('0 ; 0.25 ; 0.5 ; 1'),
									$elm$svg$Svg$Attributes$keySplines('0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1'),
									$elm$svg$Svg$Attributes$calcMode('spline'),
									$elm$svg$Svg$Attributes$begin('howto.mouseenter')
								]),
							_List_Nil),
							$author$project$Hex$view(hex2)
						]))
				])),
			A2(
			$author$project$Main$viewFinePrint,
			'Right click and drag (only on hexes in',
			_Utils_Tuple2(90, 83)),
			A2(
			$author$project$Main$viewFinePrint,
			'the grid) moves all connected hexes.',
			_Utils_Tuple2(90, 91)),
			A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('palette palette-material'),
					$elm$svg$Svg$Attributes$transform(
					A3($author$project$StrUtil$transform, 165, 123, 0.53))
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('grid-hex'),
							$elm$svg$Svg$Attributes$d('M 20 -34.6 L 10 -52 L -10 -52 L -20 -34.6 L -10 -17.3 L 10 -17.3 Z')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('grid-hex'),
							$elm$svg$Svg$Attributes$d('M 20 0 L 10 -17.3 L -10 -17.3 L -20 0 L -10 17.3 L 10 17.3 Z')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$path,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('grid-hex'),
							$elm$svg$Svg$Attributes$d('M -10 -17.3 L -20 -34.6 L -40 -34.6 L -50 -17.3 L -40 0 L -20 0 Z')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$transform(
							A2($author$project$StrUtil$translate, 0, -34.6))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$animateTransform,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$attributeName('transform'),
									$elm$svg$Svg$Attributes$attributeType('XML'),
									$elm$svg$Svg$Attributes$type_('translate'),
									$elm$svg$Svg$Attributes$values('0 -34.6 ; 0 -34.6 ; 85 -34.6 ; 85 -34.6'),
									$elm$svg$Svg$Attributes$dur('5s'),
									$elm$svg$Svg$Attributes$repeatCount('indefinite'),
									$elm$svg$Svg$Attributes$keyTimes('0 ; 0.25 ; 0.5 ; 1'),
									$elm$svg$Svg$Attributes$keySplines('0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1'),
									$elm$svg$Svg$Attributes$calcMode('spline'),
									$elm$svg$Svg$Attributes$begin('howto.mouseenter')
								]),
							_List_Nil),
							$author$project$Hex$view(hex1)
						])),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$transform(
							A2($author$project$StrUtil$translate, -30, -17.3))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$animateTransform,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$attributeName('transform'),
									$elm$svg$Svg$Attributes$attributeType('XML'),
									$elm$svg$Svg$Attributes$type_('translate'),
									$elm$svg$Svg$Attributes$values('-30 -17.3 ; -30 -17.3 ; 55 -17.3 ; 55 -17.3'),
									$elm$svg$Svg$Attributes$dur('5s'),
									$elm$svg$Svg$Attributes$repeatCount('indefinite'),
									$elm$svg$Svg$Attributes$keyTimes('0 ; 0.25 ; 0.5 ; 1'),
									$elm$svg$Svg$Attributes$keySplines('0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1'),
									$elm$svg$Svg$Attributes$calcMode('spline'),
									$elm$svg$Svg$Attributes$begin('howto.mouseenter')
								]),
							_List_Nil),
							$author$project$Hex$view(hex2)
						])),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$transform(
							A2($author$project$StrUtil$translate, 0, 0))
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$animateTransform,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$attributeName('transform'),
									$elm$svg$Svg$Attributes$attributeType('XML'),
									$elm$svg$Svg$Attributes$type_('translate'),
									$elm$svg$Svg$Attributes$values('0 0 ; 0 0 ; 85 0 ; 85 0'),
									$elm$svg$Svg$Attributes$dur('5s'),
									$elm$svg$Svg$Attributes$repeatCount('indefinite'),
									$elm$svg$Svg$Attributes$keyTimes('0 ; 0.25 ; 0.5 ; 1'),
									$elm$svg$Svg$Attributes$keySplines('0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1'),
									$elm$svg$Svg$Attributes$calcMode('spline'),
									$elm$svg$Svg$Attributes$begin('howto.mouseenter')
								]),
							_List_Nil),
							$author$project$Hex$view(hex3)
						]))
				])),
			$author$project$Main$viewBackButton($author$project$Main$TitleScreen)
		]);
};
var $author$project$Main$AboutScreen = {$: 'AboutScreen'};
var $elm$svg$Svg$a = $elm$svg$Svg$trustedNode('a');
var $author$project$Title$finePrintLetters = _List_fromArray(
	['T', 'H', 'E', 'F', 'I', 'N', 'E', 'P', 'R', 'I', 'N', 'T']);
var $author$project$Title$finePrintPositions = _List_fromArray(
	['49.3', '63.6', '77.1', '94.8', '103.7', '113.6', '127.2', '144.9', '157.5', '166.4', '176.2', '190.6']);
var $author$project$Title$finePrint = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$finePrintLetters, $author$project$Title$finePrintPositions);
var $elm$svg$Svg$Attributes$xlinkHref = function (value) {
	return A3(
		_VirtualDom_attributeNS,
		'http://www.w3.org/1999/xlink',
		'xlink:href',
		_VirtualDom_noJavaScriptUri(value));
};
var $author$project$Main$viewLicense = function (titleAnimation) {
	return _List_fromArray(
		[
			A2($author$project$Title$view, titleAnimation, $author$project$Title$finePrint),
			A2(
			$author$project$Main$viewFinePrint,
			'Hexasperate Copyright © 2020 Tom Smilack.',
			_Utils_Tuple2(40.3, 50)),
			A2(
			$author$project$Main$viewFinePrint,
			'This program comes with ABSOLUTELY NO',
			_Utils_Tuple2(40.3, 58)),
			A2(
			$author$project$Main$viewFinePrint,
			'WARRANTY. This is free software, and you',
			_Utils_Tuple2(40.3, 66)),
			A2(
			$author$project$Main$viewFinePrint,
			'are welcome to redistribute it under certain',
			_Utils_Tuple2(40.3, 74)),
			A2(
			$author$project$Main$viewFinePrint,
			'conditions. For more details see',
			_Utils_Tuple2(40.3, 82)),
			A2(
			$elm$svg$Svg$a,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$xlinkHref('https://github.com/smilack/hexasperate/LICENSE.md')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Main$viewFinePrint,
					'https://github.com/smilack/hexasperate/LICENSE.md',
					_Utils_Tuple2(40.3, 90))
				])),
			A2(
			$author$project$Main$viewFinePrint,
			'The source code for Hexasperate is available at',
			_Utils_Tuple2(40.3, 102)),
			A2(
			$elm$svg$Svg$a,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$xlinkHref('https://github.com/smilack/hexasperate')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Main$viewFinePrint,
					'https://github.com/smilack/hexasperate',
					_Utils_Tuple2(40.3, 110))
				])),
			$author$project$Main$viewBackButton($author$project$Main$AboutScreen)
		]);
};
var $author$project$Title$optionsLetters = _List_fromArray(
	['O', 'P', 'T', 'I', 'O', 'N', 'S']);
var $author$project$Title$optionsPositions = _List_fromArray(
	['83.4', '97.5', '110.3', '120.2', '130.5', '145.4', '158.5']);
var $author$project$Title$options = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$optionsLetters, $author$project$Title$optionsPositions);
var $author$project$Options$SetBackgroundAnimation = function (a) {
	return {$: 'SetBackgroundAnimation', a: a};
};
var $author$project$Options$SetBackgroundColor = function (a) {
	return {$: 'SetBackgroundColor', a: a};
};
var $author$project$Options$SetBackgroundPattern = function (a) {
	return {$: 'SetBackgroundPattern', a: a};
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
var $author$project$Options$backgroundColorStateNames = function (bg) {
	if (bg.$ === 'BluePurple') {
		return 'Blue/Purple';
	} else {
		return 'Dark Mode';
	}
};
var $author$project$Options$backgroundColorVariants = _List_fromArray(
	[$author$project$Options$BluePurple, $author$project$Options$DarkMode]);
var $author$project$Options$backgroundColorStates = _Utils_Tuple2($author$project$Options$backgroundColorVariants, $author$project$Options$backgroundColorStateNames);
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
var $author$project$Palette$classic = $author$project$Palette$Palette('#858585')('#858585')('#858585')('#858585')('#858585')('#858585')('#858585')('#858585')('#858585')('#858585');
var $author$project$Palette$colorblind = $author$project$Palette$Palette('#323232')('#bf3465')('#50b29e')('#d9d9d9')('#731683')('#1c6ccc')('#21bcff')('#dfa5e5')('#db6d1b')('#f4e345');
var $author$project$Palette$grayscale = $author$project$Palette$Palette('#000000')('#1e1e1e')('#353535')('#4e4e4e')('#696969')('#858585')('#a2a2a2')('#c0c0c0')('#dfdfdf')('#ffffff');
var $author$project$Palette$material = $author$project$Palette$Palette('#FF5722')('#E91E63')('#9C27B0')('#3F51B5')('#2196F3')('#00897B')('#4CAF50')('#FFEB3B')('#FF9800')('#795548');
var $author$project$Palette$mondrian = $author$project$Palette$Palette('#ffffff')('#292929')('#dd0100')('#fac901')('#225095')('#ffffff')('#292929')('#dd0100')('#fac901')('#225095');
var $author$project$Palette$resistors = $author$project$Palette$Palette('#000000')('#884400')('#ff0000')('#ff8800')('#ffff00')('#00ee00')('#1122ff')('#8800ff')('#888888')('#ffffff');
var $author$project$Palette$transparent = $author$project$Palette$Palette('transparent')('transparent')('transparent')('transparent')('transparent')('transparent')('transparent')('transparent')('transparent')('transparent');
var $author$project$Palette$get = function (option) {
	switch (option.$) {
		case 'Resistors':
			return $author$project$Palette$resistors;
		case 'Mondrian':
			return $author$project$Palette$mondrian;
		case 'Material':
			return $author$project$Palette$material;
		case 'ColorBlind':
			return $author$project$Palette$colorblind;
		case 'Grayscale':
			return $author$project$Palette$grayscale;
		case 'Classic':
			return $author$project$Palette$classic;
		default:
			return $author$project$Palette$transparent;
	}
};
var $author$project$Options$onOffStateNames = function (onOff) {
	if (onOff.$ === 'On') {
		return 'On';
	} else {
		return 'Off';
	}
};
var $author$project$Options$onOffVariants = _List_fromArray(
	[$author$project$Options$On, $author$project$Options$Off]);
var $author$project$Options$onOffStates = _Utils_Tuple2($author$project$Options$onOffVariants, $author$project$Options$onOffStateNames);
var $author$project$Palette$options = _List_fromArray(
	[$author$project$Palette$Resistors, $author$project$Palette$Mondrian, $author$project$Palette$Material, $author$project$Palette$ColorBlind, $author$project$Palette$Grayscale, $author$project$Palette$Classic, $author$project$Palette$Transparent]);
var $author$project$Options$palettes = _Utils_Tuple2($author$project$Palette$options, $author$project$Palette$optionNames);
var $author$project$Options$viewHardMode = F2(
	function (palette, onoff) {
		var hardMode = A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('180.75'),
							$elm$svg$Svg$Attributes$y('118.5'),
							$elm$svg$Svg$Attributes$class('text hard-mode center')
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text('Hard mode')
						])),
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('180.75'),
							$elm$svg$Svg$Attributes$y('126.5'),
							$elm$svg$Svg$Attributes$class('text hard-mode center')
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text('unlocked!')
						]))
				]));
		var _v0 = _Utils_Tuple2(palette, onoff);
		_v0$2:
		while (true) {
			if (_v0.b.$ === 'Off') {
				switch (_v0.a.$) {
					case 'Classic':
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
					$elm$svg$Svg$Attributes$x('106'),
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
					A2($author$project$StrUtil$translate, 47, y))
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
var $author$project$Label$labels = _List_fromArray(
	[$author$project$Label$Zero, $author$project$Label$One, $author$project$Label$Two, $author$project$Label$Three, $author$project$Label$Four, $author$project$Label$Five, $author$project$Label$Six, $author$project$Label$Seven, $author$project$Label$Eight, $author$project$Label$Nine]);
var $author$project$Options$viewSwatch = F3(
	function (i, color, label) {
		var w = 11.1;
		var x = A2(
			$elm$core$Basics$modBy,
			5 * $elm$core$Basics$round(w),
			$elm$core$Basics$round(w) * i);
		var y = $elm$core$Basics$round(w) * ((i / 5) | 0);
		var center = _Utils_Tuple2(x + (w / 2), (y + (w / 2)) + 1);
		return _List_fromArray(
			[
				A2(
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
				_List_Nil),
				A2($author$project$Label$view, center, label)
			]);
	});
var $author$project$Options$viewTilePreview = F3(
	function (_v0, palette, labelState) {
		var x = _v0.a;
		var y = _v0.b;
		var labelClass = function () {
			if (labelState.$ === 'On') {
				return '';
			} else {
				return 'no-labels';
			}
		}();
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$transform(
					A2($author$project$StrUtil$translate, x, y)),
					$elm$svg$Svg$Attributes$class('tile-preview'),
					$elm$svg$Svg$Attributes$class(labelClass)
				]),
			$elm$core$List$concat(
				A4(
					$elm$core$List$map3,
					$author$project$Options$viewSwatch,
					A2($elm$core$List$range, 0, 9),
					$author$project$Palette$colors(palette),
					$author$project$Label$labels)));
	});
var $author$project$Options$view = function (model) {
	return A2(
		$elm$svg$Svg$g,
		_List_Nil,
		_List_fromArray(
			[
				A5($author$project$Options$viewOption, 'Background Animation', 50, $author$project$Options$onOffStates, model.backgroundAnimation, $author$project$Options$SetBackgroundAnimation),
				A5($author$project$Options$viewOption, 'Background Pattern', 61, $author$project$Options$onOffStates, model.backgroundPattern, $author$project$Options$SetBackgroundPattern),
				A5($author$project$Options$viewOption, 'Background Color', 72, $author$project$Options$backgroundColorStates, model.backgroundColor, $author$project$Options$SetBackgroundColor),
				A5($author$project$Options$viewOption, 'Title Animation', 83, $author$project$Options$onOffStates, model.titleAnimation, $author$project$Options$SetTitleAnimation),
				A5($author$project$Options$viewOption, 'Color Palette', 94, $author$project$Options$palettes, model.palette, $author$project$Options$SetPalette),
				A5($author$project$Options$viewOption, 'Tile Labels', 105, $author$project$Options$onOffStates, model.labelState, $author$project$Options$SetLabelState),
				A3(
				$author$project$Options$viewTilePreview,
				_Utils_Tuple2(153, 111),
				$author$project$Palette$get(model.palette),
				model.labelState),
				A2($author$project$Options$viewHardMode, model.palette, model.labelState)
			]));
};
var $author$project$Main$viewOptions = function (options) {
	return _List_fromArray(
		[
			A2($author$project$Title$view, options.titleAnimation, $author$project$Title$options),
			A2(
			$elm$html$Html$map,
			$author$project$Main$OptionMsg,
			$author$project$Options$view(options)),
			$author$project$Main$viewBackButton($author$project$Main$TitleScreen)
		]);
};
var $author$project$Title$bestTimesLetters = _List_fromArray(
	['B', 'E', 'S', 'T', 'T', 'I', 'M', 'E', 'S']);
var $author$project$Title$bestTimesPositions = _List_fromArray(
	['67.7', '80.5', '92.7', '104.8', '124.6', '134.4', '145.6', '160.8', '173']);
var $author$project$Title$bestTimes = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$bestTimesLetters, $author$project$Title$bestTimesPositions);
var $author$project$BestTimes$viewListHeader = F2(
	function (x, name) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('list-header center'),
					$elm$svg$Svg$Attributes$x(
					$elm$core$String$fromFloat(x)),
					$elm$svg$Svg$Attributes$y('50')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(name)
				]));
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $author$project$BestTimes$format = function (mT) {
	if (mT.$ === 'Just') {
		var t = mT.a;
		return $elm$core$String$fromInt((t / 1000) | 0) + ('.' + A3(
			$elm$core$String$padLeft,
			3,
			_Utils_chr('0'),
			$elm$core$String$fromInt(
				A2($elm$core$Basics$modBy, 1000, t))));
	} else {
		return '-';
	}
};
var $author$project$BestTimes$viewTimeList = F2(
	function (x, times) {
		var viewTime = F2(
			function (i, mT) {
				return A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('list-entry'),
							$elm$svg$Svg$Attributes$x(
							$elm$core$String$fromFloat(x + 13)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$String$fromInt(50 + (12 * (i + 1))))
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text(
							$author$project$BestTimes$format(mT))
						]));
			});
		var pads = A2(
			$elm$core$List$repeat,
			5 - $elm$core$List$length(times),
			$elm$core$Maybe$Nothing);
		var justTimes = A2($elm$core$List$map, $elm$core$Maybe$Just, times);
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('times-list')
				]),
			A2(
				$elm$core$List$indexedMap,
				viewTime,
				_Utils_ap(justTimes, pads)));
	});
var $author$project$BestTimes$view = function (_v0) {
	var small = _v0.small;
	var medium = _v0.medium;
	var large = _v0.large;
	var huge = _v0.huge;
	var x4 = ($author$project$Graphics$screen.w * 4) / 5;
	var x3 = ($author$project$Graphics$screen.w * 3) / 5;
	var x2 = ($author$project$Graphics$screen.w * 2) / 5;
	var x1 = ($author$project$Graphics$screen.w * 1) / 5;
	return A2(
		$elm$svg$Svg$g,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('best-times')
			]),
		_List_fromArray(
			[
				A2($author$project$BestTimes$viewListHeader, x1, 'SMALL'),
				A2($author$project$BestTimes$viewTimeList, x1, small),
				A2($author$project$BestTimes$viewListHeader, x2, 'MEDIUM'),
				A2($author$project$BestTimes$viewTimeList, x2, medium),
				A2($author$project$BestTimes$viewListHeader, x3, 'LARGE'),
				A2($author$project$BestTimes$viewTimeList, x3, large),
				A2($author$project$BestTimes$viewListHeader, x4, 'HUGE'),
				A2($author$project$BestTimes$viewTimeList, x4, huge)
			]));
};
var $author$project$Main$viewTimes = F2(
	function (titleAnimation, bestTimes) {
		return _List_fromArray(
			[
				A2($author$project$Title$view, titleAnimation, $author$project$Title$bestTimes),
				$author$project$BestTimes$view(bestTimes),
				$author$project$Main$viewBackButton($author$project$Main$TitleScreen)
			]);
	});
var $author$project$Main$BestTimes = {$: 'BestTimes'};
var $author$project$Main$HowToScreen = {$: 'HowToScreen'};
var $author$project$Main$OptionsScreen = {$: 'OptionsScreen'};
var $author$project$Title$hexasperateLetters = _List_fromArray(
	['H', 'E', 'X', 'A', 'S', 'P', 'E', 'R', 'A', 'T', 'E']);
var $author$project$Title$hexasperatePositions = _List_fromArray(
	['55', '68', '81.8', '96.9', '110', '122.1', '134.8', '147.5', '161.7', '171.9', '185.5']);
var $author$project$Title$hexasperate = A3($elm$core$List$map2, $elm$core$Tuple$pair, $author$project$Title$hexasperateLetters, $author$project$Title$hexasperatePositions);
var $author$project$Main$viewTitleScreen = function (titleAnimation) {
	var _v0 = $author$project$Graphics$middle;
	var x = _v0.a;
	return _List_fromArray(
		[
			A2($author$project$Title$view, titleAnimation, $author$project$Title$hexasperate),
			A3(
			$author$project$Main$viewMenuOption,
			'PLAY',
			_Utils_Tuple2(x, 60),
			$author$project$Main$ChangeScene($author$project$Main$DifficultyMenu)),
			A3(
			$author$project$Main$viewMenuOption,
			'BEST TIMES',
			_Utils_Tuple2(x, 75),
			$author$project$Main$ChangeScene($author$project$Main$BestTimes)),
			A3(
			$author$project$Main$viewMenuOption,
			'HOW TO PLAY',
			_Utils_Tuple2(x, 90),
			$author$project$Main$ChangeScene($author$project$Main$HowToScreen)),
			A3(
			$author$project$Main$viewMenuOption,
			'OPTIONS',
			_Utils_Tuple2(x, 105),
			$author$project$Main$ChangeScene($author$project$Main$OptionsScreen)),
			A3(
			$author$project$Main$viewMenuOption,
			'ABOUT',
			_Utils_Tuple2(x, 120),
			$author$project$Main$ChangeScene($author$project$Main$AboutScreen))
		]);
};
var $author$project$Main$viewScene = F2(
	function (_v0, scene) {
		var options = _v0.options;
		var puzzle = _v0.puzzle;
		var bestTimes = _v0.bestTimes;
		var _v1 = $author$project$Main$getSceneCamera(scene);
		var x = _v1.x;
		var y = _v1.y;
		var transform = $elm$svg$Svg$Attributes$transform(
			A2($author$project$StrUtil$translate, x, y));
		switch (scene.$) {
			case 'TitleScreen':
				return _Utils_Tuple2(
					'title-screen',
					A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								transform,
								$elm$svg$Svg$Attributes$class('title-screen')
							]),
						$author$project$Main$viewTitleScreen(options.titleAnimation)));
			case 'DifficultyMenu':
				return _Utils_Tuple2(
					'difficulty-menu',
					A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								transform,
								$elm$svg$Svg$Attributes$class('difficulty-menu')
							]),
						A2($author$project$Main$viewDifficultyMenu, options.titleAnimation, puzzle)));
			case 'OptionsScreen':
				return _Utils_Tuple2(
					'options-screen',
					A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								transform,
								$elm$svg$Svg$Attributes$class('options-screen')
							]),
						$author$project$Main$viewOptions(options)));
			case 'AboutScreen':
				return _Utils_Tuple2(
					'about-screen',
					A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								transform,
								$elm$svg$Svg$Attributes$class('about-screen')
							]),
						$author$project$Main$viewAbout(options.titleAnimation)));
			case 'LicenseScreen':
				return _Utils_Tuple2(
					'license-screen',
					A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								transform,
								$elm$svg$Svg$Attributes$class('license-screen')
							]),
						$author$project$Main$viewLicense(options.titleAnimation)));
			case 'GameBoard':
				return _Utils_Tuple2(
					'game-board',
					A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								transform,
								$elm$svg$Svg$Attributes$class('game-board')
							]),
						A2($author$project$Main$viewGame, options, puzzle)));
			case 'BestTimes':
				return _Utils_Tuple2(
					'best-times',
					A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								transform,
								$elm$svg$Svg$Attributes$class('best-times')
							]),
						A2($author$project$Main$viewTimes, options.titleAnimation, bestTimes)));
			default:
				return _Utils_Tuple2(
					'how-to',
					A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								transform,
								$elm$svg$Svg$Attributes$class('how-to')
							]),
						$author$project$Main$viewHowTo(options.titleAnimation)));
		}
	});
var $author$project$Main$viewGameContent = function (model) {
	var previous = $mdgriffith$elm_animator$Animator$previous(model.scene);
	var current = $mdgriffith$elm_animator$Animator$current(model.scene);
	var scenes = _Utils_eq(current, previous) ? _List_fromArray(
		[current]) : _List_fromArray(
		[previous, current]);
	return A3(
		$elm$svg$Svg$Keyed$node,
		'g',
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('game-content')
			]),
		A2(
			$elm$core$List$map,
			$author$project$Main$viewScene(model),
			scenes));
};
var $author$project$Main$view = function (model) {
	var options = model.options;
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox(
				$author$project$Main$getViewBox(model.scene)),
				$elm$svg$Svg$Attributes$id('screen'),
				$elm$svg$Svg$Attributes$preserveAspectRatio('xMidYMid meet'),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onMove(
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.pagePos;
					},
					$author$project$Main$MouseMove)),
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onUp(
				$elm$core$Basics$always(
					$author$project$Main$PuzzleMsg($author$project$Puzzle$StopDraggingHex)))
			]),
		_List_fromArray(
			[
				$author$project$Main$viewDefs,
				A4($elm$html$Html$Lazy$lazy3, $author$project$Main$viewBackground, options.backgroundAnimation, options.backgroundPattern, options.backgroundColor),
				$author$project$Main$viewGameContent(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));