import RootStore from './models/RootStore'

import OptionModule from './modules/options/options.root'
import LineSelectorModule from './modules/line-selector/line-selector.root'

const rootStore = new RootStore()

OptionModule({
  anchorElement: document.querySelector('#options'),
  rootStore 
})

// LineSelectorModule({
//   anchorElement: document.querySelector('#line-selector'),
//   rootStore 
// })

