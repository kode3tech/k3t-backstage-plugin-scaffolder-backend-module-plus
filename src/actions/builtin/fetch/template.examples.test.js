"use strict";
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
jest.mock('@backstage/plugin-scaffolder-node', () => (Object.assign(Object.assign({}, jest.requireActual('@backstage/plugin-scaffolder-node')), { fetchContents: jest.fn() })));
const path_1 = require("path");
const fs_extra_1 = __importDefault(require("fs-extra"));
const backend_common_1 = require("@backstage/backend-common");
const stream_1 = require("stream");
const template_1 = require("./template");
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const template_examples_1 = require("./template.examples");
const yaml_1 = __importDefault(require("yaml"));
const backend_test_utils_1 = require("@backstage/backend-test-utils");
const ids_1 = require("./ids");
const aBinaryFile = fs_extra_1.default.readFileSync((0, backend_common_1.resolvePackagePath)('@backstage/plugin-scaffolder-backend', 'fixtures/test-nested-template/public/react-logo192.png'));
const mockFetchContents = plugin_scaffolder_node_1.fetchContents;
describe(`${ids_1.FETCH_TEMPLATE_ID} examples`, () => {
    let action;
    const mockDir = (0, backend_test_utils_1.createMockDirectory)();
    const workspacePath = mockDir.resolve('workspace');
    const logger = (0, backend_common_1.getVoidLogger)();
    const mockContext = (input) => ({
        templateInfo: {
            baseUrl: 'base-url',
            entityRef: 'template:default/test-template',
        },
        input: input,
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
        mockDir.clear();
        action = (0, template_1.createFetchTemplatePlusAction)({
            reader: Symbol('UrlReader'),
            integrations: Symbol('Integrations'),
        });
    });
    describe('handler', () => {
        describe('with valid input', () => {
            let context;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                context = mockContext(yaml_1.default.parse(template_examples_1.examples[0].example).steps[0].input);
                mockFetchContents.mockImplementation(({ outputPath }) => {
                    mockDir.setContent({
                        [outputPath]: {
                            'an-executable.sh': ctx => fs_extra_1.default.writeFileSync(ctx.path, '#!/usr/bin/env bash', {
                                encoding: 'utf8',
                                mode: parseInt('100755', 8),
                            }),
                            'empty-dir-${{ values.count }}': {},
                            'static.txt': 'static content',
                            '${{ values.name }}.txt': 'static content',
                            subdir: {
                                'templated-content.txt': '${{ values.name }}: ${{ values.count }}',
                            },
                            '.${{ values.name }}': '${{ values.itemList | dump }}',
                            'a-binary-file.png': aBinaryFile,
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
});
