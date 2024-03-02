
import {
  UrlReader
} from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { createFetchTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Schema } from 'jsonschema';
import { examples } from './template.examples'
import { FETCH_TEMPLATE_ID } from './ids';


export type FieldsType = {
  url: string
  targetPath: string
  values: any
  copyWithoutRender: string[]
  copyWithoutTemplating: string[]
  cookiecutterCompat: boolean
  templateFileExtension: string | boolean
  replace: boolean
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
      'Target path within the working directory to download the contents to. Defaults to the working directory root.',
    type: 'string',
  },
  values: {
    title: 'Template Values',
    description: 'Values to pass on to the templating engine',
    type: 'object',
  },
  copyWithoutRender: {
    title: '[Deprecated] Copy Without Render',
    description:
      'An array of glob patterns. Any files or directories which match are copied without being processed as templates.',
    type: 'array',
    items: {
      type: 'string',
    },
  },
  copyWithoutTemplating: {
    title: 'Copy Without Templating',
    description:
      'An array of glob patterns. Contents of matched files or directories are copied without being processed, but paths are subject to rendering.',
    type: 'array',
    items: {
      type: 'string',
    },
  },
  cookiecutterCompat: {
    title: 'Cookiecutter compatibility mode',
    description:
      'Enable features to maximise compatibility with templates built for fetch:cookiecutter',
    type: 'boolean',
  },
  templateFileExtension: {
    title: 'Template File Extension',
    description:
      'If set, only files with the given extension will be templated. If set to `true`, the default extension `.njk` is used.',
    type: ['string', 'boolean'],
  },
  replace: {
    title: 'Replace files',
    description:
      'If set, replace files in targetPath instead of skipping existing ones.',
    type: 'boolean',
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
  templates: FieldsType[]
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

export function createFetchTemplatePlusAction(options: {
  integrations: ScmIntegrations,
  reader: UrlReader
}) {
  const templateAction = createFetchTemplateAction(options)

  return createTemplateAction<InputType, OutputType>({
    id: FETCH_TEMPLATE_ID,
    description: "Same from 'fetch:template' for array list.",
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema
    },
    async handler(ctx) {
      const { 
        input: { 
          templates, 
          commonParams
        }, 
        logger, 
        output 
      } = ctx
      
      const results = [];

      for (const value of templates) {
        const input = {
          ...{...(commonParams ?? {}), ...value}
        }
        const { url }  = input;
        
        logger.info(`Fetching template from '${url}'...`)

        const result: Record<string, any> = {}

        await templateAction.handler({ 
          ...ctx, 
          output: (k, v) => {result[k] = v},
          input: {...input, values: (input.values ?? {})}
        })
        results.push(result)
      }
      output('results', results)
    }
  });
}
  
  