
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
  {
    description: 'Replace on xml keeping original indentarion useful to Yaml, Json and XML formats.',
    example: yaml.stringify({
      steps: [
        {
          action: REGEX_FS_REPLACE,
          id: 'regex-fs-replace',
          name: 'Append spring-kafka',
          input: {
            pattern: '([\\t ]+)<\/dependencies>',
            glob: 'pom.xml',
            replacement: [
              "$1	<dependency>",
              "$1		<!-- added from backstage -->",
              "$1		<groupId>org.springframework.kafka</groupId>",
              "$1		<artifactId>spring-kafka</artifactId>",
              "$1	</dependency>",
              "$1</dependencies>",
            ].join('\n')
          } as InputType,
        },
      ],
    }),
  },
];
