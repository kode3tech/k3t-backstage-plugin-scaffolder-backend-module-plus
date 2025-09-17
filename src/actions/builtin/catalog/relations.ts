
import { CatalogClient } from '@backstage/catalog-client';
import { Entity, EntityRelation, parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { CATALOG_RELATIONS_ID } from './ids';
import { examples } from './relations.examples'
import z from "zod";
import { DiscoveryService } from '@backstage/backend-plugin-api';

export type FieldsType = {
  relations: EntityRelation[];
  optional?: boolean | undefined;
  defaultKind?: string | undefined;
  defaultNamespace?: string | undefined;
  relationType?: string | undefined;
}

export const FieldsSchema = {
  relations: z.array(z.object({
    type: z.string({description: 'The type of the relation.'}),
    targetRef: z.string({description: 'The entity ref of the target of this relation.'}),
  })),
  optional: z.boolean({description: 'Whether or not the field is optional.'}).optional(),
  defaultKind: z.string({description: 'The default kind to use if none is provided.'}).optional(),
  defaultNamespace: z.string({description: 'The default namespace to use if none is provided.'}).optional(),
  relationType: z.string({description: 'Type of relation for the property.'}).optional(),
}

export const InputSchema = {
  commonParams: z.object(FieldsSchema).optional(),
  queries: z.array(z.object(FieldsSchema))
}

export type InputType = {
  commonParams?: z.infer<typeof InputSchema.commonParams>,
  queries: z.infer<typeof InputSchema.queries>
}

export type OutputFields = Array<Entity | null>

export type OutputType = {
  results: Array<OutputFields>
}

export const OutputSchema = {
  results: z.array(z.any()),
}

export function createCatalogRelationAction(options: { 
  discoveryApi: DiscoveryService
}) {
  const catalogClient = new CatalogClient(options)
  
  return createTemplateAction({
    id: CATALOG_RELATIONS_ID,
    description: "Get entities from relation spec.",
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

      const { 
        input: { 
          queries, 
          commonParams
        }, 
        logger, 
        output, 
        secrets
      } = ctx
      
      const results: Array<Array<Entity | null>> = [];

      for (const source of queries) {
        const input = {
          ...{...(commonParams ?? {}), ...source}
        }
        
        const { relations, relationType, defaultKind, defaultNamespace, optional } = input;

        logger.info(`Quering ...`)
        logger.info(JSON.stringify(input))

        const entities = await catalogClient.getEntitiesByRefs(
          {
            entityRefs: relations
            .filter(ref => !relationType || ref.type === relationType)
            .map(ref =>
              stringifyEntityRef(
                parseEntityRef(ref.targetRef, { defaultKind, defaultNamespace }),
              ),
            ),
          },
          {
            token: secrets?.backstageToken,
          },
        );

        const finalEntities = entities.items.map((e, i) => {
          if (!e && !optional) {
            throw new Error(`Entity ${relations[i]} not found`);
          }
          return e ?? null;
        });
        
        results.push(finalEntities)
      }
      output('results', results)

    }
  });
}
  
  
