import { IMomentConcept, IMomentFormatParams, IMomentTrackInfo, IMomentTrackParams } from "./types";
export declare class MomentConcept implements IMomentConcept {
    private checkpoints_;
    Format({ date, until, thin, ...rest }: IMomentFormatParams): [string, number, boolean];
    Track({ handler, until, startImmediately, ...rest }: IMomentTrackParams): IMomentTrackInfo;
    private Format_;
    private ComputeLabel_;
}
