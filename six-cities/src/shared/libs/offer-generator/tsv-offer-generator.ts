import { OFFER_GOODS, OFFER_TYPES, Setting, SixCities } from '../const.js';
import { generateRandomValue, getRandomItem, getRandomItems} from '../../helpers/common.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';


export class TSVOfferGenerator implements OfferGenerator {
  constructor (
        private readonly mockData: MockServerData
  ){}

  generate(): string {
    const id = faker.database.mongodbObjectId;
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const date = dayjs(faker.date.recent()).toISOString;
    const city = getRandomItem(Object.values(SixCities));
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.images).join(';');
    const isFavorite = faker.datatype.boolean();
    const isPremium = faker.datatype.boolean();
    const rating = generateRandomValue(Setting.MINRAITING, Setting.MAXRAITING * 10) / 10;
    const type = getRandomItem(OFFER_TYPES);
    const bedrooms = generateRandomValue(Setting.MINBEDROOMS, Setting.MAXBEDROOMS);
    const maxAdults = generateRandomValue(Setting.MINADULTS, Setting.MAXADULTS);
    const price = generateRandomValue(Setting.MINPRICE, Setting.MAXPRICE);
    const goods = getRandomItems(OFFER_GOODS).join(';');
    const host = {
      name: getRandomItem(this.mockData.userNames),
      email: getRandomItem(this.mockData.emails),
      avatar: getRandomItem(this.mockData.avatars),
      password: getRandomItem(this.mockData.passwords),
      isPro: faker.datatype.boolean()
    };
    const comments = generateRandomValue(0, Setting.MAX_COMMENTS_VALUE);
    const location = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      zoom: Setting.OFFER_LOCATION_ZOOM
    };

    return [
      id,
      title,
      type,
      price,
      city.name,
      city.location.latitude,
      city.location.longitude,
      city.location.zoom,
      location.latitude,
      location.longitude,
      location.zoom,
      isFavorite,
      isPremium,
      rating,
      previewImage,
      images,
      description,
      bedrooms,
      maxAdults,
      goods,
      host.name,
      host.password,
      host.email,
      host.isPro,
      host.avatar,
      comments,
      date
    ].join('\t');
  }
}

