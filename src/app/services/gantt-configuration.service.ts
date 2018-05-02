import { Injectable } from '@angular/core';

@Injectable()
export class GanttConfiguration {
  public cellWidth: number = 86;
  public rowHeight: number = 40;
  public graphHeight: number = 480;
  public barHeight = 35;
  public barLineHeight = 30;
  public cellWidthIn: number = 46; //šírka cellu pri zoomu !!! - o 40px menej nez original
}
