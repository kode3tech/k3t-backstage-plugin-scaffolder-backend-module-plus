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
import * as yaml from 'yaml';
import { FS_RENAME_PLURI_ID } from './ids';
import z from 'zod';
import { FieldsSchema } from './rename.types';

const FieldsInstance = FieldsSchema(z);
const FieldsArrayInstance = z.array(FieldsSchema(z));

type FieldsType = z.infer<typeof FieldsInstance>;
type FieldsArrayType = z.infer<typeof FieldsArrayInstance>;

export const examples: TemplateExample[] = [
  {
    description: 'Rename specified files ',
    example: yaml.stringify({
      steps: [
        {
          action: FS_RENAME_PLURI_ID,
          id: 'renameFiles',
          name: 'Rename files',
          input: {
            commonParams: {
              overwrite: true
            } as Partial<FieldsType>,
            files: [
              { from: 'file1.txt', to: 'file1Renamed.txt', overwrite: false },
              { from: 'file2.txt', to: 'file2Renamed.txt', overwrite: false },
              { from: 'file3.txt', to: 'file3Renamed.txt' },
            ] as FieldsArrayType,
          },
        } ,
      ],
    }),
  },
];
