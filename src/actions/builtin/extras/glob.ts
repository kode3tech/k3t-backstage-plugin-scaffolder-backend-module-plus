
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import globby from 'globby';
import z from 'zod';
import { InputFieldsSchema } from './glob.types';
import { GLOB } from './ids';
import { examples } from "./glob.examples";

export function createGlobAction() {

  return createTemplateAction({
    id: GLOB,
    description: 'Read file(s) and display',
    examples,
    schema: {
      input: (_) => InputFieldsSchema(_),
      output: {
        results: (_) => _.array(_.string({description: 'A file path found by the glob pattern'}), { description: 'List of files found by glob pattern' }),
      },
    },

    async handler(ctx) {
      ctx.logger.info('Glob');

      const {
        input: { patterns, options },
        output
      } = ctx;
      const p = [...patterns]
      try {
        const files = globby.sync(p, {
          ...(options ?? {}), 
          cwd: ctx.workspacePath
        })        
        output('results', files)
      } catch (error) {
        output('results', [])
      }
    }
  });
}
