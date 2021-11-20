export default interface Actionable {
  perform: (...args: any[]) => void | Promise<void>;
}
