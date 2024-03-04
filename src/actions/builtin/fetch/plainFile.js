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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFetchPlainFilePlusAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_backend_1 = require("@backstage/plugin-scaffolder-backend");
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const plainFile_examples_1 = require("./plainFile.examples");
const ids_1 = require("./ids");
exports.FieldsSchema = {
    url: {
        title: 'Fetch URL',
        description: 'Relative path or absolute URL pointing to the single file to fetch.',
        type: 'string',
    },
    targetPath: {
        title: 'Target Path',
        description: 'Target path within the working directory to download the file as.',
        type: 'string',
    },
};
exports.InputSchema = {
    type: 'object',
    properties: {
        commonParams: {
            type: 'object',
            properties: Object.assign({}, exports.FieldsSchema)
        },
        files: {
            type: 'array',
            items: {
                type: 'object',
                required: ['url'],
                properties: Object.assign({}, exports.FieldsSchema)
            }
        }
    }
};
exports.OutputSchema = {
    type: 'object',
    properties: {
        results: {
            type: 'array'
        }
    }
};
/**
 * Downloads content and places it in the workspace, or optionally
 * in a subdirectory specified by the 'targetPath' input option.
 * @public
 */
function createFetchPlainFilePlusAction(options) {
    const templateAction = (0, plugin_scaffolder_backend_1.createFetchPlainFileAction)(options);
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.FETCH_PLAIN_FILE_ID,
        description: 'Downloads single file and places it in the workspace.',
        examples: plainFile_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema
        },
        supportsDryRun: true,
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.logger.info('Fetching plain content from remote URL');
                const { input: { files, commonParams }, logger, output } = ctx;
                const results = [];
                for (const file of files) {
                    const input = Object.assign({}, Object.assign(Object.assign({}, (commonParams !== null && commonParams !== void 0 ? commonParams : {})), file));
                    const { url } = input;
                    logger.info(`Fetching template from '${url}'...`);
                    const result = {};
                    yield templateAction.handler(Object.assign(Object.assign({}, ctx), { output: (k, v) => { result[k] = v; }, input: Object.assign({}, input) }));
                    results.push(result);
                }
                output('results', results);
            });
        },
    });
}
exports.createFetchPlainFilePlusAction = createFetchPlainFilePlusAction;
