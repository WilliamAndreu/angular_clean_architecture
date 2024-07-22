import { TestBed } from '@angular/core/testing';
import { CheckObjectUtil } from '@utils/check-empty-object.util';
import { UtilsModule } from '@utils/utils.module';

describe('UtilsModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UtilsModule]
    });
  });

  it('should create the module', () => {
    const module = TestBed.inject(UtilsModule);
    expect(module).toBeTruthy();
  });

  it('should provide CheckObjectUtil service', () => {
    const service = TestBed.inject(CheckObjectUtil);
    expect(service).toBeTruthy();
  });
});
