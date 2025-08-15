import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonRow,IonCol,IonGrid, IonItem, IonList, IonSelect,IonSelectOption } from '@ionic/angular/standalone';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { expression_properties, stepper } from 'src/mock/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonList, IonItem, IonHeader, IonToolbar, IonTitle, IonContent,IonGrid,IonRow,IonCol,IonSelect,IonSelectOption,ReactiveFormsModule,FormlyModule],
})
export class HomePage {
    selectedFormfields : FormlyFieldConfig []=[];
    form:FormGroup = new FormGroup({});
    model:any={};
    options: FormlyFieldConfig[] = [];


  constructor() {}

  ngOnInit(){
    this.selectedFormfields = [];
    this.options = [expression_properties,stepper];
  }

  selectForm(e:CustomEvent){
    console.log(e.detail.value);
    let id = e.detail.value;
    let selected = this.options.find(el => el.id === id);
    
    selected ? this.selectedFormfields = [selected] : this.selectedFormfields = [];
     
  }
}
