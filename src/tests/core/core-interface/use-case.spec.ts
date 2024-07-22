import { MockUseCase, Params, Result } from './moks/use-case.mock'; // Asegúrate de que la ruta sea correcta

describe('MockUseCase', () => {
  let useCase: MockUseCase;

  beforeEach(() => {
    useCase = new MockUseCase();
  });

  it('should return the correct result', (done) => {
    const params: Params = { id: 1 };
    const expectedResult: Result = { name: 'User 1' };

    useCase.execute(params).subscribe(result => {
      expect(result).toEqual(expectedResult);
      done();
    });
  });
});
