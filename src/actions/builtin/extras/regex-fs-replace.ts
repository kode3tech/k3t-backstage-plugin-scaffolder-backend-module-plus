
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { REGEX_FS_REPLACE } from './ids';
import { examples } from "./regex-fs-replace.examples";
import globby from 'globby';
import fs from "node:fs";
import path from "node:path";
import z from "zod";

export type FieldsType = {
  glob: string;
  pattern: string;
  replacement: string;
  flags?: string;
};

export const FieldsSchema = z.object({
  pattern: z.string({
    description: 'Regex expression', 
    message: 'Regex expression to evaluate in file contents from `file`.'
  }),
  glob: z.string({
    description: 'Expression glob to find files to evaluate'
  }),
  replacement: z.string({
    description: 'Replace expression', 
    message: 'Replacement expression based on `pattern` field.'
  }),
  flags: z.string({
    description: 'Regex flags like d, g, i, m, s, u, v or y', 
    message: 'See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags'
  }).optional(),
})


export const InputSchema = FieldsSchema

export const OutputSchema = z.object({
  results: z.array(z.any())
});



export function createRegexFsReplaceAction() {

  return createTemplateAction({
    id: REGEX_FS_REPLACE,
    description: 'Provides Regex (ECMAScript Standards) to rewrite files. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
    examples,
    schema: {
      input: FieldsSchema,
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
