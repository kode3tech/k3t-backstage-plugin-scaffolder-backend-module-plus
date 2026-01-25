
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { GLOB } from './ids';
import { examples } from "./parse-repo-url.examples";
import globby from 'globby';
import z from 'zod';
import { InputFieldsSchema } from './glob.types';

export function createGlobAction() {

  return createTemplateAction({
    id: GLOB,
    description: 'Read file(s) and display',
    examples,
    schema: {
      input: (_)  =>  InputFieldsSchema(_),
      output: {
        results: (_) => z.array(z.string())
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
