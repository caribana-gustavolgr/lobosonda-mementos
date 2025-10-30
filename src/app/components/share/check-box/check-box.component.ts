import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-check-box",
  templateUrl: "./check-box.component.html",
  styleUrls: ["./check-box.component.scss"],
  standalone: true,
  imports: [FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckBoxComponent {

}
