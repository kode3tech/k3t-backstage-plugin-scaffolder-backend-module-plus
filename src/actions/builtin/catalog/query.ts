import { CatalogApi } from '@backstage/catalog-client';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { CATALOG_QUERY_ID } from './ids';
import { examples } from "./query.examples";
import { InputFieldsSchema, OutputSchema } from './query.types';


export function createCatalogQueryAction(options: { 
  catalogClient: CatalogApi 
}) {
  const { catalogClient } = options;

  return createTemplateAction({
    id: CATALOG_QUERY_ID,
    description:
      'Query on catalog',
    examples,
    schema: {
      input: {
        commonParams: (d) => InputFieldsSchema(d).partial().optional(),
        queries: (d) => d.array(InputFieldsSchema(d)),
      },
      output: {
        results: (d) => OutputSchema.results(d)
      },
    },

    async handler(ctx) {
      ctx.logger.info('Quering entities');

      // Finally move the template result into the task workspace
      const { 
        input: { 
          queries, 
          commonParams
        }, 
        logger, 
        output, 
        secrets
      } = ctx
      
      const results = [];

      for (const source of queries) {
        const input = {
          ...{...(commonParams ?? {}), ...source}
        }
        
        logger.info(`Quering ...`)
        logger.info(JSON.stringify(input))

        const result = await catalogClient.queryEntities(input, {token: secrets?.backstageToken })
        
        results.push(result.items)
      }
      output('results', results)
    }
  });
}
