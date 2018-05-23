import { IFamilyTree, Colour, IGrocery, ICandy } from './interface';
import { find } from 'lodash';
import { expect } from 'chai';
import { oddNumberAccumulator, favoriteColorTallier, groceryBagger, candyDistributor } from './index';

describe('Developer Evaluation', () => {

  describe('Odd Number Accumulator', () => {

    it('should add all the odd numbers between the start and end', () => {

      expect(
        oddNumberAccumulator(1, 5)
      ).to.eql(9);

      expect(
        oddNumberAccumulator(0, 10)
      ).to.eql(25);

    });

  });

  describe('Favorite Colour Tallier', () => {

    it('should tally the favorite colours of all the females in the family tree', () => {

      const familyTree: IFamilyTree = {
        name: 'Sharon',
        gender: 'female',
        favoriteColour: Colour.ORANGE,
        children: [
          {
            name: 'Peter',
            gender: 'male',
            favoriteColour: Colour.BLUE,
            children: [
              {
                name: 'Amy',
                gender: 'female',
                favoriteColour: Colour.PURPLE,
              },
              {
                name: 'Levi',
                gender: 'male',
                favoriteColour: Colour.ORANGE,
              }
            ]
          },
          {
            name: 'Paul',
            gender: 'male',
            favoriteColour: Colour.ORANGE,
            children: [
              {
                name: 'Susan',
                gender: 'female',
                favoriteColour: Colour.GREEN
              },
              {
                name: 'Sarah',
                gender: 'female',
                favoriteColour: Colour.PURPLE,
                children: [
                  {
                    name: 'Leanne',
                    gender: 'female',
                    favoriteColour: Colour.GREEN
                  }
                ]
              }
            ]
          },
          {
            name: 'Mary',
            gender: 'female',
            favoriteColour: Colour.BLUE,
            children: [
              {
                name: 'Oliver',
                gender: 'male',
                favoriteColour: Colour.BLUE
              },
              {
                name: 'Odessa',
                gender: 'female',
                favoriteColour: Colour.ORANGE
              }
            ]
          }
        ],

      };

      const tally = favoriteColorTallier(familyTree, undefined);

      expect(tally.ORANGE).to.eql(2);
      expect(tally.BLUE).to.eql(1);
      expect(tally.PURPLE).to.eql(2);
      expect(tally.GREEN).to.eql(2);
      expect(tally.PINK).to.eql(0);

    });

  });

  describe('Grocery Bagger', () => {

    it(`should return the grocery items in the order they should
      be placed in a grocery bag`, async () => {

      const promises: Array<Promise<IGrocery>> = [
        new Promise((resolve) => setTimeout(() => resolve({ item: 'bread', density: 80 }), 4)),
        new Promise((resolve) => setTimeout(() => resolve({ item: 'eggs', density: 30 }), 1)),
        new Promise((resolve) => setTimeout(() => resolve({ item: 'milk', density: 200}), 2)),
        new Promise((resolve) => setTimeout(() => resolve({ item: 'coconut', density: 120}), 3)),
      ];

      const result = await groceryBagger(promises);

      expect(result).to.eql([
        'milk',
        'coconut',
        'bread',
        'eggs'
      ]);

    });

  });

  describe('Candy Distributor', () => {

    it(`should take a bowl of candy and portion it all out so that each person
      gets the same amount of candy and each person gets an equal number of salty and sweet items.
      Some candy may be left over.`, () => {

      const people = ['Dave', 'Sharon', 'Annie', 'Eric'];

      const candies: ICandy[] = [
        { name: 'Chips', quantity: 4, type: 'salty' },
        { name: 'Pretzels', quantity: 8, type: 'salty' },
        { name: 'Chocolate Bar', quantity: 12, type: 'sweet' },
        { name: 'Lollipop', quantity: 18, type: 'sweet' },
      ];

      const results = candyDistributor(people, candies);

      const dave = find(results, (result) => result.name === 'Dave');
      const sharon = find(results, (result) => result.name === 'Sharon');
      const annie = find(results, (result) => result.name === 'Annie');
      const eric = find(results, (result) => result.name === 'Eric');

      expect(dave.candies.length)
        .to.eql(sharon.candies.length).and
        .to.eql(annie.candies.length).and
        .to.eql(eric.candies.length);

      expect(
        dave.candies.filter(
          (candy) => candy === 'Chips' || candy === 'Pretzels'
        ).length
      ).to.eql(
        dave.candies.filter(
          (candy) => candy === 'Chocolate Bar' || candy === 'Lollipop'
        ).length
      );

    });

  });

});