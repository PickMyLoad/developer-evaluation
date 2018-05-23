export enum Colour {
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  PINK = 'PINK'
}

export interface IFamilyTree {
  name: string;
  gender: 'male' | 'female';
  favoriteColour: string;
  children?: IFamilyTree[];
}

export interface IColourTally {
  [key: string]: number;
}

export interface IGrocery {
  item: string;
  density: number;
}

export interface ICandy {
  name: string;
  quantity: number;
  type: 'salty' | 'sweet';
}

export interface IDistributedCandy {
  name: string;
  candies: string[];
}