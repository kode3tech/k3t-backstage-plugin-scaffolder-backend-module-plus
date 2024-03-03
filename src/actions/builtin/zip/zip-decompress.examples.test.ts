
jest.mock('@backstage/plugin-scaffolder-node', () => {
  const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
  return { ...actual, fetchFile: jest.fn() };
});

import yaml from 'yaml';
import os from 'os';
import { getVoidLogger, UrlReader } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createZipDecompressAction } from './zip-decompress';
import { PassThrough } from 'stream';
import { examples } from './zip-decompress.examples';
import { ZIP_DECOMPRESS } from './ids';

describe(`${ZIP_DECOMPRESS} examples`, () => {
  const integrations = ScmIntegrations.fromConfig(
    new ConfigReader({
      integrations: {
        github: [{ host: 'github.com', token: 'token' }],
      },
    }),
  );
  const reader: UrlReader = {
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const action = createZipDecompressAction({ integrations, reader });
  const mockContext = {
    workspacePath: os.tmpdir(),
    logger: getVoidLogger(),
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
