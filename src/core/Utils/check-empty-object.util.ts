
export class CheckObjectUtil {

  constructor() { }

  isEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }
}