'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const { SourceCode } = require("eslint");
const { getPositionOfLineAndCharacter, createPrinter } = require("typescript");
var vscode = require("vscode");
function activate(context) {
    var disposable = vscode.commands.registerCommand('CommentsOut.commentsOut', function () {
        // Get the active text editor
        var editor = vscode.window.activeTextEditor;
        if (editor) {

			/***********************************/
			/*		Languaje support part
			/***********************************/
			
			const languaje = editor.document.languageId;
			console.log(languaje);
			let identifier;
			let identifier_multi;
			let identifier_multi2;
			if (languaje == 'python' || languaje == 'r'){
				identifier = '#';
			} else if (languaje == 'html' || languaje == 'xml'){
				identifier_multi = '<!–';
				identifier_multi2 = '–>';
			} else if (languaje == 'latex')
			{
				identifier = '%';
			} else {
				identifier = '//';
				identifier_multi = '/*';
				identifier_multi2 = '*/';
			}

			/******************************************/
			/*		Simple lines part
			/******************************************/
			
			//first we need the text of the entire file
			var text = editor.document.getText();
			//then we split the text to get an array of the text inside every line
			var array = text.split("\n");
			var numOfLines = array.length;
			for (var line = 0; line < array.length; line++) {
				//css, html and xml dont have inline comments
				if(languaje != 'css' && languaje != 'html' && languaje !='xml' && languaje !='css'){
					//for every line we want to know if there are some //
					if(array[line].indexOf(identifier) != -1 ){
						//with this we delete the lines with // of the array
						if(array[line].indexOf(identifier) == 0){
							array.splice(line,1);
							line--;
						} else {
							//if you are here it means that the comment was in the middle of the line
							array[line] = array[line].substring(0, array[line].indexOf(identifier)) + '\n'; 
						}
					}
				}
				
				/****************************************/
				/*			Multilines part
				/****************************************/
				// python, r and latex dont have multilines comments
				if (languaje != 'python' && languaje != 'r' && languaje != 'latex'){
					if(array[line].indexOf(identifier_multi) != -1 ){
						if(array[line].indexOf(identifier_multi2) != -1){
							//if you are here it means that there was multiline comment with an only one line commented
							array[line] = array[line].substring(0, array[line].indexOf(identifier_multi));
						} else {
							//if you are here it means that there were multilines commented
							for(var index = line+1; index < array.length; index++){
								if(array[index].indexOf(identifier_multi2) != -1){
									//if you are here it means that you finded the end of the comment
									array[line] = array[line].substring(0, array[line].indexOf(identifier_multi));
									for(var middle = line + 1; middle < index; middle++ ){
										array[middle] = "";
									}
									//i leave the part after the \*
									array[index] = array[index].substring(array[index].indexOf(identifier_multi2)+2, 2000); // +2 to clear the /* characters or -> or #>
								}
							}
						}
							
					}
				}
			}
			//we convert the array to string with join (with toStrings the commas bother us)
			text = array.join('');
			var pos = new vscode.Position(0,0); //first position
			var pos2 = new vscode.Position(numOfLines,2000); //2000 is the max lenght of the line (last position of the file)
			var rangeamos = new vscode.Range(pos, pos2)
			editor.edit(function (editBuilder) {
				editBuilder.replace(rangeamos, text);
			});
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;