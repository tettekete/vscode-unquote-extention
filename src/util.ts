

export type QuotedStringWithPosResult_T =
{
	quote_char: string;
	quoted_string: string;
	start: number;
	end: number;
};

export function QuotedStringWithPos( line: string ,cursor_pos: number )
{
	const analyzed: QuotedStringWithPosResult_T[] = [];
	let begin_quote: string | undefined = undefined;
	let begin_index = 0;
	/**
	 * quoted_string はフラグ兼バッファで、閉じクォートの探索中は string、
	 * そうでなければ undefined になる
	 * 
	 * quoted_string is a flag and a buffer, and is string while searching 
	 * for a closing quote, and undefined otherwise.
	 */
	let quoted_string: string | undefined = undefined;
	let back_slashed = false;

	for( let i = 0 ; i < line.length ; i ++ )
	{
		const char = line.substring(i,i+1);

		if( begin_quote )
		{
			quoted_string += char;

			if( char === '\\' )
			{
				back_slashed = true;
				continue;
			}
		}
		
		if( back_slashed )
		{
			back_slashed = false;
			continue;
		}

		if( /['"`]/.test( char ) )
		{
			if( begin_quote === undefined )
			{
				// begin quoted string
				begin_quote		= char;
				begin_index		= i;
				quoted_string	= char;
			}
			else if( begin_quote === char )
			{
				// a closing quote found
				analyzed.push(
					{
						quote_char: char,
						quoted_string: quoted_string ?? '',
						start: begin_index,
						end: i +1
					}
				);

				begin_quote = quoted_string = undefined;

				if( i > cursor_pos ) {break;}	// The analysis is cut off.
			}
		}
	}

	if( ! analyzed.length ) {return undefined;}

	const result = analyzed.filter((r) =>
	{
		return r.start < cursor_pos && (r.end - 1) >= cursor_pos;
	})[0];

	return result;
}