import { CatalogApi, EntityFilterQuery, EntityOrderQuery } from '@backstage/catalog-client';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { CATALOG_QUERY_ID } from './ids';
import { Schema } from 'jsonschema';
import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/types';
import { examples } from "./query.examples";

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

export const FieldsSchema: Schema = {
  type: 'object',
  required: ['filter'],
  properties: {
    fields: { 
      title: 'fields',
      description: 'fields',
      type: 'array',
      items: { type: 'string'}
    },
    limit: { 
      title: 'limit',
      description: 'limit',
      type: 'number',
    },
    filter: { 
      title: 'filter',
      description: 'filter',
      type: 'any'
    },
    orderFields: { 
      title: 'orderFields',
      description: 'orderFields',
      type: 'object',
      properties: {
        field: { 
          title: 'field',
          description: 'field',
          type: 'string'
        },
        order: { 
          title: 'field',
          description: 'field',
          type: 'string',
          enum:[
            'asc', 
            'desc'
          ]
        }
      }
    },
    fullTextFilter: { 
      title: 'fullTextFilter',
      description: 'fullTextFilter',
      type: ''
    },
  },
}


export const InputSchema: Schema = {
  type: 'object',
  properties: {
    commonParams: FieldsSchema,
    queries: {
      type: 'array',
      items: FieldsSchema
    }
  }
}

export type InputType = {
  commonParams?: Partial<FieldsType>,
  queries: FieldsType[]
}

export type OutputFields = Array<Entity>

export type OutputType = {
  results: Array<OutputFields>
}

export const OutputSchema: Schema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: { 
        type: "array"
       },
    }
  }
}



export function createCatalogQueryAction(options: { 
  catalogClient: CatalogApi 
}) {
  const { catalogClient } = options;

  return createTemplateAction<InputType, OutputType>({
    id: CATALOG_QUERY_ID,
    description:
      'Query on catalog',
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema,
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
