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
const yaml_1 = __importDefault(require("yaml"));
const rename_examples_1 = require("./rename.examples");
const backend_test_utils_1 = require("@backstage/backend-test-utils");
const ids_1 = require("./ids");
describe(`${ids_1.FS_RENAME_PLURI_ID} examples`, () => {
    const action = (0, rename_1.createFilesystemRenamePlusAction)();
    const files = yaml_1.default.parse(rename_examples_1.examples[0].example)
        .steps[0].input.files;
    const mockDir = (0, backend_test_utils_1.createMockDirectory)();
    const workspacePath = (0, path_1.resolve)(mockDir.path, 'workspace');
    const mockContext = {
        input: {
            files: files,
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
                [files[0].from]: 'hello',
                [files[1].from]: 'world',
                [files[2].from]: '!!!',
                'file3Renamed.txt': 'I will be overwritten :(',
                'a-folder': {
                    'file.md': 'content',
                },
            },
        });
    });
    it('should call fs.move with the correct values', () => __awaiter(void 0, void 0, void 0, function* () {
        mockContext.input.files.forEach(file => {
            const filePath = (0, path_1.resolve)(workspacePath, file.from);
            const fileExists = fs_extra_1.default.existsSync(filePath);
            expect(fileExists).toBe(true);
        });
        yield action.handler(mockContext);
        mockContext.input.files.forEach(file => {
            const filePath = (0, path_1.resolve)(workspacePath, file.from);
            const fileExists = fs_extra_1.default.existsSync(filePath);
            expect(fileExists).toBe(false);
        });
    }));
    it('should override when requested', () => __awaiter(void 0, void 0, void 0, function* () {
        const sourceFile = files[2].from;
        const destFile = files[2].to;
        const sourceFilePath = (0, path_1.resolve)(workspacePath, sourceFile);
        const destFilePath = (0, path_1.resolve)(workspacePath, destFile);
        const sourceBeforeContent = yield fs_extra_1.default.readFile(sourceFilePath, 'utf-8');
        const destBeforeContent = yield fs_extra_1.default.readFile(destFilePath, 'utf-8');
        expect(sourceBeforeContent).not.toEqual(destBeforeContent);
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                files: files,
            } }));
        const destAfterContent = yield fs_extra_1.default.readFile(destFilePath, 'utf-8');
        expect(sourceBeforeContent).toEqual(destAfterContent);
    }));
});
