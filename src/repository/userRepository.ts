import { injectable } from 'inversify';
import { IUser, IUserDocument, userModel } from '../models/userModel';
import { ObjectId } from 'bson';
import { IDocumentUpdate } from '../common/commonInterface';

export interface IUserRepository {
  getUserById(userId: ObjectId, project?: {}): Promise<IUser>;
  findUserByEmail(searchQuery, project): Promise<IUser[]>;
  saveUser(userData: IUser): Promise<IUserDocument>;
  updateUser(updateQuery: object, updateData: object): Promise<IDocumentUpdate>
}

@injectable()
export class UserRepository implements IUserRepository {

  public async getUserById(userId: ObjectId, project?: {}): Promise<IUserDocument> {
    return userModel
      .findById({ _id: userId }, project)
      .lean();
  }

  public async findUserByEmail(searchQuery, project): Promise<IUserDocument[]> {
    return userModel
      .findOne(searchQuery, project)
      .lean();  
  }

  public async saveUser(userData: IUser): Promise<IUserDocument> {
    return userModel.create(userData);
  }

  public async updateUser(updateQuery: object, updateData: object): Promise<IDocumentUpdate> {
    return userModel.updateOne(updateQuery, updateData);
  }

}