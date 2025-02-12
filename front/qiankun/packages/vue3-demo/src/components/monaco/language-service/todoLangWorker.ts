import type * as monaco from 'monaco-editor';
import * as monacoWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
// import * as edworker from 'monaco-editor/esm/vs/editor/editor.worker';
import AviService from './aviatorscript/service';
import IWorkerContext = monaco.worker.IWorkerContext;
//在monaco代理的worker中需要去initialize先初始化TodoLangWorker
self.onmessage = () => {
  monacoWorker.initialize((ctx, CreateData) => {
    // console.log(ctx, CreateData, 'onmessage');
    return new TodoLangWorker(ctx, CreateData)
  });
};
export default class TodoLangWorker {
  private _ctx: IWorkerContext;
  private CreateData: any;
  private languageService: any;
  constructor(ctx: any, CreateData: any) {
    this._ctx = ctx;
    this.CreateData = CreateData;
    // this.languageService = AviService;
  }
  doValidation(model: monaco.editor.IModel): Promise<any[]> {
    const code = this.getTextDocument();
    console.log(code)
    return Promise.resolve();
  }
  format(code: string): Promise<string> {
    return Promise.resolve(this.languageService.format(code));
  }
  private getTextDocument(): string {
    const model = this._ctx.getMirrorModels()[0];// When there are multiple files open, this will be an array
    return model.getValue();
  }
}
