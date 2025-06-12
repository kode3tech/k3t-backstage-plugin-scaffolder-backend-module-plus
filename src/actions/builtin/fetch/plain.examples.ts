
import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
// import { InputType } from './plain';
import { FETCH_PLAIN_POLY_ID } from './ids';
import { FieldsType } from './plain';

export const examples: TemplateExample[] = [
  {
    description: 'Downloads content and places it in the workspace.',
    example: yaml.stringify({
      steps: [
        {
          action: FETCH_PLAIN_POLY_ID,
          id: 'fetch-plain',
          name: 'Fetch plain',
          input: {
            commonParams: {
              targetPath: './'
            } as FieldsType,
            sources: [{
              url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
            }] as FieldsType[]
          },
        },
      ],
    }),
  },
  {
    description:
      'Optionally, if you would prefer the data to be downloaded to a subdirectory in the workspace you may specify the ‘targetPath’ input option.',
    example: yaml.stringify({
      steps: [
        {
          action: FETCH_PLAIN_POLY_ID,
          id: 'fetch-plain',
          name: 'Fetch plain',
          input: {
            // commonParams: {
            //   targetPath: './'
            // },
            sources: [{
              url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
              targetPath: 'fetched-data',
            }] as FieldsType[]
          },
        },
      ],
    }),
  },
];
