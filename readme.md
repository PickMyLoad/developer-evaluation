# PML Freight Tech Developer Evaluation
This repository is used to evaluate core skills of prospective Node JS developers at PML Freight Tech.

## Instructions
1. Clone this repository.
1. Install dependencies with Yarn or NPM.
1. There are a variety of scripts defined in package.json to help you.
1. Complete the empty method definitions in ./src/index.ts so that the tests defined in ./src/index.spec.ts pass
1. Begin at the easier methods at the top of the file and work your way down to the more challenging ones.
1. It is not mandatory that your script pass all tests, do your best and have fun.
1. Once complete, build the typescript project and create a zip file of the project directory and email to [dan@pmlfreight.tech](mailto:dan@pmlfreight.tech)

Please don't submit your answers via a pull request. That's not how this works :P.

Feel free to ask questions if you require clarifications.

## Overview
The ShipmentParser class transforms data from an Array structure to a JSON  structured according to a set of rules defined in a "SegmentConfig" collection.

Segments are provided as an array of string arrays. Each item in the array is a "Segment" and the first element in the "Segment" is the "Segment ID".

e.g.
```
[
  ['shipmentDescription', '2014-01-01]
]
```
This is a "Segment" array that contains one "Segment" whose "Segment ID" is "shipmentDescription".

The "SegmentConfig" object describes how the "Segment" array should be transformed into a JSON object.

e.g.
```
const config: ISegmentConfig[] = [{
  segmentId: 'shipmentDescription',
  isLoop: false,
  parser: ShipmentParser.shipmentDescriptionParser
}];
```

This is a "SegmentConfig" collection that specifies that segmentId is not a loop, it should be keyed by its segmentId, and the values of the segment should be run through the ShipmentParser.shipmentDescriptionParser function in order to return the proper value.

## Segments can either be "Simple" or "Looped".

A simple segment is keyed by its "segmentId" and it's value is run through a specified "parser" function.

Segments can also be "Loop Segments". Loop segment are keyed by their "loopId". The consecutive "Segment Ids" which should become part of the loop are idetified by the "loopSegmentIds". Each segment within a loop is also run through a specified "parser" function.

## Example
```
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

const segments = [
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
]
```

The "Segment Config" defines that the first segment should be a shipmentDescription. This should be followed by a "shipmentItem" segment, which is a loop that contains the following "itemDescription" and "itemDimensions" segment configs, but not the "Cost" Segment Config. The correct output when run through the ShipmentParser will be:

```
{
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
}
```