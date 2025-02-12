import * as monaco from 'monaco-editor';
type TodoLangWorker = any
import Uri = monaco.Uri;
export class WorkerManager {
  private worker: monaco.editor.MonacoWebWorker<TodoLangWorker>;
  private workerClientProxy: Promise<TodoLangWorker>;

  constructor(private languageID) {
    this.worker = null;
  }

  private async getClientproxy(): Promise<any> {
    // console.log(!this.workerClientProxy, this.languageID, '!this.workerClientProxy');
    //判断是否存在worker代理
    if (!this.workerClientProxy) {
      console.log('getClientproxy', `vs/language/${this.languageID}/todoLangWorker`, this.languageID)
      this.worker = await monaco.editor.createWebWorker<any>({
        // module that exports the create() method and returns a `JSONWorker` instance
        // moduleId: `vs/language/${this.languageID}/todoLangWorker`,
        // moduleId: 'http://localhost:8003/src/views/editor/language-service/todoLangWorker.ts?worker_file&type=module',
        moduleId: 'vs/language/AviatorScript/TodoLangWorker',
        label: this.languageID,
        keepIdleModels: true,
        //通过postMessage传递给子线程，self.onmessage中monacoWorker.initialize中获取createData
        // passed in to the create() method
        createData: {
          languageId: this.languageID,
          // parse: service.parse
        }
      });
      console.log('WorkerManager:this.worker', await this.worker.getProxy());
      this.workerClientProxy = await this.worker.getProxy();
    }
    return this.workerClientProxy;
  }

  async getLanguageServiceWorker(...resources: Uri[]): Promise<any> {
    // console.log('WorkerManager:resources', resources)
    const _client: any = await this.getClientproxy();
    // console.log('WorkerManager:_client', _client);
    await this.worker.withSyncedResources(resources)
    return _client;
  }
}
