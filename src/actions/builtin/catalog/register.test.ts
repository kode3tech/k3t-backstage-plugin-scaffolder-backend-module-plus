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
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createCatalogRegisterPlusAction } from './register';
import { Entity } from '@backstage/catalog-model';
import { CATALOG_REGISTER_ID } from './ids';
import { ActionContext } from '@backstage/plugin-scaffolder-node';

describe(`${CATALOG_REGISTER_ID}`, () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );

  const addLocation = jest.fn();
  const catalogClient = {
    addLocation: addLocation,
  };

  const action = createCatalogRegisterPlusAction({
    integrations,
    catalogClient: catalogClient as unknown as CatalogApi,
  });

  const mockContext: ActionContext<any, any> = {
    task: {id: CATALOG_REGISTER_ID},
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
          infos: [{
            catalogInfoUrl: 'https://google.com/foo/bar',
          }]
        },
      }),
    ).rejects.toThrow(
      /No integration found for host https:\/\/google.com\/foo\/bar/,
    );
  });

  it('should register location in catalog', async () => {
    addLocation
      .mockResolvedValueOnce({
        entities: [],
      })
      .mockResolvedValueOnce({
        entities: [
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Component',
          } as Entity,
        ],
      });
    await action.handler({
      ...mockContext,
      input: {
        infos: [{
          catalogInfoUrl: 'http://foo/var'
        }]
      },
    });

    expect(addLocation).toHaveBeenNthCalledWith(
      1,
      {
        type: 'url',
        target: 'http://foo/var',
      },
      {},
    );
    expect(addLocation).toHaveBeenNthCalledWith(
      2,
      {
        dryRun: true,
        type: 'url',
        target: 'http://foo/var',
      },
      {},
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'entityRef',
      'component:default/test',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'catalogInfoUrl',
      'http://foo/var',
    );
  });

  it('should return entityRef with the Component entity and not the generated location', async () => {
    addLocation
      .mockResolvedValueOnce({
        entities: [],
      })
      .mockResolvedValueOnce({
        entities: [
          {
            metadata: {
              namespace: 'default',
              name: 'generated-1238',
            },
            kind: 'Location',
          } as Entity,
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Api',
          } as Entity,
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Component',
          } as Entity,
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Template',
          } as Entity,
        ],
      });
    await action.handler({
      ...mockContext,
      input: {
        infos: [{
          catalogInfoUrl: 'http://foo/var',
        }]
      },
    });
    expect(mockContext.output).toHaveBeenCalledWith(
      'entityRef',
      'component:default/test',
    );
  });

  it('should return entityRef with the next non-generated entity if no Component kind can be found', async () => {
    addLocation
      .mockResolvedValueOnce({
        entities: [],
      })
      .mockResolvedValueOnce({
        entities: [
          {
            metadata: {
              namespace: 'default',
              name: 'generated-1238',
            },
            kind: 'Location',
          } as Entity,
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Api', // should return this one
          } as Entity,
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Template',
          } as Entity,
        ],
      });
    await action.handler({
      ...mockContext,
      input: {
        infos: [{
          catalogInfoUrl: 'http://foo/var',
        }]
      },
    });
    expect(mockContext.output).toHaveBeenCalledWith(
      'entityRef',
      'api:default/test',
    );
  });

  it('should return entityRef with the first entity if no non-generated entities can be found', async () => {
    addLocation
      .mockResolvedValueOnce({
        entities: [],
      })
      .mockResolvedValueOnce({
        entities: [
          {
            metadata: {
              namespace: 'default',
              name: 'generated-1238',
            },
            kind: 'Location',
          } as Entity,
          {
            metadata: {
              namespace: 'default',
              name: 'generated-1238',
            },
            kind: 'Template',
          } as Entity,
        ],
      });
    await action.handler({
      ...mockContext,
      input: {
        infos: [{
          catalogInfoUrl: 'http://foo/var',
        }]
      },
    });
    expect(mockContext.output).toHaveBeenCalledWith(
      'entityRef',
      'location:default/generated-1238',
    );
  });

  it('should not return entityRef if there are no entites', async () => {
    addLocation
      .mockResolvedValueOnce({
        entities: [],
      })
      .mockResolvedValueOnce({
        entities: [],
      });
    await action.handler({
      ...mockContext,
      input: {
        infos: [{
          catalogInfoUrl: 'http://foo/var',
        }]
      },
    });
    expect(mockContext.output).not.toHaveBeenCalledWith(
      'entityRef',
      expect.any(String),
    );
  });

  it('should ignore failures when dry running the location in the catalog if `optional` is set', async () => {
    addLocation
      .mockRejectedValueOnce(new Error('Not found'))
      .mockRejectedValueOnce(new Error('Not found'));
    await action.handler({
      ...mockContext,
      input: {
        infos: [{
          catalogInfoUrl: 'http://foo/var',
          optional: true,
        }]
      },
    });

    expect(addLocation).toHaveBeenNthCalledWith(
      1,
      {
        type: 'url',
        target: 'http://foo/var',
      },
      {},
    );
    expect(addLocation).toHaveBeenNthCalledWith(
      2,
      {
        dryRun: true,
        type: 'url',
        target: 'http://foo/var',
      },
      {},
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'catalogInfoUrl',
      'http://foo/var',
    );
  });

  it('should fetch entities when adding location in the catalog fails and `optional` is set', async () => {
    addLocation
      .mockRejectedValueOnce(new Error('Already registered'))
      .mockResolvedValueOnce({
        entities: [
          {
            metadata: {
              namespace: 'default',
              name: 'test',
            },
            kind: 'Component',
          } as Entity,
        ],
      });
    await action.handler({
      ...mockContext,
      input: {
        infos: [{
          catalogInfoUrl: 'http://foo/var',
          optional: true,
        }]
      },
    });

    expect(addLocation).toHaveBeenNthCalledWith(
      1,
      {
        type: 'url',
        target: 'http://foo/var',
      },
      {},
    );
    expect(addLocation).toHaveBeenNthCalledWith(
      2,
      {
        dryRun: true,
        type: 'url',
        target: 'http://foo/var',
      },
      {},
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'catalogInfoUrl',
      'http://foo/var',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'entityRef',
      'component:default/test',
    );
  });
});
