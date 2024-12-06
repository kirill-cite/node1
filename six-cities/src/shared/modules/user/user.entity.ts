import { getModelForClass, prop } from '@typegoose/typegoose';

import { User } from '../../types/index.js';

export class UserEntity implements User {
  @prop({ unique: true, required: true })
  public name: string;

  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatar?: string | undefined;

  @prop({ required: true })
  public password: string;

  @prop({ required: true })
  public isPro: boolean;
}

export const UserModel = getModelForClass(UserEntity);
