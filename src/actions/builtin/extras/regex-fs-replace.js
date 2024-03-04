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
exports.createRegexFsReplaceAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const ids_1 = require("./ids");
const regex_fs_replace_examples_1 = require("./regex-fs-replace.examples");
const globby_1 = __importDefault(require("globby"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
exports.FieldsSchema = {
    type: 'object',
    required: ['pattern', 'glob', 'replacement'],
    properties: {
        pattern: {
            title: 'Regex expression',
            description: 'Regex expression to evaluate in file contents from `file`.',
            type: 'string',
        },
        glob: {
            title: 'Expression glob to find files to evaluate',
            description: 'Expression glob to find files to evaluate',
            type: 'string',
        },
        replacement: {
            title: 'Replace expression',
            description: 'Replacement expression based on `pattern` field.',
            type: 'string',
        },
        flags: {
            type: 'string',
            title: 'Regex flags like d, g, i, m, s, u, v or y',
            description: "See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags",
            // default: 'g'
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
                type: "object"
            },
        }
    }
};
function createRegexFsReplaceAction() {
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.REGEX_FS_REPLACE,
        description: 'Provides Regex (ECMAScript Standards) to rewrite files. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions',
        examples: regex_fs_replace_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema,
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const { pattern, glob, replacement, flags } = ctx.input;
                const files = globby_1.default.sync([glob], { cwd: ctx.workspacePath });
                const reg = new RegExp(pattern, flags !== null && flags !== void 0 ? flags : 'g');
                for (const file of files.map(f => node_path_1.default.join(ctx.workspacePath, f))) {
                    const content = node_fs_1.default.readFileSync(file).toString();
                    reg.lastIndex = -1;
                    const newContent = content.replace(reg, replacement);
                    node_fs_1.default.writeFileSync(file, newContent);
                    ctx.logger.info(`${file}`);
                }
            });
        }
    });
}
exports.createRegexFsReplaceAction = createRegexFsReplaceAction;
