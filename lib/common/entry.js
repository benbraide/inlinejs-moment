"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSMoment = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const names_1 = require("./names");
const concept_1 = require("./concept");
const moment_1 = require("./directive/moment");
const moment_2 = require("./magic/moment");
function InlineJSMoment() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        (0, inlinejs_1.GetGlobal)().SetConcept(names_1.MomentConceptName, new concept_1.MomentConcept());
        (0, moment_1.MomentDirectiveHandlerCompact)();
        (0, moment_2.MomentMagicHandlerCompact)();
    });
}
exports.InlineJSMoment = InlineJSMoment;
