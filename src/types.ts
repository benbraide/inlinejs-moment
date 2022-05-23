export interface IMomentFormatParams{
    date: Date;
    thin?: boolean;
    short?: boolean;
    ucfirst?: boolean;
    capitalize?: boolean;
    until?: boolean;
}

export interface IMomentTrackInfo{
    stop: () => void;
    resume: () => void;
    stopped: () => boolean;
}

export type IMomentTrackHandlerType = (label: string) => void | boolean;

export interface IMomentTrackParams extends IMomentFormatParams{
    handler: IMomentTrackHandlerType;
    startImmediately?: boolean;
}

export interface IMomentConcept{
    Format(params: IMomentFormatParams): [string, number, boolean];
    Track(params: IMomentTrackParams): IMomentTrackInfo;
}
