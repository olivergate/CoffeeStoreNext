export type ValidationError = {
  field: string;
  message: string;
};

type BaseValidationType = { type: string };

interface RequiredType extends BaseValidationType {
  type: 'Required';
}

interface FieldLength extends BaseValidationType {
  type: 'FieldLength';
  length: number;
}

export type ValidationType = RequiredType | FieldLength;

export type ValidationQuery<T extends Record<string, any>> = {
  [key in keyof T]?: ValidationType[];
};

export default class Validator<T extends Record<string, any>> {
  private validationErrors: ValidationError[] = [];
  private queryObject: ValidationQuery<T>;
  public isValidating: boolean = false;
  constructor(queryObject: ValidationQuery<T>) {
    this.queryObject = queryObject;
  }

  private addToErrorList = (validationError: ValidationError) => this.validationErrors.push(validationError);
  public validate = async (values: T) => {
    const valuesClone = Object.assign({}, values);
    Object.keys(this.queryObject).forEach(x => {
      const value = valuesClone[x];
      this.queryObject[x]?.forEach(query => {
        if (query.type === 'Required' && !value) {
          this.addToErrorList({ field: x, message: `${x} cannot be empty` });
        }
        if (query.type === 'FieldLength' && typeof value === 'string' && value.length < query.length) {
          this.addToErrorList({ field: x, message: `Field ${x} cannot be less than ${query.length} characters` });
        }
      });
    });
  };
  public getIsValid = (): boolean => this.validationErrors.length === 0;
  public getValidationErrors = (): ValidationError[] => this.validationErrors;
}
