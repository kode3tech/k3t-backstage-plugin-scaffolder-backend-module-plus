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
exports.createVarsAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const ids_1 = require("./ids");
const vars_examples_1 = require("./vars.examples");
exports.FieldsSchema = {
    type: 'object',
};
exports.InputSchema = exports.FieldsSchema;
exports.OutputSchema = {
    type: "object",
    properties: {
        result: {
            title: 'Parsed input param.',
            type: "object"
        }
    }
};
function createVarsAction() {
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.VARS,
        description: 'Proxy template varriables/expressions',
        examples: vars_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema,
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const { input, output, logger } = ctx;
                logger.info(JSON.stringify(input, undefined, 2));
                output('result', input);
            });
        }
    });
}
exports.createVarsAction = createVarsAction;
