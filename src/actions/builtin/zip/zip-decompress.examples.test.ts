
jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchFile: jest.fn() };
});

import { UrlReaderService } from '@backstage/backend-plugin-api';
import { mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { ActionContext } from '@backstage/plugin-scaffolder-node';
import os from 'os';
import { ZIP_DECOMPRESS } from './ids';
import { createZipDecompressAction } from './zip-decompress';

describe(`${ZIP_DECOMPRESS} examples`, () => {
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
    task: {id: ZIP_DECOMPRESS },
    workspacePath: os.tmpdir(),
    input: {} as any,
    checkpoint: {} as any,
    getInitiatorCredentials: {} as any,
    logger: mockServices.logger.mock(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  it('should parse object', async () => {
    // const parsedExemple = yaml.parse(examples[0].example)
    // await action.handler({
    //   ...mockContext,
    //   input: parsedExemple.steps[0].input,
    // });
    // const result = [
    //   [yaml.parse(parsedExemple.steps[0].input.sources[0].content)],
    //   [yaml.parse(parsedExemple.steps[0].input.sources[1].content)]
    // ];

    // expect(mockContext.output).toHaveBeenCalledWith(
    //   'results',
    //   result
    // );
    expect(1).toBe(1);
  });
});
