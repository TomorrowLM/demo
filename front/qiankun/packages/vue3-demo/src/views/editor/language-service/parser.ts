// import { TodoLangGrammarParser, TodoExpressionsContext } from '../ANTLR/TodoLangGrammarParser';
// import { TodoLangGrammarLexer } from '../ANTLR/TodoLangGrammarLexer';
import TodoLangErrorListener from './TodoLangErrorListener'
import { InputStream, CommonTokenStream } from 'antlr4'
import GrammarParser from '../aviatorscript/grammar/GrammarParser.mjs'

function parse(code: string): { ast: TodoExpressionsContext; errors: ITodoLangError[] } {
  // const inputStream = new InputStream(code);
  // const lexer = new TodoLangGrammarLexer(inputStream);
  // lexer.removeErrorListeners()
  // const todoLangErrorsListner = new TodoLangErrorListener();
  // lexer.addErrorListener(todoLangErrorsListner);
  // const tokenStream = new CommonTokenStream(lexer);
  // const parser = new TodoLangGrammarParser(tokenStream);
  // parser.removeErrorListeners();
  // parser.addErrorListener(todoLangErrorsListner);
  // const ast = parser.todoExpressions();
  // const errors: ITodoLangError[] = todoLangErrorsListner.getErrors();
  // return { ast, errors };
  const grammarParser = new GrammarParser()
  const astJson = grammarParser.parse(code)
  // console.log(astJson,'astJson');
  return astJson
}

// function parse(code: string): { ast: TodoExpressionsContext, errors: any[] } {
//     // const inputStream = new ANTLRInputStream(code);
//     // const lexer = new TodoLangGrammarLexer(inputStream);
//     // lexer.removeErrorListeners()
//     // const todoLangErrorsListner = new TodoLangErrorListener();
//     // lexer.addErrorListener(todoLangErrorsListner);
//     // const tokenStream = new CommonTokenStream(lexer);
//     // const parser = new TodoLangGrammarParser(tokenStream);
//     // parser.removeErrorListeners();
//     // parser.addErrorListener(todoLangErrorsListner);
//     // const ast =  parser.todoExpressions();
//     // const errors: ITodoLangError[]  = todoLangErrorsListner.getErrors();
//     // return {ast, errors};
// }
export function parseAndGetASTRoot(code: string): TodoExpressionsContext {
  const { ast } = parse(code)
  return ast
}
export function parseAndGetSyntaxErrors(code: string): any[] {
  const { errors } = parse(code)
  return errors
}
