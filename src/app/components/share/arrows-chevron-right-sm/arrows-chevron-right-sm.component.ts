import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-arrows-chevron-right-sm",
  templateUrl: "./arrows-chevron-right-sm.component.html",
  styleUrls: ["./arrows-chevron-right-sm.component.scss"],
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrowsChevronRightSmComponent {}