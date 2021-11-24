import { inject, injectable } from 'inversify';
import { State } from 'country-state-city'
import { IDENTIFIER } from '../constants/identifier';
import { IGeoCodingService } from '../services/geoCodingService';
import { IRedisService } from '../services/redisService';
import { IPaginationFilter } from '../common/commonInterface';

type GenericObject = { [key: string]: any };

export interface ISearchQuery {
  baseQuery: GenericObject,
  totalCountQuery?: GenericObject,
  filter?: IPaginationFilter
}

export interface Search {
  searchQuery(object): Promise<ISearchQuery>;
}

@injectable()
export class RadiusLatLangSearch implements Search {
  private geoCodingService;
  private redisService;

  constructor(
    @inject(IDENTIFIER.GeoCodingService) geoCodingService: IGeoCodingService,
    @inject(IDENTIFIER.RedisService) redisService: IRedisService
  ) {
    this.geoCodingService = geoCodingService;
    this.redisService = redisService;
  }

  public async searchQuery({ lat, long, radius, page, limit }): Promise<ISearchQuery> {
    const address = await this.geoCodingService.reverseGeoCoding(lat, long);
    const key = `${(address[0]?.formattedAddress.split(',')[0]).replace(/ /g,'')}-${address[0].city}-${radius}KM`.toLocaleLowerCase();
    
    let propertyIds = await this.redisService.zrange(key, page, limit);

    if (propertyIds?.length === 0) {
      propertyIds = await this.redisService.geoSearchProperty(address[0].city, lat, long, radius);
      await this.redisService.savePropertyIdInRedis(propertyIds, radius, address);
    }

    return {
      baseQuery: { _id: { $in: propertyIds } },
      filter: {
        select: {
          name: 1,
          description: 1,
          property_type: 1,
          room_type: 1,
          price: 1,
          image: 1,
          address: 1,
          added_by: 1,
        },
        lean: true
      }
    };
  }
}

export class CountrySearch implements Search {
  public async searchQuery({ country, page, limit }): Promise<ISearchQuery> {
    // get all city of a country from db currently using a npm package
    const cities = State.getStatesOfCountry(country);
    return {
      baseQuery: { 'address.city': { $in: cities }},
      totalCountQuery: { 'address.city': { $in: cities }},
      filter: {
        select: {
          name: 1,
          description: 1,
          property_type: 1,
          room_type: 1,
          price: 1,
          image: 1,
          address: 1,
          added_by: 1,
        },
        sort: -1,
        skip: page * limit,
        limit: limit,
        lean: true
      }
    };
  }
}

export class CitySearch implements Search {
  public async searchQuery({ city, limit, page }): Promise<ISearchQuery> {
    return {
      baseQuery: { 'address.city': city },
      totalCountQuery: { 'address.city': city },
      filter: {
        select: {
          name: 1,
          description: 1,
          property_type: 1,
          room_type: 1,
          price: 1,
          image: 1,
          address: 1,
          added_by: 1,
        },
        sort: -1,
        skip: page * limit,
        limit: limit,
        lean: true
      }
    };
  }
}

export class OtherSerach implements Search {
  public async searchQuery({ bedrooms, propertyType, city, page, limit }): Promise<ISearchQuery> {
    let searchQuery: ISearchQuery = {
      baseQuery: {},
      totalCountQuery: {},
      filter: {
        select: {
          name: 1,
          description: 1,
          property_type: 1,
          room_type: 1,
          price: 1,
          image: 1,
          address: 1,
          added_by: 1,
        },
        sort: -1,
        skip: page * limit,
        limit: limit,
        lean: true
      }
    };
    if (bedrooms) {
      searchQuery.baseQuery.room_type = bedrooms;
    }
    if (propertyType) {
      searchQuery.baseQuery.property_type = propertyType;
    }
    if (city) {
      searchQuery.baseQuery['address.city'] = city;
    }
    searchQuery.totalCountQuery = searchQuery.baseQuery; 
    return searchQuery;
  }
}

