import { Component } from '@angular/core';
import { AgenciesOverviewService } from './overview.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { EstatelistModel } from '../../grid/grid.model';
import { agentlistdata } from '../../agent/list/data';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { latLng, tileLayer, polygon, marker, circle } from 'leaflet';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [AgenciesOverviewService, DecimalPipe]
})

// Overview Component
export class OverviewComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  agentOverviewCharts: any;

  products: any;
  agents: any;
  estateList!: Observable<EstatelistModel[]>;
  total: Observable<number>;
  masterSelected!: boolean;

  bedroom: any;
  deleteID: any;
  currentTab: any = 'property';

  constructor(public service: AgenciesOverviewService) {
    this.estateList = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Agencies', active: true },
      { label: 'Overview', active: true }
    ];

    // Fetch Data
    // this.agents = agentlistdata;
    this.agents = agentlistdata.slice(0, 4);

    setTimeout(() => {
      this.estateList.subscribe(x => {
        this.products = Object.assign([], x);
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)
  }

  // Agent Pagination
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.agents = agentlistdata.slice(startItem, endItem);
  }

  // Change Tab Content
  changeTab(tab: string) {
    this.currentTab = tab;
  }

  /**
   * Markers Maps
   */
  markers = {
    layers: [
      tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w",
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
        }
      )
    ],
    zoom: 13,
    center: latLng(51.505, -0.09)
  };
  markersLayers = [
    circle([51.508, -0.11], { color: "#0ab39c", fillColor: "#0ab39c", radius: 500 }),
    polygon([[51.509, -0.08], [51.503, -0.06], [51.51, -0.047],], { color: "#405189", fillColor: "#405189" }),
    marker([51.5, -0.09])
  ];
}
