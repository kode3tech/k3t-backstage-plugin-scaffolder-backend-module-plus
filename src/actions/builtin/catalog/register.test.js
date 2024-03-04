"use strict";
/*
 * Copyright 2024 The K3tech Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
const stream_1 = require("stream");
const os_1 = __importDefault(require("os"));
const backend_common_1 = require("@backstage/backend-common");
const config_1 = require("@backstage/config");
const integration_1 = require("@backstage/integration");
const register_1 = require("./register");
const ids_1 = require("./ids");
describe(`${ids_1.CATALOG_REGISTER_ID}`, () => {
    const integrations = integration_1.ScmIntegrations.fromConfig(new config_1.ConfigReader({
        integrations: {
            github: [{ host: 'github.com', token: 'token' }],
        },
    }));
    const addLocation = jest.fn();
    const catalogClient = {
        addLocation: addLocation,
    };
    const action = (0, register_1.createCatalogRegisterPlusAction)({
        integrations,
        catalogClient: catalogClient,
    });
    const mockContext = {
        workspacePath: os_1.default.tmpdir(),
        logger: (0, backend_common_1.getVoidLogger)(),
        logStream: new stream_1.PassThrough(),
        output: jest.fn(),
        createTemporaryDirectory: jest.fn(),
    };
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('should reject registrations for locations that does not match any integration', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                infos: [{
                        catalogInfoUrl: 'https://google.com/foo/bar',
                    }]
            } }))).rejects.toThrow(/No integration found for host https:\/\/google.com\/foo\/bar/);
    }));
    it('should register location in catalog', () => __awaiter(void 0, void 0, void 0, function* () {
        addLocation
            .mockResolvedValueOnce({
            entities: [],
        })
            .mockResolvedValueOnce({
            entities: [
                {
                    metadata: {
                        namespace: 'default',
                        name: 'test',
                    },
                    kind: 'Component',
                },
            ],
        });
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                infos: [{
                        catalogInfoUrl: 'http://foo/var'
                    }]
            } }));
        expect(addLocation).toHaveBeenNthCalledWith(1, {
            type: 'url',
            target: 'http://foo/var',
        }, {});
        expect(addLocation).toHaveBeenNthCalledWith(2, {
            dryRun: true,
            type: 'url',
            target: 'http://foo/var',
        }, {});
        expect(mockContext.output).toHaveBeenCalledWith('entityRef', 'component:default/test');
        expect(mockContext.output).toHaveBeenCalledWith('catalogInfoUrl', 'http://foo/var');
    }));
    it('should return entityRef with the Component entity and not the generated location', () => __awaiter(void 0, void 0, void 0, function* () {
        addLocation
            .mockResolvedValueOnce({
            entities: [],
        })
            .mockResolvedValueOnce({
            entities: [
                {
                    metadata: {
                        namespace: 'default',
                        name: 'generated-1238',
                    },
                    kind: 'Location',
                },
                {
                    metadata: {
                        namespace: 'default',
                        name: 'test',
                    },
                    kind: 'Api',
                },
                {
                    metadata: {
                        namespace: 'default',
                        name: 'test',
                    },
                    kind: 'Component',
                },
                {
                    metadata: {
                        namespace: 'default',
                        name: 'test',
                    },
                    kind: 'Template',
                },
            ],
        });
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                infos: [{
                        catalogInfoUrl: 'http://foo/var',
                    }]
            } }));
        expect(mockContext.output).toHaveBeenCalledWith('entityRef', 'component:default/test');
    }));
    it('should return entityRef with the next non-generated entity if no Component kind can be found', () => __awaiter(void 0, void 0, void 0, function* () {
        addLocation
            .mockResolvedValueOnce({
            entities: [],
        })
            .mockResolvedValueOnce({
            entities: [
                {
                    metadata: {
                        namespace: 'default',
                        name: 'generated-1238',
                    },
                    kind: 'Location',
                },
                {
                    metadata: {
                        namespace: 'default',
                        name: 'test',
                    },
                    kind: 'Api', // should return this one
                },
                {
                    metadata: {
                        namespace: 'default',
                        name: 'test',
                    },
                    kind: 'Template',
                },
            ],
        });
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                infos: [{
                        catalogInfoUrl: 'http://foo/var',
                    }]
            } }));
        expect(mockContext.output).toHaveBeenCalledWith('entityRef', 'api:default/test');
    }));
    it('should return entityRef with the first entity if no non-generated entities can be found', () => __awaiter(void 0, void 0, void 0, function* () {
        addLocation
            .mockResolvedValueOnce({
            entities: [],
        })
            .mockResolvedValueOnce({
            entities: [
                {
                    metadata: {
                        namespace: 'default',
                        name: 'generated-1238',
                    },
                    kind: 'Location',
                },
                {
                    metadata: {
                        namespace: 'default',
                        name: 'generated-1238',
                    },
                    kind: 'Template',
                },
            ],
        });
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                infos: [{
                        catalogInfoUrl: 'http://foo/var',
                    }]
            } }));
        expect(mockContext.output).toHaveBeenCalledWith('entityRef', 'location:default/generated-1238');
    }));
    it('should not return entityRef if there are no entites', () => __awaiter(void 0, void 0, void 0, function* () {
        addLocation
            .mockResolvedValueOnce({
            entities: [],
        })
            .mockResolvedValueOnce({
            entities: [],
        });
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                infos: [{
                        catalogInfoUrl: 'http://foo/var',
                    }]
            } }));
        expect(mockContext.output).not.toHaveBeenCalledWith('entityRef', expect.any(String));
    }));
    it('should ignore failures when dry running the location in the catalog if `optional` is set', () => __awaiter(void 0, void 0, void 0, function* () {
        addLocation
            .mockRejectedValueOnce(new Error('Not found'))
            .mockRejectedValueOnce(new Error('Not found'));
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                infos: [{
                        catalogInfoUrl: 'http://foo/var',
                        optional: true,
                    }]
            } }));
        expect(addLocation).toHaveBeenNthCalledWith(1, {
            type: 'url',
            target: 'http://foo/var',
        }, {});
        expect(addLocation).toHaveBeenNthCalledWith(2, {
            dryRun: true,
            type: 'url',
            target: 'http://foo/var',
        }, {});
        expect(mockContext.output).toHaveBeenCalledWith('catalogInfoUrl', 'http://foo/var');
    }));
    it('should fetch entities when adding location in the catalog fails and `optional` is set', () => __awaiter(void 0, void 0, void 0, function* () {
        addLocation
            .mockRejectedValueOnce(new Error('Already registered'))
            .mockResolvedValueOnce({
            entities: [
                {
                    metadata: {
                        namespace: 'default',
                        name: 'test',
                    },
                    kind: 'Component',
                },
            ],
        });
        yield action.handler(Object.assign(Object.assign({}, mockContext), { input: {
                infos: [{
                        catalogInfoUrl: 'http://foo/var',
                        optional: true,
                    }]
            } }));
        expect(addLocation).toHaveBeenNthCalledWith(1, {
            type: 'url',
            target: 'http://foo/var',
        }, {});
        expect(addLocation).toHaveBeenNthCalledWith(2, {
            dryRun: true,
            type: 'url',
            target: 'http://foo/var',
        }, {});
        expect(mockContext.output).toHaveBeenCalledWith('catalogInfoUrl', 'http://foo/var');
        expect(mockContext.output).toHaveBeenCalledWith('entityRef', 'component:default/test');
    }));
});
