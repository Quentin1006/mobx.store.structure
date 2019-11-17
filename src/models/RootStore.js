export default class RootStore {
  add (name, value) {
    if(this[name] !==  undefined) {
      return new Error('Store already exists')
    }
    this[name] = value
  }
}