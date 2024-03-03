
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./vars";
import { VARS } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Proxy vars to reuse on next actions',
    example: yaml.stringify({
      steps: [
        {
          action: VARS,
          id: 'reusable-vars',
          name: 'Proxy vars',
          input: {
            foo: 'my-prefixed-${{ parameters.name | lower }}-foo',
            bar: 'bar-${{ parameters.value | lower }}'
          } as InputType,
        },
      ],
    }),
  },
];
