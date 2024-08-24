import { Component, inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ViewRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Collection, Item } from '../../models/objects';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faInfo, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new-expenses',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DecimalPipe,
    FormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './new-expenses.component.html',
  styleUrl: './new-expenses.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [],
})
export class NewExpensesComponent implements OnInit {
  private offCanvasService = inject(NgbOffcanvas);
  public expenseSheetOffCanvas: NgbOffcanvasRef | null = null;

  collections: Collection[] = [];
  collectionId: number = 0;
  collectionName: string = '';
  collectionIndex: number = 0;

  edit: boolean = false;

  changes: boolean = false;

  newCollection: Collection | null = null;
  items: Item[] = [];
  newItem: Item | null = null;
  errorMessage: string | null = null;

  faTrash: IconDefinition;
  faInfo: IconDefinition;
  faClose: IconDefinition;

  constructor(
    private dataService: DataService,
  ) {

    this.faTrash = faTrash;
    this.faInfo = faInfo;
    this.faClose = faClose;
  }

  @ViewChild('expenseSheet', { read: TemplateRef }) expenseSheet!: TemplateRef<any>;

  openExpenseSheet(): void {
    this.expenseSheetOffCanvas = this.offCanvasService?.open(this.expenseSheet, {
      position: 'end',
      backdrop: 'static',
      panelClass: 'offcanvas-w95',
      ariaLabelledBy: 'Expense Sheet OffCanvas',
    });
  }

  close(): void {
    if (this.changes) {
      if (confirm(
        'Are you sure you wish to leave without finalising this expense sheet?\nAll your items will be lost'
      )) {
        this.expenseSheetOffCanvas?.close();
        if (this.edit) {
          this.edit = false;
          this.collectionId = 0;
          this.collectionName = '';
          this.items = [];
        }
      } else {
        return;
      }
    } else {
      this.expenseSheetOffCanvas?.close();
      if (this.edit) {
        this.edit = false;
        this.collectionId = 0;
        this.collectionName = '';
        this.items = [];
      }
    }
  }

  ngOnInit(): void {
    this.getCollections();
  }

  getCollections(): void {
    this.dataService.getCollections().subscribe({
      next: (result: Collection[]) => {
        this.collections = result;
        console.log(this.collections);
      }
    })
  }


  togglePaid(index: number): void {
    if (this.items[index].id !== 0) {
      this.items[index].paid = !this.items[index].paid;
      this.dataService.updateItem(this.items[index]).subscribe({
        next: (result) => {
          console.log(result);
        }
      })
    }
  }

  removeItem(index: number): void {
    if (this.items[index].id !== 0) {
      this.dataService.deleteItem(this.items[index].id).subscribe({
        next: (result) => {
          console.log(result);
        }
      })
    }

    this.items?.splice(index, 1)
  }

  public _name: string = '';
  public _amount: number = 0.00;
  public _origin: string = '';
  public _paid: boolean = false;
  public _comment: string = '';

  addExpense(): void {
    this.changes = true;
    this.newItem = new Item(0, this._name, this._amount, this._origin, this._paid, this._comment);

    if (this.items == undefined) {
      this.items = [];
    }
    if (this.newItem)
      this.items.push(this.newItem);

    this._name = '';
    this._amount = 0.00;
    this._origin = '';
    this._paid = false;
    this._comment = '';
    // reload
    // window.location.reload();
  }

  submit(): void {
    this.newCollection = new Collection(this.collectionId, this.collectionName, this.items);

    if (!this.edit && this.changes) {
      this.collections.push(this.newCollection);

      this.dataService.postCollection(this.newCollection).subscribe({
        next: (results) => {
          console.log(results as Item[]);
        },
        error: err => this.errorMessage = err
      });
      console.log(this.items)
    }
    if (this.edit) {
      // Adding new items to collection
      let itemsToAdd: Item[] = [];
      this.items.forEach((item: Item) => {
        if (item.collectionId == 0) {
          item.collectionId = this.collectionId;
          itemsToAdd.push(item);
        }
      })
      if (itemsToAdd.length) {
        this.dataService.postItem(itemsToAdd).subscribe({
          next: (results) => {
            console.log(results);
          },
          error: err => this.errorMessage = err
        });
      }
      this.dataService.updateCollection(this.newCollection).subscribe({
        next: (result) => {
          console.log(result);
        }
      })
      this.collections[this.collectionIndex].name = this.collectionName;
      this.edit = false;
      this.changes = false;
      this.collectionId = 0;
      this.collectionName = '';
      this.collectionIndex = 0;
      this.items = [];
    }
    this.expenseSheetOffCanvas?.close();
  }

  getTotals(): number {
    if (this.items != undefined) {
      let total: number = 0;
      this.items.forEach(item => {
        if (item.amount != null) {
          total = total + item.amount;
        }
      });
      return total;
    }
    return 0;
  }


  getPaidTotals(): number {
    if (this.items != undefined) {
      let total: number = 0;
      this.items.forEach(item => {
        if (item.amount !== null && item.paid) {
          total = total + item.amount;
        }
      });
      return total;
    }
    return 0;
  }

  getOutstandingTotals(): number {
    if (this.items != undefined) {
      let total: number = 0;
      this.items.forEach(item => {
        if (item.amount !== null && !item.paid) {
          total = total + item.amount;
        }
      });
      return total;
    }
    return 0;
  }

  editCollection(collection: Collection, index: number): void {
    this.collectionId = collection.id;
    this.collectionName = collection.name;
    this.collectionIndex = index;
    this.items = collection.items;
    this.edit = true;
    this.changes = false;
    this.openExpenseSheet();
  }

  public getDistinctOrigins(): string[] {
    let results: string[] = [];
    this.items.forEach((item: Item) => {
      if (!results.some(x => x === item.origin)) {
        results.push(item.origin);
      }
    })
    return results;
  }

  public getOriginLenght(origin: string): number {
    let results: number = 0;
    this.items.forEach((item: Item) => {
      if (item.origin === origin) {
        results++;
      }
    })
    return results;
  }

  getCollectionPaidTotals(collection: Collection): number {
    let result: number = 0;
    collection.items.forEach((item: Item) => {
      if(item.paid)
      result = result + item.amount;
    })
    return result;
  }

  getCollectionOutstandingTotals(collection: Collection): number {
    let result: number = 0;
    collection.items.forEach((item: Item) => {
      if(!item.paid)
      result = result + item.amount;
    })
    return result;
  }

  getCollectionTotals(collection: Collection): number {
    let result: number = 0;
    collection.items.forEach((item: Item) => {
      result = result + item.amount;
    })
    return result;
  }

getAllCollectionFigures(type: string): number{
  let result: number = 0;
  this.collections.forEach((collection: Collection) => {
    collection.items.forEach((item: Item) => {
      switch(type){
        case 'paid':
          if(item.paid)
            result = result + item.amount;
          break;
        case 'outstanding':
          if(!item.paid)
            result = result + item.amount;
          break;
        case 'totals':
            result = result + item.amount;
          break;
        default:
          break;
      }
    });
  });
  return result;
}

// Used in Collection Dashboard - Origin Totals
getAllCollectionTotals(origin: string, type: string): number{
  let result: number = 0;
  this.collections.forEach((collection: Collection) => {
    collection.items.forEach((item: Item) => {
      switch(type){
        case 'paid':
          if(item.origin === origin && item.paid)
            result = result + item.amount;
          break;
        case 'outstanding':
          if(item.origin === origin && !item.paid)
            result = result + item.amount;
          break;
        case 'totals':
          (item.origin === origin)
            result = result + item.amount;
          break;
        default:
          break;
      }
    });
  });
  return result;
}

  public getOriginTotals(origin: string): number {
    let results: number = 0
    this.items.forEach((item: Item) => {
      if (item.origin === origin) {
        results = results + item.amount;
      }
    })
    return results;
  }

  public getOriginOutstandingTotals(origin: string): number {
    let results: number = 0
    this.items.forEach((item: Item) => {
      if (item.origin === origin && !item.paid) {
        results = results + item.amount;
      }
    })
    return results;
  }

  public getOriginPaidTotals(origin: string): number {
    let results: number = 0
    this.items.forEach((item: Item) => {
      if (item.origin === origin && item.paid) {
        results = results + item.amount;
      }
    })
    return results;
  }

  public getAllDistinctOrigins(): string[] {
    let results: string[] = [];
    this.collections.forEach((collection: Collection) => {
      collection.items.forEach((item: Item) => {
        if (!results.some(x => x === item.origin)) {
          results.push(item.origin);
        }
      })
    })
    return results;
  }

    public getAllOriginsLength(origin: string): number {
      let results: number = 0;
      this.collections.forEach((collection: Collection) => {
        collection.items.forEach((item: Item) => {
          if (item.origin === origin) {
            results++;
          }
      });
    });
    return results;
  }

  deleteCollection(i: number, collection: Collection): void {
    if (confirm(
      'Are you sure you wish to delete this expense sheet?\nIt cannot be restored'
    )) {
      this.dataService.deleteCollection(collection.id).subscribe({
        next: (results) => {
          console.log(results);
        },
        error: err => this.errorMessage = err
      });

      collection.items.forEach((item: Item) => {
        this.dataService.deleteItem(item.id).subscribe({
          next: (results) => {
            console.log(results);
          },
          error: err => this.errorMessage = err
        });
      })
      this.collections.splice(i, 1);
    }
  }
}