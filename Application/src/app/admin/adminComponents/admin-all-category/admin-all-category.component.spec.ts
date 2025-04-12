import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAllCategoryComponent } from './admin-all-category.component';

describe('AdminAllCategoryComponent', () => {
  let component: AdminAllCategoryComponent;
  let fixture: ComponentFixture<AdminAllCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAllCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAllCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
