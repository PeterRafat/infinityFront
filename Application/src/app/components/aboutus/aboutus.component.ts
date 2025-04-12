import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-aboutus',
  imports: [RouterLink,TranslateModule,TranslatePipe],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {

}
