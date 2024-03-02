
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { InputType } from "./parse-repo-url";
import { PARSE_REPO_URL } from './ids';

export const examples: TemplateExample[] = [
  {
    description: 'Parse Repo Url like "host?owner=any&organization=any&workspace=any&project=any"',
    example: yaml.stringify({
      steps: [
        {
          action: PARSE_REPO_URL,
          id: 'parse-repos-url',
          name: 'Parse Repos URLs',
          input: {
            reposUrls: ['host?owner=any&organization=any&workspace=any&project=any']
          } as InputType,
        },
      ],
    }),
  },
];
