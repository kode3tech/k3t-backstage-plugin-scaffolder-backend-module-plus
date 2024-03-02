
import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { Entity, EntityRelation, parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { CATALOG_RELATIONS_ID } from './ids';
import { Schema } from 'jsonschema';
import { examples } from './register.examples'

export type FieldsType = {
  relations: EntityRelation[];
  optional?: boolean | undefined;
  defaultKind?: string | undefined;
  defaultNamespace?: string | undefined;
  relationType?: string | undefined;
}

export const FieldsSchema: Schema = {
  "type": 'object',
  "required": ['relations'],
  "properties": {
    "relations": { 
      "type": 'array',
      "title": 'fields',
      "description": 'fields',
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "description": "The type of the relation."
          },
          "targetRef": {
            "type": "string",
            "description": "The entity ref of the target of this relation."
          }
        },
        "required": ["type", "targetRef"],
        "additionalProperties": false,
        "description": "EntityRelation represents a relationship between entities."
      }
    },
    "optional": {
      "anyOf": [
        {"type": "boolean"},
        {"type": "undefined"}
      ],
      "description": "Optional flag indicating whether the property is optional."
    },
    "defaultKind": {
      "anyOf": [
        {"type": "string"},
        {"type": "undefined"}
      ],
      "description": "Default kind for the property."
    },
    "defaultNamespace": {
      "anyOf": [
        {"type": "string"},
        {"type": "undefined"}
      ],
      "description": "Default namespace for the property."
    },
    "relationType": {
      "anyOf": [
        {"type": "string"},
        {"type": "undefined"}
      ],
      "description": "Type of relation for the property."
    }
  },
  "additionalProperties": false,
  "description": "Object representing optional properties for configuration."
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

export type OutputFields = Array<Entity | null>

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

export function createCatalogRelationAction(options: { 
  discoveryApi: PluginEndpointDiscovery
}) {
  const catalogClient = new CatalogClient(options)
  
  return createTemplateAction<InputType, OutputType>({
    id: CATALOG_RELATIONS_ID,
    description: "Get entities from relation spec.",
    examples,
    schema: {
      input: InputSchema,
      output: OutputSchema,
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
  
  
