import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class UserModel {
  @Prop()
  userId: Types.ObjectId;

  @Prop()
  userName: string;

  @Prop({ unique: true })
  userEmail: string;

  @Prop()
  userPasswordHash: string;

  @Prop({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
  userDateCreatedUtc: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
