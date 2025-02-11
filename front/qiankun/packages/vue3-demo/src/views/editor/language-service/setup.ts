import * as monaco from "monaco-editor";
// import { languageExtensionPoint, languageID } from "./config";
// import { richLanguageConfiguration, monarchLanguage } from "./TodoLang";
import { TodoLangWorker } from "./todoLangWorker";
import { WorkerManager } from "./WorkerManager";
import DiagnosticsAdapter from "./DiagnosticsAdapter";
// import TodoLangFormattingProvider from "./TodoLangFormattingProvider";
// import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
// import initialize from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import * as monacoWorker from 'monaco-editor/esm/vs/editor/editor.worker.js';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
//在初始化之前，先设置MonacoEnvironment环境
export function setupLanguage(languageID: any) {
  (window as any).MonacoEnvironment = {
    getWorker: function (moduleId: string, label: string) {
      // label 是语言类型，比如：sql, AviatorScript, json等，这里可以根据需要自定义worker的加载方式
      console.log('getWorker', moduleId, label === 'AviatorScript', 2, label);
      if (label === 'AviatorScript') {
        return new TodoLangWorker();
      }
      // if (label === 'json') {
      //   return new jsonWorker();
      // }
      // if (label === 'css' || label === 'scss' || label === 'less') {
      //   return new cssWorker();
      // }
      // if (label === 'html') {
      //   return new htmlWorker();
      // }
      // if (label === 'typescript' || label === 'javascript') {
      //   return new tsWorker();
      // }
      return new editorWorker();
    }
  };
  monaco.languages.register(languageID);
  monaco.languages.onLanguage(languageID.name, () => {
    const client = new WorkerManager(languageID.name);
    const worker = (...uris: monaco.Uri[]) => {
      return client.getLanguageServiceWorker(...uris);
    };
    console.log('onLanguage-worker', worker)
    new DiagnosticsAdapter(worker);
  });

}

export type WorkerAccessor = (...uris: monaco.Uri[]) => Promise<TodoLangWorker>;