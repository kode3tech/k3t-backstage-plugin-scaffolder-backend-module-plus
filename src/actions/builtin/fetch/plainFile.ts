
import { ScmIntegrations } from '@backstage/integration';
import { createFetchPlainFileAction } from '@backstage/plugin-scaffolder-backend';
import {
  createTemplateAction
} from '@backstage/plugin-scaffolder-node';
import { Schema } from 'jsonschema';
import { examples } from './plainFile.examples';
import { FETCH_PLAIN_FILE_ID } from './ids';
import { UrlReaderService } from '@backstage/backend-plugin-api';

export type FieldsType = {
  url: string
  targetPath: string
}

export const FieldsSchema = {
  url: {
    title: 'Fetch URL',
    description:
      'Relative path or absolute URL pointing to the single file to fetch.',
    type: 'string',
  },
  targetPath: {
    title: 'Target Path',
    description:
      'Target path within the working directory to download the file as.',
    type: 'string',
  },
}


export const InputSchema = {
  type: 'object',
  properties: {
    commonParams: {
      type: 'object',
      properties:{
        ...FieldsSchema
      }
    },
    files: {
      type: 'array',
      items: {
        type: 'object',
        required: ['url'],
        properties: {
          ...FieldsSchema
        }
      }
    }
  }
}

export type InputType = {
  commonParams?: Partial<FieldsType>,
  files: FieldsType[]
}

export type OutputType = {
  results: any[]
}

export const OutputSchema: Schema = {
  type: 'object',
  properties: {
    results: {
      type: 'array'
    }
  }
}

/**
 * Downloads content and places it in the workspace, or optionally
 * in a subdirectory specified by the 'targetPath' input option.
 * @public
 */
export function createFetchPlainFilePlusAction(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
}) {
  const templateAction = createFetchPlainFileAction(options)

  return createTemplateAction<InputType, OutputType>({
    id: FETCH_PLAIN_FILE_ID,
    description: 'Downloads single file and places it in the workspace.',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema
    },
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info('Fetching plain content from remote URL');

      const { 
        input: { 
          files, 
          commonParams
        }, 
        logger, 
        output 
      } = ctx
      
      const results = [];

      for (const file of files) {
        const input = {
          ...{...(commonParams ?? {}), ...file}
        }
        const { url }  = input;
        
        logger.info(`Fetching template from '${url}'...`)

        const result: Record<string, any> = {}

        await templateAction.handler({ 
          ...ctx, 
          output: (k, v) => {result[k] = v},
          input: {...input}
        })
        results.push(result)
      }
      output('results', results)
    },
  });
}
