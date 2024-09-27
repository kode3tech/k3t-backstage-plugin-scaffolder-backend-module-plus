
jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchFile: jest.fn() };
});

import os from 'os';
import { resolve as resolvePath } from 'path';

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { ActionContext, fetchFile } from '@backstage/plugin-scaffolder-node';
import { createZipDecompressAction } from './zip-decompress';
import { PassThrough } from 'stream';
import { ZIP_DECOMPRESS } from './ids';
import { UrlReaderService } from '@backstage/backend-plugin-api';
// import { mockServices } from '@backstage/backend-test-utils';

describe(`${ZIP_DECOMPRESS}`, () => {
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

  const action = createZipDecompressAction({ integrations, reader });
  const mockContext: ActionContext<any, any> = {
    workspacePath: os.tmpdir(),
    input: {} as any,
    checkpoint: {} as any,
    getInitiatorCredentials: {} as any,
    logger: {} as any,
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  it('should disallow a target path outside working directory', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          commonParams: {
            encoding: 'file',
          },
          sources: [{
            content: './compressed.zip',
            destination: './tmp.zip/'
          }]
        },
      }),
    ).rejects.toThrow(
      /Relative path is not allowed to refer to a directory outside its parent/,
    );
  });

  it('should fetch plain', async () => {
    await action.handler({
      ...mockContext,
      input: {
        commonParams: {
          encoding: 'file',
        },
        sources: [{
          content: './compressed.zip',
          destination: './tmp.zip/'
        }]
      },
    });
    expect(fetchFile).toHaveBeenCalledWith(
      expect.objectContaining({
        outputPath: resolvePath(mockContext.workspacePath, 'lol'),
        fetchUrl:
          'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
      }),
    );
  });
});

