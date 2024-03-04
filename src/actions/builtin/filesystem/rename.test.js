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
const path_1 = require("path");
const rename_1 = require("./rename");
const backend_common_1 = require("@backstage/backend-common");
const stream_1 = require("stream");
const fs_extra_1 = __importDefault(require("fs-extra"));
const backend_test_utils_1 = require("@backstage/backend-test-utils");
const ids_1 = require("./ids");
describe(`${ids_1.FS_RENAME_PLURI_ID}`, () => {
    const action = (0, rename_1.createFilesystemRenamePlusAction)();
    const mockDir = (0, backend_test_utils_1.createMockDirectory)();
    const workspacePath = (0, path_1.resolve)(mockDir.path, 'workspace');
    const mockInputFiles = [
        {
            from: 'unit-test-a.js',
            to: 'new-a.js',
        },
        {
            from: 'unit-test-b.js',
            to: 'new-b.js',
        },
        {
            from: 'a-folder',
            to: 'brand-new-folder',
        },
    ];
    const mockContext = {
        input: {
            files: mockInputFiles,
        },
        workspacePath,
        logger: (0, backend_common_1.getVoidLogger)(),
        logStream: new stream_1.PassThrough(),
        output: jest.fn(),
        createTemporaryDirectory: jest.fn(),
    };
    beforeEach(() => {
        jest.restoreAllMocks();
        mockDir.setContent({
            [workspacePath]: {
                'unit-test-a.js': 'hello',
                'unit-test-b.js': 'world',
                'unit-test-c.js': 'i will be overwritten :-(',
                'a-folder': {
                    'file.md': 'content',
                },
            },
        });
    });
    it('should throw an error when files is not an array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: { files: undefined } }))).rejects.toThrow(/files must be an Array/);
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: { files: {} } }))).rejects.toThrow(/files must be an Array/);
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: { files: '' } }))).rejects.toThrow(/files must be an Array/);
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: { files: null } }))).rejects.toThrow(/files must be an Array/);
    }));
    it('should throw an error when files have missing from/to', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: { files: ['old.md'] } }))).rejects.toThrow(/each file must have a from and to property/);
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: { files: [{ from: 'old.md' }] } }))).rejects.toThrow(/each file must have a from and to property/);
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: { files: [{ to: 'new.md' }] } }))).rejects.toThrow(/each file must have a from and to property/);
    }));
    it('should throw when file name is not relative to the workspace', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: { files: [{ from: 'index.js', to: '/core/../../../index.js' }] } }))).rejects.toThrow(/Relative path is not allowed to refer to a directory outside its parent/);
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: { files: [{ from: '/core/../../../index.js', to: 'index.js' }] } }))).rejects.toThrow(/Relative path is not allowed to refer to a directory outside its parent/);
    }));
    it('should throw is trying to override by mistake', () => __awaiter(void 0, void 0, void 0, function* () {
        const destFile = 'unit-test-c.js';
        const filePath = (0, path_1.resolve)(workspacePath, destFile);
        const beforeContent = yield fs_extra_1.default.readFile(filePath, 'utf-8');
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                files: [
                    {
                        from: 'unit-test-a.js',
                        to: 'unit-test-c.js',
                    },
                ],
            } }))).rejects.toThrow(/dest already exists/);
        const afterContent = yield fs_extra_1.default.readFile(filePath, 'utf-8');
        expect(beforeContent).toEqual(afterContent);
    }));
    it('should call fs.move with the correct values', () => __awaiter(void 0, void 0, void 0, function* () {
        mockInputFiles.forEach(file => {
            const filePath = (0, path_1.resolve)(workspacePath, file.from);
            const fileExists = fs_extra_1.default.existsSync(filePath);
            expect(fileExists).toBe(true);
        });
        yield action.handler(mockContext);
        mockInputFiles.forEach(file => {
            const filePath = (0, path_1.resolve)(workspacePath, file.from);
            const fileExists = fs_extra_1.default.existsSync(filePath);
            expect(fileExists).toBe(false);
        });
    }));
    it('should override when requested', () => __awaiter(void 0, void 0, void 0, function* () {
        const sourceFile = 'unit-test-a.js';
        const destFile = 'unit-test-c.js';
        const sourceFilePath = (0, path_1.resolve)(workspacePath, sourceFile);
        const destFilePath = (0, path_1.resolve)(workspacePath, destFile);
        const sourceBeforeContent = yield fs_extra_1.default.readFile(sourceFilePath, 'utf-8');
        const destBeforeContent = yield fs_extra_1.default.readFile(destFilePath, 'utf-8');
        expect(sourceBeforeContent).not.toEqual(destBeforeContent);
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                files: [
                    {
                        from: sourceFile,
                        to: destFile,
                        overwrite: true,
                    },
                ],
            } }));
        const destAfterContent = yield fs_extra_1.default.readFile(destFilePath, 'utf-8');
        expect(sourceBeforeContent).toEqual(destAfterContent);
    }));
});
