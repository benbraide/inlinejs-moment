import { GetGlobal, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy } from "@benbraide/inlinejs";
import { MomentConceptName } from "../names";
function CreateMomentProxy() {
    let methods = {
        format: (params) => { var _a; return (_a = GetGlobal().GetConcept(MomentConceptName)) === null || _a === void 0 ? void 0 : _a.Format(params); },
        track: (params) => { var _a; return (_a = GetGlobal().GetConcept(MomentConceptName)) === null || _a === void 0 ? void 0 : _a.Track(params); },
    };
    return CreateReadonlyProxy(methods);
}
const MomentProxy = CreateMomentProxy();
export const MomentMagicHandler = CreateMagicHandlerCallback(MomentConceptName, () => MomentProxy);
export function MomentMagicHandlerCompact() {
    AddMagicHandler(MomentMagicHandler);
}
