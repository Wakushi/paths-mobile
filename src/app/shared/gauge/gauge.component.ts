import { Component } from '@angular/core';
import { GaugesService } from 'src/app/core/services/gauges.service';
import { ItemService } from 'src/app/core/services/items.service';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss'],
})
export class GaugeComponent {
  constructor(
    public gaugesService: GaugesService,
    public itemService: ItemService,
  ) {}
}
