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

import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { mkdirSync, renameSync } from 'fs';
import globby from 'globby';
import path from 'path';
import { RENAME_PATHS_ID } from './ids';
import { examples } from './rename-paths.examples';
import { FieldsSchema } from './rename-paths.types';


/**
 * Creates a new action that allows renames of files and directories in the workspace.
 * @public
 */
export const createRenamePathsAction = () => {

  return createTemplateAction({
    id: RENAME_PATHS_ID,
    description: 'Renames files and directories within the workspace using glob and regex pattern matching',
    examples,
    schema: {
      input: {
        commonParams: (d) => FieldsSchema(d).partial().optional(),
        paths: (d) => d.array(FieldsSchema(d)),
      },
      output: {
        results: (d) => d.array(d.object({}))
      }
    },
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info('Fetching plain content from remote URL');

      // Finally move the template result into the task workspace
      const { 
        input: { 
          paths: paths, 
          commonParams
        }, 
        // logger,
        output 
      } = ctx
      
      if (!Array.isArray(ctx.input?.paths)) {
        throw new InputError('files must be an Array');
      }

      const pathsResults = [];

      for (const {glob, pattern, replacement, overwrite } of paths) {
        const results = [];
        if (!glob || !pattern || !replacement) {
          throw new InputError('each path must have a glob, pattern, and replacement property');
        }

        const parsed = /\/(.+)\/([isdyugm]{0,})/g.exec(pattern);
        if (!parsed) {
          throw new Error([
            `Invalid regular expression '${pattern}'. `,
            `You must put raw ECMAScript syntax like '/hello/ig'.`,
            `Try build your expression using 'https://regex101.com', is a great tool.`
          ].join('\n'));
        }
        const regExp = new RegExp(parsed[1], parsed[2]);

        let founded = globby.sync(glob, { cwd: ctx.workspacePath, onlyDirectories: true })
        for (const currentPath of founded) {
          regExp.lastIndex = 0; // Reset lastIndex in case of global regex
          if (!regExp.test(currentPath)) continue;
          
          const sourceFilepath = resolveSafeChildPath(ctx.workspacePath,currentPath);
          const destFilepath = resolveSafeChildPath(ctx.workspacePath, currentPath.replace(regExp, replacement));

          try {
            if(!ctx.isDryRun) {
              renameSync(sourceFilepath, destFilepath);
              ctx.logger.info(
                `File ${sourceFilepath} renamed to ${destFilepath} successfully`,
              );
            }
            results.push({ from: sourceFilepath, to: destFilepath, status: 'renamed' });
          } catch (err: any) {
            ctx.logger.error(
              `Failed to rename file ${sourceFilepath} to ${destFilepath}:`,
              err,
            );
          }
        }
        
        founded = globby.sync(glob, { cwd: ctx.workspacePath, onlyFiles: true })
          
        for (const currentPath of founded) {
          regExp.lastIndex = 0; // Reset lastIndex in case of global regex
          if (!regExp.test(currentPath)) continue;
          
          const sourceFilepath = resolveSafeChildPath(ctx.workspacePath,currentPath);
          const destFilepath = resolveSafeChildPath(ctx.workspacePath, currentPath.replace(regExp, replacement));

          try {
            if(!ctx.isDryRun) {
              renameSync(sourceFilepath, destFilepath);
              ctx.logger.info(
                `File ${sourceFilepath} renamed to ${destFilepath} successfully`,
              );
            }
            results.push({ from: sourceFilepath, to: destFilepath, status: 'renamed' });
          } catch (err: any) {
            ctx.logger.error(
              `Failed to rename file ${sourceFilepath} to ${destFilepath}:`,
              err,
            );
          }
        }



        pathsResults.push(results);
      }

      output('results', pathsResults)
    },
  });
};
