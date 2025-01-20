import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { autocompletion } from '@codemirror/autocomplete';
import {
  schemaCompletionSource, keywordCompletionSource, sql, SQLDialect,
} from '@codemirror/lang-sql';
import { basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import type { CompletionContext } from '@codemirror/autocomplete';
import { keywords, selectList } from '@/constants/code-mirror';

const IotdbKeywords = `${keywords.join(' ')} ENCODING PLAIN RLE TS_2DIFF GORILLA FREQ ZIGZAG UNCOMPRESSED SNAPPY LZ4 GZIP MAX_POINT_NUMBER DEADBAND SDT COMPDEV COMPMINTIME COMPMAXTIME`;
const IotdbTypes = 'BOOLEAN INT32 INT64 FLOAT DOUBLE TEXT';
let IotdbBuiltin = 'root TIME TIMESTAMP AND OR NOT NULL CONTAINS';

export const IotdbSQLConfigName = 'IotdbSQLConfig';

export function addIotdbExtensions(dataBaseFiled: any) {
  if (dataBaseFiled.length >= 1) {
    IotdbBuiltin += ' ';
    IotdbBuiltin += dataBaseFiled.join(' ');
  }
  const IotdbSQL = SQLDialect.define({
    operatorChars: '*+-%<>!=&|^',
    charSetCasts: true,
    doubleQuotedStrings: true,
    unquotedBitLiterals: true,
    hashComments: true,
    spaceAfterDashes: true,
    specialVar: '@?',
    identifierQuotes: '`',
    keywords: IotdbKeywords,
    types: IotdbTypes,
    builtin: IotdbBuiltin,
  });
  const sqlExamplesCompletions = (context: CompletionContext) => {
    const before = context.matchBefore(/\w+/);
    if (!context.explicit && !before) return null;
    const arr = Object.keys(selectList);
    const upperToken = before?.text.trim() || '';
    if (arr.includes(upperToken)) {
      return {
        options: selectList[upperToken].map((item: string) => ({
          label: item,
          type: 'text',
        })),
        from: before ? before.from : context.pos,
      };
    }
    return null;
  };

  const IotdbSQLConfig = {
    dialect: IotdbSQL,
    upperCaseKeywords: true,
  };

  const IOTDB_EXTENSIONS1 = [
    basicSetup,
    keymap.of(defaultKeymap),
    sql(IotdbSQLConfig),
    syntaxHighlighting(defaultHighlightStyle),
    autocompletion({ override: [schemaCompletionSource(IotdbSQLConfig), keywordCompletionSource(IotdbSQL, true), sqlExamplesCompletions] }),
  ];
  return IOTDB_EXTENSIONS1;
}
