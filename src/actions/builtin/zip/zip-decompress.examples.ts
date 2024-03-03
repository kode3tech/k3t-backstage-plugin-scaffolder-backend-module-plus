

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from './zip-decompress';
import { ZIP_DECOMPRESS } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Decompress multiple files from same encoding type.',
    example: yaml.stringify({
      steps: [
        {
          action: ZIP_DECOMPRESS,
          id: 'zip-decompress',
          name: 'Decompress multiple files.',
          input: {
            commonParams: {
              encoding: 'file',
            },
            sources: [
              { content: './compressed-1.zip', destination: './tmp.zip-1/'},
              { content: './compressed-2.zip', destination: './tmp.zip-2/'},
            ]
          } as InputType,
        },
      ],
    }),
  },
];
