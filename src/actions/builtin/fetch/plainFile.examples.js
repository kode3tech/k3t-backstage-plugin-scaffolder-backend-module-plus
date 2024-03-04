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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.examples = void 0;
const yaml_1 = __importDefault(require("yaml"));
const ids_1 = require("./ids");
exports.examples = [
    {
        description: 'Downloads multiple files and places it in the workspace.',
        example: yaml_1.default.stringify({
            steps: [
                {
                    action: ids_1.FETCH_PLAIN_FILE_ID,
                    id: 'fetch-plain-file',
                    name: 'Fetch plain file',
                    input: {
                        commonParams: {
                            url: 'https://github.com/backstage/community/tree/main/backstage-community-sessions/assets/Backstage%20Community%20Sessions.png',
                        },
                        files: [
                            { targetPath: 'target-main' },
                            { targetPath: 'target-optional' }
                        ]
                    },
                },
            ],
        }),
    },
];
