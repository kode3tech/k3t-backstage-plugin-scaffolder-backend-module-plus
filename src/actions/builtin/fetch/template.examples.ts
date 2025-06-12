/*
 * Copyright 2024 The K3tech Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';
import { FieldsType } from './template';
import { FETCH_TEMPLATE_ID } from './ids';

export const examples: TemplateExample[] = [
  {
    description:
      'Downloads multiple skeleton directories that lives alongside the template file and fill it out with common values.',
    example: yaml.stringify({
      steps: [
        {
          action: FETCH_TEMPLATE_ID,
          id: 'fetch-template',
          name: 'Fetch template',
          input: {
            commonParams: {
              values: {
                name: 'test-project',
                count: 1234,
                itemList: ['first', 'second', 'third'],
                showDummyFile: false,
              }              
            } as FieldsType,
            templates: [{
              url: './skeleton',
              targetPath: './'
            }] as FieldsType[]
          }
        },
      ],
    }),
  },
  {
    description:
      'Downloads multiple skeleton directories that lives alongside the template file and fill it out with common values.',
    example: yaml.stringify({
      steps: [
        {
          action: FETCH_TEMPLATE_ID,
          id: 'fetch-template',
          name: 'Fetch template',
          input: {
            commonParams: {
              values: {
                name: 'test-project',
                count: 1234,
                itemList: ['first', 'second', 'third'],
                showDummyFile: false,
              }              
            } as FieldsType,
            templates: [
              {
                url: './skeleton/main',
                targetPath: './target-main'
              },
              {
                url: './skeleton/optional',
                targetPath: './target-optional'
              }
            ] as FieldsType[]
          },
        },
      ],
    }),
  },
];
