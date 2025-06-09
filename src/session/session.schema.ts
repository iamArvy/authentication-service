import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({
  timestamps: true,
  collection: 'auth_sessions',
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      return ret;
    },
  },
})
export class Session {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ select: false })
  hashedRefreshToken?: string | null;

  @Prop({ required: true, select: false })
  userAgent: string;

  @Prop({ required: true, select: false })
  ipAddress: string;

  @Prop({ required: false })
  revokedAt?: Date;

  @Prop({ required: true })
  expiresAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
