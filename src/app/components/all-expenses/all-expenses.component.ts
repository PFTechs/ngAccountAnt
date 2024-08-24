import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/objects';
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
  }

  getItems(): void {
    this.items = [];
    this.dataService.getItems().subscribe({
      next: (result) => {
        result.forEach(r => {
          this.items.push(r as Item);
          console.log(r as Item);
      
        });
      },
      error: err => this.errorMessage = err
    });
    console.log(this.items)
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
