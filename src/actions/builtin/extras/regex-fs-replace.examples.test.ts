
import { mockServices } from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import os from 'os';
import yaml from 'yaml';
import { REGEX_FS_REPLACE } from './ids';
import { createRegexFsReplaceAction } from './regex-fs-replace';
import { examples } from './regex-fs-replace.examples';

describe(`${REGEX_FS_REPLACE} examples`, () => {
  const addLocation = jest.fn();
  const action = createRegexFsReplaceAction();

  const mockContext: ActionContext<any, any> = {
    task: {id: REGEX_FS_REPLACE},
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
