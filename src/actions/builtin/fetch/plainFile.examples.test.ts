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

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchFile: jest.fn() };
});

import yaml from 'yaml';
import os from 'os';
import { resolve as resolvePath } from 'path';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createFetchPlainFilePlusAction } from './plainFile';
import { PassThrough } from 'stream';
import { ActionContext, fetchFile } from '@backstage/plugin-scaffolder-node';
import { examples } from './plainFile.examples';
import { FETCH_PLAIN_FILE_ID } from './ids';
import { UrlReaderService } from '@backstage/backend-plugin-api';

describe(`${FETCH_PLAIN_FILE_ID} examples`, () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );
  const reader: UrlReaderService = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const action = createFetchPlainFilePlusAction({ integrations, reader });
  const mockContext = createMockActionContext();
  // const mockContext: ActionContext<any, any> = {
  //   task: {id: FETCH_PLAIN_FILE_ID },
  //   input: {},
  //   checkpoint: jest.fn(),
  //   getInitiatorCredentials: jest.fn(),
  //   workspacePath: os.tmpdir(),
  //   logger: getVoidLogger(),
  //   logStream: new PassThrough(),
  //   output: jest.fn(),
  //   createTemporaryDirectory: jest.fn(),
  // };

  it('should fetch plain', async () => {
    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });
    expect(fetchFile).toHaveBeenCalled();
  });
});
