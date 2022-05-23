import { GetGlobal, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy } from "@benbraide/inlinejs";

import { IMomentConcept, IMomentFormatParams, IMomentTrackParams } from "../types";
import { MomentConceptName } from "../names";

function CreateMomentProxy(){
    let methods = {
        format: (params: IMomentFormatParams) => GetGlobal().GetConcept<IMomentConcept>(MomentConceptName)?.Format(params),
        track: (params: IMomentTrackParams) => GetGlobal().GetConcept<IMomentConcept>(MomentConceptName)?.Track(params),
    };

    return CreateReadonlyProxy(methods);
}

const MomentProxy = CreateMomentProxy();

export const MomentMagicHandler = CreateMagicHandlerCallback(MomentConceptName, () => MomentProxy);

export function MomentMagicHandlerCompact(){
    AddMagicHandler(MomentMagicHandler);
}
