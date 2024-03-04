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
exports.createParseRepoUrlAction = exports.parseRepoUrl = exports.OutputSchema = exports.InputSchema = exports.FieldsSchema = void 0;
const errors_1 = require("@backstage/errors");
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const ids_1 = require("./ids");
const parse_repo_url_examples_1 = require("./parse-repo-url.examples");
exports.FieldsSchema = {
    type: 'object',
    required: ['reposUrls'],
    properties: {
        reposUrls: {
            title: 'reposUrls',
            description: 'reposUrls',
            type: 'array',
            items: { type: 'string' }
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
                type: "object",
                properties: {
                    repo: {
                        type: 'string',
                    },
                    host: {
                        type: 'string',
                    },
                    owner: {
                        type: 'string',
                    },
                    organization: {
                        type: 'string',
                    },
                    workspace: {
                        type: 'string',
                    },
                    project: {
                        type: 'string',
                    },
                }
            },
        }
    }
};
/**
 *
 * @param repoUrl  host?owner=any&organization=any&workspace=any&project=any
 * @param integrations
 * @returns
 */
const parseRepoUrl = (repoUrl, integrations) => {
    var _a, _b, _c, _d, _e;
    let parsed;
    try {
        parsed = new URL(`https://${repoUrl}`);
    }
    catch (error) {
        throw new errors_1.InputError(`Invalid repo URL passed to publisher, got ${repoUrl}, ${error}`);
    }
    const host = parsed.host;
    const owner = (_a = parsed.searchParams.get('owner')) !== null && _a !== void 0 ? _a : undefined;
    const organization = (_b = parsed.searchParams.get('organization')) !== null && _b !== void 0 ? _b : undefined;
    const workspace = (_c = parsed.searchParams.get('workspace')) !== null && _c !== void 0 ? _c : undefined;
    const project = (_d = parsed.searchParams.get('project')) !== null && _d !== void 0 ? _d : undefined;
    const type = (_e = integrations.byHost(host)) === null || _e === void 0 ? void 0 : _e.type;
    if (!type) {
        throw new errors_1.InputError(`No matching integration configuration for host ${host}, please check your integrations config`);
    }
    if (type === 'bitbucket') {
        if (host === 'bitbucket.org') {
            if (!workspace) {
                throw new errors_1.InputError(`Invalid repo URL passed to publisher: ${repoUrl}, missing workspace`);
            }
        }
        if (!project) {
            throw new errors_1.InputError(`Invalid repo URL passed to publisher: ${repoUrl}, missing project`);
        }
    }
    else {
        if (!owner) {
            throw new errors_1.InputError(`Invalid repo URL passed to publisher: ${repoUrl}, missing owner`);
        }
    }
    const repo = parsed.searchParams.get('repo');
    if (!repo) {
        throw new errors_1.InputError(`Invalid repo URL passed to publisher: ${repoUrl}, missing repo`);
    }
    return { host, owner, repo, organization, workspace, project };
};
exports.parseRepoUrl = parseRepoUrl;
function createParseRepoUrlAction(options) {
    const { integrations } = options;
    return (0, plugin_scaffolder_node_1.createTemplateAction)({
        id: ids_1.PARSE_REPO_URL,
        description: 'Parse Repo url like "host?owner=any&organization=any&workspace=any&project=any"',
        examples: parse_repo_url_examples_1.examples,
        schema: {
            input: exports.InputSchema,
            output: exports.OutputSchema,
        },
        handler(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                ctx.logger.info('Parsing repos urls');
                const { input: { reposUrls }, logger, output } = ctx;
                const results = [];
                for (const repoUrl of reposUrls) {
                    try {
                        const parsed = (0, exports.parseRepoUrl)(repoUrl, integrations);
                        results.push(parsed);
                    }
                    catch (e) {
                        logger.error(e === null || e === void 0 ? void 0 : e.message);
                    }
                }
                output('results', results);
            });
        }
    });
}
exports.createParseRepoUrlAction = createParseRepoUrlAction;
