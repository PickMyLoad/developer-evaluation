import { takeWhile, drop, filter, reduce, clone, cloneDeep } from 'lodash';
import { ISegmentConfig, IParserStep } from './interface';

export class ShipmentParser {

  static shipmentItemParser = (segmentId: string, name: string) => {

  }

  static itemDescriptionParser = (segmentId: string, description: string) => {

  }

  static itemDimensionsParser = (segmentId: string, weight: string, dims: string) => {

  }

  static shipmentDescriptionParser = (name: string, shipmentDate: string) => {

  }

  static costParser = (name: string, cost: string) => {

  }

  getFirstSegmentsWithSegmentId(segmentId: string, segments: string[][]) {

  }

  getFirstSegmentWithSegmentId(segmentId: string, segments: string[][]) {

  }

  getFirstSegmentsWithSegmentIds(segmentIds: string[], segments: string[][]) {

  }

  getFirstSegmentConfigsWithSegmentIds(segmentIds: string[], segmentConfigs: ISegmentConfig[]) {

  }

  getBundledSegmentsInLoop(segmentIds: string[], segments: string[][]) {

  }

  getNumberOfSegmentsInSegmentBundle(segmentBundles: string[][][]) {

  }

  removeLoopPropertiesFromFirstSegmentConfig(segmentConfigs: ISegmentConfig[]) {

  }

}