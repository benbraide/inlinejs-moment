"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MomentDirectiveHandlerCompact = exports.MomentDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("../names");
exports.MomentDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)(names_1.MomentConceptName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if ((0, inlinejs_1.BindEvent)({ contextElement, expression,
        component: (component || componentId),
        key: names_1.MomentConceptName,
        event: argKey,
        defaultEvent: 'update',
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })) {
        return;
    }
    let concept = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.MomentConceptName), localKey = `$${names_1.MomentConceptName}`;
    if (!concept) {
        return (0, inlinejs_1.JournalError)('Moment concept is not installed.', `InlineJS.${names_1.MomentConceptName}`, contextElement);
    }
    let resolvedComponent = (component || (0, inlinejs_1.FindComponentById)(componentId)), elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope) {
        return (0, inlinejs_1.JournalError)('Failed to retrieve element scope.', `InlineJS.${names_1.MomentConceptName}`, contextElement);
    }
    if (elementScope.HasLocal(localKey)) { //Already initialized
        return;
    }
    let id = resolvedComponent.GenerateUniqueId(`${names_1.MomentConceptName}_proxy_`), info = null, savedLabel = '', options = (0, inlinejs_1.ResolveOptions)({
        options: {
            thin: false,
            short: false,
            ucfirst: false,
            capitalize: false,
            stopped: false,
        },
        list: argOptions,
    });
    let valid = false, evaluate = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression }), stopCurrent = () => ((info === null || info === void 0 ? void 0 : info.stop()) || (info = null));
    (0, inlinejs_1.UseEffect)({ componentId, contextElement,
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
                info = ((_a = (0, inlinejs_1.GetGlobal)().GetConcept(names_1.MomentConceptName)) === null || _a === void 0 ? void 0 : _a.Track(Object.assign(Object.assign({ date }, options), { startImmediately: !options.stopped, handler: (label) => {
                        var _a;
                        (0, inlinejs_1.AddChanges)('set', `${id}.label`, 'label', (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                        savedLabel = label;
                        contextElement.dispatchEvent(new CustomEvent(`${names_1.MomentConceptName}.update`, { detail: { label } }));
                    } }))) || null;
                if (info && !valid) {
                    valid = true;
                    (0, inlinejs_1.AddChanges)('set', `${id}.valid`, 'valid', (_b = (0, inlinejs_1.FindComponentById)(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes);
                }
            }
            else if (valid) {
                valid = false;
                (0, inlinejs_1.AddChanges)('set', `${id}.valid`, 'valid', (_c = (0, inlinejs_1.FindComponentById)(componentId)) === null || _c === void 0 ? void 0 : _c.GetBackend().changes);
            }
        }),
    });
    const passValue = (prop, value) => {
        var _a;
        (_a = (0, inlinejs_1.GetGlobal)().GetCurrentProxyAccessStorage()) === null || _a === void 0 ? void 0 : _a.Put(componentId, `${id}.${prop}`);
        return value;
    };
    elementScope.SetLocal(localKey, (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildProxyOptions)({
        getter: (prop) => {
            var _a;
            if (prop === 'valid') {
                (_a = (0, inlinejs_1.GetGlobal)().GetCurrentProxyAccessStorage()) === null || _a === void 0 ? void 0 : _a.Put(componentId, `${id}.${prop}`);
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
                    (0, inlinejs_1.AddChanges)('set', `${id}.${prop}`, prop, (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                }
            }
            return true;
        },
        lookup: ['valid', 'label', 'stopped'],
    })));
    elementScope.AddUninitCallback(stopCurrent);
});
function MomentDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.MomentDirectiveHandler);
}
exports.MomentDirectiveHandlerCompact = MomentDirectiveHandlerCompact;
