import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,TranslatePipe,TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
userNavbar: any;
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en'); // Set default language
  }

  switchLanguage(language: string) {
    console.log('Switching to language:', language);
    this.translate.use(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }
}

