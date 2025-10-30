import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ObjectsThingsBrightnessComponent } from "../share/objects-things-brightness/objects-things-brightness.component";
import { ObjectsThingsCalendarAltComponent } from "../share/objects-things-calendar-alt/objects-things-calendar-alt.component";
import { NavigationTransportationMapMarkerComponent } from "../share/navigation-transportation-map-marker/navigation-transportation-map-marker.component";
import { ArrowsChevronRightSmComponent } from "../share/arrows-chevron-right-sm/arrows-chevron-right-sm.component";
@Component({
  selector: "app-trip",
  templateUrl: "./trip.component.html",
  styleUrls: ["./trip.component.scss"],
  standalone: true,
  imports: [
    ObjectsThingsBrightnessComponent,
    ObjectsThingsCalendarAltComponent,
    NavigationTransportationMapMarkerComponent,
    ArrowsChevronRightSmComponent,
    FormsModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripComponent {

}
