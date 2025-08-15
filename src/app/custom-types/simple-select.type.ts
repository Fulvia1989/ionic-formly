import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonCol, IonGrid, IonRow, IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { FieldType, FieldTypeConfig } from "@ngx-formly/core";

@Component({
  selector:'simple-select',
  standalone:true,
  imports:[IonSelect,IonSelectOption,ReactiveFormsModule,IonRow,IonCol,IonGrid],
  template:`
    <ion-grid class="ion-no-padding ion-margin-bottom">
      <ion-row>

        <ion-col size="12" class="ion-no-padding">
          <ion-select  fill="outline" toggleIcon="chevron-down-outline" interface="popover"
          [attr.aria-label]="field.props.label"
          [placeholder]="field.props.label"
          [formControl]="formControl">
            @for(option of  (listOptions); track $index){

              <ion-select-option [value]="option.value">{{option.label}}</ion-select-option>

            }
          </ion-select>

        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles:[
    `
      ion-select{
        &::part(icon){
          font-size:18px!important;
          width:18px!important;
          position: absolute;
          right: var(--padding-end);
        }
        &::part(container) {
          width: 100%;
        }

      }

    `
  ]
})

export class SimpleSelectType extends FieldType<FieldTypeConfig>{
  listOptions:any[] = [];
  ngOnInit(){
    this.listOptions = this.field.props.options as Array<{value:any,label:string}>
  }
}
