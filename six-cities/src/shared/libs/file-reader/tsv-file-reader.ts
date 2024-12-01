import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, City, User, Location } from '../../types/index.js';

import dayjs from 'dayjs';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(
    private readonly filename: string
  ) {
    super();
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
      cityZoom,
      offerLatitude,
      offerLongitude,
      offerZoom,
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
      comments,
      date
    ] = line.split('\t');

    return {
      id,
      title,
      description,
      city: this.parseCity(cityName, cityLatitude, cityLongitude, cityZoom),
      date: (date) ? date : dayjs().toISOString(),
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
      location: this.parseLocation(offerLatitude, offerLongitude, offerZoom)
    };
  }

  private parseCity(cityName: string, cityLatitude: string, cityLongitude: string, zoom: string): City {
    return {
      name: cityName,
      location:this.parseLocation(cityLatitude, cityLongitude, zoom)
    };
  }

  private parseLocation(latitude: string, longitude: string, zoom: string): Location{
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      zoom: parseInt(zoom, 10),
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

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }
}
