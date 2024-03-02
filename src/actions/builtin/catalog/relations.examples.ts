
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./query";
import { CATALOG_RELATIONS_ID } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Query in relations',
    example: yaml.stringify({
      steps: [
        {
          action: CATALOG_RELATIONS_ID,
          id: 'query-in-relations',
          name: 'Query in relations',
          input: {
            queries: [
              {
                relations: [{
                  type: "apiProvidedBy",
                  targetRef: "component/default:customers-service"
                },{
                  type: "ownedBy",
                  targetRef: "group/default:dream-devs"
                }],
                optional: true,
                relationType: "apiProvidedBy"
              }
            ]
          } as InputType,
        },
      ],
    }),
  },
];
