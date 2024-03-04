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
const backend_common_1 = require("@backstage/backend-common");
const os_1 = __importDefault(require("os"));
const stream_1 = require("stream");
const regex_fs_replace_1 = require("./regex-fs-replace");
const ids_1 = require("./ids");
describe(`${ids_1.REGEX_FS_REPLACE}`, () => {
    // const integrations = ScmIntegrations.fromConfig(
    //   new ConfigReader({
    //     integrations: {
    //       github: [{ host: 'github.com', token: 'token' }],
    //     },
    //   }),
    // );
    const action = (0, regex_fs_replace_1.createRegexFsReplaceAction)();
    const mockContext = {
        workspacePath: os_1.default.tmpdir(),
        logger: (0, backend_common_1.getVoidLogger)(),
        logStream: new stream_1.PassThrough(),
        output: jest.fn(),
        createTemporaryDirectory: jest.fn(),
    };
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should reject registrations for locations that does not match any integration', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                glob: '**/*.y[a?]ml',
                pattern: 'a',
                replacement: 'b',
                flags: 'g'
            } }))).rejects.toThrow(/No integration found for host https:\/\/google.com\/foo\/bar/);
    }));
});
