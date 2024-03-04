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
exports.createCatalogRegisterPlusAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const register_examples_1 = require("./register.examples");
const plugin_scaffolder_backend_1 = require("@backstage/plugin-scaffolder-backend");
const ids_1 = require("./ids");
exports.FieldsSchema = {
    type: 'object',
    required: ['catalogInfoUrl'],
    properties: {
        catalogInfoUrl: {
            title: 'Catalog Info URL',
            description: 'An absolute URL pointing to the catalog info file location',
            type: 'string',
        },
        optional: {
            title: 'Optional',
            description: 'Permit the registered location to optionally exist. Default: false',
            type: 'boolean',
        },
    },
};
exports.InputSchema = {
    type: 'object',
    properties: {
        commonParams: exports.FieldsSchema,
        infos: {
            type: 'array',
            items: exports.FieldsSchema
        }
    }
};
exports.OutputSchema = {
    type: 'object',
    properties: {
        results: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    entityRef: {
                        type: 'string',
                    },
                    catalogInfoUrl: {
                        type: 'string',
                    },
                }
            }
        }
    }
};
/**
 * Registers entities from a catalog descriptor file in the workspace into the software catalog.
 * @public
 */
function createCatalogRegisterPlusAction(options) {
    const templateAction = (0, plugin_scaffolder_backend_1.createCatalogRegisterAction)(options);
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.CATALOG_REGISTER_ID,
        description: 'Registers entities from a catalog descriptor file in the workspace into the software catalog.',
        examples: register_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.logger.info('Registering entities');
                // Finally move the template result into the task workspace
                const { input: { infos, commonParams }, logger, output } = ctx;
                const results = [];
                for (const source of infos) {
                    const input = Object.assign({}, Object.assign(Object.assign({}, (commonParams !== null && commonParams !== void 0 ? commonParams : {})), source));
                    const { catalogInfoUrl } = input;
                    logger.info(`Registering from '${catalogInfoUrl}'...`);
                    const result = {};
                    yield templateAction.handler(Object.assign(Object.assign({}, ctx), { output: (k, v) => { result[k] = v; }, input: Object.assign({}, input) }));
                    results.push(result);
                }
                output('results', results);
            });
        },
    });
}
exports.createCatalogRegisterPlusAction = createCatalogRegisterPlusAction;
