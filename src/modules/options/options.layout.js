import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import OptionsWall from './pages/options-wall'
import SingleOption from './pages/single-option'

export default function OptionsLayout () {
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <div>Hello</div>
        </Route>
        <Route path='/voir-les-options/:optionId'>
          <SingleOption/>
        </Route>
        <Route path='/voir-les-options'>
          <OptionsWall/>
        </Route>
      </Switch>
    </Router>
  )
}
