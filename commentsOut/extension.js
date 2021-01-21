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
			const languaje = editor.document.languageId;
			let identifier;
			if (languaje == 'perl' || languaje == 'python' || languaje == 'ruby' || languaje == 'r'){
				identifier = '#';
			} else {
				identifier = '//';
			}
			//first we need the text of the entire file
			var text = editor.document.getText();
			//then we find the numbers of '//en' substrings inside the text
			// // var key = '//en'
			// // var re = new RegExp(key, 'g');
			// // var count = (text.match(re) || []).length;
			//then we split the text to get an array of the text inside every line
			var array = text.split("\n");
			var numOfLines = array.length;
			for (var line = 0; line < array.length; line++) {
				// console.log("holus " + array[i]);
				//for every line we want to know if there are some //en
				if(array[line].indexOf(identifier) != -1 ){
					//with this we delete the lines with //en of the array
					if(array[line].indexOf(identifier) == 0){
						array.splice(line,1);
						line--;
					} else {
						//if you are here it means that the comment was in the middle of the line
						array[line] = array[line].substring(0, array[line].indexOf(identifier)); 
					}

					//console.log(array);
				} else{
				//do nothing because there are no //en in that line	
				}
			}
			//we convert the array to string with join (with toStrings the commas bother us)
			text = array.join('');
			console.log(text)
			var pos = new vscode.Position(0,0); //+4 because //en
			var pos2 = new vscode.Position(numOfLines,2000); //2000 is the max lenght of the line
			var rangeamos = new vscode.Range(pos, pos2)
			editor.edit(function (editBuilder) {
				editBuilder.replace(rangeamos, text);
			});
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;