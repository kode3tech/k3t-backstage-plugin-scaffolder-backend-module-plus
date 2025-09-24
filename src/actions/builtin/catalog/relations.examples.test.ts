
import { mockServices } from '@backstage/backend-test-utils';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import os from 'os';
import yaml from 'yaml';
import { CATALOG_RELATIONS_ID } from './ids';
import { createCatalogRegisterPlusAction } from './register';
import { examples } from './register.examples';

describe(`${CATALOG_RELATIONS_ID} examples`, () => {
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
    task: {id: CATALOG_RELATIONS_ID},
    input: {},
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
    workspacePath: os.tmpdir(),
    logger: mockServices.logger.mock(),
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
