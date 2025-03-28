import { Component, OnInit } from '@angular/core';
import { Collection, Item } from '../../models/objects';
import { DataService } from '../../services/data.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-expenses',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DecimalPipe,
  ],
  templateUrl: './all-expenses.component.html',
  styleUrl: './all-expenses.component.scss'
})
export class AllExpensesComponent implements OnInit{
  items: Item[] = [];
  collections: Collection[] = [];
  errorMessage: string = '';

  constructor(
    private dataService: DataService,
  )
  {}

    public _name: string = '';
    public _amount: number = 0.00;
    public _origin: string = '';
    public _comment: string = '';

  ngOnInit(): void{
    this.getItems();
    this.getCollections();
  }

  getItems(): void {
    this.items = [];
    this.dataService.getItems().subscribe({
      next: (result) => {
        result.forEach(r => {
          this.items.push(r as Item);      
        });
      },
      error: (err) => {
        this.errorMessage = err;
        console.log(this.errorMessage);
      }
    });
    console.log(this.items)
  }
  
  getCollections(): void {
    this.collections = [];
    this.dataService.getCollections().subscribe({
      next: (result) => {
        result.forEach(r => {
          this.collections.push(r as Collection);
        });
      },
      error: (err) => {
        this.errorMessage = err;
        console.log(this.errorMessage);
      }
    });
  }

  getCollectionName(id: number): string{
    if(id){
      const collection = this.collections.find(x => x.id == id);
      if(collection){
        return collection.name;
      }
      return "";
    }
    return "";
  }


  getTotals(): number{
    let total: number = 0;
    this.items.forEach(item => {
      if (item.amount != null){
      total = total + item.amount;
      }
    });
    return total;
  }
}
