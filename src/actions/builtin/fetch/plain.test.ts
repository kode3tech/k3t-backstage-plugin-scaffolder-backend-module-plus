
jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchContents: jest.fn() };
});

import os from 'os';
import { resolve as resolvePath } from 'path';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { ActionContext, fetchContents } from '@backstage/plugin-scaffolder-node';
import { createFetchPlainPlusAction, FieldsType } from './plain';
import { PassThrough } from 'stream';
import { FETCH_PLAIN_POLY_ID } from './ids';
import { UrlReaderService } from '@backstage/backend-plugin-api';

describe(`${FETCH_PLAIN_POLY_ID}`, () => {
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
  const mockContext = (_paramsPatch: Partial<FieldsType> = {}): ActionContext<any, any> => ({
    task: {id: FETCH_PLAIN_POLY_ID},
    input: {},
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
    workspacePath: os.tmpdir(),
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  });

  it('should disallow a target path outside working directory', async () => {
    await expect(
      action.handler({
        ...mockContext(),
        input: {
          sources: [{
            url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
            targetPath: '/foobar',
          }]
        },
      }),
    ).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('should fetch plain', async () => {
    await action.handler({
      ...mockContext(),
      input: {
        sources: [{
          url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
          targetPath: 'lol',
        }]
      },
    });
    expect(fetchContents).toHaveBeenCalledWith(
      expect.objectContaining({
        outputPath: resolvePath(mockContext().workspacePath, 'lol'),
        fetchUrl:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets',
      }),
    );
  });
});
