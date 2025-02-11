import * as monaco from 'monaco-editor';
import { WorkerManager } from './WorkerManager';
import DiagnosticsAdapter from './DiagnosticsAdapter';
import type { MonacoEditorProps, ConfigProps } from '../index.d';
import AviService from './aviatorscript/service';
import TodoLangWorker from './todoLangWorker.ts?worker';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
export default class LanguageService {
  private config: { [key: string]: any };
  private serviceInstance: any; // 语言服务实例
  protected DiagnosticsAdapter: any; // 语法校验诊断
  constructor(config: any) {
    this.config = config;
    this.config.name = this.config.name || 'AviatorScript'
    // this.languageConfig = {
    //   sql: {
    //     name: 'sql',
    //     autoCompleteType: 0,
    //     suggestions: {
    //       keywords: sqlLanguage.keywords,
    //       operators: sqlLanguage.operators,
    //       // functions: sqlLanguage.builtinFunctions,
    //       variables: sqlLanguage.builtinVariables,
    //     },
    //     monarchTokens: {
    //       ignoreCase: true,
    //       tokenizer: {
    //         root: [
    //           [/\[(.+?)\]/, 'custom-point'],
    //         ]
    //       }
    //     }
    //   },
    // }
    this.init()
  }
  async init() {
    if (this.config.name === 'AviatorScript') {
      this.serviceInstance = AviService;
    }
    this.creatWorker();//在初始化之前，先设置MonacoEnvironment环境，不然代码提示会报错
    this.registerLanguage()
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
        return new editorWorker();
      }
    };

  }
  async registerLanguage(): Promise<void> {
    await monaco.languages.register({ id: this.config.name });
    //是 Monaco Editor 提供的一个方法，用于在特定语言被加载时执行回调函数。这个方法可以用来设置语言相关的功能，例如语法检查、自动补全等。
    await monaco.languages.onLanguage(this.config.name, () => {
      const client = new WorkerManager(this.config.name);
      console.log('onLanguage-client', client)
      const worker = (...uris: monaco.Uri[]) => {
        return client.getLanguageServiceWorker(...uris);
      };
      console.log('onLanguage-worker', worker)
      this.DiagnosticsAdapter = new DiagnosticsAdapter(worker);
    });
  }
}
