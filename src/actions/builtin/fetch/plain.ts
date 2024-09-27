
import { ScmIntegrations } from '@backstage/integration';
import { examples } from './plain.examples';

import { createFetchPlainFileAction } from '@backstage/plugin-scaffolder-backend';
import {
  createTemplateAction
} from '@backstage/plugin-scaffolder-node';
import { Schema } from 'jsonschema';
import { FETCH_PLAIN_POLY_ID } from './ids';
import { UrlReaderService } from '@backstage/backend-plugin-api';

export type FieldsType = {
  url: string
  targetPath: string
}

export const FieldsSchema = {
  url: {
    title: 'Fetch URL',
    description:
      'Relative path or absolute URL pointing to the directory tree to fetch',
    type: 'string',
  },
  targetPath: {
    title: 'Target Path',
    description:
      'Target path within the working directory to download the contents to.',
    type: 'string',
  },
}


export const InputSchema: Schema = {
  type: 'object',
  properties: {
    commonParams: {
      type: 'object',
      properties:{
        ...FieldsSchema
      }
    },
    templates: {
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
  sources: FieldsType[]
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
export function createFetchPlainPlusAction(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
}) {  
  const templateAction = createFetchPlainFileAction(options)

  return createTemplateAction<InputType, OutputType>({
    id: FETCH_PLAIN_POLY_ID,
    description:
    'Downloads content and places it in the workspace, or optionally in a subdirectory specified by the `targetPath` input option.',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema
    },
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info('Fetching plain content from remote URL');

      // Finally move the template result into the task workspace
      const { 
        input: { 
          sources, 
          commonParams
        }, 
        logger, 
        output 
      } = ctx
      
      const results = [];

      for (const source of sources) {
        const input = {
          ...{...(commonParams ?? {}), ...source}
        }
        const { url }  = input;
        
        logger.info(`Fetching pain from '${url}'...`)

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
