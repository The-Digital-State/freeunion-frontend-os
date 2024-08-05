import { validatorsTextTemplates } from '../ValidatorsTextTemplates';

type IFormErrorProps = {
  fieldName?: string;
  children?: any;
};

export function FormError({ fieldName = '', children }: IFormErrorProps) {
  return (
    <span className="danger">
      {validatorsTextTemplates.hasOwnProperty(children) ? validatorsTextTemplates[children](fieldName) : children}
    </span>
  );
}
