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
exports.createFetchTemplatePlusAction = exports.createFetchPlainFilePlusAction = exports.createFetchPlainAction = void 0;
var plain_1 = require("./plain");
Object.defineProperty(exports, "createFetchPlainAction", { enumerable: true, get: function () { return plain_1.createFetchPlainPlusAction; } });
var plainFile_1 = require("./plainFile");
Object.defineProperty(exports, "createFetchPlainFilePlusAction", { enumerable: true, get: function () { return plainFile_1.createFetchPlainFilePlusAction; } });
var template_1 = require("./template");
Object.defineProperty(exports, "createFetchTemplatePlusAction", { enumerable: true, get: function () { return template_1.createFetchTemplatePlusAction; } });
