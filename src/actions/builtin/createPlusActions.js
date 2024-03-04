"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlusActions = void 0;
const catalog_1 = require("./catalog");
const fetch_1 = require("./fetch");
const filesystem_1 = require("./filesystem");
const extras_1 = require("./extras");
const zip_1 = require("./zip");
/**
 * A function to generate create a list of default actions that the scaffolder provides.
 * Is called internally in the default setup, but can be used when adding your own actions or overriding the default ones
 *
 * @public
 * @returns A list of actions that can be used in the scaffolder
 */
const createPlusActions = (options) => {
    const actions = [
        (0, fetch_1.createFetchTemplatePlusAction)(options),
        (0, fetch_1.createFetchPlainFilePlusAction)(options),
        (0, fetch_1.createFetchPlainAction)(options),
        (0, filesystem_1.createFilesystemRenamePlusAction)(),
        (0, catalog_1.createCatalogRegisterPlusAction)(options),
        (0, catalog_1.createCatalogQueryAction)(options),
        (0, extras_1.createParseRepoUrlAction)(options),
        (0, extras_1.createDebugFsReadAction)(options),
        (0, extras_1.createGlobAction)(),
        (0, extras_1.createRegexFsReplaceAction)(),
        (0, extras_1.createUuidV4GenAction)(),
        (0, extras_1.createVarsAction)(),
        (0, zip_1.createZipDecompressAction)(options),
    ];
    return actions;
};
exports.createPlusActions = createPlusActions;
