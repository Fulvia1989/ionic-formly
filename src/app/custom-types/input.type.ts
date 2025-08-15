import { DatePipe, NgClass } from '@angular/common';
import { Component} from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IonInput, IonRow, IonCol, IonIcon, IonButton, IonPopover, IonDatetime, IonButtons } from '@ionic/angular/standalone';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { getMondayOfNextWeek, setTimeToMidnight } from '../shared/utils/utils';
import {v4 as uuid} from 'uuid';

export function forbiddenDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let today : Date = new Date();
    today.setHours(0,0,0,0);
    return new Date(control.value).getTime() < today.getTime() ? { minDate: { value: control.value } } : null;
  };
}
@Component({
  selector: 'simple-input',
  standalone:true,
  imports:[IonInput,FormlyModule,ReactiveFormsModule,FormsModule,IonRow,IonCol,IonIcon,NgClass,IonButton,
    IonPopover,IonDatetime,IonButtons,DatePipe
  ],
  template: `
    @if(field.props.type === 'date'){
      <ion-row>
        <ion-col>
          <ion-input
            mode="md"
            fill="outline"
            type="text"
            [readonly]="field.props.type === 'date'"
            labelPlacement="floating"
            label="{{!field.props.label ? field.key : field.props.required ? field.props.label+'*' : field.props.label}}"
            [id]="idDateInput"
            value="{{formControl.value | date : 'dd/MM/yyyy'}}"

          >

            <ion-button slot="end" fill="clear"  id="datetime" #dateTimeButton>
                <ion-icon name="calendar-outline" slot="icon-only" size="large" [ngClass]="{'error': formControl.invalid}"></ion-icon>
            </ion-button>
          </ion-input>

        </ion-col>
      </ion-row>

      <ion-popover [keepContentsMounted]="true"  trigger="datetime">
        <ng-template>
          <ion-datetime  presentation="date"
          [id]="idPopover"
          (ionChange)="updateControlValue($event)"
          [min]="minDate"
          [value]="formControl.value"
          #dateTime>
          <ion-buttons slot="buttons">
            <ion-button color="medium" (click)="dateTime.cancel(true);">Annulla</ion-button>
            <ion-button color="secondary" (click)="dateTime.reset();dateTime.confirm()">Reset</ion-button>
            <ion-button color="primary" (click)="dateTime.confirm(true)">Conferma</ion-button>
          </ion-buttons>
          </ion-datetime>
        </ng-template>
      </ion-popover>
    }@else {
      <ion-row>
        <ion-col>
          <ion-input
            fill="outline"
            mode="md"
            type="{{field.props.type ?? 'input'}}"
            labelPlacement="floating"
            label="{{!field.props.label ? field.key : field.props.required ? field.props.label+'*' : field.props.label}}"
            [id]="idSimpleInput"
            [formControl]="formControl"
            [formlyAttributes]="field"
          ></ion-input>
        </ion-col>
      </ion-row>
    }


  `,
  styles:[
    `
      ion-popover{
        --min-width:300px
      }
      .error{
        color: var(--ion-color-danger);
      }
    `
  ]
})
export class SympleInputType extends FieldType<FieldTypeConfig> {
  idSimpleInput:string = this.field.key + '_input_' +  uuid().toString();
  idDateInput:string = this.field.key + '_date_' + uuid().toString();
  idPopover:string = this.field.key + '_popover_' + uuid().toString();
  minDate = getMondayOfNextWeek(new Date());


  ngOnInit(){
    if(this.field.props && this.field.props.type === 'date'){
      this.formControl.addValidators(forbiddenDateValidator());
      this.formControl.updateValueAndValidity();
    };
  }

    updateControlValue(event:any){
      let value:string|null = event.detail ? event.detail.value as string : event as string;
        value = (value && value.length) ? setTimeToMidnight(value) : null;
      this.formControl.setValue(value);
    }

}
