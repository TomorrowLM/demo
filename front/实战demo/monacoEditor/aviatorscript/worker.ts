import { format } from 'sql-formatter';
import * as monaco from 'monaco-editor';
// import AviatorScript from './aviatorscript/AviatorScript.js';
// import { ANTLRErrorListener, RecognitionException, Recognizer } from 'antlr4';
import { InputStream, CommonTokenStream } from 'antlr4';
// import { TodoLangGrammarParser, TodoExpressionsContext } from "../ANTLR/TodoLangGrammarParser";
// import { TodoLangGrammarLexer } from "../ANTLR/TodoLangGrammarLexer";
// import TodoLangErrorListener, { ITodoLangError } from "./TodoLangErrorListener";

import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import IWorkerContext = monaco.worker.IWorkerContext;

import AviatorScript from './AviatorScript.ts';

export interface ITodoLangError {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
  code: string;
}

export class TodoLangErrorListener implements ANTLRErrorListener<any>{
  private errors: ITodoLangError[] = []
  syntaxError(recognizer: Recognizer<any, any>, offendingSymbol: any, line: number, charPositionInLine: number, message: string, e: RecognitionException | undefined): void {

    this.errors.push(
      {
        startLineNumber: line,
        endLineNumber: line,
        startColumn: charPositionInLine,
        endColumn: charPositionInLine + 1,//Let's suppose the length of the error is only 1 char for simplicity
        message,
        code: '1' // This the error code you can customize them as you want
      }
    )
  }

  getErrors(): ITodoLangError[] {
    return this.errors;
  }
}


export class TodoLangLanguageService {
  validate(code: string): ITodoLangError[] {
    const syntaxErrors: ITodoLangError[] = parseAndGetSyntaxErrors(code);
    //Later we will append semantic errors
    return syntaxErrors;
  }
}

function parse(code: string): { ast: TodoExpressionsContext, errors: ITodoLangError[] } {
  const inputStream = new InputStream(code);
  const lexer = new TodoLangGrammarLexer(inputStream);
  lexer.removeErrorListeners()
  const todoLangErrorsListner = new TodoLangErrorListener();
  lexer.addErrorListener(todoLangErrorsListner);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new TodoLangGrammarParser(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(todoLangErrorsListner);
  const ast = parser.todoExpressions();
  const errors: ITodoLangError[] = todoLangErrorsListner.getErrors();
  return { ast, errors };
}
export function parseAndGetASTRoot(code: string): TodoExpressionsContext {
  const { ast } = parse(code);
  return ast;
}
export function parseAndGetSyntaxErrors(code: string): ITodoLangError[] {
  const { errors } = parse(code);
  return errors;
}


export class DiagnosticsAdapter {
  constructor(private worker: WorkerAccessor) {
    const onModelAdd = (model: monaco.editor.IModel): void => {
      let handle: any;
      model.onDidChangeContent(() => {
        // here we are Debouncing the user changes, so everytime a new change is done, we wait 500ms before validating
        // otherwise if the user is still typing, we cancel the
        clearTimeout(handle);
        handle = setTimeout(() => this.validate(model.uri), 500);
      });

      this.validate(model.uri);
    };
    monaco.editor.onDidCreateModel(onModelAdd);
    monaco.editor.getModels().forEach(onModelAdd);
  }

  private async validate(resource: monaco.Uri): Promise<void> {
    // const worker = await this.worker(resource)
    // const errorMarkers = await worker.doValidation();
    // const model = monaco.editor.getModel(resource);
    // monaco.editor.setModelMarkers(model, 'AviatorScript', errorMarkers.map(toDiagnostics));
  }
}



function toDiagnostics(error: ITodoLangError): monaco.editor.IMarkerData {
  return {
    ...error,
    severity: monaco.MarkerSeverity.Error,
  };
}

export class TodoLangWorker {
  private _ctx: IWorkerContext;
  private languageService: TodoLangLanguageService;
  constructor(ctx: IWorkerContext) {
    console.log('TodoLangWorker');
    this._ctx = ctx;
    this.languageService = new TodoLangLanguageService();
  }

  doValidation() {
    const code = this.getTextDocument();
    return Promise.resolve(this.languageService.validate(code));
  }

  private getTextDocument(): string {
    const model = this._ctx.getMirrorModels()[0];
    return model.getValue();
  }
}

export class WorkerManager {

  private worker: monaco.editor.MonacoWebWorker<TodoLangWorker>;
  private workerClientProxy: Promise<TodoLangWorker>;

  constructor() {
    console.log('**********WorkerManager');
    // this.worker = null;

    this.worker = monaco.editor.createWebWorker<TodoLangWorker>({
      moduleId: 'AviatorScript',
      label: 'AviatorScript',
      createData: {
        languageId: 'AviatorScript',
      }
    });
  }

  private getClientproxy(): Promise<TodoLangWorker> {
    if (!this.workerClientProxy) {
      this.worker = monaco.editor.createWebWorker<TodoLangWorker>({
        moduleId: 'TodoLangWorker',
        label: 'AviatorScript',
        createData: {
          languageId: 'AviatorScript',
        }
      });
      this.workerClientProxy = <Promise<TodoLangWorker>><any>this.worker.getProxy();
    }

    return this.workerClientProxy;
  }

  parse(e) {
    console.log(e, this.worker);
    let a = new AviatorScript();
    console.log(a.format(e.getValue()), a.changeContent(e));
  }
}

// monaco.languages.onLanguage('AviatorScript', (e) => {
//   worker.initialize((ctx: worker.IWorkerContext, createData: ICreateData) => {
//     return new WorkerManager(ctx, createData);
//   });
//   console.log(113);
//   new WorkerManager();
// });