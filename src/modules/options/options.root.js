import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import OptionsLayout from './options.layout'
import OptionsStore from './options.store'
import optionsService from './options.service'

export default ({
  // All dependencies of the module
  anchorElement, // where in the app it will appear
  authInfos, // might contains authToken, referer, method to refresh token...
  bus, // pubsub to communicate from one module to the core
  rootStore, // to communicate states between modules
}) => {
  const store = new OptionsStore(rootStore, optionsService)
  function Module ({
    authInfos,
    baseUrl,
    bus, // peut-être à passer dans le context
  }) {
    return (
      <Provider store={store}>
        <OptionsLayout authInfos={authInfos}/>
      </Provider>
    )
  }

  ReactDOM.render(<Module authInfos={authInfos} bus={bus}/>, anchorElement);
}

// function App () {
//   return <div>Hello</div>
// }

// export default function Module ({ anchorElement }) {
//   ReactDOM.render(<App/>, anchorElement)
// }