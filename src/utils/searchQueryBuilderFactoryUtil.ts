import { injectable } from 'inversify';
import container from '../config/diConfig';
import { IDENTIFIER } from '../constants/identifier';
import { SEARCH_TYPE } from '../constants/propertySearchType';
import { 
  RadiusLatLangSearch, 
  CountrySearch, 
  CitySearch, 
  OtherSerach
} from './searchTypeUtil'

@injectable()
export class SearchQueryFactory {
  
  public getSearchQuery(searchType: SEARCH_TYPE): object {
    switch(searchType) {
      case SEARCH_TYPE.RADIUSLATLANG:
        return container.get<RadiusLatLangSearch>(IDENTIFIER.RadiusLatLangSearch);
      case  SEARCH_TYPE.COUNTRY:
        return new CountrySearch();
      case SEARCH_TYPE.CITY:
        return new CitySearch();
      case SEARCH_TYPE.OTHER :
        return new OtherSerach();  
    }
  }
}