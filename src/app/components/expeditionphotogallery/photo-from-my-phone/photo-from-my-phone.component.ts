import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CheckBoxComponent } from "../../share/check-box/check-box.component";
@Component({
  selector: "app-photo-from-my-phone",
  templateUrl: "./photo-from-my-phone.component.html",
  styleUrls: ["./photo-from-my-phone.component.scss"],
  standalone: true,
  imports: [CheckBoxComponent, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFromMyPhoneComponent {
  @Input() property1: "Default" | "Selected" = "Default";
}