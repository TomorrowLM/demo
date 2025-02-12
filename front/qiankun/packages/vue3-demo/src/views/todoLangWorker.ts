import type * as monaco from 'monaco-editor';

import * as monacoWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';

//在monaco代理的worker中需要去initialize先初始化TodoLangWorker
self.onmessage = () => {
  monacoWorker.initialize((ctx, CreateData) => {
    // console.log(ctx, CreateData);
    return new TodoLangWorker(ctx, CreateData)
  });
};
export default class TodoLangWorker {
  private _ctx: any;
  private CreateData: any;
  private languageService: any;
  constructor(ctx: any, CreateData: any) {
    // console.log('TodoLangWorker:ctx', ctx, CreateData);
    this._ctx = ctx;
    this.CreateData = CreateData;
  }
  doValidation(model: monaco.editor.IModel): Promise<any[]> {
    // console.log('TodoLangWorker:ctx', this._ctx, this.CreateData);
    const code = this.getTextDocument();
    // console.log(code)
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
