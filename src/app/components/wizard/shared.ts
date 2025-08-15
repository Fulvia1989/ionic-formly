import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class State {

  private disableButton = new BehaviorSubject<boolean>(false);
  disableButton$ = this.disableButton.asObservable();

  private currentIndex = new BehaviorSubject<number>(0);
  currentIndex$ = this.currentIndex.asObservable();

  setDisableButton(value:boolean){
    this.disableButton.next(value);
  }

  setCurrentIndex(value:number){
    this.currentIndex.next(value);
  }
  
}
