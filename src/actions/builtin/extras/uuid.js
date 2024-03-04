"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createUuidV4GenAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const uuid = __importStar(require("uuid"));
const ids_1 = require("./ids");
const uuid_examples_1 = require("./uuid.examples");
exports.FieldsSchema = {
    type: 'object',
    required: ['amount'],
    properties: {
        amount: {
            title: 'Amount of uuid to generate ',
            type: 'number',
        }
    },
};
exports.InputSchema = exports.FieldsSchema;
exports.OutputSchema = {
    type: "object",
    properties: {
        results: {
            title: 'List of generated uuid\'s.',
            type: "array",
            items: {
                type: "string"
            },
        }
    }
};
function createUuidV4GenAction() {
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.UUID_V4_GEN,
        description: 'Generate a list of UUID\'s v4',
        examples: uuid_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema,
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const { input: { amount }, output } = ctx;
                const r = [];
                for (let i = 0; i < amount; i++) {
                    r.push(uuid.v4().toString());
                }
                output('results', r);
            });
        }
    });
}
exports.createUuidV4GenAction = createUuidV4GenAction;
