import { isEqual, isPlainObject, reduce } from 'lodash';

export const buildFormData = (formData: any, data: any, parentKey?: any) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;
    formData.append(parentKey, value);
  }
};

export const rules = {
  required: (v: any) => !!v || 'Este campo es requerido',
  maxLength: (maxnum: number, v: string) =>
    (v && v.length <= maxnum) || `Maximo ${maxnum} caracteres`,
  maxLengthUnrequired: (maxnum: number, v: string) => {
    if (v && v.length > maxnum) {
      return `Maximo ${maxnum} caracteres`;
    }

    return true;
  },
  minLength: (minnum: number, v: string) =>
    (v && v.length >= minnum) || `Mínimo ${minnum} caracteres`,
  email: (v: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(v) || 'Ingresa un email valido';
  },
};

export const diffObjects = function (obj1: any, obj2: any) {
  return reduce(
    obj1,
    function (result: any, value: any, key: any) {
      if (isPlainObject(value)) {
        result[key] = diffObjects(value, obj2[key]);
      } else if (!isEqual(value, obj2[key])) {
        result[key] = value;
      }
      return result;
    },
    {}
  );
};

export const objectToFormData = (obj: any, rootName = ''): FormData => {
  function _buildFormData(formData: FormData, data: any, parentKey: string) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.entries(data).forEach(([key, value]) => {
        _buildFormData(formData, value, parentKey ? `${parentKey}['${key}']` : key);
      });
    } else {
      formData.append(parentKey, data);
    }
  }

  const formData = new FormData();
  _buildFormData(formData, obj, rootName);

  return formData;
};
