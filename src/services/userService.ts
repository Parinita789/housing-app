import { ObjectID, ObjectId } from 'bson';
import { inject, injectable } from 'inversify';
import { IPagination } from '../common/commonInterface';
import { IDENTIFIER } from '../constants/identifier';
import { IUser, IUserDocument, IWishlist } from '../models/userModel';
import { IUserRepository } from '../repository/userRepository';
import { DuplicateError } from '../utils/errorUtil';
import { IPasswordService } from './passwordService';

export interface IUserService {
  getUserById(userId: ObjectId, project?: {}): Promise<IUserDocument>;
  findUserByEmail(searchQuery, project): Promise<IUserDocument[]>;
  createUser(userData: IUser): Promise<IUserDocument>;
  getWishlistProperty(userId: string, page: number, limit: number): Promise<IPagination<IWishlist>>;
  wishlistProperty(wishlistData: IWishlist, userId: string): Promise<void>
}

@injectable()
export class UserService implements IUserService {
  private userRepository;
  private passwordService;

  constructor(
    @inject(IDENTIFIER.UserRepository) userRepository: IUserRepository,
    @inject(IDENTIFIER.PasswordService) passwordService: IPasswordService
  ) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }

  public async getUserById(userId: ObjectId, project?: object): Promise<IUserDocument> {
    return this.userRepository.getUserById(userId, project);
  }

  public async findUserByEmail(searchQuery: object, project: object): Promise<IUserDocument[]> {
    return this.userRepository.findUserByEmail(searchQuery, project);
  }

  public async createUser(userData: IUser): Promise<IUserDocument> {
    const existingUser = await this.userRepository.findUserByEmail({ email: userData.email }, { email: 1 });
    if (existingUser) {
      throw new DuplicateError('User Already Exists.');
    }
    userData.password = await this.passwordService.getPasswordHash(userData.password);
    return await this.userRepository.saveUser(userData);
  }

  public async wishlistProperty(wishlistData: IWishlist, userId: string): Promise<void> {
    const updateData = { $push: { wishlist: wishlistData } };
    const updateQuery = { _id: new ObjectID(userId) };
    await this.userRepository.updateUser(updateQuery, updateData);
  }

  public async getWishlistProperty(userId: string, page: number, limit: number): Promise<IPagination<IWishlist>> {
    const { wishlist } =  await this.userRepository.getUserById(new ObjectID(userId), { wishlist: 1 , _id: 0 });

    return { 
      data: wishlist.splice(page * limit, limit),
      totalRecords: wishlist?.length,
      recordsPerPage: limit
    }
  }

}