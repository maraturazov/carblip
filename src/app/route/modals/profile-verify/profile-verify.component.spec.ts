import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileVerifyComponent } from './profile-verify.component';

describe('ProfileVerifyComponent', () => {
  let component: ProfileVerifyComponent;
  let fixture: ComponentFixture<ProfileVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileVerifyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
