import { SlicePipe } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit, signal } from "@angular/core";
import { IonCol, IonGrid, IonRow } from "@ionic/angular/standalone";
import { FieldType, FormlyModule } from "@ngx-formly/core";
import { WizardComponent } from "../components/wizard/wizard.component";
import { StepComponent } from "../components/wizard/step/step.component";


@Component({
  selector:'stepper',
  standalone:true,
  imports:[
    FormlyModule,WizardComponent,StepComponent,IonGrid,IonRow,IonCol,
    SlicePipe
  ],
  template:`
    <wizard>
      @for (step of (field.fieldGroup | slice:1); track $index;let i = $index) {
        <step [title]="step.props?.label ?? 'Step '+($index+1)" [disableButton]="step.formControl?.invalid ?? false">
            <div class="flex flex-col" stepContent>
              <formly-field [field]="step"></formly-field>
            </div>

        </step>

      }
      <step [title]="'Summary'">
              <div stepContent>
                <ion-grid>
                  <ion-row >
                    <ion-col>
                      <span class="title">Service:</span>
                    </ion-col>
                    <ion-col class="content">
                      <span >{{field.form?.value['service_selection'].service_code}}</span>
                    </ion-col>
                  </ion-row>
                  <ion-row >
                    <ion-col class="note" size="9" offset="1">
                      <span>Moving more than 4 offices? </span>
                    </ion-col>
                    <ion-col size="2" class="note">
                      <span>{{field.form?.value['service_selection'].more_four_sites ? 'YES' : 'NO'}}</span>
                    </ion-col>
                  </ion-row>
                  <ion-row >
                    <ion-col>
                      <span class="title">Address From:</span>
                    </ion-col>
                    <ion-col class="content">
                      <span>{{field.form?.value['site_selection'].from_site_code}}</span>

                    </ion-col>
                  </ion-row>
                  <ion-row >
                    <ion-col>
                      <span class="title">Address To:</span>
                    </ion-col>
                    <ion-col class="content">
                      <span>{{field.form?.value['site_selection'].to_site_code}}</span>
                    </ion-col>
                  </ion-row>
                  <ion-row >
                    <ion-col>
                      <span class="title">Estimate Date:</span>
                    </ion-col>
                    <ion-col class="content">
                      <span>{{field.form?.value['site_selection'].possible_date}}</span>
                    </ion-col>
                  </ion-row>
                  <ion-row >
                    <ion-col>
                      <ion-row>
                        <span class="title">Selected forniture:</span>
                      </ion-row>
                        @for(item of field.form?.value['object_selection'];track $index){
                          <ion-row class="item-list">
                            <ion-col size="5">{{item.object_tag ?? '-'}}</ion-col>
                            <ion-col size="5">{{item.object_type ?? ' - '}}</ion-col>
                            <ion-col size="2" >{{item.object_n}}</ion-col>
                          </ion-row>
                        }
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </div>
        </step>
    </wizard>
 
  `,
  styles:[
    `
    .flex{
      display:flex;
    }
    .flex-col{
      flex-direction:column;
    }
      ion-row{
        margin-bottom: 0.5rem;

        &.item-list{
          border-radius:3px;
          border: 1px solid var(--ion-color-medium);
          border-left: 10px solid var(--ion-color-medium);

          font-size:14px;
          ion-col{
            border-bottom:none;
            &:last-child{
              text-align:right;
            }
          }
        }

      }
      ion-col{
        &.note{
          background-color:var(--ion-color-tertiary);
          font-size:smaller;
          border:none;
        }
        padding:0.5rem 0.3rem;
        border-bottom:1px solid var(--ion-color-medium);
        &.content{
          border:1px solid var(--ion-color-medium);
          border-radius:3px;
          border-bottom-left-radius:0;
          text-align:right;
        }
      }
      span{
        &.title{
          font-weight:500;
        }
      }
    `
  ]
})

export class StepperType extends FieldType implements OnInit{

  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    //console.log(this.field);

  }
  ngAfterViewInit(){
    this.cdr.detectChanges();
  }





}
