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

import { PassThrough } from 'stream';
import os from 'os';
import { getVoidLogger } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { createCatalogQueryAction } from './query';
import { CATALOG_QUERY_ID } from './ids';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import { createCatalogRelationAction } from './relations';
import { mockServices } from '@backstage/backend-test-utils';

describe(`${CATALOG_QUERY_ID}`, () => {

  const addLocation = jest.fn();
  const catalogClient = {
    addLocation: addLocation,
  };

  const action = createCatalogRelationAction({
    discoveryApi: mockServices.discovery(),
  });

  const mockContext: ActionContext<any, any> = {
    task: {id: CATALOG_QUERY_ID},
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
          queries: [{
            relations: [{
              type: "apiProvidedBy",
              targetRef: "component/default:customers-service"
            }],
          }]
        },
      }),
    ).rejects.toThrow(
      /No integration found for host https:\/\/google.com\/foo\/bar/,
    );
  });

});
