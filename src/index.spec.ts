import { ISegmentConfig } from './interface';
import { cloneDeep } from 'lodash';
import { expect } from 'chai';
import * as testdouble from 'testdouble';
import { ShipmentParser } from './index';

describe('Developer Evaluation', () => {

  afterEach(() => { testdouble.reset(); });

  describe('shipmentItemParser', () => {

    it('should take a segmentId and name and return a valid object', () => {

      expect(ShipmentParser.shipmentItemParser('shipmentItem', 'Apple')).to.eql(
        { name: 'Apple' }
      );

    });

  });

  describe('itemDescriptionParser', () => {

    it('should take a segmentId and description and return a valid string', () => {

      expect(
        ShipmentParser.itemDescriptionParser('itemDescription', 'Juicy Red Delicious Apple')
      ).to.eql('Juicy Red Delicious Apple');

    });

  });

  describe('itemDimensionsParser', () => {

    it(`should take a segmentId, weight string and
    dimensions string in (1x1x1) format and return a valid object`, () => {

      expect(ShipmentParser.itemDimensionsParser('itemDimensions', '44', '5x6x7')).to.eql(
        {
          weight: 44,
          dimensions: {
            height: 5,
            width: 6,
            length: 7
          }
        }
      );

    });

  });

  describe('shipmentDescriptionParser', () => {

    it('should take a segmentId and a date string and return a valid date object', () => {

      expect(ShipmentParser.shipmentDescriptionParser('shipmentDescription', '2016-01-01')).to.eql(
        { date: new Date('2016-01-01')}
      );

    });

  });

  describe('costParser', () => {

    it('should take a segmentId and a string float and return a float', () => {

      expect(ShipmentParser.costParser('cost', '14.99')).to.eql(14.99);

    });

  });

  describe('getFirstSegmentsWithSegmentId', () => {

    it(`should take a segmentId and an array of segments and return the
    subset of the segments from the start, until it finds a segment whose
    segmentId does not match the given segmentId`, () => {

      const segments = [
        ['a', '1'],
        ['a', '2'],
        ['a', '3'],
        ['a', '4'],
        ['b', '5'],
        ['a', '6']
      ];

      expect(new ShipmentParser().getFirstSegmentsWithSegmentId('a', segments)).to.eql([
        ['a', '1'],
        ['a', '2'],
        ['a', '3'],
        ['a', '4']
      ]);

    });

  });

  describe('getFirstSegmentWithSegmentId', () => {

    it(`should take a segmentId and an array of segments and return the first segment that matches,
    or undefined if the first segment does not match`, () => {

      const validSegments = [
        ['a', '1'],
        ['a', '2'],
        ['b', '1'],
      ];

      const invalidSegments = [
        ['b', '1'],
        ['a', '1'],
        ['a', '2'],
      ];

      expect(new ShipmentParser().getFirstSegmentWithSegmentId('a', invalidSegments)).to.eql(undefined);

    });

  });

  describe('getFirstSegmentsWithSegmentIds', () => {

    it(`should take an array of segmentIds and an array of segments and return the first segments that match
    any of the provided segmentIds`, () => {

      const segments = [
        ['a', '1'],
        ['a', '2'],
        ['b', '1'],
        ['c', '1'],
        ['d', '2']
      ];

      expect(new ShipmentParser().getFirstSegmentsWithSegmentIds(['a', 'b'], segments)).to.eql(
        [
          ['a', '1'],
          ['a', '2'],
          ['b', '1'],
        ]
      );

    });

  });

  describe('getFirstSegmentConfigsWithSegmentIds', () => {

    it(`should take an array of segmentIds and an array of segment configs and return the first segment
    configs that match any of the provided segmentIds`, () => {

      const segmentConfigs = [
        {
          segmentId: 'a',
          isLoop: false,
          parser: ShipmentParser.shipmentDescriptionParser
        },
        {
          segmentId: 'b',
          isLoop: true,
          parser: ShipmentParser.shipmentItemParser
        },
        {
          segmentId: 'c',
          isLoop: false,
          parser: ShipmentParser.itemDescriptionParser
        },
        {
          segmentId: 'd',
          isLoop: false,
          parser: ShipmentParser.itemDimensionsParser
        },
      ];

      expect(new ShipmentParser().getFirstSegmentConfigsWithSegmentIds(['a', 'b'], segmentConfigs)).to.eql(
        [
          {
            segmentId: 'a',
            isLoop: false,
            parser: ShipmentParser.shipmentDescriptionParser
          },
          {
            segmentId: 'b',
            isLoop: true,
            parser: ShipmentParser.shipmentItemParser
          }
        ]
      );

    });

  });

  describe('getBundledSegmentsInLoop', () => {

    it(`should take and array of segmentIds and an array of segments,
    and bundle the segments into repeating arrays,
    starting a new bundle at each instance of the segmentId of the first segment`, () => {

      const segments = [
        ['a', '1'],
        ['b', '1'],
        ['c', '1'],
        ['a', '2'],
        ['b', '2'],
        ['c', '2'],
        ['a', '3'],
        ['b', '3'],
        ['c', '3'],
      ];

      expect(new ShipmentParser().getBundledSegmentsInLoop(['a', 'b', 'c'], segments)).to.eql(
        [
          [
            ['a', '1'],
            ['b', '1'],
            ['c', '1'],
          ],
          [
            ['a', '2'],
            ['b', '2'],
            ['c', '2'],
          ],
          [
            ['a', '3'],
            ['b', '3'],
            ['c', '3'],
          ]
        ]
      );

    });

  });

  describe('getNumberOfSegmentsInSegmentBundle', () => {

    it('should take a segment bundle and return the correct number of segments in that bundle', () => {

      const segmentBundle = [
        [
          ['a'],
          ['b'],
          ['c']
        ],
        [
          ['a'],
          ['b'],
          ['c']
        ],
        [
          ['a'],
          ['b'],
          ['c']
        ],
      ];

      expect(new ShipmentParser().getNumberOfSegmentsInSegmentBundle(segmentBundle)).to.eql(9);

    });

  });

  describe('removeLoopPropertiesFromFirstSegmentConfig', () => {

    it(`should take an array of segment configs, clone the object,
    and alter the first segment config so it no longer describes a loop`, () => {

      const segmentConfigs: ISegmentConfig[] = [
        {
          segmentId: 'shipmentItem',
          isLoop: true,
          loopId: 'shipmentItems',
          loopSegmentIds: ['itemDescription', 'itemDimensions'],
          parser: ShipmentParser.shipmentItemParser
        },
        {
          segmentId: 'itemDescription',
          isLoop: false,
          parser: ShipmentParser.itemDescriptionParser
        },
        {
          segmentId: 'itemDimensions',
          isLoop: false,
          parser: ShipmentParser.itemDimensionsParser
        }
      ];

      expect(new ShipmentParser().removeLoopPropertiesFromFirstSegmentConfig(segmentConfigs)).to.eql(
        [
          {
            segmentId: 'shipmentItem',
            isLoop: false,
            loopId: undefined,
            loopSegmentIds: ['itemDescription', 'itemDimensions'],
            parser: ShipmentParser.shipmentItemParser
          },
          {
            segmentId: 'itemDescription',
            isLoop: false,
            parser: ShipmentParser.itemDescriptionParser
          },
          {
            segmentId: 'itemDimensions',
            isLoop: false,
            parser: ShipmentParser.itemDimensionsParser
          }
        ]
      );

      // Make sure original copy of object is untouched
      expect(segmentConfigs[0].loopId).to.not.eql(undefined);
      expect(segmentConfigs[0].isLoop).to.not.eql(false);

    });

  });

});