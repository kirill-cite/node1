import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';

import { City, Location } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'cities',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CityEntity extends defaultClasses.TimeStamps implements City {

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public location: Location;

  constructor(cityData: City) {
    super();

    this.name = cityData.name;
    this.location = cityData.location;
  }

}

export const CityModel = getModelForClass(CityEntity);
