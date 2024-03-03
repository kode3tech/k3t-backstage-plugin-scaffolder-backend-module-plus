
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./glob";
import { GLOB } from './ids';

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
