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
exports.createCatalogRelationAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const catalog_client_1 = require("@backstage/catalog-client");
const catalog_model_1 = require("@backstage/catalog-model");
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const ids_1 = require("./ids");
const register_examples_1 = require("./register.examples");
exports.FieldsSchema = {
    "type": 'object',
    "required": ['relations'],
    "properties": {
        "relations": {
            "type": 'array',
            "title": 'fields',
            "description": 'fields',
            "items": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "description": "The type of the relation."
                    },
                    "targetRef": {
                        "type": "string",
                        "description": "The entity ref of the target of this relation."
                    }
                },
                "required": ["type", "targetRef"],
                "additionalProperties": false,
                "description": "EntityRelation represents a relationship between entities."
            }
        },
        "optional": {
            "anyOf": [
                { "type": "boolean" },
                { "type": "undefined" }
            ],
            "description": "Optional flag indicating whether the property is optional."
        },
        "defaultKind": {
            "anyOf": [
                { "type": "string" },
                { "type": "undefined" }
            ],
            "description": "Default kind for the property."
        },
        "defaultNamespace": {
            "anyOf": [
                { "type": "string" },
                { "type": "undefined" }
            ],
            "description": "Default namespace for the property."
        },
        "relationType": {
            "anyOf": [
                { "type": "string" },
                { "type": "undefined" }
            ],
            "description": "Type of relation for the property."
        }
    },
    "additionalProperties": false,
    "description": "Object representing optional properties for configuration."
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
function createCatalogRelationAction(options) {
    const catalogClient = new catalog_client_1.CatalogClient(options);
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.CATALOG_RELATIONS_ID,
        description: "Get entities from relation spec.",
        examples: register_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema,
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.logger.info('Quering entities');
                const { input: { queries, commonParams }, logger, output, secrets } = ctx;
                const results = [];
                for (const source of queries) {
                    const input = Object.assign({}, Object.assign(Object.assign({}, (commonParams !== null && commonParams !== void 0 ? commonParams : {})), source));
                    const { relations, relationType, defaultKind, defaultNamespace, optional } = input;
                    logger.info(`Quering ...`);
                    logger.info(JSON.stringify(input));
                    const entities = yield catalogClient.getEntitiesByRefs({
                        entityRefs: relations
                            .filter(ref => !relationType || ref.type === relationType)
                            .map(ref => (0, catalog_model_1.stringifyEntityRef)((0, catalog_model_1.parseEntityRef)(ref.targetRef, { defaultKind, defaultNamespace }))),
                    }, {
                        token: secrets === null || secrets === void 0 ? void 0 : secrets.backstageToken,
                    });
                    const finalEntities = entities.items.map((e, i) => {
                        if (!e && !optional) {
                            throw new Error(`Entity ${relations[i]} not found`);
                        }
                        return e !== null && e !== void 0 ? e : null;
                    });
                    results.push(finalEntities);
                }
                output('results', results);
            });
        }
    });
}
exports.createCatalogRelationAction = createCatalogRelationAction;
