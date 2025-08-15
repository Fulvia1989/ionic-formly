import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonRadio, IonRadioGroup, IonSearchbar, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BehaviorSubject, debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';

@Component({
  selector: 'search-select',
  standalone:true,
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss'],
  imports:[IonModal,IonHeader,
    IonRadioGroup,
    IonRadio,
    IonToolbar,
    IonButtons,IonButton,IonTitle,
    IonSearchbar,
    IonContent,
    IonList,IonItem,
    IonIcon,

    FormsModule,AsyncPipe,ReactiveFormsModule]
})
export class SearchSelectComponent  implements OnInit {

  modal = false;
  filter:string = '';

  @Input() header = '';
  @Input() defaultLabel = 'Seleziona';

  @Input() limit = 20;

  @Input() internalFilter = true;

  @Input() trackBy = 'uuid';

  @Input() set selected(selected: any) {
    if (selected) {
      if(typeof(selected)=='string'){
        this.selectedOption = this.availableOptions.find(el => el[this.trackBy] == selected);
      }else{
        this.selectedOption = this.availableOptions.find(el => el[this.trackBy] == selected[this.trackBy]);
      }
      //setTimeout(() => this.cdr.detectChanges(), 5);
    } else {
      this.selectedOption = null;
    }
  }

  availableOptions: any[] = [];
  prevAvailableOptions: any[] = [];

  @Input() set setAvailableOptions(availableOptions: any[]) {
    if (availableOptions) {
      this.availableOptions = availableOptions;
      this.filteredOptions.next(availableOptions.slice(0, this.limit));
    } else {
      this.availableOptions = [];
    }
  }

  @Input() filterFields: string[] = [];
  @Output() selectedOptionChanged = new EventEmitter<any>();
  @Output() onFilter = new EventEmitter<any>();

  selectedOption: { [x: string]: any; } | null = null;

  search = new UntypedFormControl(null);


  filteredOptions = new BehaviorSubject<any>([]);
  filteredOptions$ = this.filteredOptions.asObservable().pipe(
    tap((res) => {
        this.selectedOption = res.find((item:any) => this.selectedOption ? item[this.trackBy] === this.selectedOption[this.trackBy] :null);

    setTimeout(() => this.cdr.detectChanges(), 5);
  }));

  valueChanges$ = this.search.valueChanges.pipe(
    startWith(''),
    distinctUntilChanged(),
    debounceTime(500),
    tap((value: string) => {

      if(this.internalFilter) {
        if (value === '') {
          this.filteredOptions.next(this.availableOptions?.slice(0, this.limit));
        } else {
          this.filteredOptions.next(
              this.availableOptions.filter(option => {
                let queryToSearch = '';
                this.filterFields.forEach(field => queryToSearch += option[field] + ' ');
                return queryToSearch?.toLowerCase().includes(value.toLowerCase());
              })?.slice(0, this.limit)
          );
        }
      } else {
        this.onFilter.emit(value);
      }


    }));

  constructor(
      private cdr: ChangeDetectorRef
  ) {
  }

  getLabel(option: { [x: string]: string; }) {
    let label = '';
    for (let i = 0; i < this.filterFields.length - 1; i++) {
      label += option[this.filterFields[i]] + ' - ';
    }
    label += option[this.filterFields[this.filterFields.length - 1]];
    return label;
  }

  ngOnInit() {
    this.valueChanges$.subscribe();
  }
  handleInput(e:any){
    this.filter = e.target.value.toLowerCase();
    if (this.filter === '') {
      this.filteredOptions.next(this.availableOptions?.slice(0, this.limit));
    } else {
      this.filteredOptions.next(
          this.availableOptions.filter(option => {
            let queryToSearch = '';
            this.filterFields.forEach(field => queryToSearch += option[field] + ' ');
            return queryToSearch?.toLowerCase().includes(this.filter);
          })?.slice(0, this.limit)
      );
    }
  }

  async toggleModal(show = true) {
    if(!show) {
      this.search.patchValue('');
    }
    this.modal = show;
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  onSelect(event: any) {
    this.selectedOption = event;
    this.selectedOptionChanged.emit(this.selectedOption);
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  ngDoCheck() {
    if (JSON.stringify(this.availableOptions) !== JSON.stringify(this.prevAvailableOptions)) {
      this.updateSelection();
      this.prevAvailableOptions = [...this.availableOptions];
    }
  }

  updateSelection(): void {
    if (this.selectedOption) {
      const found = this.availableOptions.find(option => this.selectedOption ? option[this.trackBy] === this.selectedOption[this.trackBy] : null); // adjust this line based on how you compare your options
      if (found) {
        this.selectedOption = found;
      }
    }
  }

  onSearchChange(event: any) {
    this.search.patchValue(event.detail.value);
  }
}


