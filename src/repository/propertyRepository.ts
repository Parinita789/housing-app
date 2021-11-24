import { injectable } from 'inversify';
import { propertyModel, IProperty, IPropertyDocument } from '../models/propertyModel';
import { IPagination } from '../common/commonInterface';
import { ISearchQuery } from '../utils/searchTypeUtil';

export interface IPropertyRepository {
  createProperty(propertyData: IProperty): Promise<IPropertyDocument>;
  searchProperty(searchQuery: ISearchQuery): Promise<IPagination<IPropertyDocument>> 
}

@injectable()
export class PropertyRepository implements IPropertyRepository {

  public async createProperty(propertyData: IProperty): Promise<IPropertyDocument> {
    return propertyModel.create(propertyData);
  }

  public async searchProperty(searchQuery: ISearchQuery): Promise<IPagination<IPropertyDocument>> {
    if (!searchQuery.baseQuery) throw new Error('BASE Query does not exist');
    const data = await propertyModel
    .find(searchQuery.baseQuery)
    .select(searchQuery.filter?.select)
    .skip(searchQuery.filter?.skip)
    .limit(searchQuery.filter?.limit)
    .lean(searchQuery.filter?.lean || false);

    let totalRecords;
    if (searchQuery.totalCountQuery) {
      totalRecords = await propertyModel.count(searchQuery);
    }

    return { 
      data, 
      totalRecords,
      recordsPerPage:  searchQuery.filter?.limit
    };
  }
}

