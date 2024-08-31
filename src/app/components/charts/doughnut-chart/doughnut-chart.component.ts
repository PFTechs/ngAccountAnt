import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { NewExpensesComponent } from '../../new-expenses/new-expenses.component';
import { Collection, Item } from '../../../models/objects';
import { DataService } from '../../../services/data.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [
    DecimalPipe,
  ],
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.scss',
})
export class DoughnutChartComponent implements OnInit, OnChanges {
  @Input() paid: number | null = null;
  @Input() outstanding: number | null = null;
  public chart: any = null;
  collections: Collection[] = [];

  constructor(
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.createChart();
  }



  ngOnChanges(changes: SimpleChanges): void {
    if(changes['paid'].firstChange == false){
    this.chart.data.datasets[0].data = [changes['paid'].currentValue, changes['outstanding'].currentValue];
    this.chart.update();
    }
  }

  createChart() {

    this.chart = new Chart("Totals", {
      type: 'doughnut', //this denotes the type of chart

      data: {// values on X-Axis

        datasets: [{
          label: 'Amount',
          data: [this.paid, this.outstanding],
          backgroundColor: [
            'grey',
            'black',
          ],
          hoverOffset: 4
        }],
        labels: ['Paid', 'Outstanding'],
      },
      options: {
        aspectRatio: 1
      }

    });
  }

  // getCollections(): void {
  //   this.dataService.getCollections().subscribe({
  //     next: (result: Collection[]) => {
  //       this.collections = result;
  //       console.log(this.collections);
  //       this.createChart();
  //     }
  //   })
  // }

  // public getAllCollectionFigures(type: string): number{
  //   let result: number = 0;
  //   this.collections.forEach((collection: Collection) => {
  //     collection.items.forEach((item: Item) => {
  //       switch(type){
  //         case 'paid':
  //           if(item.paid)
  //             result = result + item.amount;
  //           break;
  //         case 'outstanding':
  //           if(!item.paid)
  //             result = result + item.amount;
  //           break;
  //         case 'totals':
  //             result = result + item.amount;
  //           break;
  //         default:
  //           break;
  //       }
  //     });
  //   });
  //   return result;
  // }


}
