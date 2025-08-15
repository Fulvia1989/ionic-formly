import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ContentChildren, effect, EventEmitter, inject, input, Input, NgZone, OnInit, Output, QueryList, signal } from '@angular/core';
import { StepComponent } from './step/step.component';
import { merge, startWith, Subscription, takeUntil } from 'rxjs';
import { IonButton, IonCol, IonGrid, IonIcon, IonRow } from '@ionic/angular/standalone';
import { DestroyService } from './destroy';
import {  State } from './shared';

@Component({
  selector: 'wizard',
  standalone:true,
  providers:[DestroyService],
  imports:[IonButton,IonIcon,IonRow,IonCol,IonGrid],
  template:`
    <div class="toolbar">
      <ion-grid>
        <ion-row class="ion-align-items-center">
          <ion-col size="2" class="ion-no-padding flex ion-justify-content-start">
            @if (currentIndex() !==0) {
              <ion-button (click)="pre()" color="secondary"  shape="round" >
                <ion-icon name="chevron-back-outline" slot="icon-only" ></ion-icon>
              </ion-button>
            }
          </ion-col>
          <ion-col size="8">
            <label>
              <span class="badge" [class.completed]="!disabledButton">{{currentIndex()+1}}</span>
              <h3 class="title">{{title()}}</h3>
            </label>

          </ion-col>
          <ion-col size="2" class="ion-no-padding flex ion-justify-content-end">
            @if(this.steps && currentIndex()!== this.steps.length-1){
              <ion-button (click)="next()" [disabled]="disabledButton" color="secondary" fill="clear" shape="round">
                <ion-icon name="chevron-forward-outline" slot="icon-only"></ion-icon>
              </ion-button>
            }
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>




    <ng-content></ng-content>
  `,
  styles:[
    `
    .flex{
      display:flex;
    }
    .toolbar{
      box-sizing:border-box;
      margin-bottom:1rem;
      ion-icon{
        font-size: 24px;
      }
      label{
        font-size:large;
        display:flex;
        align-items:center;
        justify-content:center;
        h3{
          margin:0;
          font-size:1.2rem;
        }
        .badge{
          padding:0.3rem;
          background-color:var(--ion-color-medium);
          color:var(--ion-color-medium-contrast);
          margin-right:1rem;
          border-radius:50%;
          height:2rem;
          width:2rem;
          text-align:center;
          transition: all .2 ease-in-out;
          &.completed{
            background-color:var(--ion-color-primary);
            color:var(--ion-color-primary-contrast);
          }
        }
      }
    }
    `
    ]

})
export class WizardComponent  implements OnInit {

  currentIndex = signal<number>(0);
  disabledButton = false;
  @Output() readonly indexChange = new EventEmitter<number>();
  
  stateService = inject(State);
  destroy = inject(DestroyService);
  cdr = inject(ChangeDetectorRef);

  title = computed(() => this.steps.get(this.currentIndex())?.title);
  
  @ContentChildren(StepComponent) steps!: QueryList<StepComponent>;

  constructor() {}

  ngOnInit() {
    this.stateService.disableButton$.subscribe(res => {
      this.disabledButton = res;
    });
    this.stateService.currentIndex$.subscribe(res => {
      this.updateChildrenSteps();
    })  
  }

  ngAfterContentInit(): void {

      this.steps.changes.pipe(startWith(null), takeUntil(this.destroy)).subscribe((res) => {
        this.updateChildrenSteps();
        //this.cdr.markForCheck();

      });
    
  }
 pre(): void {
    this.currentIndex.set(this.currentIndex() - 1) ;
    this.stateService.setCurrentIndex(this.currentIndex());
  }

  next(): void {
    if(this.currentIndex()<this.steps.length){

      this.currentIndex.set(this.currentIndex() + 1) ;
      this.stateService.setCurrentIndex(this.currentIndex());

    }
  }


  private updateChildrenSteps(): void {
    if (this.steps) {

      this.steps.toArray().forEach((step, index) => {
        step.index = index ;
        //step.currentIndex.set(this.currentIndex());
        step.hidden = this.currentIndex() !==index;
        step.markForCheck();
      });
    }
  }
}
