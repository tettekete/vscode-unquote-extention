
import * as assert from 'assert';
import * as vscode from 'vscode';
import { QuotedStringWithPos ,QuotedStringWithPosResult_T } from '../util';

const _common_test = (
{
	line,
	pos,
	expected_string,
	quote_char,
	r
}:
{
	line: string ,
	pos: number ,
	expected_string: string | undefined ,
	quote_char: string
	r: QuotedStringWithPosResult_T | undefined
}) =>
{
	if( expected_string === undefined )
	{
		test(`Testing without results for pos ${pos}`,()=>
		{
			assert.equal( r , undefined );
		});
	}
	else
	{
		test(`Testing with results for pos ${pos}`,()=>
		{
			assert.ok( r );

			if( ! r ) {throw Error("QuotedStringWithPos returns undefined.");}
		
			assert.equal( r.quote_char , quote_char );
			assert.equal( r.quoted_string , expected_string );
			assert.equal( typeof r.start , 'number' );
			assert.equal( typeof r.end , 'number' );
			assert.equal( line.substring( r.start ,r.end ) , r.quoted_string );
		});
	}
};


suite('QuotedStringWithPos Basic Tests', () => {

	test('Sample test', () =>
	{
		[
			{pos: 0 ,expected_string: undefined ,quote_char: "'"},
			{pos: 12 ,expected_string: undefined ,quote_char: "'"},
		
			{pos: 13 ,expected_string: "'xyz'" ,quote_char: "'"},
			{pos: 15 ,expected_string: "'xyz'" ,quote_char: "'"},
			{pos: 16 ,expected_string: "'xyz'" ,quote_char: "'"},
		
			{pos: 17 ,expected_string: undefined ,quote_char: "'"},
			{pos: 18 ,expected_string: undefined ,quote_char: "'"},
		
			{pos: 19 ,expected_string: `"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"` ,quote_char: '"'},
			{pos: 25 ,expected_string: `"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"` ,quote_char: '"'},
			{pos: 31 ,expected_string: `"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"` ,quote_char: '"'},
			{pos: 37 ,expected_string: `"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"` ,quote_char: '"'},
			{pos: 43 ,expected_string: `"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"` ,quote_char: '"'},
			{pos: 49 ,expected_string: `"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"` ,quote_char: '"'},
			{pos: 55 ,expected_string: `"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"` ,quote_char: '"'},
			{pos: 61 ,expected_string: `"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"` ,quote_char: '"'},	
			{pos: 66 ,expected_string: `"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"` ,quote_char: '"'},
		
			{pos: 67 ,expected_string: undefined ,quote_char: "'"},
			{pos: 68 ,expected_string: undefined ,quote_char: "'"},
		
		].forEach((t)=>
		{
			const line = `let hoge = ['xyz',"foo 'bar' 'fizz \`buzz 'hoge' moge\` hello' world"`;
			const r = QuotedStringWithPos( line , t.pos );

			_common_test({
				r,line,
				...t
			});
		});
	});

	test("Back slash '\\' included test ",()=>
	{
		[
			{pos: 13 ,expected_string: undefined ,quote_char: ""},

			{pos: 14 ,expected_string: `'I\\'am hero'` ,quote_char: "'"},
			{pos: 24 ,expected_string: `'I\\'am hero'` ,quote_char: "'"},
		
			{pos: 25 ,expected_string: undefined ,quote_char: ""},
			{pos: 28 ,expected_string: undefined ,quote_char: ""},
		
			{pos: 29 ,expected_string: '"Say \\"Hello\\""' ,quote_char: '"'},
			{pos: 42 ,expected_string: '"Say \\"Hello\\""' ,quote_char: '"'},
		
			{pos: 43 ,expected_string: undefined ,quote_char: ""},
			{pos: 45 ,expected_string: undefined ,quote_char: ""},
		
			{pos: 46 ,expected_string: '`this is \\\`markdown code\\\`\`' ,quote_char: "`"},
			{pos: 71 ,expected_string: '`this is \\\`markdown code\\\`\`' ,quote_char: "`"},
		
			{pos: 72 ,expected_string: undefined ,quote_char: ""},
			{pos: 75 ,expected_string: undefined ,quote_char: ""},
		
		].forEach((t)=>
		{
			const line = `let list = [ 'I\\'am hero' , "Say \\"Hello\\"" ,\`this is \\\`markdown code\\\`\` ];`;
			const r = QuotedStringWithPos( line , t.pos );

			_common_test({
				r,line,
				...t
			});
		});
	});
});

