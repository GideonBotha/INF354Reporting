import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js';
import { mergeMap, groupBy, map, reduce, max } from 'rxjs/operators';
import { of } from 'rxjs';
import { ReportService } from './services/report.service';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'INF354Reporting';
 
  isLoading = false;
  chart: Chart;
  employees: Object = null;
  options = [
    { id: "UK", text: "UK" },
    { id: "USA", text: "USA" },
    { id: "ALL", text: "All Countries" }
  ]
  selection: String = "ALL";
  constructor(private reporting: ReportService) { }

  colorGenerator() { //generates dem pwetty colours
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ', 0.7)';
    console.log(o);
  }

  DownloadPDF() {
    this.isLoading = true;
    this.reporting.getReportingData(this.selection).subscribe((res) => {
     
      var doc = new jsPDF();
      

      var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

      let length = res['TableData'].length;
      let keys = res['TableData'].map(z => z.Key);
      let totals = res['TableData'].map(z => z.TotalOrders);


      var finalY = 160;

      var newCanvas = <HTMLCanvasElement>document.querySelector('#canvas');

      var newCanvasImg = newCanvas.toDataURL("image/png", 1.0);

      //styling of actual pdf
      doc.setFontSize(40);

      doc.text("Total Orders Report", (pageWidth / 2) - 45, 15);
      doc.addImage(newCanvasImg, 'PNG', 25, 25, 160, 150);
      doc.setFontSize(14);
      for (let i = 0; i < length; i++) {
        doc.text(keys[i] + " (Total Orders: "+ totals[i] +")", (pageWidth/2)-35, finalY+23); //keys[i]+ " (Total Orders: " + totals[i] + ")", (pageWidth / 2) - 35, yaxis + 23
       // @ts-ignore
        doc.autoTable({
          startY: finalY + 25, html: '#test' + i, useCss: true, head: [
            ['Customer', 'Shipping Address']]})
            // @ts-ignore
            finalY = doc.autoTable.previous.finalY;
      }

      doc.save('AdvancedReport.pdf');
      this.isLoading = false;
    });
  }

  submitReport() {
    if (this.chart) this.chart.destroy();
    this.isLoading = true;
    this.reporting.getReportingData(this.selection).subscribe(r => {
      console.log(r);

      let keys = r["ChartData"].map(d => d.Name);
      let vals = r["ChartData"].map(d => d.TotalOrders);

      this.employees = r["TableData"];

      Chart.defaults.global.defaultFontColor = 'white';
      Chart.defaults.global.defaultFontSize = 17;

      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: keys,
          datasets: [
            {
              data: vals,
              borderColor: "black",
              fill: true,
              backgroundColor: [
                this.colorGenerator(),
                this.colorGenerator(),
                this.colorGenerator(),
                this.colorGenerator()
              ]
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: "Total orders by Country"
          },
          scales: {
            xAxes: [{
              display: true,
              barPercentage: 0.75
            }],
            yAxes: [{
              display: true,
              ticks: {
                min: 0,
                max: 3000
              }
            }]
          }
        }
      })
    }, error => { console.log("ERROR") }, () => this.isLoading = false)
  }




}
