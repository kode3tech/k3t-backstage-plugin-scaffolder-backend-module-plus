"use strict";
/*
 * Copyright 2024 The K3tech Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('@backstage/plugin-scaffolder-node', () => {
    const actual = jest.requireActual('@backstage/plugin-scaffolder-node');
    return Object.assign(Object.assign({}, actual), { fetchContents: jest.fn() });
});
const backend_common_1 = require("@backstage/backend-common");
const backend_test_utils_1 = require("@backstage/backend-test-utils");
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = require("node:path");
const path_1 = require("path");
const stream_1 = require("stream");
const template_1 = require("./template");
const ids_1 = require("./ids");
// const aBinaryFile = fs.readFileSync(
//   resolvePackagePath(
//     '@k3tech/backstage-plugin-scaffolder-backend-module-plus',
//     'fixtures/test-nested-template/public/react-logo192.png',
//   ),
// );
const aBinaryFile = fs_extra_1.default.readFileSync((0, node_path_1.resolve)(__dirname, '../../../../fixtures/test-nested-template/public/react-logo192.png'));
const mockFetchContents = plugin_scaffolder_node_1.fetchContents;
describe(`${ids_1.FETCH_TEMPLATE_ID}`, () => {
    let action;
    const mockDir = (0, backend_test_utils_1.createMockDirectory)();
    const workspacePath = mockDir.resolve('workspace');
    const logger = (0, backend_common_1.getVoidLogger)();
    const mockContext = (paramsPatch = {}) => ({
        templateInfo: {
            baseUrl: 'base-url',
            entityRef: 'template:default/test-template',
        },
        input: {
            // commonParams: {},
            templates: [Object.assign({ url: './skeleton', targetPath: './target', values: {
                        test: 'value',
                    } }, paramsPatch)]
        },
        output: jest.fn(),
        logStream: new stream_1.PassThrough(),
        logger,
        workspacePath,
        createTemporaryDirectory() {
            return __awaiter(this, void 0, void 0, function* () {
                return fs_extra_1.default.mkdtemp(mockDir.resolve('tmp-'));
            });
        },
    });
    beforeEach(() => {
        mockDir.setContent({
            workspace: {},
        });
        action = (0, template_1.createFetchTemplatePlusAction)({
            reader: Symbol('UrlReader'),
            integrations: Symbol('Integrations'),
        });
    });
    it(`returns a TemplateAction with the id 'fetch:template:plus'`, () => {
        expect(action.id).toEqual('fetch:template:plus');
    });
    describe('handler', () => {
        it('throws if output directory is outside the workspace', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(() => action.handler(mockContext({ targetPath: '../' }))).rejects.toThrow(/relative path is not allowed to refer to a directory outside its parent/i);
        }));
        it('throws if copyWithoutRender parameter is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(() => action.handler(mockContext({ copyWithoutRender: 'abc' }))).rejects.toThrow(/copyWithoutRender\/copyWithoutTemplating must be an array/i);
        }));
        it('throws if both copyWithoutRender and copyWithoutTemplating are used', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(() => action.handler(mockContext({
                copyWithoutRender: 'abc',
                copyWithoutTemplating: 'def',
            }))).rejects.toThrow(/copyWithoutRender and copyWithoutTemplating can not be used at the same time/i);
        }));
        it('throws if copyWithoutRender is used with extension', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(() => action.handler(mockContext({
                copyWithoutRender: ['abc'],
                templateFileExtension: true,
            }))).rejects.toThrow(/input extension incompatible with copyWithoutRender\/copyWithoutTemplating and cookiecutterCompat/);
        }));
        it('throws if cookiecutterCompat is used with extension', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(() => action.handler(mockContext({
                cookiecutterCompat: true,
                templateFileExtension: true,
            }))).rejects.toThrow(/input extension incompatible with copyWithoutRender\/copyWithoutTemplating and cookiecutterCompat/);
        }));
        describe('with optional directories / files', () => {
            let context;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                context = mockContext({
                    values: {
                        showDummyFile: false,
                        skipRootDirectory: true,
                        skipSubdirectory: true,
                        skipMultiplesDirectories: true,
                        skipFileInsideDirectory: true,
                    },
                });
                mockFetchContents.mockImplementation(({ outputPath }) => {
                    mockDir.setContent({
                        [outputPath]: {
                            '{% if values.showDummyFile %}dummy-file.txt{% else %}{% endif %}': 'dummy file',
                            '${{ "dummy-file2.txt" if values.showDummyFile else "" }}': 'some dummy file',
                            '${{ "dummy-dir" if not values.skipRootDirectory else "" }}': {
                                'file.txt': 'file inside optional directory',
                                subdir: {
                                    '${{ "dummy-subdir" if not values.skipSubdirectory else "" }}': 'file inside optional subdirectory',
                                },
                            },
                            subdir2: {
                                '${{ "dummy-subdir" if not values.skipMultiplesDirectories else "" }}': {
                                    '${{ "dummy-subdir" if not values.skipMultiplesDirectories else "" }}': {
                                        'multipleDirectorySkippedFile.txt': 'file inside multiple optional subdirectories',
                                    },
                                },
                            },
                            subdir3: {
                                '${{ "fileSkippedInsideDirectory.txt" if not values.skipFileInsideDirectory else "" }}': 'skipped file inside directory',
                            },
                        },
                    });
                    return Promise.resolve();
                });
                yield action.handler(context);
            }));
            it('skips empty filename', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.pathExists(`${workspacePath}/target/dummy-file.txt`)).resolves.toEqual(false);
            }));
            it('skips empty filename syntax #2', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.pathExists(`${workspacePath}/target/dummy-file2.txt`)).resolves.toEqual(false);
            }));
            it('skips empty directory', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.pathExists(`${workspacePath}/target/dummy-dir/dummy-file3.txt`)).resolves.toEqual(false);
            }));
            it('skips empty filename inside directory', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.pathExists(`${workspacePath}/target/subdir3/fileSkippedInsideDirectory.txt`)).resolves.toEqual(false);
            }));
            it('skips content of empty subdirectory', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.pathExists(`${workspacePath}/target/subdir2/multipleDirectorySkippedFile.txt`)).resolves.toEqual(false);
                yield expect(fs_extra_1.default.pathExists(`${workspacePath}/target/subdir2/dummy-subdir/dummy-subdir/multipleDirectorySkippedFile.txt`)).resolves.toEqual(false);
            }));
        });
        describe('with valid input', () => {
            let context;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                context = mockContext({
                    values: {
                        name: 'test-project',
                        count: 1234,
                        itemList: ['first', 'second', 'third'],
                        showDummyFile: false,
                    },
                });
                mockFetchContents.mockImplementation(({ outputPath }) => {
                    mockDir.setContent({
                        [outputPath]: {
                            'empty-dir-${{ values.count }}': {},
                            'static.txt': 'static content',
                            '${{ values.name }}.txt': 'static content',
                            subdir: {
                                'templated-content.txt': '${{ values.name }}: ${{ values.count }}',
                            },
                            '.${{ values.name }}': '${{ values.itemList | dump }}',
                            'a-binary-file.png': aBinaryFile,
                            'an-executable.sh': ctx => fs_extra_1.default.writeFileSync(ctx.path, '#!/usr/bin/env bash', {
                                encoding: 'utf-8',
                                mode: parseInt('100755', 8),
                            }),
                            symlink: ctx => ctx.symlink('a-binary-file.png'),
                            brokenSymlink: ctx => ctx.symlink('./not-a-real-file.txt'),
                        },
                    });
                    return Promise.resolve();
                });
                yield action.handler(context);
            }));
            it('uses fetchContents to retrieve the template content', () => {
                var _a;
                expect(mockFetchContents).toHaveBeenCalledWith(expect.objectContaining({
                    baseUrl: (_a = context.templateInfo) === null || _a === void 0 ? void 0 : _a.baseUrl,
                    fetchUrl: context.input.templates[0].url,
                }));
            });
            it('copies files with no templating in names or content successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/static.txt`, 'utf-8')).resolves.toEqual('static content');
            }));
            it('copies files with templated names successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8')).resolves.toEqual('static content');
            }));
            it('copies files with templated content successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/subdir/templated-content.txt`, 'utf-8')).resolves.toEqual('test-project: 1234');
            }));
            it('processes dotfiles', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/.test-project`, 'utf-8')).resolves.toEqual('["first","second","third"]');
            }));
            it('copies empty directories', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.readdir(`${workspacePath}/target/empty-dir-1234`, 'utf-8')).resolves.toEqual([]);
            }));
            it('copies binary files as-is without processing them', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/a-binary-file.png`)).resolves.toEqual(aBinaryFile);
            }));
            it('copies files and maintains the original file permissions', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default
                    .stat(`${workspacePath}/target/an-executable.sh`)
                    .then(fObj => fObj.mode)).resolves.toEqual(parseInt('100755', 8));
            }));
            it('copies file symlinks as-is without processing them', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default
                    .lstat(`${workspacePath}/target/symlink`)
                    .then(i => i.isSymbolicLink())).resolves.toBe(true);
                yield expect(fs_extra_1.default.realpath(`${workspacePath}/target/symlink`)).resolves.toBe(fs_extra_1.default.realpathSync((0, path_1.join)(workspacePath, 'target', 'a-binary-file.png')));
            }));
            it('copies broken symlinks as-is without processing them', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default
                    .lstat(`${workspacePath}/target/brokenSymlink`)
                    .then(i => i.isSymbolicLink())).resolves.toBe(true);
                yield expect(fs_extra_1.default.readlink(`${workspacePath}/target/brokenSymlink`)).resolves.toEqual(`.${path_1.sep}not-a-real-file.txt`);
            }));
        });
    });
    describe('copyWithoutRender', () => {
        let context;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            context = mockContext({
                values: {
                    name: 'test-project',
                    count: 1234,
                },
                copyWithoutRender: ['.unprocessed'],
            });
            mockFetchContents.mockImplementation(({ outputPath }) => {
                mockDir.setContent({
                    [outputPath]: {
                        processed: {
                            'templated-content-${{ values.name }}.txt': '${{ values.count }}',
                        },
                        '.unprocessed': {
                            'templated-content-${{ values.name }}.txt': '${{ values.count }}',
                        },
                    },
                });
                return Promise.resolve();
            });
            yield action.handler(context);
        }));
        it('ignores template syntax in files matched in copyWithoutRender', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/.unprocessed/templated-content-\${{ values.name }}.txt`, 'utf-8')).resolves.toEqual('${{ values.count }}');
        }));
        it('processes files not matched in copyWithoutRender', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/processed/templated-content-test-project.txt`, 'utf-8')).resolves.toEqual('1234');
        }));
    });
    describe('copyWithoutTemplating', () => {
        let context;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            context = mockContext({
                values: {
                    name: 'test-project',
                    count: 1234,
                },
                copyWithoutTemplating: ['.unprocessed'],
            });
            mockFetchContents.mockImplementation(({ outputPath }) => {
                mockDir.setContent({
                    [outputPath]: {
                        processed: {
                            'templated-content-${{ values.name }}.txt': '${{ values.count }}',
                        },
                        '.unprocessed': {
                            'templated-content-${{ values.name }}.txt': '${{ values.count }}',
                        },
                    },
                });
                return Promise.resolve();
            });
            yield action.handler(context);
        }));
        it('renders path template and ignores content template in files matched in copyWithoutTemplating', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/.unprocessed/templated-content-test-project.txt`, 'utf-8')).resolves.toEqual('${{ values.count }}');
        }));
        it('processes files not matched in copyWithoutTemplating', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/processed/templated-content-test-project.txt`, 'utf-8')).resolves.toEqual('1234');
        }));
        describe('with exclusion filter', () => {
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                context = mockContext({
                    values: {
                        name: 'test-project',
                        count: 1234,
                    },
                    copyWithoutTemplating: [
                        '.unprocessed',
                        '!*/templated-process-content-${{ values.name }}.txt',
                    ],
                });
                mockFetchContents.mockImplementation(({ outputPath }) => {
                    mockDir.setContent({
                        [outputPath]: {
                            processed: {
                                'templated-content-${{ values.name }}.txt': '${{ values.count }}',
                            },
                            '.unprocessed': {
                                'templated-content-${{ values.name }}.txt': '${{ values.count }}',
                                'templated-process-content-${{ values.name }}.txt': '${{ values.count }}',
                            },
                        },
                    });
                    return Promise.resolve();
                });
                yield action.handler(context);
            }));
            it('renders path template including excluded matches in copyWithoutTemplating', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/.unprocessed/templated-process-content-test-project.txt`, 'utf-8')).resolves.toEqual('1234');
                yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/.unprocessed/templated-content-test-project.txt`, 'utf-8')).resolves.toEqual('${{ values.count }}');
            }));
        });
    });
    describe('cookiecutter compatibility mode', () => {
        let context;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            context = mockContext({
                values: {
                    name: 'test-project',
                    count: 1234,
                    itemList: ['first', 'second', 'third'],
                },
                cookiecutterCompat: true,
            });
            mockFetchContents.mockImplementation(({ outputPath }) => {
                mockDir.setContent({
                    [outputPath]: {
                        '{{ cookiecutter.name }}.txt': 'static content',
                        subdir: {
                            'templated-content.txt': '{{ cookiecutter.name }}: {{ cookiecutter.count }}',
                        },
                        '{{ cookiecutter.name }}.json': '{{ cookiecutter.itemList | jsonify }}',
                    },
                });
                return Promise.resolve();
            });
            yield action.handler(context);
        }));
        it('copies files with cookiecutter-style templated names successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8')).resolves.toEqual('static content');
        }));
        it('copies files with cookiecutter-style templated content successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/subdir/templated-content.txt`, 'utf-8')).resolves.toEqual('test-project: 1234');
        }));
        it('includes the jsonify filter', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/test-project.json`, 'utf-8')).resolves.toEqual('["first","second","third"]');
        }));
    });
    describe('with extension=true', () => {
        let context;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            context = mockContext({
                values: {
                    name: 'test-project',
                    count: 1234,
                    itemList: ['first', 'second', 'third'],
                },
                templateFileExtension: true,
            });
            mockFetchContents.mockImplementation(({ outputPath }) => {
                mockDir.setContent({
                    [outputPath]: {
                        'empty-dir-${{ values.count }}': {},
                        'static.txt': 'static content',
                        '${{ values.name }}.txt': 'static content',
                        '${{ values.name }}.txt.jinja2': '${{ values.name }}: ${{ values.count }}',
                        subdir: {
                            'templated-content.txt.njk': '${{ values.name }}: ${{ values.count }}',
                        },
                        '.${{ values.name }}.njk': '${{ values.itemList | dump }}',
                        'a-binary-file.png': aBinaryFile,
                    },
                });
                return Promise.resolve();
            });
            yield action.handler(context);
        }));
        it('copies files with no templating in names or content successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/static.txt`, 'utf-8')).resolves.toEqual('static content');
        }));
        it('copies files with templated names successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8')).resolves.toEqual('static content');
        }));
        it('copies jinja2 files with templated names successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/test-project.txt.jinja2`, 'utf-8')).resolves.toEqual('${{ values.name }}: ${{ values.count }}');
        }));
        it('copies files with templated content successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/subdir/templated-content.txt`, 'utf-8')).resolves.toEqual('test-project: 1234');
        }));
        it('processes dotfiles', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/.test-project`, 'utf-8')).resolves.toEqual('["first","second","third"]');
        }));
        it('copies empty directories', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readdir(`${workspacePath}/target/empty-dir-1234`, 'utf-8')).resolves.toEqual([]);
        }));
        it('copies binary files as-is without processing them', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/a-binary-file.png`)).resolves.toEqual(aBinaryFile);
        }));
    });
    describe('with specified .jinja2 extension', () => {
        let context;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            context = mockContext({
                templateFileExtension: '.jinja2',
                values: {
                    name: 'test-project',
                    count: 1234,
                },
            });
            mockFetchContents.mockImplementation(({ outputPath }) => {
                mockDir.setContent({
                    [outputPath]: {
                        '${{ values.name }}.njk': '${{ values.name }}: ${{ values.count }}',
                        '${{ values.name }}.txt.jinja2': '${{ values.name }}: ${{ values.count }}',
                    },
                });
                return Promise.resolve();
            });
            yield action.handler(context);
        }));
        it('does not process .njk files', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/test-project.njk`, 'utf-8')).resolves.toEqual('${{ values.name }}: ${{ values.count }}');
        }));
        it('does process .jinja2 files', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/test-project.txt`, 'utf-8')).resolves.toEqual('test-project: 1234');
        }));
    });
    describe('with replacement of existing files', () => {
        let context;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            context = mockContext({
                values: {
                    name: 'test-project',
                    count: 1234,
                },
                replace: true,
            });
            mockFetchContents.mockImplementation(({ outputPath }) => {
                mockDir.setContent({
                    [(0, path_1.join)(workspacePath, 'target')]: {
                        'static-content.txt': 'static-content',
                    },
                    [outputPath]: {
                        'static-content.txt': '${{ values.name }}: ${{ values.count }}',
                    },
                });
                return Promise.resolve();
            });
            yield action.handler(context);
        }));
        it('overwrites existing file', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/static-content.txt`, 'utf-8')).resolves.toEqual('test-project: 1234');
        }));
    });
    describe('without replacement of existing files', () => {
        let context;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            context = mockContext({
                values: {
                    name: 'test-project',
                    count: 1234,
                },
                targetPath: './target',
                replace: false,
            });
            mockFetchContents.mockImplementation(({ outputPath }) => {
                mockDir.setContent({
                    [(0, path_1.join)(workspacePath, 'target')]: {
                        'static-content.txt': 'static-content',
                    },
                    [outputPath]: {
                        'static-content.txt': '${{ values.name }}: ${{ values.count }}',
                    },
                });
                return Promise.resolve();
            });
            yield action.handler(context);
        }));
        it('keeps existing file', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(fs_extra_1.default.readFile(`${workspacePath}/target/static-content.txt`, 'utf-8')).resolves.toEqual('static-content');
        }));
    });
});
