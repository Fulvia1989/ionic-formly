import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, ElementRef, inject, input, Input, model, signal, SimpleChanges, ViewChild } from '@angular/core';
import { State } from '../shared';

@Component({
  selector: 'step',
  standalone:true,
  imports:[],
  template: `
    <div #itemContainer  [hidden]="hidden">

      <ng-content select="[stepContent]"></ng-content>
    </div>
  `,
  styles: [],
})
export class StepComponent {
  @Input() title?: string;
  private _disableButton:boolean = false;
  @Input() 
  set disableButton(value){
    this._disableButton = value;
    this.stateService.setDisableButton(this.disableButton);
  }
  get disableButton(){
    return this._disableButton;
  }  
  hidden:boolean=false;
  index = 0;
  last:boolean=false;

  stateService = inject(State);
  cdr = inject(ChangeDetectorRef);

  @ViewChild('itemContainer') itemContainer!: ElementRef<HTMLElement>;


  constructor(
  ) {}

  ngOnInit() {
    this.stateService.currentIndex$.subscribe(current => {
      if(this.index===current){
        this.stateService.setDisableButton(this.disableButton);
      }
    })
  }


  markForCheck(): void {
    this.cdr.markForCheck();
  }

}
