import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-objects-things-calendar-alt",
  templateUrl: "./objects-things-calendar-alt.component.html",
  styleUrls: ["./objects-things-calendar-alt.component.scss"],
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectsThingsCalendarAltComponent {}