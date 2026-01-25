
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { GLOB } from './ids';
import z from 'zod';
import { InputFieldsSchema } from './glob.types';

const InputInstance = InputFieldsSchema(z);

type InputType = z.infer<typeof InputInstance>;

export const examples: TemplateExample[] = [
  {
    description: 'Find files from Glob expressions',
    example: yaml.stringify({
      steps: [
        {
          action: GLOB,
          id: 'glob',
          name: 'List files',
          input: {
            patterns: ['**/*.y[a?]ml']
          } as InputType,
        },
      ],
    }),
  },
];
