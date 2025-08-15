import { Component } from "@angular/core";
import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonRow } from "@ionic/angular/standalone";
import { FieldArrayType, FormlyFieldConfig, FormlyModule } from "@ngx-formly/core";
import { FormControl, FormControlOptions, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { SearchSelectComponent } from '../components/search-select/search-select.component';
import { forniture } from "src/mock/data";

@Component({
  selector:'object-select-type',
  standalone:true,
  imports: [
    FormlyModule,
    IonButton, IonInput,
    ReactiveFormsModule,
    IonRow, IonCol, IonIcon, IonGrid, IonCard,IonCardContent,
    SearchSelectComponent
],
  template:`

    @if(tagInput.controls && listInput.controls){

      <!-- <form [formGroup]="tagInput">

        <ion-row class="ion-align-items-center">
          <ion-col size="10">
            <app-barcode-scanner-input
            [label]="'Tag'"
            id="tag_input_object_tag"
            formControlName="object_tag"
            ></app-barcode-scanner-input>
          </ion-col>
          <ion-col size="2">

            <ion-button (click)="addElement('tag')" [disabled]="tagInput.invalid">
              <ion-icon slot="icon-only" name="add-outline"></ion-icon>
            </ion-button>
          </ion-col>

        </ion-row>
      </form> -->
      <form [formGroup]="listInput">

        <ion-row [hidden]="options.formState['externalUser']" class="ion-align-items-center">
          <ion-col size="7">
            <search-select
            defaultLabel="Seleziona da Abaco"
            header="Abaco"
            [setAvailableOptions]="optionsList"
            [filterFields]="['name']"
            [trackBy]="'name'"
            [selected]="getSelected()"
            (selectedOptionChanged)="setSelection($event)"
            ></search-select>
          </ion-col>
          <ion-col size="3">
            <ion-input
                label-placement="floating"
                label="N"
                mode="md"
                type="number"
                color="primary"
                fill="outline"
                formControlName="object_n">
            </ion-input>
          </ion-col>
          <ion-col size="2">

            <ion-button (click)="addElement('list')" [disabled]="listInput.invalid">
              <ion-icon slot="icon-only" name="add-outline"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </form>

      <div class="flex flex-col">
        @for (item of formControl.value; track $index) {
          <ion-card class="thick-border">
            <ion-card-content class="ion-no-padding">
              <ion-grid>
                <ion-row>
                  <ion-col size="8">
                    <div class="text-box">
                      <p class="label">Tipologia</p>
                      <p class="content title">{{item['object_type'] ?? ''}}</p>
                    </div>
                  </ion-col>
                  <ion-col size="4">
                    <div class="number-box">
                      <span class="icon"># </span>
                      <span>{{item["object_n"]}}</span>
                    </div>
                  </ion-col>

                </ion-row>
                <ion-row>
                  <ion-col size="10">
                    <div class="text-box">
                      <p class="label">Tag</p>
                      <p class="content">
                      {{item['object_tag'] ?? ''}}
                      </p>
                    </div>
                  </ion-col>
                  <ion-col size="2">
                    <ion-button class="ion-no-margin" color="danger" shape="round" fill="clear" (click)="remove($index)" >
                      <ion-icon slot="icon-only" name="trash-outline" ></ion-icon>
                    </ion-button>
                  </ion-col>

                </ion-row>

              </ion-grid>
            </ion-card-content>
          </ion-card>
        }

      </div>


    }

  `,
  styles:[
    `
      ion-card{
        ion-icon{
          font-size:32px;
        }
      }
      .text-box{
          p{
            margin: 0;
          }
          .label{
            font-size: .7rem;
          }
          .content{
            color: var(--ion-color-dark);
            font-size: 1rem;
            span{
              margin-left: 0.5rem;
            }
          }
          .title{
            font-size: 1.2rem;
            font-weight: 500;
          }

      }
      .number-box{
        display:flex;
        align-items:center;
        justify-content:center;
        border: 1px solid var(--ion-color-medium);
        border-radius:2px;
        font-size:1.3rem;
        .icon{
          font-size:larger;
          color:var(--ion-color-medium);

        }
      }
      .thick-border{
        border: 1px solid var(--ion-color-secondary);
        border-left: 10px solid var(--ion-color-secondary);
        padding-left:0.5rem;
      }
    `
  ]
})

export class ObjectSelectType extends FieldArrayType{
  tagInput: FormGroup = new FormGroup({});
  listInput: FormGroup = new FormGroup({});
  optionsList = forniture;

  ngOnInit() {

    let fieldGroup = (this.field.fieldArray as FormlyFieldConfig).fieldGroup;

    fieldGroup?.forEach((field:FormlyFieldConfig)=>{
      let control = new FormControl( this.initValue(field.props?.type),this.initOptions(field.props?.type,field.props?.required));
      if(field.key?.toString().indexOf('type')==-1){
        this.tagInput.addControl(field.key as string, control);
      };
      if(field.key?.toString().indexOf('tag')==-1){
        this.listInput.addControl(field.key as string, control);
      }
    });
    this.tagInput.updateValueAndValidity();
    this.listInput.updateValueAndValidity();

  }
  initValue = (type?:string) : null | number => {
    return type && type==='number' ? 1 : null
  }
  initOptions = (type?:string,isRequired:boolean=false) : FormControlOptions =>{
    return {
      validators: Validators.required,
      nonNullable: type==='number'
    }
  }
  initValidator = (isRequired:boolean=false) : ValidatorFn[] => {
    return isRequired ? [Validators.required] : []
  }
  setSelection(el:{name:string,uuid:string}){
    this.listInput.patchValue({object_type: el.name});
  }
  getSelected(){
    return this.listInput.controls['object_type'].value;
  }
  addElement(from:'tag'|'list'){
    let i = (this.formControl.value).length;
    let newValue;
    if(from === 'tag') {
      newValue = this.tagInput.value;
      this.tagInput.reset();
    } else{
      newValue = this.listInput.value;
      this.listInput.reset();

    }
    this.add(i,newValue);

  }
}
