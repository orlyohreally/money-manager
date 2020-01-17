import { Injectable } from '@angular/core';
import { ImageAsset } from '@shared/types';

@Injectable({
  providedIn: 'root'
})
export class ImageAssetService {
  public imageAssets: ImageAsset[];
  constructor() {
    this.imageAssets = [
      {
        _id: '1',
        category: 'payment-subject',
        path: 'assets/payment-subjects-icons/apartment.png'
      },
      {
        _id: '2',
        category: 'payment-subject',
        path: 'assets/payment-subjects-icons/dancing.png'
      },
      {
        _id: '3',
        category: 'payment-subject',
        path: 'assets/payment-subjects-icons/electricity.png'
      },
      {
        _id: '4',
        category: 'payment-subject',
        path: 'assets/payment-subjects-icons/film-reel.png'
      },
      {
        _id: '4',
        category: 'payment-subject',
        path: 'assets/payment-subjects-icons/water.png'
      },
      {
        _id: '4',
        category: 'payment-subject',
        path: 'assets/payment-subjects-icons/pets.png'
      }
    ];
  }

  public getImageAssetsByCategory(category: string): ImageAsset[] {
    return this.imageAssets.filter(image => image.category === category);
  }
}
