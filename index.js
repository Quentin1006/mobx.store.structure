class MemoryCache {
  constructor ({ ttl = 0, nspSeparator = '.' } = {}) {

    this.memory = {}
    this.lastModified = 0
    this.ttl = ttl
    this.nspSeparator = nspSeparator
  }

  clear = (nsp = '') => {
    Object.keys(this.memory).forEach(key => {
        const keyMatchNsp = key.split(this.nspSeparator)[0].match(nsp)
        keyMatchNsp && delete this.memory[key]
    })
  }
  get = (key) => this.memory[key]  
  isExpired = () => this.lastModified + this.ttl > Date.now()
  set = (name, content) => this.memory[name] = JSON.stringify(content)
  updateLastModified = () => this.lastModified = Date.now()
  
}

// Le rootStore est instancié une fois au chargement de l'app
// il instancie tous les stores de l'app
// Il permet aux stores de communiquer entre eux via sa réf
// Chaque module sera encapsulé dans un provider avec pour store le rootStore
// Les injects se feront de façon ciblée selon les stores nécessaires pour le module
class RootStore {
  constructor (storeConfigs) {
    this.contractStore = new ContractStore()
    this.optionStore = new OptionStore()

    // Cache général au store
    // faille: si une donnée secondaire est modifié 
    // juste avant l'expiration, elle ne sera pas réellement cachée
    this.cache = new storeConfigs.Cache()
  }

  // decorator qui permet de gérer le cache 
  // sans s'en préoccuper lors d'un appel fetch
  fetch = (name, useCache = false) => {
    return async (target, key, descriptor) => {
      const original = descriptor.value

      descriptor.value = () => {
        if(useCache && !this.cache.isExpired()) {
          return this.cache.get(name)
        }
        if(this.cache.isExpired()) {
          this.cache.clear(name)
        }
        const response = await original.apply(this, arguments)
        this.cache.set(name, response)
      }
    }
  }
}

class OptionsStore {
  id = Date.now()

  constructor (rootStore, service) {
    this.rootStore = rootStore
    this.optionsService = service

  }

  @observable isLoadingOptions = false
  @observable isErrorOptions = false

  // retour de la ressource
  // Les clés seront les numéros de contrats
  // Ces numéros de contrats contiendront un array d'options
  // ??? userOptions a t-il besoin d'etre un observable ???
  @observable userOptions = {}

  @computed get optionsAlreadyFetched ()) {
    
  }

  @computed get options () {
    if (!this.optionsAlreadyFetched) {
      this.fetchOptions()
    }
    return this.sourceOptions
  }

  // constitue la "Single Source Of Truth"
  // ne doit pas etre utilisée directement 
  @observable sourceOptions

  // convention "<namespace>.<identifiant-unique>""
  @this.fetch(`options.${this.id}`, false)
  async fetchOptions = () => {
    const contract = this.rootStore.contractStore.currentContract
    this.setLoadingOptions(true)
    this.setErrorOptions(false)
    try {
      const options = await optionsService.fetchOptions(contract)
      this.setSourceOptions(options)
    } catch (error) {
      this.setErrorOptions(true)
    }
    this.setLoadingOptions(false)
  }
}

// Tous ces Domain Stores peuvent hériter d'un Parent
// responsable de l'installation d'un background commun 
class ContractOptions {
  constructor () {

  }


  
  @action setSourceOptions = (options, contractId) => {
    this.userOptions[contractId] = new ContractOptions(options)
  }







  @action setLoadingOptions = (bool) => {
    this.isLoadingOptions = bool
  }

  @action setErrorOptions = (bool) => {
    this.isErrorOptions = bool
  }
}

class Option {
  constructor (option) {
    // objet option retourné de la ressource
    // ne doit pas etre utilisé directement
    this.sourceOption = option
    this.isErrorSubscription = false
  }

  @computed get label () {
    return this.option.libelle
  }

  @computed get isSubscribed () {
    return this.option.subscribed
  }
  // ... on peut imaginer tout un tas de computed
  // tirés directement de la source

  @action setErrorSubscription = (bool) => {
    this.isErrorSubscription = bool
  }

  @action subscribe = () => {
    this.setErrorSubscription(false)
    try {
      await optionsService.subscribeOption(contract)
    } catch (error) {
      this.setErrorSubscription(true)
    }
    
  }
}