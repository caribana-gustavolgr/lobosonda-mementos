import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-arrows-chevron-left",
  templateUrl: "./arrows-chevron-left.component.html",
  styleUrls: ["./arrows-chevron-left.component.scss"],
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrowsChevronLeftComponent {
  @Input() color: string = '#1B1B1B';
}