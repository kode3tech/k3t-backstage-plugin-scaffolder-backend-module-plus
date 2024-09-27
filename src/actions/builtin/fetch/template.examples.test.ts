

jest.mock('@backstage/plugin-scaffolder-node', () => ({
  ...jest.requireActual('@backstage/plugin-scaffolder-node'),
  fetchContents: jest.fn(),
}));

import { join as joinPath, sep as pathSep } from 'path';
import fs from 'fs-extra';
import {
  getVoidLogger,
  resolvePackagePath,
} from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { PassThrough } from 'stream';
import { createFetchTemplatePlusAction, InputType } from './template';
import {
  ActionContext,
  TemplateAction,
  fetchContents,
} from '@backstage/plugin-scaffolder-node';
import { examples } from './template.examples';
import yaml from 'yaml';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { FETCH_TEMPLATE_ID } from './ids';
import { UrlReaderService } from '@backstage/backend-plugin-api';


type FetchTemplateInput = InputType;

const aBinaryFile = fs.readFileSync(
  resolvePackagePath(
    '@backstage/plugin-scaffolder-backend',
    'fixtures/test-nested-template/public/react-logo192.png',
  ),
);

const mockFetchContents = fetchContents as jest.MockedFunction<
  typeof fetchContents
>;

describe(`${FETCH_TEMPLATE_ID} examples`, () => {
  let action: TemplateAction<any, any>;

  const mockDir = createMockDirectory();
  const workspacePath = mockDir.resolve('workspace');

  const logger = getVoidLogger();

  const mockContext = (input: any): ActionContext<any, any> => ({
    templateInfo: {
      baseUrl: 'base-url',
      entityRef: 'template:default/test-template',
    },
    checkpoint: jest.fn(),
    getInitiatorCredentials: jest.fn(),
    input: input,
    output: jest.fn(),
    logStream: new PassThrough(),
    logger,
    workspacePath,

    async createTemporaryDirectory() {
      return fs.mkdtemp(mockDir.resolve('tmp-'));
    },
  });

  beforeEach(() => {
    mockDir.clear();
    action = createFetchTemplatePlusAction({
      reader: Symbol('UrlReader') as unknown as UrlReaderService,
      integrations: Symbol('Integrations') as unknown as ScmIntegrations,
    });
  });

  describe('handler', () => {
    describe('with valid input', () => {
      let context: ActionContext<FetchTemplateInput>;

      beforeEach(async () => {
        context = mockContext(yaml.parse(examples[0].example).steps[0].input);

        mockFetchContents.mockImplementation(({ outputPath }) => {
          mockDir.setContent({
            [outputPath]: {
              'an-executable.sh': ctx =>
                fs.writeFileSync(ctx.path, '#!/usr/bin/env bash', {
                  encoding: 'utf8',
                  mode: parseInt('100755', 8),
                }),
              'empty-dir-${{ values.count }}': {},
              'static.txt': 'static content',
              '${{ values.name }}.txt': 'static content',
              subdir: {
                'templated-content.txt':
                  '${{ values.name }}: ${{ values.count }}',
              },
              '.${{ values.name }}': '${{ values.itemList | dump }}',
              'a-binary-file.png': aBinaryFile,
              symlink: ctx => ctx.symlink('a-binary-file.png'),
              brokenSymlink: ctx => ctx.symlink('./not-a-real-file.txt'),
            },
          });

          return Promise.resolve();
        });

        await action.handler(context);
      });

      it('uses fetchContents to retrieve the template content', () => {
        expect(mockFetchContents).toHaveBeenCalledWith(
          expect.objectContaining({
            baseUrl: context.templateInfo?.baseUrl,
            fetchUrl: context.input.templates[0].url,
          }),
        );
      });

      it('copies files with no templating in names or content successfully', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/static.txt`, 'utf-8'),
        ).resolves.toEqual('static content');
      });

      it('copies files with templated names successfully', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8'),
        ).resolves.toEqual('static content');
      });

      it('copies files with templated content successfully', async () => {
        await expect(
          fs.readFile(
            `${workspacePath}/target/subdir/templated-content.txt`,
            'utf-8',
          ),
        ).resolves.toEqual('test-project: 1234');
      });

      it('processes dotfiles', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/.test-project`, 'utf-8'),
        ).resolves.toEqual('["first","second","third"]');
      });

      it('copies empty directories', async () => {
        await expect(
          fs.readdir(`${workspacePath}/target/empty-dir-1234`, 'utf-8'),
        ).resolves.toEqual([]);
      });

      it('copies binary files as-is without processing them', async () => {
        await expect(
          fs.readFile(`${workspacePath}/target/a-binary-file.png`),
        ).resolves.toEqual(aBinaryFile);
      });

      it('copies files and maintains the original file permissions', async () => {
        await expect(
          fs
            .stat(`${workspacePath}/target/an-executable.sh`)
            .then(fObj => fObj.mode),
        ).resolves.toEqual(parseInt('100755', 8));
      });

      it('copies file symlinks as-is without processing them', async () => {
        await expect(
          fs
            .lstat(`${workspacePath}/target/symlink`)
            .then(i => i.isSymbolicLink()),
        ).resolves.toBe(true);

        await expect(
          fs.realpath(`${workspacePath}/target/symlink`),
        ).resolves.toBe(
          fs.realpathSync(
            joinPath(workspacePath, 'target', 'a-binary-file.png'),
          ),
        );
      });

      it('copies broken symlinks as-is without processing them', async () => {
        await expect(
          fs
            .lstat(`${workspacePath}/target/brokenSymlink`)
            .then(i => i.isSymbolicLink()),
        ).resolves.toBe(true);

        await expect(
          fs.readlink(`${workspacePath}/target/brokenSymlink`),
        ).resolves.toEqual(`.${pathSep}not-a-real-file.txt`);
      });
    });
  });
});
