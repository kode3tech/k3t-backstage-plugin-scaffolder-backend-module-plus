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
exports.createDebugFsReadAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const ids_1 = require("./ids");
const parse_repo_url_examples_1 = require("./parse-repo-url.examples");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
exports.FieldsSchema = {
    type: 'object',
    required: ['files'],
    properties: {
        files: {
            type: 'array',
            title: 'Files paths to Read contents from Workspace Path',
            items: {
                type: 'string'
            }
        },
        useMainLogger: {
            title: 'Attach context logger to main application logger',
            type: 'boolean',
        }
    },
};
exports.InputSchema = exports.FieldsSchema;
exports.OutputSchema = {
    type: "object",
    properties: {
        results: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    file: {
                        type: 'string',
                        title: 'Relative path of the source file'
                    },
                    content: {
                        type: 'string',
                        title: 'Contents of the source file'
                    }
                }
            },
        }
    }
};
function createDebugFsReadAction(options) {
    const { logger: mainLogger } = options;
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.DEBUG_FS_READ,
        description: 'Read file(s) and display',
        examples: parse_repo_url_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema,
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.logger.info('Debug files');
                const { input: { files, useMainLogger }, output, workspacePath, logger } = ctx;
                if (useMainLogger)
                    logger.pipe(mainLogger);
                const results = [];
                for (const file of (files !== null && files !== void 0 ? files : [])) {
                    const resolvedFile = node_path_1.default.resolve(workspacePath, file);
                    logger.info(`file: ${file}`);
                    const fileContent = (0, node_fs_1.readFileSync)(resolvedFile).toString('utf-8');
                    logger.info(fileContent);
                    results.push({ file, content: fileContent });
                }
                output('results', results);
            });
        }
    });
}
exports.createDebugFsReadAction = createDebugFsReadAction;
