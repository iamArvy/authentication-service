import { Injectable } from '@nestjs/common';
import { Session, SessionDocument } from './session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionRepo {
  constructor(
    @InjectModel(Session.name) private model: Model<SessionDocument>,
  ) {}
  async create(data: Partial<Session>): Promise<SessionDocument> {
    const auth = new this.model(data);
    return auth.save();
  }

  async findByEmail(email: string): Promise<SessionDocument | null> {
    return this.model.findOne({ email });
  }

  async findById(id: string): Promise<SessionDocument | null> {
    return this.model.findById(id);
  }

  // async updateRefreshToken(id: string, token: string | null): Promise<any> {
  //   return this.model.updateOne(
  //     { _id: id },
  //     { $set: { refresh_token: token } },
  //   );
  // }
}
