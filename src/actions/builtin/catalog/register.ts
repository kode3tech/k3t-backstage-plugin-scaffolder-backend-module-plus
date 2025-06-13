import { ScmIntegrations } from '@backstage/integration';
import { CatalogApi } from '@backstage/catalog-client';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { examples } from './register.examples';
import { Schema } from 'jsonschema';
import { createCatalogRegisterAction } from '@backstage/plugin-scaffolder-backend';
import { CATALOG_REGISTER_ID } from './ids';
import { z } from 'zod';

export type FieldsType = { catalogInfoUrl: string; optional?: boolean }

export const FieldsSchema = {
  catalogInfoUrl: z.string({description: 'Catalog Info URL', message: 'An absolute URL pointing to the catalog info file location'}),
  optional: z.boolean({description: 'Optional', message: 'Permit the registered location to optionally exist. Default: false'}).optional()
};

export const InputSchema = {
  commonParams: z.object(FieldsSchema).optional(),
  infos: z.array(z.object(FieldsSchema))
}

export type InputType = {
  commonParams?: Partial<FieldsType>,
  infos: FieldsType[]
}

export type OutputFields = {
  entityRef?: string,
  catalogInfoUrl?: string,
}

export const OutputSchema = {
  results: z.array(
    z.object({
      entityRef: z.string({description: 'The entity reference of the registered entity.'}),
      catalogInfoUrl: z.string({description: 'The location of the registered entity.'}),
    }),
  )
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

  return createTemplateAction({
    id: CATALOG_REGISTER_ID,
    description:
      'Registers entities from a catalog descriptor file in the workspace into the software catalog.',
    examples,
    schema: {
      input: {
        commonParams: (_) => InputSchema.commonParams,
        infos: (_) => InputSchema.infos,
      },
      output: {
        results: (_) => OutputSchema.results
      },
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
        
        logger.info(`WARNING: This function is not implemented yet!`);

        // const result: OutputFields = {}

        // await templateAction.handler({ 
        //   ...ctx, 
        //   output: (k, v) => { (result as any)[k] = v},
        //   input: {...input}
        // })
        // results.push(result)

      }
      // output('results', results)
    },
  });
}
