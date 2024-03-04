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
exports.createZipDecompressAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const decompress_1 = __importDefault(require("decompress"));
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const content_1 = require("../../utils/content");
const ids_1 = require("./ids");
const zip_decompress_examples_1 = require("./zip-decompress.examples");
exports.FieldsSchema = {
    type: 'object',
    required: ['content', 'destination'],
    properties: {
        content: {
            type: 'string',
            title: 'Zip Content',
            description: 'Zip File Content.',
        },
        destination: {
            type: 'string',
            title: 'Relative path of destination files',
            description: 'Relative path of destination files.',
        },
        encoding: {
            type: 'string',
            title: 'Indicate is encoded "content".',
            // default: 'base64',
            description: 'Indicate if input "content" field has encoded in "base64", "file" or "url".',
            enum: ['base64', 'file', 'url']
        },
        skipErrors: {
            type: 'boolean',
            title: 'Not Throw on errors.',
            description: 'Not interrupts next actions.',
            // default: false,
        },
    },
};
exports.InputSchema = {
    type: 'object',
    properties: {
        commonParams: exports.FieldsSchema,
        sources: {
            type: 'array',
            items: exports.FieldsSchema
        }
    }
};
exports.OutputSchema = {
    type: "object",
    properties: {
        results: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    success: {
                        title: 'Indicates if OpenApi Spec is valid.',
                        type: 'boolean',
                    },
                    files: {
                        type: 'array',
                        title: 'List of decompressed files.',
                        items: {
                            type: 'object',
                        },
                    },
                    errorMessage: {
                        title: 'Message if is not valid.',
                        type: 'string',
                    },
                }
            },
        }
    }
};
function createZipDecompressAction({ reader, integrations }) {
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.ZIP_DECOMPRESS,
        description: 'Decmpress an zip files from diferent sources types.',
        examples: zip_decompress_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema,
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const { input: { sources, commonParams }, logger, output, workspacePath } = ctx;
                const results = [];
                for (const source of sources) {
                    const { content, encoding = 'base64', destination } = Object.assign(Object.assign({}, (commonParams !== null && commonParams !== void 0 ? commonParams : {})), source);
                    try {
                        const finalContent = yield content_1.resolvers[encoding](content, ctx, { reader, integrations });
                        const destinationPath = node_path_1.default.resolve(workspacePath, destination);
                        (0, node_fs_1.mkdirSync)(destinationPath, { recursive: true });
                        logger.info(`destination path: ${destinationPath}`);
                        const entities = yield (0, decompress_1.default)(Buffer.from(finalContent), destinationPath);
                        results.push({
                            success: true,
                            files: entities.map(({ path: p, mode, type, mtime }) => {
                                return { path: p, mode, type, mtime };
                            })
                        });
                    }
                    catch (e) {
                        results.push({ success: false, files: [], errorMessage: (e === null || e === void 0 ? void 0 : e.message) || e });
                        // logger.pipe(mainLogger)
                        logger.error(e === null || e === void 0 ? void 0 : e.message);
                    }
                }
                output('results', results);
            });
        }
    });
}
exports.createZipDecompressAction = createZipDecompressAction;
