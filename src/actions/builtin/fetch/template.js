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
exports.createFetchTemplatePlusAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_backend_1 = require("@backstage/plugin-scaffolder-backend");
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const template_examples_1 = require("./template.examples");
const ids_1 = require("./ids");
exports.FieldsSchema = {
    url: {
        title: 'Fetch URL',
        description: 'Relative path or absolute URL pointing to the directory tree to fetch',
        type: 'string',
    },
    targetPath: {
        title: 'Target Path',
        description: 'Target path within the working directory to download the contents to. Defaults to the working directory root.',
        type: 'string',
    },
    values: {
        title: 'Template Values',
        description: 'Values to pass on to the templating engine',
        type: 'object',
    },
    copyWithoutRender: {
        title: '[Deprecated] Copy Without Render',
        description: 'An array of glob patterns. Any files or directories which match are copied without being processed as templates.',
        type: 'array',
        items: {
            type: 'string',
        },
    },
    copyWithoutTemplating: {
        title: 'Copy Without Templating',
        description: 'An array of glob patterns. Contents of matched files or directories are copied without being processed, but paths are subject to rendering.',
        type: 'array',
        items: {
            type: 'string',
        },
    },
    cookiecutterCompat: {
        title: 'Cookiecutter compatibility mode',
        description: 'Enable features to maximise compatibility with templates built for fetch:cookiecutter',
        type: 'boolean',
    },
    templateFileExtension: {
        title: 'Template File Extension',
        description: 'If set, only files with the given extension will be templated. If set to `true`, the default extension `.njk` is used.',
        type: ['string', 'boolean'],
    },
    replace: {
        title: 'Replace files',
        description: 'If set, replace files in targetPath instead of skipping existing ones.',
        type: 'boolean',
    },
};
exports.InputSchema = {
    type: 'object',
    properties: {
        commonParams: {
            type: 'object',
            properties: Object.assign({}, exports.FieldsSchema)
        },
        templates: {
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
function createFetchTemplatePlusAction(options) {
    const templateAction = (0, plugin_scaffolder_backend_1.createFetchTemplateAction)(options);
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.FETCH_TEMPLATE_ID,
        description: "Same from 'fetch:template' for array list.",
        examples: template_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema
        },
        handler(ctx) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const { input: { templates, commonParams }, logger, output } = ctx;
                const results = [];
                for (const value of templates) {
                    const input = Object.assign({}, Object.assign(Object.assign({}, (commonParams !== null && commonParams !== void 0 ? commonParams : {})), value));
                    const { url } = input;
                    logger.info(`Fetching template from '${url}'...`);
                    const result = {};
                    yield templateAction.handler(Object.assign(Object.assign({}, ctx), { output: (k, v) => { result[k] = v; }, input: Object.assign(Object.assign({}, input), { values: ((_a = input.values) !== null && _a !== void 0 ? _a : {}) }) }));
                    results.push(result);
                }
                output('results', results);
            });
        }
    });
}
exports.createFetchTemplatePlusAction = createFetchTemplatePlusAction;
