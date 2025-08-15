import { Component } from "@angular/core";
import { FieldType, FieldTypeConfig, FormlyModule } from "@ngx-formly/core";
import { IonCheckbox, IonRow, IonCol } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector:'simple-checkbox',
  standalone:true,
  imports:[IonCheckbox,ReactiveFormsModule,FormlyModule,IonRow,IonCol],
  template:`
    <ion-row>
      <ion-col>
        <ion-checkbox
        [labelPlacement]="field.props['labelPlacement'] ? field.props['labelPlacement'] : 'start'"
        justify="space-between"
        [formControl]="formControl"
        [formlyAttributes]="field"
        >{{field.props.label}}</ion-checkbox>
      </ion-col>
    </ion-row>


  `,
  styles:[
    `
    `
  ]
})

export class SimpleCheckboxType  extends FieldType<FieldTypeConfig>  {
  ngOnInit(){

    if(this.field.props['defaultValue']){
      let value = this.field.props['defaultValue'];
      this.formControl.setValue(value);
    }else if(this.field.props['binary']){

      this.formControl.setValue(false);
    };
  }

}
