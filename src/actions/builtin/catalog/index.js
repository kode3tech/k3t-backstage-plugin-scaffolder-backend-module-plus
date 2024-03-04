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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCatalogQueryAction = exports.createCatalogRelationAction = exports.createCatalogRegisterPlusAction = void 0;
var register_1 = require("./register");
Object.defineProperty(exports, "createCatalogRegisterPlusAction", { enumerable: true, get: function () { return register_1.createCatalogRegisterPlusAction; } });
var relations_1 = require("./relations");
Object.defineProperty(exports, "createCatalogRelationAction", { enumerable: true, get: function () { return relations_1.createCatalogRelationAction; } });
var query_1 = require("./query");
Object.defineProperty(exports, "createCatalogQueryAction", { enumerable: true, get: function () { return query_1.createCatalogQueryAction; } });
// export { createPlusFetchCatalogEntityAction } from './fetch';
