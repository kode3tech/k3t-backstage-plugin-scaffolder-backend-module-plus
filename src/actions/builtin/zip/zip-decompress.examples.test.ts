
jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchFile: jest.fn() };
});

import yaml from 'yaml';
import os from 'os';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createZipDecompressAction } from './zip-decompress';
import { PassThrough } from 'stream';
import { examples } from './zip-decompress.examples';
import { ZIP_DECOMPRESS } from './ids';
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ActionContext } from '@backstage/plugin-scaffolder-node';

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
    workspacePath: os.tmpdir(),
    input: {} as any,
    checkpoint: {} as any,
    getInitiatorCredentials: {} as any,
    logger: {} as any,
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  it('should parse object', async () => {
    const parsedExemple = yaml.parse(examples[0].example)
    await action.handler({
      ...mockContext,
      input: parsedExemple.steps[0].input,
    });
    const result = [
      [yaml.parse(parsedExemple.steps[0].input.sources[0].content)],
      [yaml.parse(parsedExemple.steps[0].input.sources[1].content)]
    ];

    expect(mockContext.output).toHaveBeenCalledWith(
      'results',
      result
    );
  });
});
