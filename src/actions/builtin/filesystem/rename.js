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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFilesystemRenamePlusAction = exports.OutputSchema = exports.InputSchema = exports.ParamsSchema = void 0;
const plugin_scaffolder_backend_1 = require("@backstage/plugin-scaffolder-backend");
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const zod_1 = require("zod");
const rename_examples_1 = require("./rename.examples");
const errors_1 = require("@backstage/errors");
const ids_1 = require("./ids");
exports.ParamsSchema = zod_1.z.object({
    from: zod_1.z.string({
        description: 'The source location of the file to be renamed'
    }),
    to: zod_1.z.string({
        description: 'The destination of the new file'
    }),
    overwrite: zod_1.z.optional(zod_1.z.boolean({
        description: 'Overwrite existing file or directory, default is false'
    })),
});
exports.InputSchema = zod_1.z.object({
    commonParams: zod_1.z.optional(exports.ParamsSchema),
    files: zod_1.z.array(exports.ParamsSchema)
});
exports.OutputSchema = zod_1.z.object({
    results: zod_1.z.array(zod_1.z.any())
});
/**
 * Creates a new action that allows renames of files and directories in the workspace.
 * @public
 */
const createFilesystemRenamePlusAction = () => {
    const templateAction = (0, plugin_scaffolder_backend_1.createFilesystemRenameAction)();
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.FS_RENAME_PLURI_ID,
        description: 'Renames files and directories within the workspace',
        examples: rename_examples_1.examples,
        supportsDryRun: true,
        handler(ctx) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                ctx.logger.info('Fetching plain content from remote URL');
                // Finally move the template result into the task workspace
                const { input: { files: files, commonParams }, 
                // logger,
                output } = ctx;
                if (!Array.isArray((_a = ctx.input) === null || _a === void 0 ? void 0 : _a.files)) {
                    throw new errors_1.InputError('files must be an Array');
                }
                const results = [];
                const result = {};
                yield templateAction.handler(Object.assign(Object.assign({}, ctx), { output: (k, v) => { result[k] = v; }, input: {
                        files: files.map(file => {
                            return Object.assign({}, Object.assign(Object.assign({}, (commonParams !== null && commonParams !== void 0 ? commonParams : {})), file));
                        })
                    } }));
                results.push(result);
                output('results', results);
            });
        },
    });
};
exports.createFilesystemRenamePlusAction = createFilesystemRenamePlusAction;
