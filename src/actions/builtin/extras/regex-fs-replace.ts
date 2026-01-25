
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import globby from 'globby';
import fs from "node:fs";
import path from "node:path";
import { REGEX_FS_REPLACE } from './ids';
import { examples } from "./regex-fs-replace.examples";
import { FieldsSchema } from './regex-fs-replace.types';


export function createRegexFsReplaceAction() {

  return createTemplateAction({
    id: REGEX_FS_REPLACE,
    description: 'Provides Regex (ECMAScript Standards) to rewrite files. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
    examples,
    schema: {
      input: FieldsSchema,
      output: {
        results: (d) => d.array(d.any(), { description: 'List of processed files' }),
      },
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
