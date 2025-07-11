import yaml from 'yaml';
import os from 'os';
import { resolve as resolvePath } from 'path';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createFetchPlainPlusAction } from './plain';
import { PassThrough } from 'stream';
import { ActionContext, fetchContents } from '@backstage/plugin-scaffolder-node';
import { examples } from './plain.examples';
import { FETCH_PLAIN_POLY_ID } from './ids';
import { UrlReaderService } from '@backstage/backend-plugin-api';

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchContents: jest.fn(),
}));

describe(`${FETCH_PLAIN_POLY_ID} examples`, () => {
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

  const action = createFetchPlainPlusAction({ integrations, reader });
  const mockContext: ActionContext<any, any> = {
    task: {id: FETCH_PLAIN_POLY_ID },
    input: {},
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
    workspacePath: os.tmpdir(),
    logger: getVoidLogger(),
    // logger: mockServices.rootLogger.mock(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  it('should fetch plain', async () => {
    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });
    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        outputPath: resolvePath(mockContext.workspacePath),
        fetchUrl:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
      }),
    );
  });

  it('should fetch plain to a specified directory', async () => {
    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[1].example).steps[0].input,
    });
    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        outputPath: resolvePath(mockContext.workspacePath, 'fetched-data'),
        fetchUrl:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
      }),
    );
  });
});
