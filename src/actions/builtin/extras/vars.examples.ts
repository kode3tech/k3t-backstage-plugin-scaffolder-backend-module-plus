
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./vars";
import { VARS } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Proxy vars',
    example: yaml.stringify({
      steps: [
        {
          action: VARS,
          id: 'reusable-vars',
          name: 'Proxy vars',
          input: {
            foo: 'bar',
            bar: 'baaaar'
          } as InputType,
        },
      ],
    }),
  },
];
