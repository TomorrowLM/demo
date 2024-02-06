import * as monaco from 'monaco-editor';
import edWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as editorWorker from 'monaco-editor/esm/vs/editor/editor.worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import type { MonacoEditorProps, ConfigProps, AutoCompleteTypeEnum } from './index.d';
import initialize from 'monaco-editor/esm/vs/editor/editor.worker?worker';

import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js';
import { format } from 'sql-formatter'
import { WorkerManager } from './aviatorscript/worker';
import aviSuggestions from './aviatorscript/suggestions.js';
import aviMonarchs from './aviatorscript/monarch';
import { WorkerSQlManager } from './sql/worker';


monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2016,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  noEmit: true,
  typeRoots: ['node_modules/@types']
});

//在初始化之前，先设置MonacoEnvironment
self.MonacoEnvironment = {
  //一定要导入对应的代码提示文件,不然页面代码输入没有代码提示
  getWorker(_, label) {
    console.log(label);
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new edWorker();
  }
}




monaco.editor.defineTheme('myTheme', {
  base: 'vs',
  inherit: true,
  colors: {
    'editor.foreground': '#000000',
    'editor.background': '#EDF9FA',
    'editorCursor.foreground': '#8B0000',
    'editor.lineHighlightBackground': '#0000FF20',
    'editorLineNumber.foreground': '#008800',
    'editor.selectionBackground': '#88000030',
    'editor.inactiveSelectionBackground': '#88000015',
  },
  rules: [
    {
      //注释
      token: 'comment',
      foreground: 'ffa500',
      fontStyle: 'italic underline',
    },
    {
      //操作符
      token: 'operator',
      foreground: 'ffa500',
      fontStyle: 'italic underline',
    },
    { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
    { token: 'comment.css', foreground: '0000ff' }, // will inherit fontStyle from `comment` above
  ],
});

export default class MonacoEditor implements MonacoEditorProps {
  protected editorInstance: any;
  protected htmlBox: HTMLElement;
  protected config: ConfigProps;

  constructor(id: string, config: ConfigProps) {
    this.htmlBox = document.getElementById(id) as HTMLElement;
    this.config = config;
  }

  async init() {
    await this.registerLanguage({
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
    })

    await this.registerLanguage({
      name: 'sql',
      autoCompleteType: 0,
      suggestions: {
        keywords: sqlLanguage.keywords,
        operators: sqlLanguage.operators,
        functions: sqlLanguage.builtinFunctions,
        variables: sqlLanguage.builtinVariables,
      }
    });
    this.editorInstance = monaco.editor.create(this.htmlBox, {
      value: this.config.defaultDoc,
      automaticLayout: true,
      readOnly: this.config.readOnly ?? false,
      language: this.config.language ?? 'sql',
      lineNumbers: 'on',
      fontSize: 16,
      folding: true, // 是否启用代码折叠
      links: true, // 是否点击链接
      ...this.config.prettier,
      scrollbar: {
        // Subtle shadows to the left & top. Defaults to true.
        // useShadows: false,
        // // Render vertical arrows. Defaults to false.
        // verticalHasArrows: true,
        // // Render horizontal arrows. Defaults to false.
        // horizontalHasArrows: true,
        // // Render vertical scrollbar.
        // // Accepted values: 'auto', 'visible', 'hidden'.
        // // Defaults to 'auto'
        // vertical: 'visible',
        // // Render horizontal scrollbar.
        // // Accepted values: 'auto', 'visible', 'hidden'.
        // // Defaults to 'auto'
        // horizontal: 'visible',
        // verticalScrollbarSize: 17,
        // horizontalScrollbarSize: 17,
        // arrowSize: 30,
      },
    });


    console.log('init', this.editorInstance.getModel(), 'modal');
  }

  //销毁实例
  destroyed() {
    this.editorInstance.dispose()
  }

  //更新配置选项
  updateOptions(e: any) {
    this.editorInstance.updateOptions(e);
  }

  setValue(e: string) {
    this.editorInstance.setValue(e)
  }

  getValue() {
    return this.editorInstance.getValue()
  }

  insertText(e: any) {
    // this.editorInstance.setValue(e)//设置值
    const position = this.getPosition();
    const range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
    this.editorInstance.executeEdits('需要插入的代码/string', [
      {
        range: range,
        text: e,
      }
    ]);
    this.editorInstance.focus();
  }

  //获取光标位置
  getPosition() {
    return this.editorInstance.getPosition();
  }

  setPosition() {
    return this.editorInstance.revealPositionInCenter({ lineNumber: 50, column: 120 });
  }

  setLanguage(val: any) {
    console.log(val);
    this.clearMistake(this.editorInstance.getModel()?.getLanguageId())
    monaco.editor.setModelLanguage(this.editorInstance.getModel(), val || 'javascript')
  }

  setTheme() {
    monaco.editor.setTheme('myTheme');
    let commandId = this.editorInstance.addCommand(
      0,
      function () {
        // services available in `ctx`
        alert('my command is executing!');
      },
      ''
    );
    //长度
    monaco.languages.registerCodeLensProvider('javascript', {
      provideCodeLenses: function (model, token) {
        return {
          lenses: [
            {
              range: {
                startLineNumber: 0,
                startColumn: 1,
                endLineNumber: 2,
                endColumn: 1,
              },
              id: 'First Line',
              command: {
                id: commandId,
                title: 'First Line',
              },
            },
          ],
          dispose: () => { },
        };
      },
      resolveCodeLens: function (model, codeLens, token) {
        console.log(codeLens);
        return codeLens;
      },
    });
  }

  // 标记错误信息
  markMistake(range: any, type: string, message: any) {
    const { startLineNumber, endLineNumber, startColumn, endColumn }: any = range;
    monaco.editor.setModelMarkers(
      this.editorInstance.getModel(),
      'eslint',
      [{
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn,
        // Hint = 1,
        // Info = 2,
        // Warning = 4,
        // Error = 8
        severity: monaco.MarkerSeverity[type], // type可以是Error,Warning,Info
        message: message
      }]
    )
    // const issues = monacoLinter.getEditorMarks(this.editorInstance);
  }

  clearMistake(e: string) {
    console.log(545, this.editorInstance.getModel());
    monaco.editor.setModelMarkers(
      this.editorInstance.getModel(),
      e,
      []
    )
  }

  //   格式化代码 getAction
  // editor.getAction(‘editor.action.formatDocument’).run() //格式化代码
  //   editor.trigger("myapp", "undo");//触发撤销
  // editor.trigger("myapp", "redo");//触发重做
  // 格式化代码
  formatCode() {
    const formatFn = () => {
      try {
        return format(this.getValue(), {
          language: 'mysql',
          tabWidth: 2,
          keywordCase: 'upper',
          linesBetweenQueries: 2,
        });
      } catch (e: any) {
        const { message } = e
        console.log(message);
        const list = message.split(' ')
        const line = list.indexOf('line')
        const column = list.indexOf('column')
        this.markMistake({
          startLineNumber: Number(list[line + 1]),
          endLineNumber: Number(list[line + 1]),
          startColumn: Number(list[column + 1]),
          endColumn: Number(list[column + 1])
        }, 'Error', message)
      }
    }
    monaco.languages.registerDocumentFormattingEditProvider('sql', {
      provideDocumentFormattingEdits(model): any {
        return [{
          text: formatFn(),
          range: model.getFullModelRange()
        }]
      }
    })
  }

  async getFileContent(e: string) {
    let libSource;
    await fetch(e, {
      mode: 'no-cors',
    })
      .then(response => response.text()).then(response => {
        libSource = response
      })
    // console.log(libSource);
    return libSource
  }

  //代码自动补全
  async setAutoComplete(languageConfig: ConfigProps['languageConfig']) {
    const { suggestions, autoCompleteType }: any = languageConfig;
    if (autoCompleteType === 0) {
      monaco.languages.registerCompletionItemProvider(languageConfig.name, {
        //   triggerCharacters: ['$'],
        //   replaceTriggerChar: true,
        provideCompletionItems: function () {
          // { label: any; kind: monaco.languages.CompletionItemKind; insertText: any }[]
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
                //       detail: '123', // 提示内容后的说明
                //       insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              });
            })
          };
        },
      });
      // monaco.languages.registerCompletionItemProvider('sql', {
      //   provideCompletionItems: function () {
      //     let newSuggestions: { label: any; kind: monaco.languages.CompletionItemKind; insertText: any }[] = [];
      //     sqlLanguage.builtinFunctions.forEach((item: any) => {
      //       suggestions.push({
      //         label: item,
      //         kind: monaco.languages.CompletionItemKind.Function,
      //         insertText: item
      //       });
      //     })
      //     return {
      //       suggestions: newSuggestions
      //     };
      //   },
      // });

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
    // monaco.languages.registerCompletionItemProvider(this.config.language, {
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

  creatWorker() {
    // worker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
    //   console.log(22);
    //   return new WorkerManager(ctx, createData);
    // });
    let modal = this.editorInstance.getModel();
    let worker = modal?.getLanguageId() === 'sql' ? new WorkerSQlManager() : new WorkerManager();
    // const worker = monaco.editor.createWebWorker({
    //   moduleId: modal?.getLanguageId(),
    //   label: 'sql',
    //   createData: {
    //     languageId: 'sql',
    //   }
    // });
    // console.log(worker);
    // monaco.languages.onLanguage('sql', () => {
    //   console.log(889);
    //   return 'sql' ? new WorkerSQlManager(worker) : new WorkerManager();
    // });
    // self.onmessage = (message: any) => {
    //   console.log(449);
    //   return 'sql' ? new WorkerSQlManager(worker) : new WorkerManager();
    //   editorWorker.initialize((ctx: any, createData: any) => {
    //     // return 'sql' ? new WorkerSQlManager() : new WorkerManager();
    //     return modal?.getLanguageId() === 'sql' ? new WorkerSQlManager(worker) : new WorkerManager();
    //   });
    // };
    self.onmessage = (message: any) => {
      console.log('onmessage:', message)
      console.log(modal, this.getValue());
      worker.parse(this.editorInstance)
    };
    // self.addEventListener('message', function (e) {
    //   console.log('get:message', self, e, 1239);
    // });
  }

  monarchToken(languageConfig: ConfigProps['languageConfig']) {
    //语法高亮-和theme搭配
    monaco.languages.setMonarchTokensProvider(languageConfig.name, languageConfig.monarchTokens);
  }

  registerLanguage(languageConfig: ConfigProps['languageConfig']): void {
    // const { keywords, typeKeywords, operators, symbols, escapes } = languageConfig.suggestion;
    monaco.languages.register({ id: languageConfig.name });
    this.setAutoComplete(languageConfig)
    languageConfig.monarchTokens && this.monarchToken(languageConfig)
  }
}

