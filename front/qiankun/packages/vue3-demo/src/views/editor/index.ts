import * as monaco from 'monaco-editor';
import type { IDisposable } from 'monaco-editor';
import * as monacoWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';

import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// import initialize from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import type { MonacoEditorProps, ConfigProps } from './index.d';
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js';
import aviSuggestions from './aviatorscript/suggestions.js';
import aviMonarchs from './aviatorscript/monarch';

import { WorkerManager } from './language-service/WorkerManager';
import DiagnosticsAdapter from './language-service/DiagnosticsAdapter';
import TodoLangWorker from './language-service/todoLangWorker.ts?worker';
import { reactive } from 'vue';

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
    { token: 'custom-info1', foreground: '808080', background: 'FFA500', fontStyle: 'bold' },
    { token: 'custom-point', foreground: 'ff0000', fontStyle: 'bold' },
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
  protected editorInstance: any; // 编辑器实例
  protected htmlBox: HTMLElement;
  protected monacoConfig: ConfigProps;
  protected DiagnosticsAdapter: any; // 语法校验诊断
  protected suggestInstance: IDisposable; // 补全实例
  // public codeInfo: {
  //   oldCode: '', //保存删除的脚本
  //   insideOldCode: any[],
  //   undoList: any[], // 回退列表
  //   insideCodeSnip?: any, //inside片段
  //   outsideCodeSnip?: any
  //   insideCode?: string //脚本
  // };
  private languageConfig: { [key: string]: any };

  constructor(config: ConfigProps) {
    this.htmlBox = document.getElementById(config.el) as HTMLElement;
    this.monacoConfig = config;
    this.languageConfig = {
      sql: {
        name: 'sql',
        autoCompleteType: 0,
        suggestions: {
          keywords: sqlLanguage.keywords,
          operators: sqlLanguage.operators,
          // functions: sqlLanguage.builtinFunctions,
          variables: sqlLanguage.builtinVariables,
        },
        monarchTokens: {
          ignoreCase: true,
          tokenizer: {
            root: [
              [/\[(.+?)\]/, 'custom-point'],
            ]
          }
        }
      },
      AviatorScript: {
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
  }

  async init() {
    console.log('init', this.monacoConfig?.languageConfig?.name)
    const languageConfig = this.languageConfig[this.monacoConfig?.languageConfig?.name || 'AviatorScript'];
    if (languageConfig) {
      await this.registerLanguage(languageConfig)
    }
    await this.creatWorker();//在初始化之前，先设置MonacoEnvironment环境，不然代码提示会报错
    this.editorInstance = monaco.editor.create(this.htmlBox, {
      value: this.monacoConfig?.defaultDoc ? this.monacoConfig?.defaultDoc : '',
      automaticLayout: true,
      readOnly: this.monacoConfig?.readOnly ? this.monacoConfig.readOnly : false,
      language: this.monacoConfig?.languageConfig?.name || 'AviatorScript',
      lineNumbers: 'on',
      fontSize: 16,
      folding: true, // 是否启用代码折叠
      links: true, // 是否点击链接
      theme: this.monacoConfig?.theme || 'vs',
      ...this.monacoConfig?.prettier,
      scrollbar: {
      },
    });
  }

  creatWorker() {
    (window as any).MonacoEnvironment = {
      getWorker: function (moduleId: string, label: string) {
        // label 是语言类型，比如：sql, AviatorScript, json等，这里可以根据需要自定义worker的加载方式
        console.log(moduleId, label === 'AviatorScript', 2, label);
        if (label === 'AviatorScript') {
          return new TodoLangWorker();
        }
        if (label === 'json') {
          return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return new cssWorker();
        }
        if (label === 'html') {
          return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
          return new tsWorker();
        }
        return new monacoWorker();
      }
    };

  }

  async monarchToken(languageConfig: ConfigProps['languageConfig']) {
    //语法高亮-和theme搭配
    // console.log(languageConfig.monarchTokens, languageConfig.name, 11221122212229);
    monaco.languages.setMonarchTokensProvider(languageConfig.name, languageConfig.monarchTokens);
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


  async registerLanguage(languageConfig: ConfigProps['languageConfig']): void {
    await monaco.languages.register({ id: this.monacoConfig.languageConfig.name });
    //是 Monaco Editor 提供的一个方法，用于在特定语言被加载时执行回调函数。这个方法可以用来设置语言相关的功能，例如语法检查、自动补全等。
    await monaco.languages.onLanguage(this.monacoConfig?.languageConfig?.name, () => {
      const client = new WorkerManager(this.monacoConfig?.languageConfig?.name);
      console.log('onLanguage-client', client)
      const worker = (...uris: monaco.Uri[]) => {
        return client.getLanguageServiceWorker(...uris);
      };
      console.log('onLanguage-worker', worker)
      this.DiagnosticsAdapter = new DiagnosticsAdapter(worker);
    });
    await this.setAutoComplete(languageConfig)
    await languageConfig.monarchTokens && this.monarchToken(languageConfig)
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


  isChinese(text) {
    const pattern = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    return pattern.test(text);
  }

  //获取具体位置
  getCodePosition(line, column) {
    let a = 0;
    new Array(line).fill(0).forEach((val, index) => {
      a += this.editorInstance.getModel().getLineLength(index + 1) + 1;//加1是换行符也算一个字符
    })
    return a
  }


  handleConnect(e) {

  }

  //销毁实例
  destroyed() {
    this.editorInstance.dispose();
    this.suggestInstance.dispose();
  }

  //更新配置选项
  updateOptions(e: any) {
    this.editorInstance.updateOptions(e);
  }


  public dispose() {
    this.editorInstance.dispose();
  }
  /**
   * 
   * @param e1 
   * @param e2 insideCode
   */
  initSetValue(e1: string) {
    this.editorInstance.setValue(e1);
  }

  getValue() {
    return this.editorInstance.getValue()
  }

  insertText(e1: any, e2?: any) {
    let readOnlyStatus = false
    this.monacoConfig.readOnlyArr && this.monacoConfig.readOnlyArr.forEach(element => {
      if (this.getPosition().lineNumber === element.lineNumber) {
        readOnlyStatus = true
      }
    });
    if (readOnlyStatus) return;

    const position = this.getPosition();
    const range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
    this.editorInstance.executeEdits('需要插入的代码/string', [
      {
        range: range,
        text: e1
      }
    ]);
    console.log(e1, e2);
    this.editorInstance.focus();
  }

  copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  copy() {
    this.editorInstance.trigger('editor', 'editor.action.clipboardCutAction');
    this.copyToClipboard(this.editorInstance.getValue())
  }

  //获取光标位置
  getPosition() {
    return this.editorInstance.getPosition();
  }

  setPosition(lineNumber: number, column: number) {
    this.editorInstance.setPosition({ lineNumber, column });
  }

  setLanguage(val: any) {
    console.log(val);
    this.clearMistake(this.editorInstance.getModel()?.getLanguageId())
    monaco.editor.setModelLanguage(this.editorInstance.getModel(), val || 'javascript')
  }

  setTheme(theme: string) {
    monaco.editor.setTheme(theme);
  }

  // 标记错误信息
  markMistake(data: any) {
    console.log(data);
    monaco.editor.setModelMarkers(
      this.editorInstance.getModel(),
      'AviatorScript',
      data
    )
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
  format() {
    this.editorInstance.getAction('editor.action.formatDocument').run();
  }

  //   撤销
  undo() {
    this.editorInstance.trigger('myapp', 'undo');
  }
  //  重做
  redo() {
    this.editorInstance.trigger('myapp', 'redo');
  }
  // 格式化代码
  formatCode() {
    const formatFn = () => {
      try {
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



}

