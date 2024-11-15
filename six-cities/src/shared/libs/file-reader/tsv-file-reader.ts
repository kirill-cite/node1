import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, City, User, Location } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData() {
    if (! this.rawData) {
      throw new Error('file was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      id,
      title,
      type,
      price,
      cityName,
      cityLatitude,
      cityLongitude,
      offerLatitude,
      offerLongitude,
      isFavorite,
      isPremium,
      rating,
      previewImage,
      images,
      description,
      bedrooms,
      maxAdults,
      goods,
      userName,
      password,
      email,
      isPro,
      avatar,
      comments
    ] = line.split('\t');

    return {
      id,
      title,
      description,
      date: Date.now(),
      city: this.parseCity(cityName, cityLatitude, cityLongitude),
      previewImage,
      images: images.split(';'),
      isFavorite: this.parseBoolean(isFavorite),
      isPremium: this.parseBoolean(isPremium),
      rating: parseFloat(rating),
      type,
      bedrooms: parseInt(bedrooms, 10),
      maxAdults: parseInt(maxAdults, 10),
      price: parseInt(price, 10),
      goods: goods.split(','),
      host: this.parseUser(userName, password, email, isPro, avatar),
      comments: parseInt(comments, 10),
      location: this.parseLocation(offerLatitude, offerLongitude)
    };
  }

  private parseCity(cityName: string, cityLatitude: string, cityLongitude: string): City {
    return {
      name: cityName,
      location:this.parseLocation(cityLatitude, cityLongitude)
    };
  }

  private parseLocation(latitude: string, longitude: string): Location{
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };
  }

  private parseBoolean(status: string): boolean {
    return status === 'true';
  }

  private parseUser(name: string, password: string, email: string, isPro: string, avatar: string): User {
    return {
      name,
      password,
      email,
      isPro: this.parseBoolean(isPro),
      avatar: avatar ?? null
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, 'utf-8');
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
