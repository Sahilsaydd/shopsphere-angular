import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Shop } from './shop';
import { Products } from '../../core/services/products';

describe('Shop', () => {
  let component: Shop;
  let fixture: ComponentFixture<Shop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shop],
      providers: [
        {
          provide: Products,
          useValue: {
            getProducts: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Shop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
