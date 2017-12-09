export interface ISegmentConfig {
  segmentId: string;
  isLoop: boolean;
  loopId?: string;
  loopSegmentIds?: string[];
  parser?: (...any) => {};
}

export interface IParserStep {
    key: string;
    value: {};
    numSegmentsToDrop: number;
    numSegmentConfigsToDrop: number;
}