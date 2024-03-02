import { ScmIntegrations } from '@backstage/integration';
import { CatalogApi } from '@backstage/catalog-client';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { examples } from './register.examples';
import { Schema } from 'jsonschema';
import { createCatalogRegisterAction } from '@backstage/plugin-scaffolder-backend';
import { CATALOG_REGISTER_ID } from './ids';


export type FieldsType = { catalogInfoUrl: string; optional?: boolean }

export const FieldsSchema: Schema = {
  type: 'object',
  required: ['catalogInfoUrl'],
  properties: {
    catalogInfoUrl: {
      title: 'Catalog Info URL',
      description:
        'An absolute URL pointing to the catalog info file location',
      type: 'string',
    },
    optional: {
      title: 'Optional',
      description:
        'Permit the registered location to optionally exist. Default: false',
      type: 'boolean',
    },
  },
}

export const InputSchema: Schema = {
  type: 'object',
  properties: {
    commonParams: FieldsSchema,
    infos: {
      type: 'array',
      items: FieldsSchema
    }
  }
}

export type InputType = {
  commonParams?: Partial<FieldsType>,
  infos: FieldsType[]
}

export type OutputFields = {
  entityRef?: string,
  catalogInfoUrl?: string,
}

export type OutputType = {
  results: OutputFields[]
}

export const OutputSchema: Schema = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          entityRef: {
            type: 'string',
          },
          catalogInfoUrl: {
            type: 'string',
          },
        }
      }
    }
  }
}

/**
 * Registers entities from a catalog descriptor file in the workspace into the software catalog.
 * @public
 */
export function createCatalogRegisterPlusAction(options: {
  catalogClient: CatalogApi;
  integrations: ScmIntegrations;
}) {
  const templateAction = createCatalogRegisterAction(options)

  return createTemplateAction<InputType, OutputType>({
    id: CATALOG_REGISTER_ID,
    description:
      'Registers entities from a catalog descriptor file in the workspace into the software catalog.',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema
    },
    async handler(ctx) {
      ctx.logger.info('Registering entities');

      // Finally move the template result into the task workspace
      const { 
        input: { 
          infos, 
          commonParams
        }, 
        logger, 
        output 
      } = ctx
      
      const results = [];

      for (const source of infos) {
        const input = {
          ...{...(commonParams ?? {}), ...source}
        }
        const { catalogInfoUrl } = input; 
        
        logger.info(`Registering from '${catalogInfoUrl}'...`)

        const result: OutputFields = {}

        await templateAction.handler({ 
          ...ctx, 
          output: (k, v) => { (result as any)[k] = v},
          input: {...input}
        })
        results.push(result)
      }
      output('results', results)
    },
  });
}
