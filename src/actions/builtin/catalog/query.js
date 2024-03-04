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
exports.createCatalogQueryAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const ids_1 = require("./ids");
const query_examples_1 = require("./query.examples");
exports.FieldsSchema = {
    type: 'object',
    required: ['filter'],
    properties: {
        fields: {
            title: 'fields',
            description: 'fields',
            type: 'array',
            items: { type: 'string' }
        },
        limit: {
            title: 'limit',
            description: 'limit',
            type: 'number',
        },
        filter: {
            title: 'filter',
            description: 'filter',
            type: 'any'
        },
        orderFields: {
            title: 'orderFields',
            description: 'orderFields',
            type: 'object',
            properties: {
                field: {
                    title: 'field',
                    description: 'field',
                    type: 'string'
                },
                order: {
                    title: 'field',
                    description: 'field',
                    type: 'string',
                    enum: [
                        'asc',
                        'desc'
                    ]
                }
            }
        },
        fullTextFilter: {
            title: 'fullTextFilter',
            description: 'fullTextFilter',
            type: ''
        },
    },
};
exports.InputSchema = {
    type: 'object',
    properties: {
        commonParams: exports.FieldsSchema,
        queries: {
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
                type: "array"
            },
        }
    }
};
function createCatalogQueryAction(options) {
    const { catalogClient } = options;
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.CATALOG_QUERY_ID,
        description: 'Query on catalog',
        examples: query_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema,
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.logger.info('Quering entities');
                // Finally move the template result into the task workspace
                const { input: { queries, commonParams }, logger, output, secrets } = ctx;
                const results = [];
                for (const source of queries) {
                    const input = Object.assign({}, Object.assign(Object.assign({}, (commonParams !== null && commonParams !== void 0 ? commonParams : {})), source));
                    logger.info(`Quering ...`);
                    logger.info(JSON.stringify(input));
                    const result = yield catalogClient.queryEntities(input, { token: secrets === null || secrets === void 0 ? void 0 : secrets.backstageToken });
                    results.push(result.items);
                }
                output('results', results);
            });
        }
    });
}
exports.createCatalogQueryAction = createCatalogQueryAction;
