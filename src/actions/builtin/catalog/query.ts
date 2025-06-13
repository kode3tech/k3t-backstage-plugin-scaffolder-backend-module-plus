import { CatalogApi, EntityFilterQuery, EntityOrderQuery } from '@backstage/catalog-client';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { CATALOG_QUERY_ID } from './ids';
import { Schema } from 'jsonschema';
import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/types';
import { examples } from "./query.examples";
import z from 'zod';

export type FieldsType = {
  fields?: string[];
  limit?: number;
  filter?: EntityFilterQuery;
  orderFields?: EntityOrderQuery;
  fullTextFilter?: {
      term: string;
      fields?: string[];
  };
} & JsonObject;

export const FieldsSchema = {
  fields: z.array(z.string()).optional(),
  limit: z.number({description: 'Limit the number of results returned.'}).optional(),
  filter: z.object({}).optional(),
  orderFields: z.object({
    field: z.string(),
    order: z.enum(['asc', 'desc'])
  }).optional(),
  fullTextFilter: z.object({
      term: z.string(),
      fields: z.array(z.string()),
  }).optional(),
}
export const InputSchema = {
  commonParams: z.object(FieldsSchema).optional(),
  queries: z.array(z.object(FieldsSchema))
}

export type InputType = {
  commonParams?: Partial<FieldsType>,
  queries: FieldsType[]
}

export const OutputSchema ={
  results: z.array(z.array(z.any())),
}



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
        commonParams: (_) => InputSchema.commonParams,
        queries: (_) => InputSchema.queries,
      },
      output: {
        results: (_) => OutputSchema.results
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
