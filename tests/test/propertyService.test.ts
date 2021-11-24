process.env.NODE_ENV = 'development';
process.env.PORT = '8000';

import { should, expect } from 'chai';
import { Container } from 'inversify';
import 'mocha';
import 'reflect-metadata';
import { IDENTIFIER } from '../../src/constants/identifier';
import { PropertyService, IPropertyService } from '../../src/services/propertyService';
import { IPropertyRepository, PropertyRepository } from '../../src/repository/propertyRepository';
import { IRedisService, RedisService } from '../../src/services/redisService';
import { SearchQueryFactory } from '../../src/utils/searchQueryBuilderFactoryUtil';

describe('Test User Service', () => {
  let propertyService: PropertyService;

  const data = {
    "name": "Paras Tiera",
    "description": "1 BHK Appartment for rent",
    "property_type": "Own",
    "room_type": "SINGLE",
    "accommodates": 2,
    "bedrooms": 1,
    "beds": 1,
    "bed_type": "DOUBLE",
    "bathrooms": 1,
    "price": 10000,
    "security_deposit": 20000,
    "amenities": [
        "Kitchen",
        "Wifi",
        "Gyser",
        "TV",
        "Fridge"
    ],
    "images": [
        {
            "thumnail_url": "",
            "picture_url": ""
        }
    ],
    "address": {
        "street": "Sector 81",
        "government_area": "NSEZ",
        "city": "Noida",
        "pincode": 201305,
        "country": "India",
        "country_code": "IN",
        "location": {
            "type": "point",
            "lat": 28.5414,
            "long": 77.3970
        }
    },
    "age": "1 years",
    "added_by": "6197dec65fde425d8e2a1a48",
    "available_from": "01/12/2021"
}


  before(() => {
    const container = new Container();
    container.bind<IPropertyService>(IDENTIFIER.PropertyService).to(PropertyService).inSingletonScope();
    container.bind<SearchQueryFactory>(IDENTIFIER.SearchQueryFactory).to(SearchQueryFactory).inSingletonScope();
    container.bind<IPropertyRepository>(IDENTIFIER.PropertyRepository).to(PropertyRepository).inSingletonScope();
    container.bind<IRedisService>(IDENTIFIER.RedisService).to(RedisService).inSingletonScope();
    propertyService = container.get(IDENTIFIER.PropertyService);
  });

  it('It should save user in users collection', async (done) => {
    const property = await propertyService.addProperty(data);
    // mocked property should be equal to the new created property
    done();
  });
});

