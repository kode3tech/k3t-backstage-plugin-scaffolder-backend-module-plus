import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { DEBUG_FS_READ } from './ids';
import { examples } from "./parse-repo-url.examples";
import { readFileSync } from "node:fs";
import path from "node:path";
import z from "zod";

// export type FieldsType = {
//   files: string[];
//   useMainLogger?: boolean;
// } & JsonObject;

export const InputSchema = {
  files: z.array(z.string({description: 'Files paths to Read contents from Workspace Path'})),
}

export type InputType = {
  files: z.infer<typeof InputSchema.files>,
}

export const OutputSchema = {
  results: z.array(
    z.object({
      file: z.string({description: 'Relative path of the source file'}),
      content: z.string({description: 'Contents of the source file'}),
    })
  ),
}

export function createDebugFsReadAction() {

  return createTemplateAction({
    id: DEBUG_FS_READ,
    description: 'Read file(s) and display',
    examples,
    schema: {
      input: {
        files: (_) => InputSchema.files,
      },
      output: {
        results: (_) => OutputSchema.results
      },
    },

    async handler(ctx) {
      ctx.logger.info('Debug files');

      const { input: { files }, output, workspacePath, logger } = ctx
      const results = []

      for (const file of (files ?? [])) {
        const resolvedFile = path.resolve(workspacePath, file)
        logger.info(`file: ${file}`)
        const fileContent = readFileSync(resolvedFile).toString('utf-8')
        logger.info(fileContent)
        results.push({file, content: fileContent})
      }
      output('results', results)
    }
  });
}
