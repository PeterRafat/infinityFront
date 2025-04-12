import { Component } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contactus',
  imports: [TranslateModule,TranslatePipe],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent {

}
