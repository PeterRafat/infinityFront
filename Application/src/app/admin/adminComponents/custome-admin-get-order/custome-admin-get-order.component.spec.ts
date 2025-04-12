import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeAdminGetOrderComponent } from './custome-admin-get-order.component';

describe('CustomeAdminGetOrderComponent', () => {
  let component: CustomeAdminGetOrderComponent;
  let fixture: ComponentFixture<CustomeAdminGetOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomeAdminGetOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomeAdminGetOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
