//import { Component } from '@angular/core';
import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-adjustment-dashboard',
  templateUrl: './adjustment-dashboard.component.html',
  styleUrls: ['./adjustment-dashboard.component.scss']
})

export class AdjustmentDashboardComponent implements AfterViewInit {

  kpis = [
    { label: 'Total Returns', value: 124, class: 'text-danger' },
    { label: 'Total Exchanges', value: 87, class: 'text-primary' },
    { label: 'Customer Paid', value: 45200, class: 'text-success' },
    { label: 'Store Paid', value: 19800, class: 'text-danger' }
  ];

  ngAfterViewInit() {
    this.loadBarChart();
    this.loadPieChart();
    this.loadLineChart();
  }

  loadBarChart() {
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          {
            label: 'Returns',
            data: [1200, 800, 950, 1100, 700, 600]
          },
          {
            label: 'Exchanges',
            data: [1500, 1000, 1300, 900, 1200, 1400]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  loadPieChart() {
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Customer Pay', 'Store Pay', 'Even'],
        datasets: [{
          data: [55, 35, 10]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  loadLineChart() {
    new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [{
          label: 'Net Amount',
          data: [500, -200, 300, 0, -150, 400, 250],
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}


