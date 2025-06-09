import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema({
  timestamps: true,
  collection: 'auth_users',
  // Ensure that the password and version are not included in the JSON response
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
})
export class Auth {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, select: false, default: false })
  emailVerified: boolean;

  @Prop({ required: true, select: false })
  passwordResetToken: string;

  @Prop({ required: true, select: false })
  @Prop()
  refresh_token?: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
