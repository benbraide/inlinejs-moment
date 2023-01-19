import { GetGlobal, WaitForGlobal } from '@benbraide/inlinejs';

import { MomentConceptName } from './names';
import { MomentConcept } from './concept';

import { MomentDirectiveHandlerCompact } from './directive/moment';

import { MomentMagicHandlerCompact } from './magic/moment';

export function InlineJSMoment(){
    WaitForGlobal().then(() => {
        GetGlobal().SetConcept(MomentConceptName, new MomentConcept());
        MomentDirectiveHandlerCompact();
        MomentMagicHandlerCompact();
    });
}
