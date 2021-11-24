import { inject, injectable } from 'inversify';
import { IPagination } from '../common/commonInterface';
import { IDENTIFIER } from '../constants/identifier';
import { IProperty, IPropertyDocument } from '../models/propertyModel';
import { IPropertyRepository } from '../repository/propertyRepository';
import { SearchQueryFactory } from '../utils/searchQueryBuilderFactoryUtil';
import { IRedisService } from './redisService';
import { SEARCH_TYPE } from '../constants/propertySearchType';

export interface IPropertySearchQuery {
  radius?: number,
  lat?: number,
  long?: number,
  city?: string,
  country?: string,
  bedrooms?: number,
  searchType: SEARCH_TYPE,
  page: number,
  limit: number
}

export interface IPropertyService {
  addProperty(propertyData: IProperty): Promise<IPropertyDocument>;
  getProperty(query: IPropertySearchQuery): Promise<IPagination<IPropertyDocument>>;
}

@injectable()
export class PropertyService implements IPropertyService {

  private propertyRepository;
  private redisService;
  private searchQueryFactory;

  constructor(
    @inject(IDENTIFIER.PropertyRepository) propertyRepository: IPropertyRepository,
    @inject(IDENTIFIER.RedisService) redisService: IRedisService,
    @inject(IDENTIFIER.SearchQueryFactory) searchQueryFactory: SearchQueryFactory
  ) {
    this.propertyRepository = propertyRepository;
    this.redisService = redisService;
    this.searchQueryFactory = searchQueryFactory;
  }

  public async addProperty(propertyData: IProperty): Promise<IPropertyDocument> {
    // saving property in the db
    const property = await this.propertyRepository.createProperty(propertyData);
    // adding geo location of property in redis
    const res= await this.redisService.geoAddLocation(
      propertyData.address.city, 
      propertyData.address.location.lat, 
      propertyData.address.location.long, 
      property._id.toString()
    )
    return property;
  }

  public async getProperty(query: IPropertySearchQuery): Promise<IPagination<IPropertyDocument>> {
    /**
     * if search is through radius, lat && long, check in redis for property ids using zrange coressponding 
     * to locality and radius retrived from reverse geocoding of lat long using google api 
     * if no property ids data cached in for the location within given radius
     * make a geosearch query in redis to get the property id within given radius
     * save the fetched ids using zadd in redis
     * fetch the property details form the db with the property ids fetched from redis
     * If search is through country, fetch all city of the country query the properties collection 
     * for fast search can use index on the city field
     */
    const searchQueryFactory = this.searchQueryFactory.getSearchQuery(SEARCH_TYPE[query.searchType]);
    const searchQuery = await searchQueryFactory.searchQuery(query);

    return this.propertyRepository.searchProperty(searchQuery);
    
  }

}