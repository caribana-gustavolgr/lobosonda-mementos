import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ArrowsChevronLeftComponent } from "../share/arrows-chevron-left/arrows-chevron-left.component";
@Component({
  selector: "app-photodetail",
  templateUrl: "./photodetail.component.html",
  styleUrls: ["./photodetail.component.scss"],
  standalone: true,
  imports: [ArrowsChevronLeftComponent, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotodetailComponent {}