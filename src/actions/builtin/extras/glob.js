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
exports.createGlobAction = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const ids_1 = require("./ids");
const parse_repo_url_examples_1 = require("./parse-repo-url.examples");
const globby_1 = __importDefault(require("globby"));
exports.FieldsSchema = {
    type: 'object',
    required: ['patterns'],
    properties: {
        patterns: {
            title: 'List of glob patterns to match files',
            description: 'List of glob patterns to match files. See https://github.com/mrmlnc/fast-glob#pattern-syntax to details.',
            type: 'array',
            items: {
                type: 'string'
            }
        },
        options: {
            type: 'object',
            description: 'See https://github.com/mrmlnc/fast-glob#common-options for details.',
            properties: {
                absolute: {
                    type: "boolean",
                    title: "Return the absolute path for entries.",
                    // default: false,
                },
                baseNameMatch: {
                    type: "boolean",
                    title: "If set to `true`, then patterns without slashes will be matched against the basename of the path if it contains slashes.",
                    // default: false,
                },
                braceExpansion: {
                    type: "boolean",
                    title: "Enables Bash-like brace expansion.",
                    // default: true,
                },
                caseSensitiveMatch: {
                    type: "boolean",
                    title: "Enables a case-sensitive mode for matching files.",
                    // default: true,
                },
                concurrency: {
                    type: "number",
                    title: "Specifies the maximum number of concurrent requests from a reader to read directories.",
                    // default: "os.cpus().length",
                },
                deep: {
                    type: "number",
                    title: "Specifies the maximum depth of a read directory relative to the start directory.",
                    // default: "Infinity",
                },
                dot: {
                    type: "boolean",
                    title: "Allow patterns to match entries that begin with a period (`.`).",
                    // default: false,
                },
                extglob: {
                    type: "boolean",
                    title: "Enables Bash-like `extglob` functionality.",
                    // default: true,
                },
                followSymbolicLinks: {
                    type: "boolean",
                    title: "Indicates whether to traverse descendants of symbolic link directories.",
                    // default: true,
                },
                globstar: {
                    type: "boolean",
                    title: "Enables recursively repeats a pattern containing `**`. If `false`, `**` behaves exactly like `*`.",
                    // default: true,
                },
                ignore: {
                    type: "array",
                    title: "An array of glob patterns to exclude matches. This is an alternative way to use negative patterns.",
                    // default: [],
                    items: {
                        type: "string"
                    },
                },
                markDirectories: {
                    type: "boolean",
                    title: "Mark the directory path with the final slash.",
                    // default: false,
                },
                objectMode: {
                    type: "boolean",
                    title: "Returns objects (instead of strings) describing entries.",
                    // default: false,
                },
                onlyDirectories: {
                    type: "boolean",
                    title: "Return only directories.",
                    // default: false,
                },
                onlyFiles: {
                    type: "boolean",
                    title: "Return only files.",
                    // default: true,
                },
                stats: {
                    type: "boolean",
                    title: "Enables an object mode (`objectMode`) with an additional `stats` field.",
                    // default: false,
                },
                suppressErrors: {
                    type: "boolean",
                    title: "By default this package suppress only `ENOENT` errors. Set to `true` to suppress any error.",
                    // default: false,
                },
                throwErrorOnBrokenSymbolicLink: {
                    type: "boolean",
                    title: "Throw an error when symbolic link is broken if `true` or safely return `lstat` call if `false`.",
                    // default: false,
                },
                unique: {
                    type: "boolean",
                    title: "Ensures that the returned entries are unique.",
                    // default: true,
                },
                gitignore: {
                    type: "boolean",
                    title: "Respect ignore patterns in `.gitignore` files that apply to the globbed files.",
                    // default: false,
                },
            }
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
                type: "string"
            },
        }
    }
};
function createGlobAction() {
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.GLOB,
        description: 'Read file(s) and display',
        examples: parse_repo_url_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema,
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.logger.info('Glob');
                const { input: { patterns, options }, output } = ctx;
                const p = [...patterns];
                try {
                    const files = globby_1.default.sync(p, Object.assign(Object.assign({}, (options !== null && options !== void 0 ? options : {})), { cwd: ctx.workspacePath }));
                    output('results', files);
                }
                catch (error) {
                    output('results', []);
                }
            });
        }
    });
}
exports.createGlobAction = createGlobAction;
