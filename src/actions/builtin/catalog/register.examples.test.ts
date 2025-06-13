
import { PassThrough } from 'stream';
import os from 'os';
import { getVoidLogger } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createCatalogRegisterPlusAction } from './register';
import { Entity } from '@backstage/catalog-model';
import { examples } from './register.examples';
import yaml from 'yaml';
import { CATALOG_REGISTER_ID } from './ids';
import { ActionContext } from '@backstage/plugin-scaffolder-node';

describe(`${CATALOG_REGISTER_ID} examples`, () => {
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
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(addLocation).toHaveBeenNthCalledWith(
      1,
      {
        type: 'url',
        target:
          'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      },
      {},
    );
    expect(addLocation).toHaveBeenNthCalledWith(
      2,
      {
        dryRun: true,
        type: 'url',
        target:
          'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      },
      {},
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'entityRef',
      'component:default/test',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'catalogInfoUrl',
      'http://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    );
  });
});
