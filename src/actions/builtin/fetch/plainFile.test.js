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
    return Object.assign(Object.assign({}, actual), { fetchFile: jest.fn() });
});
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
const backend_common_1 = require("@backstage/backend-common");
const config_1 = require("@backstage/config");
const integration_1 = require("@backstage/integration");
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const plainFile_1 = require("./plainFile");
const stream_1 = require("stream");
const ids_1 = require("./ids");
describe(`${ids_1.FETCH_PLAIN_FILE_ID}`, () => {
    const integrations = integration_1.ScmIntegrations.fromConfig(new config_1.ConfigReader({
        integrations: {
            github: [{ host: 'github.com', token: 'token' }],
        },
    }));
    const reader = {
        readUrl: jest.fn(),
        readTree: jest.fn(),
        search: jest.fn(),
    };
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const action = (0, plainFile_1.createFetchPlainFilePlusAction)({ integrations, reader });
    const mockContext = {
        workspacePath: os_1.default.tmpdir(),
        logger: (0, backend_common_1.getVoidLogger)(),
        logStream: new stream_1.PassThrough(),
        output: jest.fn(),
        createTemporaryDirectory: jest.fn(),
    };
    it('should disallow a target path outside working directory', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                files: [{
                        url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
                        targetPath: '/foobar',
                    }]
            } }))).rejects.toThrow(/Relative path is not allowed to refer to a directory outside its parent/);
    }));
    it('should fetch plain', () => __awaiter(void 0, void 0, void 0, function* () {
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                files: [{
                        url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
                        targetPath: 'lol',
                    }]
            } }));
        expect(plugin_scaffolder_node_1.fetchFile).toHaveBeenCalledWith(expect.objectContaining({
            outputPath: (0, path_1.resolve)(mockContext.workspacePath, 'lol'),
            fetchUrl: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
        }));
    }));
});
