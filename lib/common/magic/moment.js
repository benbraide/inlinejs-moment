"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MomentMagicHandlerCompact = exports.MomentMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("../names");
function CreateMomentProxy() {
    let methods = {
        format: (params) => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.MomentConceptName)) === null || _a === void 0 ? void 0 : _a.Format(params); },
        track: (params) => { var _a; return (_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.MomentConceptName)) === null || _a === void 0 ? void 0 : _a.Track(params); },
    };
    return (0, inlinejs_1.CreateReadonlyProxy)(methods);
}
const MomentProxy = CreateMomentProxy();
exports.MomentMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)(names_1.MomentConceptName, () => MomentProxy);
function MomentMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.MomentMagicHandler);
}
exports.MomentMagicHandlerCompact = MomentMagicHandlerCompact;
