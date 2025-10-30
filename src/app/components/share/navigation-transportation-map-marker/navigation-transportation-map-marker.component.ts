import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-navigation-transportation-map-marker",
  templateUrl: "./navigation-transportation-map-marker.component.html",
  styleUrls: ["./navigation-transportation-map-marker.component.scss"],
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationTransportationMapMarkerComponent {}