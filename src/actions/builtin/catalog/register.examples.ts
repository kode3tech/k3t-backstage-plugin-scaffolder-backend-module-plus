
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./register";
import { CATALOG_REGISTER_ID } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Register with the catalog',
    example: yaml.stringify({
      steps: [
        {
          action: CATALOG_REGISTER_ID,
          id: 'register-with-catalog',
          name: 'Register with the catalog',
          input: {
            infos: [{
              catalogInfoUrl:
                'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
            }]
          } as InputType,
        },
      ],
    }),
  },
  {
    description: 'Register with the catalog',
    example: yaml.stringify({
      steps: [
        {
          action: CATALOG_REGISTER_ID,
          id: 'register-with-catalog',
          name: 'Register with the catalog',
          input: {
            commonParams: {
              optional: true
            },
            infos: [
              { catalogInfoUrl: 'http://github.com/backstage/backstage/blob/master/catalog-info.yaml', optional: false },
              { catalogInfoUrl: 'http://github.com/backstage/backstage/blob/master/catalog-info-two.yaml' }
            ]
          } as InputType,
        },
      ],
    }),
  },
];
