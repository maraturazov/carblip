import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ImageLoadService {
  constructor() {}

  loadImage(imagePath: string): Observable<any> {
    return Observable.create(function(observer) {
      const img = new Image();
      img.src = imagePath;
      img.onload = function() {
        observer.next(img);
      };
      img.onerror = function(err) {
        observer.error(err);
      };
    });
  }

  loadImages(imagePaths: string[]) {
    const images: Array<Observable<any>> = [];
    imagePaths.forEach(imagePath => {
      images.push(this.loadImage(imagePath));
    });
    return combineLatest(images);
  }
}
