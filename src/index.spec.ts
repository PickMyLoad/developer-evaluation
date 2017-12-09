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

  describe('parseSegmentBundlesToArray', () => {

    it(`should take an array of segment configs, and an array of segment bundles
    and output an array of parsed segment objects`, () => {

      const segmentConfig: ISegmentConfig[] = [
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
        },
        {
          segmentId: 'cost',
          isLoop: false,
          parser: ShipmentParser.costParser
        }
      ];

      const transformedSegmentConfig = cloneDeep(segmentConfig);

      transformedSegmentConfig[0].isLoop = false;
      transformedSegmentConfig[0].loopId = undefined;

      const bundledSegments = [
        [
          ['shipmentItem', 'Apples'],
          ['itemDescription', 'Apples are delicious red fruit.'],
          ['itemDimensions', '45', '4x4x4'],
        ],
        [
          ['shipmentItem', 'Bananas'],
          ['itemDescription', 'Bananas grow on trees in the carribbean.'],
          ['itemDimensions', '30', '5x5x5'],
        ],
        [
          ['shipmentItem', 'Oranges'],
          ['itemDescription', 'Oranges have rinds and are found in Florida.'],
          ['itemDimensions', '35', '5x6x5']
        ]
      ];

      const myShipmentParser = new ShipmentParser();

      // Here we will mock the parseSegmentsToObject call for easier testing
      myShipmentParser.parseSegmentsToObject = testdouble.function(myShipmentParser.parseSegmentsToObject);

      // Here we declare what should be returned when our function under test calls the
      // myShipmentParser.parseSegmentsToObject function with various parameters
      testdouble.when(
        myShipmentParser.parseSegmentsToObject(
          transformedSegmentConfig,
          bundledSegments[0]
        )
      ).thenReturn({ name: 'a' });

      testdouble.when(
        myShipmentParser.parseSegmentsToObject(
          transformedSegmentConfig,
          bundledSegments[1]
        )
      ).thenReturn({ name: 'b' });

      testdouble.when(
        myShipmentParser.parseSegmentsToObject(
          transformedSegmentConfig,
          bundledSegments[2]
        )
      ).thenReturn({ name: 'c' });

      expect(
        myShipmentParser.parseSegmentBundlesToArray(
          transformedSegmentConfig,
          bundledSegments
        )
      ).to.eql([{ name: 'a' }, { name: 'b' }, { name: 'c' }]);

      // You may be tempted to mutate this object in the function under test.
      // Make a deep clone instead.
      expect(segmentConfig[0].isLoop).to.not.eql(false);
      expect(segmentConfig[0].loopId).to.not.eql('');

    });

  });

  describe('parseSegmentsToObject', () => {

    it(`should take data in the Segments format, apply the rules from the
    configuration object and output the data in the destination format`, () => {

      const config: ISegmentConfig[] = [
        {
          segmentId: 'shipmentDescription',
          isLoop: false,
          parser: ShipmentParser.shipmentDescriptionParser
        },
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
        },
        {
          segmentId: 'cost',
          isLoop: false,
          parser: ShipmentParser.costParser
        }
      ];

      const Segments = [
        ['shipmentDescription', '2014-01-01'],
        ['shipmentItem', 'Apples'],
        ['itemDescription', 'Apples are delicious red fruit.'],
        ['itemDimensions', '45', '4x4x4'],
        ['shipmentItem', 'Bananas'],
        ['itemDescription', 'Bananas grow on trees in the carribbean.'],
        ['itemDimensions', '30', '5x5x5'],
        ['shipmentItem', 'Oranges'],
        ['itemDescription', 'Oranges have rinds and are found in Florida.'],
        ['itemDimensions', '35', '5x6x5'],
        ['cost', '49.99']
      ];

      const destination = {
        shipmentDescription: {
          date: new Date('2014-01-01')
        },
        shipmentItems: [
          {
            shipmentItem: {
              name: 'Apples'
            },
            itemDescription: 'Apples are delicious red fruit.',
            itemDimensions: {
              weight: 45,
              dimensions: {
                height: 4,
                width: 4,
                length: 4
              }
            }
          },
          {
            shipmentItem: {
              name: 'Bananas'
            },
            itemDescription: 'Bananas grow on trees in the carribbean.',
            itemDimensions: {
              weight: 30,
              dimensions: {
                height: 5,
                width: 5,
                length: 5
              }
            }

          },
          {
            shipmentItem: {
              name: 'Oranges'
            },
            itemDescription: 'Oranges have rinds and are found in Florida.',
            itemDimensions: {
              weight: 35,
              dimensions: {
                height: 5,
                width: 6,
                length: 5
              }
            }

          }
        ],
        cost: 49.99
      };

      const result = new ShipmentParser().parseSegmentsToObject(config, Segments);

      expect(result).to.eql(destination);

    });

  });

});