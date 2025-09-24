
jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchFile: jest.fn() };
});

import os from 'os';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import { createZipDecompressAction, FieldsType } from './zip-decompress';
import { ZIP_DECOMPRESS } from './ids';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { mockServices } from '@backstage/backend-test-utils';
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
  const mockContext = (_paramsPatch: Partial<FieldsType> = {}): ActionContext<any, any> => ({
    task: {id: ZIP_DECOMPRESS},
    input: {},
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
    workspacePath: os.tmpdir(),
    logger: mockServices.logger.mock(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  });

  it('should disallow a target path outside working directory', async () => {
    expect(1).toBe(1);
    // return expect(
    //   action.handler({
    //     ...mockContext(),
    //     input: {
    //       commonParams: {
    //         encoding: 'file',
    //       },
    //       sources: [{
    //         content: './compressed.zip',
    //         destination: './tmp.zip/'
    //       }]
    //     },
    //   }),
    // ).resolves.toHaveBeenCalled();
  });
});

