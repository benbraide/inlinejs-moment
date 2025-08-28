import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal, JournalError, AddChanges, BuildProxyOptions, CreateInplaceProxy, UseEffect, BindEvent, ResolveOptions } from "@benbraide/inlinejs";
import { MomentConceptName } from "../names";
export const MomentDirectiveHandler = CreateDirectiveHandlerCallback(MomentConceptName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: MomentConceptName,
        event: argKey,
        defaultEvent: 'update',
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })) {
        return;
    }
    let concept = GetGlobal().GetConcept(MomentConceptName), localKey = `$${MomentConceptName}`;
    if (!concept) {
        return JournalError('Moment concept is not installed.', `InlineJS.${MomentConceptName}`, contextElement);
    }
    let resolvedComponent = (component || FindComponentById(componentId)), elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope) {
        return JournalError('Failed to retrieve element scope.', `InlineJS.${MomentConceptName}`, contextElement);
    }
    if (elementScope.HasLocal(localKey)) { //Already initialized
        return;
    }
    let id = resolvedComponent.GenerateUniqueId(`${MomentConceptName}_proxy_`), info = null, savedLabel = '', options = ResolveOptions({
        options: {
            thin: false,
            short: false,
            ucfirst: false,
            capitalize: false,
            stopped: false,
        },
        list: argOptions,
    });
    let valid = false, evaluate = EvaluateLater({ componentId, contextElement, expression }), stopCurrent = () => ((info === null || info === void 0 ? void 0 : info.stop()) || (info = null));
    UseEffect({ componentId, contextElement,
        callback: () => evaluate((value) => {
            var _a, _b, _c;
            let date = null;
            if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
                date = new Date(value);
            }
            else if (value instanceof HTMLTimeElement) {
                date = new Date(value.dateTime);
            }
            stopCurrent();
            if (date && !isNaN(date.getTime())) { //Valid date specified
                info = ((_a = GetGlobal().GetConcept(MomentConceptName)) === null || _a === void 0 ? void 0 : _a.Track(Object.assign(Object.assign({ date }, options), { startImmediately: !options.stopped, handler: (label) => {
                        var _a;
                        AddChanges('set', `${id}.label`, 'label', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                        savedLabel = label;
                        contextElement.dispatchEvent(new CustomEvent(`${MomentConceptName}.update`, { detail: { label } }));
                    } }))) || null;
                if (info && !valid) {
                    valid = true;
                    AddChanges('set', `${id}.valid`, 'valid', (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes);
                }
            }
            else if (valid) {
                valid = false;
                AddChanges('set', `${id}.valid`, 'valid', (_c = FindComponentById(componentId)) === null || _c === void 0 ? void 0 : _c.GetBackend().changes);
            }
        }),
    });
    const passValue = (prop, value) => {
        var _a;
        (_a = GetGlobal().GetCurrentProxyAccessStorage()) === null || _a === void 0 ? void 0 : _a.Put(componentId, `${id}.${prop}`);
        return value;
    };
    elementScope.SetLocal(localKey, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => {
            var _a;
            if (prop === 'valid') {
                (_a = GetGlobal().GetCurrentProxyAccessStorage()) === null || _a === void 0 ? void 0 : _a.Put(componentId, `${id}.${prop}`);
                return passValue(prop, valid);
            }
            if (prop === 'label') {
                return passValue(prop, savedLabel);
            }
            if (prop === 'stopped') {
                return passValue(prop, info ? info.stopped() : true);
            }
        },
        setter: (prop, value) => {
            var _a;
            if (prop === 'stopped' && info) {
                if (!!value != !!info.stopped()) {
                    value ? info === null || info === void 0 ? void 0 : info.stop() : info === null || info === void 0 ? void 0 : info.resume();
                    AddChanges('set', `${id}.${prop}`, prop, (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                }
            }
            return true;
        },
        lookup: ['valid', 'label', 'stopped'],
    })));
    elementScope.AddUninitCallback(stopCurrent);
});
export function MomentDirectiveHandlerCompact() {
    AddDirectiveHandler(MomentDirectiveHandler);
}
