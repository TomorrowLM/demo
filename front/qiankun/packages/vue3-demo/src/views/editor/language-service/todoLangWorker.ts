import type * as monaco from 'monaco-editor';
import * as monacoWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import AviService from './aviatorscript/service';
import IWorkerContext = monaco.worker.IWorkerContext;
//在monaco代理的worker中需要去initialize先初始化TodoLangWorker
// self.onmessage = () => {
//     monacoWorker.initialize((ctx, CreateData) => {
//         console.log(ctx, CreateData, 'onmessage');
//         return new TodoLangWorker(ctx, CreateData)
//     });
// };
export class TodoLangWorker {
    // private _ctx: IWorkerContext;
    // private CreateData: any;
    private languageService: any;
    constructor() {
        // console.log('TodoLangWorker:ctx', ctx, CreateData, AviService);
        // this._ctx = ctx;
        // this.CreateData = CreateData;
        this.languageService = AviService;
    }
    doValidation(model: monaco.editor.IModel): Promise<any[]> {
        // console.log('TodoLangWorker:ctx', this._ctx, this.CreateData);
        const code = this.getTextDocument();
        // console.log(code)
        // return Promise.resolve(this.languageService.parse(code));
    }
    format(code: string): Promise<string> {
        // return Promise.resolve(AviService.format(code));
    }
    private getTextDocument(): string {
        const model = this._ctx.getMirrorModels()[0];// When there are multiple files open, this will be an array
        return model.getValue();
    }
}
