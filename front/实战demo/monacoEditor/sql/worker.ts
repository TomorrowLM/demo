
import { MySQL } from 'dt-sql-parser';
import * as monaco from 'monaco-editor';
// export { MySQL, FlinkSQL, SparkSQL, HiveSQL, PostgresSQL, TrinoSQL, ImpalaSQL, PLSQL, } from './parser';

class TodoLangLanguageService {
  parse(editor) {

    const parser = new MySQL();
    const correctSql = 'select id, name from user1;';
    let model = editor.getModel();
    // console.info("onDidChangeModelContent-model:", model);

    let textToValidate = model.getValue();
    if (!textToValidate) {
      return;
    }
    let code = textToValidate + '\n';
    let astJson = parser.validate(code);
    console.log(astJson);
    let markers = [];

    let isError = false;
    for (let i = 0; i < astJson.length; i++) {
      let error = astJson[i];
      console.log(error);
      markers.push({
        startLineNumber: error.startLine,
        startColumn: error.startColumn,
        endLineNumber: error.endLine,
        endColumn: error.endColumn,
        severity: monaco.MarkerSeverity.Error,
        message: error.message
      });
      isError = true;
    }

    // for (let i = 1; i < astJson.children.length - 1; i++) {
    //   let child = astJson.ast.children[i];
    //   markers.push({
    //     severity: monaco.MarkerSeverity.Error,
    //     startLineNumber: child.line,
    //     startColumn: child.column,
    //     endLineNumber: child.line,
    //     endColumn: child.column,
    //     message: child.text
    //   });
    //   isError = true;
    // }
    monaco.editor.setModelMarkers(model, 'sql', markers);
  }
}

export class WorkerSQlManager {
  private worker: any;
  custructor(worker: any) {
    this.worker = worker;
    console.log(8);
    const onModelAdd = (model: monaco.editor.IModel): void => {
      console.log(model);
      let handle: any;
      model.onDidChangeContent(() => {
        // here we are Debouncing the user changes, so everytime a new change is done, we wait 500ms before validating
        // otherwise if the user is still typing, we cancel the
        clearTimeout(handle);
        handle = setTimeout(() => this.parse(model.uri), 500);
      });

    };
    monaco.editor.onDidCreateModel(onModelAdd);
    monaco.editor.getModels().forEach(onModelAdd);
  }

  parse(editor) {

    const parser = new MySQL();
    const correctSql = 'select id, name from user1;';
    let model = editor.getModel();
    // console.info("onDidChangeModelContent-model:", model);

    let textToValidate = model.getValue();
    if (!textToValidate) {
      return;
    }
    let code = textToValidate + '\n';
    let astJson = parser.validate(code);
    console.log(astJson);
    let markers = [];

    let isError = false;
    for (let i = 0; i < astJson.length; i++) {
      let error = astJson[i];
      console.log(error);
      markers.push({
        startLineNumber: error.startLine,
        startColumn: error.startColumn,
        endLineNumber: error.endLine,
        endColumn: error.endColumn,
        severity: monaco.MarkerSeverity.Error,
        message: error.message
      });
      isError = true;
    }

    // for (let i = 1; i < astJson.children.length - 1; i++) {
    //   let child = astJson.ast.children[i];
    //   markers.push({
    //     severity: monaco.MarkerSeverity.Error,
    //     startLineNumber: child.line,
    //     startColumn: child.column,
    //     endLineNumber: child.line,
    //     endColumn: child.column,
    //     message: child.text
    //   });
    //   isError = true;
    // }
    monaco.editor.setModelMarkers(model, 'sql', markers);
  }
}