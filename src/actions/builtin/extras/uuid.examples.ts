
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./uuid";
import { UUID_V4_GEN } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Generate 3 UUID\'s',
    example: yaml.stringify({
      steps: [
        {
          action: UUID_V4_GEN,
          id: 'uuid-v4-gen',
          name: 'UUID gen',
          input: {
            amount: 3
          } as InputType,
        },
      ],
    }),
  },
];
