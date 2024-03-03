
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { REGEX_FS_REPLACE } from './ids';
import { examples } from "./regex-fs-replace.examples";
import globby from 'globby';
import fs from "node:fs";
import path from "node:path";

export type FieldsType = {
  glob: string;
  pattern: string;
  replacement: string;
  flags?: string;
} & JsonObject;

export const FieldsSchema: Schema = {
  type: 'object',
  required: ['pattern', 'glob', 'replacement'],
  properties: {
    pattern: {
      title: 'Regex expression',
      description: 'Regex expression to evaluate in file contents from `file`.',
      type: 'string',
    },
    glob: {
      title: 'Expression glob to find files to evaluate',
      description: 'Expression glob to find files to evaluate',
      type: 'string',
    },
    replacement: {
      title: 'Replace expression',
      description: 'Replacement expression based on `pattern` field.',
      type: 'string',
    },
    flags: {
      type: 'string',
      title: 'Regex flags like d, g, i, m, s, u, v or y',
      description: "See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags",
      // default: 'g'
    }
},
}


export const InputSchema: Schema = FieldsSchema

export type InputType = FieldsType

export type OutputFields = any

export type OutputType = {
  results: Array<OutputFields>
}


export const OutputSchema: Schema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: { 
        type: "object"
      },
    }
  }
}



export function createRegexFsReplaceAction() {

  return createTemplateAction<InputType, OutputType>({
    id: REGEX_FS_REPLACE,
    description: 'Provides Regex (ECMAScript Standards) to rewrite files. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema,
    },

    async handler(ctx) {
      const {
        pattern,
        glob,
        replacement,
        flags
      } = ctx.input;
  
      const files = globby.sync([glob], {cwd: ctx.workspacePath })
      const reg = new RegExp(pattern, flags ?? 'g')
      for (const file of files.map(f => path.join(ctx.workspacePath, f))) {
        const content = fs.readFileSync(file).toString()

        reg.lastIndex = -1
        const newContent = content.replace(reg, replacement);
        fs.writeFileSync(file, newContent);

        ctx.logger.info(`${file}`)
      }
  }
  });
}
