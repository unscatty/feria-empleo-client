import Validable from './validable.interface';

export default interface ValidableForm extends Validable {
  isValid: boolean;
  resetValidation: () => void;
  reset: () => void;
}
