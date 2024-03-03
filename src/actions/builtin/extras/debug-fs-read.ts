import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { JsonObject } from '@backstage/types';
import { Schema } from 'jsonschema';
import { DEBUG_FS_READ } from './ids';
import { examples } from "./parse-repo-url.examples";
import { Logger } from 'winston';
import { readFileSync } from "node:fs";
import path from "node:path";

export type FieldsType = {
  files: string[];
  useMainLogger?: boolean;
} & JsonObject;

export const FieldsSchema: Schema = {
  type: 'object',
  required: ['files'],
  properties: {
    files: {
      type: 'array',
      title: 'Files paths to Read contents from Workspace Path',
      items: {
        type: 'string'
      }
    },
    useMainLogger: {
      title: 'Attach context logger to main application logger',
      type: 'boolean',
    }
  },
}


export const InputSchema: Schema = FieldsSchema

export type InputType = FieldsType

export type OutputFields = {
  file: string;
  content: string;
}

export type OutputType = {
  results: Array<OutputFields>
}


export const OutputSchema: Schema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: { 
        type: "object",
        properties: {
          file: {
            type: 'string',
            title: 'Relative path of the source file'
          },
          content: {
            type: 'string',
            title: 'Contents of the source file'
          }  
        }
      },
    }
  }
}



export function createDebugFsReadAction(options: {
  logger: Logger
}) {
  const { logger: mainLogger } = options;

  return createTemplateAction<InputType, OutputType>({
    id: DEBUG_FS_READ,
    description: 'Read file(s) and display',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema,
    },

    async handler(ctx) {
      ctx.logger.info('Debug files');

      const { input: { files, useMainLogger }, output, workspacePath, logger } = ctx
      if(useMainLogger) logger.pipe(mainLogger)
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
