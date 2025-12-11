import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ArrowsChevronRightSmComponent } from "../share/arrows-chevron-right-sm/arrows-chevron-right-sm.component";
@Component({
  selector: "app-my-trips",
  templateUrl: "./my-trips.component.html",
  styleUrls: ["../../../styles.scss","./my-trips.component.scss"],
  standalone: true,
  imports: [ArrowsChevronRightSmComponent, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTripsComponent {}
