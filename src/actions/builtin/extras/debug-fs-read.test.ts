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

import { getVoidLogger } from '@backstage/backend-common';
import os from 'os';
import { PassThrough } from 'stream';
import { createDebugFsReadAction } from './debug-fs-read';
import { DEBUG_FS_READ } from './ids';
import { ActionContext } from '@backstage/plugin-scaffolder-node';

describe(`${DEBUG_FS_READ}`, () => {

  // const integrations = ScmIntegrations.fromConfig(
  //   new ConfigReader({
  //     integrations: {
  //       github: [{ host: 'github.com', token: 'token' }],
  //     },
  //   }),
  // );

  const action = createDebugFsReadAction();

  const mockContext: ActionContext<any, any> = {
    task: {id: DEBUG_FS_READ},
    input: {},
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
    workspacePath: os.tmpdir(),
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should reject registrations for locations that does not match any integration', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          files: ['./catalog-info.yaml']
        },
      }),
    ).rejects.toThrow(
      /No integration found for host https:\/\/google.com\/foo\/bar/,
    );
  });

});
