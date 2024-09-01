// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {QuotedStringWithPos} from './util';

const _message_time_out = 3500;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('vscode-unquote.unquote', () =>
	{
		const config = vscode.workspace.getConfiguration('unquote');
		const editor = vscode.window.activeTextEditor;
		if (!editor) {return;}

		const document = editor.document;
		const selection = editor.selection;

		if ( selection.isEmpty )
		{
			if( ! config.get<boolean>('unquote_without_selection') )
			{
				vscode.window.setStatusBarMessage( "Unquote: Config unquote_without_selection is false.",_message_time_out );
				return;
			}
			// 選択範囲がないのでカーソル位置を内包するクォートされたテキストを探します
			// Since there is no selection, it will look for quoted text
			// that contains the cursor position.
			const cursorPosition = selection.active;
			const lineText = document.lineAt(cursorPosition.line).text;

			const r = QuotedStringWithPos( lineText ,cursorPosition.character );

			if( r )
			{
				const unquoted = r.quoted_string.substring(1,r.quoted_string.length -1 );
				const range_begin = new vscode.Position(
					cursorPosition.line,
					r.start
				);

				const range_end = new vscode.Position(
					cursorPosition.line,
					r.end
				);

				editor.edit(editBuilder =>
				{
					editBuilder.replace(
						new vscode.Range(
							range_begin,
							range_end
						)
						,unquoted
					);
				})
				.then(()=>
				{
					const newSelection = new vscode.Selection(
						range_begin,
						range_end.translate(0, -2)
					);

					editor.selection = newSelection;

					vscode.window.setStatusBarMessage( "Unquoted!" ,_message_time_out);
				});
			}
			else
			{
				vscode.window.setStatusBarMessage( "Unquote: Could'nt Unquote." ,_message_time_out);
			}
			
			
		}
		else
		{
			// There are selected text.
			const start	= selection.start;
			const end	= selection.end;

			const startChar = document.getText(new vscode.Range(start.translate(0, -1), start));
			const endChar = document.getText(new vscode.Range(end, end.translate(0, 1)));

			if( startChar === endChar && /[\'\".`]/.test( startChar) )
			{
				const text = document.getText(selection);
				editor.edit(editBuilder =>
				{
					editBuilder.replace(new vscode.Range(start.translate(0, -1), end.translate(0, 1)), text);
				})
				.then(()=>
				{
					const newSelection = new vscode.Selection(start.translate(0, -1), end.translate(0, -1));
					editor.selection = newSelection;

					vscode.window.setStatusBarMessage( "Unquoted!",_message_time_out );
				});
			}
			else
			{
				vscode.window.setStatusBarMessage( "Unquote: Could not Unquote the selection." ,_message_time_out);
			}
		}
		
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
