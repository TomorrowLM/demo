import * as monaco from 'monaco-editor';

import Uri = monaco.Uri;
import type { TodoLangWorker } from './todoLangWorker';
export class WorkerManager {
  private worker: monaco.editor.MonacoWebWorker<TodoLangWorker>;
  private workerClientProxy: Promise<TodoLangWorker>;

  constructor(private languageID) {
    this.worker = null;
  }

  private getClientproxy(): Promise<any> {
    // console.log(!this.workerClientProxy, this.languageID, '!this.workerClientProxy');
    //判断是否存在worker代理
    if (!this.workerClientProxy) {
      console.log('getClientproxy',`vs/language/${this.languageID}/todoLangWorker`,this.languageID)
      this.worker = monaco.editor.createWebWorker<any>({
        // module that exports the create() method and returns a `JSONWorker` instance
        // moduleId: `vs/language/${this.languageID}/todoLangWorker`,
        // moduleId: 'http://localhost:8003/src/views/editor/language-service/todoLangWorker.ts?worker_file&type=module',
        moduleId: 'src/views/editor/language-service/todoLangWorker.ts',
        label: this.languageID,
        // passed in to the create() method
        //通过postMessage传递给子线程，self.onmessage中monacoWorker.initialize中获取createData
        createData: {
          languageId: this.languageID,
          // parse: service.parse
        }
      });
      this.workerClientProxy = <Promise<any>><any>this.worker.getProxy();
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
