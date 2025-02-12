import * as monaco from 'monaco-editor';
import Uri = monaco.Uri;
const languageID = 'AviatorScript'
// import { TodoLangGrammarParser, TodoExpressionsContext } from '../ANTLR/TodoLangGrammarParser';
// import { TodoLangGrammarLexer } from '../ANTLR/TodoLangGrammarLexer';
// import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
// import { InputStream, CommonTokenStream } from 'antlr4ts';
// import { ANTLRErrorListener, RecognitionException, Recognizer } from 'antlr4ts';
import GrammarParser from './grammar/GrammarParser.mjs';
import aviSuggestions from './suggestions.js';
import aviMonarchs from './monarch';
export interface ITodoLangError {
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
  message: string
  code: string
}
class AviService {
  private errors: ITodoLangError[] = [];
  private config: any;
  protected suggestInstance: any; // 补全实例
  constructor() {
    this.config = {
      name: 'AviatorScript',
      autoCompleteType: 0,
      suggestions: {
        functions: aviSuggestions,
        keywords: aviMonarchs.keywords,
        typeKeywords: aviMonarchs.typeKeywords,
        operators: aviMonarchs.operators,
      },
      monarchTokens: {
        ...aviMonarchs
      }
    }
  }
  init() {
    console.log('init AviService')
  }
  parse(code: string): { ast: TodoExpressionsContext, errors: ITodoLangError[] } {
    // const inputStream = new InputStream(code);
    // const lexer = new TodoLangGrammarLexer(inputStream);
    // lexer.removeErrorListeners()
    // const todoLangErrorsListner = new TodoLangErrorListener();
    // lexer.addErrorListener(todoLangErrorsListner);
    // const tokenStream = new CommonTokenStream(lexer);
    // const parser = new TodoLangGrammarParser(tokenStream);
    // parser.removeErrorListeners();
    // parser.addErrorListener(todoLangErrorsListner);
    // const ast = parser.todoExpressions();
    // const errors: ITodoLangError[] = todoLangErrorsListner.getErrors();
    // return { ast, errors };
    let grammarParser = new GrammarParser();
    let astJson = grammarParser.parse(code);
    // console.log(astJson,'astJson');
    return astJson
  }
  parseAndGetSyntaxErrors(code: string): any[] {
    const { errors } = this.parse(code);
    // this.errors.push(
    //   {
    //     startLineNumber: line,
    //     endLineNumber: line,
    //     startColumn: charPositionInLine,
    //     endColumn: charPositionInLine + 1,//Let's suppose the length of the error is only 1 char for simplicity
    //     message,
    //     code: '1' // This the error code you can customize them as you want
    //   }
    // )
    return errors;
  }
  parseAndGetASTRoot(code: string): TodoExpressionsContext {
    const { ast } = this.parse(code);
    return ast;
  }
  //代码自动补全
  async setAutoComplete(languageConfig: ConfigProps['languageConfig']) {
    const { suggestions, autoCompleteType }: any = languageConfig;
    if (autoCompleteType === 0) {
      this.suggestInstance = monaco.languages.registerCompletionItemProvider(languageConfig.name, {
        //   triggerCharacters: ['$'],
        //   replaceTriggerChar: true,
        provideCompletionItems: function () {
          let newSuggestions: any = [];
          Object.keys(suggestions as any).forEach((item: any) => {
            newSuggestions.push(...suggestions[item]);
          })
          return {
            suggestions: newSuggestions.map((item: any) => {
              return ({
                label: item.label ? item.label : item,// 显示的提示内容
                kind: item?.kind ? item.kind : monaco.languages.CompletionItemKind.Function,// 用来显示提示内容后的不同的图标
                insertText: item.label ? item.label : item, // 选择后粘贴到编辑器中的文字
                // detail: '123', // 提示内容后的说明
                // insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              });
            })
          };
        },
      });
      // monaco.languages.registerCompletionItemProvider('AviatorScript', {
      //   provideCompletionItems: () => {
      //     aviSuggestions.forEach(suggestion => {
      //       delete suggestion.range;
      //     });
      //     return {
      //       suggestions: aviSuggestions
      //     };
      //   }
      // })
    } else {
      //addExtraLib添加库
      // let libSource: any;
      // await fetch('./index.d.ts', {
      //   mode: 'no-cors',
      // })
      //   .then(response => response.text()).then(response => {
      //     libSource = response
      //   })
      // monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, 'index.d.ts');
    }
    //注册语法片段
    // monaco.languages.registerCompletionItemProvider(this.monacoConfig.language, {
    //   provideCompletionItems: async (model, position) => {
    //     // const wordUntil = model.getWordUntilPosition(position);
    //     // const defaultRange = new monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
    //     const result: monaco.languages.CompletionList = {
    //       suggestions: []
    //     };
    //     await this.getFileContent('./javascriptSnippets.json').then((res: any) => {
    //       let snippets: any;
    //       snippets = JSON.parse(res);

    //       for (let key in snippets) {
    //         if (snippets.hasOwnProperty(key)) {
    //           result.suggestions.push({
    //             kind: monaco.languages.CompletionItemKind.Snippet,
    //             insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    //             label: snippets[key].prefix,
    //             documentation: snippets[key].description,
    //             insertText: snippets[key].body.join('\n'),
    //             // range: undefined
    //           });
    //         }
    //       }
    //     })
    //     // console.log(result);
    //     return result;
    //   }
    // }
    // );
  }
  async monarchToken() {
    //语法高亮-和theme搭配
    // console.log(languageConfig.monarchTokens, languageConfig.name, 11221122212229);
    monaco.languages.setMonarchTokensProvider('AviatorScript', this.config.monarchTokens);
    // await monaco.languages.setMonarchTokensProvider(languageConfig.name, {
    //   tokenizer: {
    //     root: [
    //       [/^\[\d/, { token: 'custom-error' }],
    //       [/\[error\]/, 'custom-error'],
    //       [/\[info\]/, { token: 'custom-info' }],
    //       [/^\[warning\]/, { token: 'custom-warning' }]
    //     ]
    //   }
    // });
  }
}

export default new AviService()