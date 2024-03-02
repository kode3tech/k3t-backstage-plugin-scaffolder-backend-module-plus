
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./query";
import { CATALOG_QUERY_ID } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Query in catalog',
    example: yaml.stringify({
      steps: [
        {
          action: CATALOG_QUERY_ID,
          id: 'query-in-catalog',
          name: 'Query in catalog',
          input: {
            queries: [
              {
                limit: 2,
                fields: [
                  'metadata.name'
                ],
                filter:{
                  'metadata.annotations.backstage.io/template-origin': 'template:default/java-api',
                  'relations.dependsOn': '${{ parameters.component_ref }}'
                }
              }
            ]
          } as InputType,
        },
      ],
    }),
  },
];
