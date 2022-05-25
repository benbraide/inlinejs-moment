import {
    FindComponentById,
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    EvaluateLater,
    GetGlobal,
    JournalError,
    AddChanges,
    BuildProxyOptions,
    CreateInplaceProxy,
    UseEffect,
    BindEvent,
    ResolveOptions
} from "@benbraide/inlinejs";

import { IMomentConcept, IMomentTrackInfo } from "../types";
import { MomentConceptName } from "../names";

export const MomentDirectiveHandler = CreateDirectiveHandlerCallback(MomentConceptName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: MomentConceptName,
        event: argKey,
        defaultEvent: 'update',
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })){
        return;
    }

    let concept = GetGlobal().GetConcept<IMomentConcept>(MomentConceptName), localKey = `$${MomentConceptName}`;
    if (!concept){
        return JournalError('Moment concept is not installed.', `InlineJS.${MomentConceptName}`, contextElement);
    }
    
    let resolvedComponent = (component || FindComponentById(componentId)), elementScope = resolvedComponent?.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope){
        return JournalError('Failed to retrieve element scope.', `InlineJS.${MomentConceptName}`, contextElement);
    }

    if (elementScope.HasLocal(localKey)){//Already initialized
        return;
    }

    let id = resolvedComponent.GenerateUniqueId(`${MomentConceptName}_proxy_`), info: IMomentTrackInfo | null = null, savedLabel = '', options = ResolveOptions({
        options: {
            thin: false,
            short: false,
            ucfirst: false,
            capitalize: false,
            stopped: false,
        },
        list: argOptions,
    });

    let valid = false, evaluate = EvaluateLater({ componentId, contextElement, expression }), stopCurrent = () => (info?.stop() || (info = null));
    UseEffect({ componentId, contextElement,
        callback: () => evaluate((value) => {
            let date: Date | null = null;
            if (typeof value === 'string' || typeof value === 'number' || value instanceof Date){
                date = new Date(value);
            }
            else if (value instanceof HTMLTimeElement){
                date = new Date(value.dateTime);
            }

            stopCurrent();
            if (date){//Valid date specified
                info = GetGlobal().GetConcept<IMomentConcept>(MomentConceptName)?.Track({ date, ...options,
                    startImmediately: !options.stopped,
                    handler: (label) => {
                        AddChanges('set', `${id}.label`, 'label', FindComponentById(componentId)?.GetBackend().changes);
                        savedLabel = label;
                        contextElement.dispatchEvent(new CustomEvent(`${MomentConceptName}.update`, { detail: { label } }));
                    },
                }) || null;

                if (info && !valid){
                    valid = true;
                    AddChanges('set', `${id}.valid`, 'valid', FindComponentById(componentId)?.GetBackend().changes);
                }
            }
            else if (valid){
                valid = false;
                AddChanges('set', `${id}.valid`, 'valid', FindComponentById(componentId)?.GetBackend().changes);
            }
        }),
    });

    elementScope.SetLocal(localKey, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => {
            if (prop === 'valid'){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return valid;
            }

            if (prop === 'label'){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return savedLabel;
            }

            if (prop === 'stopped'){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return (info ? info.stopped() : true);
            }
        },
        setter: (prop, value) => {
            if (prop === 'stopped' && info){
                if (!!value != !!info.stopped()){
                    value ? info?.stop() : info?.resume();
                    AddChanges('set', `${id}.${prop}`, prop, FindComponentById(componentId)?.GetBackend().changes);
                }
            }
            return true;
        },
        lookup: ['valid', 'label', 'stopped'],
    })));

    elementScope.AddUninitCallback(stopCurrent);
});

export function MomentDirectiveHandlerCompact(){
    AddDirectiveHandler(MomentDirectiveHandler);
}
