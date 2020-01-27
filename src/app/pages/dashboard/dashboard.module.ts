import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { ChartsModule } from 'ng2-charts';

import { Dashboard } from './dashboard.component';
import { routing } from './dashboard.routing';

import { DashboardService } from './dashboard.service';

import { LineChartComponent } from "./linechart/linechart.component";
import { BarChartComponent } from "./barchart/barchart.component";
import { DoughNutChartComponent } from "./doughnutchart/doughnutchart.component";
import { RadarChartComponent } from "./radarchart/radarchart.component";
import { PieChartComponent } from "./piechart/piechart.component";
import { PolarAreaChartComponent } from "./polarareachart/polarareachart.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ChartsModule
  ],
  declarations: [
    Dashboard,
    
    LineChartComponent,
    BarChartComponent,
    DoughNutChartComponent,
    RadarChartComponent,
    PieChartComponent,
    PolarAreaChartComponent
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
