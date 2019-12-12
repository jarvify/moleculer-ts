import { Tuple } from 'index';

const IMPORT_KEYWORD = 'import';
const FROM_KEYWORD = 'from';
const AS_KEYWORD = 'as';
const NAMED_IMPORTS_OPEN_TOKEN = '{';
const NAMED_IMPORTS_CLOSE_TOKEN = '}';

function parseImport(line: string) {
  const trimmedLine = line.trim();
  const lineWithoutImport = removeImportKeyword(trimmedLine);

  if (!hasFrom(lineWithoutImport)) {
    const fromModule = removeQuotesAndSemicolon(lineWithoutImport);
    return {
      defaultImport: null,
      namedImports: [],
      starImport: null,
      fromModule,
    };
  }

  const [beforeFrom, afterFrom] = lineWithoutImport.split(FROM_KEYWORD);
  const fromModule = removeQuotesAndSemicolon(afterFrom);

  const defaultOrStarImportStr = getDefaultOrStarImportStr(beforeFrom);
  const namedImportStr = getNamedImportsStr(beforeFrom);

  const { defaultImport, starImport } = parseDefaultOrStarImport(
    defaultOrStarImportStr,
  );
  const namedImports = parseNamedImports(namedImportStr);

  return {
    defaultImport,
    namedImports,
    starImport,
    fromModule,
  };
}

function removeImportKeyword(line: string) {
  return line.slice(IMPORT_KEYWORD.length);
}

function hasFrom(line: string) {
  return line.indexOf(` ${FROM_KEYWORD} `) !== -1;
}

function getDefaultOrStarImportStr(importVariables: string) {
  if (containsNamedImports(importVariables)) {
    const [beforeNamedImports] = importVariables.split(
      NAMED_IMPORTS_OPEN_TOKEN,
    );
    return beforeNamedImports;
  }

  return importVariables;
}

function getNamedImportsStr(importVariables: string) {
  if (containsNamedImports(importVariables)) {
    const [_, afterNamedImports] = importVariables.split(
      NAMED_IMPORTS_OPEN_TOKEN,
    );
    return afterNamedImports.replace(NAMED_IMPORTS_CLOSE_TOKEN, '');
  }

  return null;
}

function containsNamedImports(str: string) {
  return (
    str.indexOf(NAMED_IMPORTS_OPEN_TOKEN) !== -1 &&
    str.indexOf(NAMED_IMPORTS_CLOSE_TOKEN) !== -1
  );
}

/*

convert import to names !!

*/

function parseDefaultOrStarImport(str: string) {
  const noDefaultOrStarImport = {
    defaultImport: null,
    starImport: null,
  };

  const cleanStr = str.trim().replace(',', '');

  if (cleanStr === '') {
    return noDefaultOrStarImport;
  }

  if (hasAs(cleanStr)) {
    const { value } = parseAs(cleanStr);
    return {
      defaultImport: null,
      starImport: value,
    };
  }

  return {
    defaultImport: cleanStr,
    starImport: null,
  };
}

function parseNamedImports(namedImportsStr: string | null) {
  if (!namedImportsStr) return [];

  const namedImportsValues = namedImportsStr.split(',');
  return namedImportsValues.map(mapNameAndValue);
}

function mapNameAndValue(str: string) {
  const trimmedStr = str.trim();

  if (hasAs(trimmedStr)) {
    return parseAs(trimmedStr);
  }

  return {
    name: trimmedStr,
    value: trimmedStr,
  };
}

function hasAs(str: string) {
  return str.indexOf(` ${AS_KEYWORD} `) !== -1;
}

function parseAs(str: string) {
  const [name, value] = str.split(` ${AS_KEYWORD} `);

  return {
    name,
    value,
  };
}

function removeQuotesAndSemicolon(str: string) {
  return str.trim().replace(/[\;\'\"]/g, '');
}

function isEmptyLine(line: string) {
  return line.trim() === '';
}

function isLineWithImport(line: string) {
  return line.trim().indexOf('import') === 0;
}

function isLineWithComment(line: string) {
  return line.trim().indexOf('//') === 0 || line.trim().indexOf('/*') === 0;
}

function parseTsImport(str: string) {
  const lines = str.split('\n');
  const results = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isLineWithComment(line) || isEmptyLine(line)) {
      continue;
    }

    if (isLineWithImport(line)) {
      const result = parseImport(line);
      results.push(result);
      continue;
    }

    break;
  }

  return results;
}

function getTuplesNames(str: string) {
  return str
    .split(',')
    .map(one => one.trim())
    .filter(one => one.length > 0);
}

// fromModule: './tuple.test'

// we get array of concats !
// Name + import path

function getImportOfName(
  name: string,
  importRes: ReturnType<typeof parseTsImport>,
): { name: string; fromModule: string | null } {
  let result: { name: string; fromModule: string } | null = null;

  importRes.map(oneImport => {
    oneImport.namedImports.map(namedImport => {
      if (namedImport.value === name) {
        result = {
          name: namedImport.name,
          fromModule: oneImport.fromModule,
        };
      }
    });
  });

  if (!result) {
    return {
      name,
      fromModule: null,
    };
  }

  return result;
}

export function parseTsConcatMultiple(str: string) {
  const importRes = parseTsImport(str);

  const actionsMatchArray = str.match(
    /type\s+Actions\s*=\s*ConcatMultiple\s*<\s*\[([^\]]*)/,
  );

  // count it by parts or can we put it into single file ?! yes !
  const result: {
    actions: { name: string; fromModule: string }[];
    events: { name: string; fromModule: string }[];
  }[] = [];

  if (
    actionsMatchArray &&
    actionsMatchArray.length === 2 &&
    typeof actionsMatchArray[1] === 'string'
  ) {
    const actionTuples = getTuplesNames(actionsMatchArray[1]).map(tupleName => {
      return getImportOfName(tupleName, importRes);
    });

    console.log(actionTuples);
  }

  const eventsMatchArray = str.match(
    /type\s+Events\s*=\s*ConcatMultiple\s*<\s*\[([^\]]*)/,
  );

  if (
    eventsMatchArray &&
    eventsMatchArray.length === 2 &&
    typeof eventsMatchArray[1] === 'string'
  ) {
    const eventTuples = getTuplesNames(eventsMatchArray[1]).map(tupleName => {
      return getImportOfName(tupleName, importRes);
    });

    console.log(eventTuples);
  }

  // namedImports only - for first release
  // if not found in name imports -> its exported local
  // get relative path - if starts with . otherwise its fullpath - we dont care for it

  /* 
    {
      defaultImport: null,
      namedImports: [ { name: 'SomeActions', value: 'Idk' } ],
      starImport: null,
      fromModule: './tuple.test'
    }
  */

  return result;
}
