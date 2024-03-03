
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./regex-fs-replace";
import { REGEX_FS_REPLACE } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Replace in files using Regex and Glob',
    example: yaml.stringify({
      steps: [
        {
          action: REGEX_FS_REPLACE,
          id: 'regex-fs-replace',
          name: 'Replace in files',
          input: {
            glob: '**/*.y[a?]ml',
            pattern: 'a',
            replacement: 'b',
            flags: 'g'
          } as InputType,
        },
      ],
    }),
  },
];
