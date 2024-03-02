/*
 * Copyright 2024 The K3tech Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createFilesystemRenameAction } from '@backstage/plugin-scaffolder-backend';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { z } from "zod";
import { examples } from './rename.examples';
import { InputError } from '@backstage/errors';
import { FS_RENAME_PLURI_ID } from './ids';

export const ParamsSchema = z.object({
  from: z.string({ 
    description: 'The source location of the file to be renamed'
  }),
  to: z.string({ 
    description: 'The destination of the new file'
  }),
  overwrite:  z.optional(z.boolean({ 
    description: 'Overwrite existing file or directory, default is false'
  })),
})


export const InputSchema = z.object({
  commonParams: z.optional(ParamsSchema),
  files: z.array(ParamsSchema)
})

export const OutputSchema = z.object({
  results: z.array(z.any())
})


/**
 * Creates a new action that allows renames of files and directories in the workspace.
 * @public
 */
export const createFilesystemRenamePlusAction = () => {

  const templateAction = createFilesystemRenameAction();

  return createTemplateAction<any,any, typeof InputSchema, typeof OutputSchema>({
    id: FS_RENAME_PLURI_ID,
    description: 'Renames files and directories within the workspace',
    examples,
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info('Fetching plain content from remote URL');

      // Finally move the template result into the task workspace
      const { 
        input: { 
          files: files, 
          commonParams
        }, 
        // logger,
        output 
      } = ctx
      
      if (!Array.isArray(ctx.input?.files)) {
        throw new InputError('files must be an Array');
      }

      const results = [];

      const result: Record<string, any> = {}

      await templateAction.handler({ 
        ...ctx, 
        output: (k, v) => {result[k] = v},
        input: {
          files: files.map(file => {
            return {
              ...{...(commonParams ?? {}), ...file}
            }
          })
        }
      })

      results.push(result)

      output('results', results)
    },
  });
};
