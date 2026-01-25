
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { PARSE_REPO_URL } from './ids';
import z from 'zod';
import { InputFieldsSchema } from './parse-repo-url.types';

const FieldsInstance = InputFieldsSchema(z);
const FieldsArrayInstance = z.array(InputFieldsSchema(z));

type FieldsType = z.infer<typeof FieldsInstance>;
type FieldsArrayType = z.infer<typeof FieldsArrayInstance>;

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
          } as FieldsType,
        }
      ],
    })
  },
];
