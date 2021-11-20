export default interface Validable {
  validate: (...args: any[]) => boolean;
}
