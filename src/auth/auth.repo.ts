import { Injectable } from '@nestjs/common';
import { Auth, AuthDocument } from './auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthRepo {
  constructor(@InjectModel(Auth.name) private model: Model<AuthDocument>) {}
  async create(data: Partial<Auth>): Promise<AuthDocument> {
    const auth = new this.model(data);
    return auth.save();
  }

  async findByEmail(email: string): Promise<AuthDocument | null> {
    return this.model.findOne({ email });
  }

  async findById(id: string): Promise<AuthDocument | null> {
    return this.model.findById(id);
  }

  async findByUserId(userId: string): Promise<AuthDocument | null> {
    return this.model.findOne({ userId });
  }

  // async updateRefreshToken(id: string, token: string | null): Promise<any> {
  //   return this.model.updateOne(
  //     { _id: id },
  //     { $set: { refresh_token: token } },
  //   );
  // }
}
