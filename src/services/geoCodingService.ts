import { injectable } from 'inversify';
import geoCoder from 'node-geocoder';
import CONFIG from '../config/envConfig';

export interface IReverseGeoCoding {
  latitude: number;
  longitude: number,
  formattedAddress: string,
  country: string,
  city: string,
  state: string,
  zipcode: number,
  streetName?: string,
  streetNumber?: string,
  countryCode: string,
  neighbourhood?: string,
  provider: string
}

export interface IGeoCodingService {
  reverseGeoCoding(lat: number, lon: number): Promise<IReverseGeoCoding>;
  createClient(): Promise<void>;
}

@injectable()
export class GeoCodingService implements IGeoCodingService {
  private geoCoderClient;

  constructor() {}
  
  public async createClient(): Promise<void> {
    const options = {
      provider: 'openstreetmap'
        // provider: CONFIG.LOCATION_PROVIDER,
        // apiKey: CONFIG.LOCATION_API_KEY,
        // formatter: null
    };
    this.geoCoderClient = await geoCoder(options);
  }

  public async reverseGeoCoding(lat: number, lon: number): Promise<IReverseGeoCoding> {
    return this.geoCoderClient.reverse({lat, lon});
  }

}