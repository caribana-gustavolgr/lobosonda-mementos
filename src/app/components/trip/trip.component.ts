import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ObjectsThingsCalendarAltComponent } from "../share/objects-things-calendar-alt/objects-things-calendar-alt.component";
import { ArrowsChevronRightSmComponent } from "../share/arrows-chevron-right-sm/arrows-chevron-right-sm.component";
import { ButtonComponent } from '../share/button/button.component';
import { SightingRowComponent } from '../sighting-row/sighting-row.component';

@Component({
  selector: "app-trip",
  templateUrl: "./trip.component.html",
  styleUrls: ["./trip.component.scss"],
  standalone: true,
  imports: [
    ObjectsThingsCalendarAltComponent,
    ArrowsChevronRightSmComponent,
    FormsModule,
    CommonModule,
    ButtonComponent,
    SightingRowComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripComponent {
  sightings = [
    {
      speciesName: 'Physeter Macrocephalus',
      speciesDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
      speciesIcon: 'assets/svgs/cachalote.svg'
    },
    {
      speciesName: 'Tursiops Truncatus',
      speciesDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
      speciesIcon: 'assets/svgs/dolphin.svg'
    }
  ];

  onPhotoGalleryClick(): void {
    console.log('Photo Gallery clicked!');
    // Aquí puedes agregar la lógica para abrir la galería de fotos
    console.log('Test edit - funcionando correctamente');
  }
}
