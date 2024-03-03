
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./debug-fs-read";
import { DEBUG_FS_READ } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Debug read files in log stream',
    example: yaml.stringify({
      steps: [
        {
          action: DEBUG_FS_READ,
          id: 'debug-fs-read',
          name: 'Read files',
          input: {
            files: ['./catalog-info.yaml', 'some-file.txt'],
            useMainLogger: true
          } as InputType,
        },
      ],
    }),
  },
];
