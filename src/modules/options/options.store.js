import { observable, computed, action } from 'mobx'

export default class OptionsStore {
  id = Date.now()
  
  @observable isLoadingOptions = false
  @observable isErrorOptions = false
  @observable isErrorSubscription = false

  // retour de la ressource
  // Les clés seront les numéros de contrats
  // Ces numéros de contrats contiendront un array d'options
  // les observer vont-il s'updater si on ajoute une clé à l'objet
  // A TESTER
  @observable _sourceUserOptions = {}

  constructor (rootStore, service) {
    this.rootStore = rootStore
    this.optionsService = service

    // Hook the store to the rootStore
    // so it is accessible from the rootStore
    // !!! PB !!! If the module hasn't been instantiated 
    // the store won't exist
    this.rootStore.add('optionsStore', this)
  }

  @computed get contract () {
    return this.rootStore.contractStore.currentContract
  }

  @computed get contractId () {
    return this.contract.id
  }

  @computed get optionsAlreadyFetched () {
    return this._sourceUserOptions[this.contract.id] || this.isLoadingOptions
  }

  @computed get options () {
    if (!this.optionsAlreadyFetched) {
      this.fetchOptions()
      return []
    }
    return this._sourceUserOptions[this.contractId]
  }

  @action setLoadingOptions = (bool) => {
    this.isLoadingOptions = bool
  }

  @action setErrorOptions = (bool) => {
    this.isErrorOptions = bool
  }

  @action setSourceOptions = (options) => {
    if(!options) {
      // allow us to reset the options for the current contract
      // when a POST action is made (action that modifies the ressource)
      // So we are guaranteed to fetch them again the next time we call options
      delete this._sourceUserOptions[this.contractId]
    }
    this._sourceUserOptions[this.contractId] = options.map(opt => new Option(opt))
  }

  @action resetSourceOptions = () => {
    this._sourceUserOptions = {}
  }

  @action subscribeOption = async (optionId) => {
    this.setErrorSubscription(false)
    try {
      await this.service.subscribeOption(optionId, this.contract)
      this.setSourceOptions(null)
    } catch (error) {
      this.setErrorSubscription(true)
    }
  }

  @action setErrorSubscription = (bool) => {
    this.isErrorSubscription = bool
  }

  @action resetStore () {
    // reset all the value 
    // Pourrait peut etre appartenir au rootStore
    // Ou reset tous les observables
    this.resetSourceOptions()
    this.setErrorOptions(false)
    this.setErrorSubscription(false)
    this.setLoadingOptions(false)

  }

fetchOptions = async () => {
    this.setLoadingOptions(true)
    this.setErrorOptions(false)
    try {
      const options = await this.service.fetchOptions(this.contract)
      this.setSourceOptions(options)
    } catch (error) {
      this.setErrorOptions(true)
    }
    this.setLoadingOptions(false)
  }
}

class Option {
  constructor (option) {
    // objet option retourné de la ressource
    // ne doit pas etre utilisé directement
    this._sourceOption = option
  }

  @computed get label () {
    return this._sourceOption.libelle
  }

  @computed get isSubscribed () {
    return this._sourceOption.subscribed
  }
  // ... on peut imaginer tout un tas de computed
  // tirés directement de la source
}