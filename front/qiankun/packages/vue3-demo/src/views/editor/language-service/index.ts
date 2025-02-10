import * as monaco from 'monaco-editor';
import { WorkerManager } from './WorkerManager';
import DiagnosticsAdapter from './DiagnosticsAdapter';
import type { MonacoEditorProps, ConfigProps } from '../index.d';
import AviService from './aviatorscript/service';
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
    this.registerLanguage()
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
