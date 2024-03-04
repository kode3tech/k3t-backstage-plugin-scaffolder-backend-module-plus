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
exports.resolvers = exports.AvailableTypes = void 0;
const plugin_scaffolder_node_1 = require("@backstage/plugin-scaffolder-node");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
exports.AvailableTypes = ['base64', 'file', 'raw', 'url'];
exports.resolvers = {
    'raw': (content) => content,
    'base64': (content) => Buffer.from(content.split(';')[2].split(',')[1], 'base64').toString(),
    'file': (content, { workspacePath }) => (0, node_fs_1.readFileSync)((0, node_path_1.resolve)(workspacePath, content)).toString('utf8'),
    'url': (content, { workspacePath, templateInfo }, { reader, integrations }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const tmpFetchFile = (0, node_path_1.resolve)(workspacePath, './tmp.fetchFile');
        yield (0, plugin_scaffolder_node_1.fetchFile)({
            reader,
            integrations,
            baseUrl: (_a = templateInfo === null || templateInfo === void 0 ? void 0 : templateInfo.baseUrl) !== null && _a !== void 0 ? _a : workspacePath,
            fetchUrl: content,
            outputPath: tmpFetchFile,
        });
        // logger.error('Parsing Json from url has not implemented yet!')
        const finalContent = (0, node_fs_1.readFileSync)(tmpFetchFile).toString('utf8');
        (0, node_fs_1.rmSync)(tmpFetchFile);
        return finalContent;
    })
};
