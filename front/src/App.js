import React, { Component } from 'react'
import { debounce } from 'lodash'

import actions from './actions'

class App extends Component {
  state = {
    value: '',
    placeholder: 'Type you text here...',
    keys: {},
    suggests: [],
  }

  replaceLastWord = word => {
    const { value } = this.state
    let splittedValue = value.split(' ')

    splittedValue[splittedValue.length - 1] = word
    this.setState({ value: `${splittedValue.join(' ')} ` })
  }

  handleKeyPress = async ({ keyCode, type }) => {
   await this.setState({
     keys: {
       ...this.state.keys,
       [keyCode]: type === 'keydown',
     },
   })

   const { keys, value, suggests } = this.state

   if (keys['17'] && keys['49'] && value) {
     this.replaceLastWord(suggests[0])
   } else if (keys['17'] && keys['50'] && value) {
     this.replaceLastWord(suggests[1])
   } else if (keys['17'] && keys['51'] && value) {
     this.replaceLastWord(suggests[2])
   }
  }

  predict = debounce(async () =>
    this.setState({ suggests: await actions.predict(this.state.value) })
  , 500)

  handleChange = async value => {
    await this.setState({ value })

    if (!!value.length) { this.predict() }
  }

  learn = async value => {
    await actions.learn(value)
    this.handleChange('')
  }

  handleFocus = ({ type }) =>
    this.setState({ placeholder: type === 'focus' ? '' : 'Type you text here...' })

  render() {
    const { value, placeholder, suggests = [] } = this.state

    console.log('VALUE', value)
    console.log('SUGGESTS', suggests)

    return (
      <div className="app">
        <div className="title">
          <i className="icon ion-aperture" />
          <h1>Predictr</h1>
        </div>
        <div className="predictr">
          <div className="suggestions">
            {suggests.map((suggest, index) => (
              <div
                key={index}
                className="single"
                onClick={() => this.replaceLastWord(suggest)}
              >
                <span className="word">{suggest}</span>
                <span className="ctrl">CTRL + {index + 1}</span>
              </div>
            ))}
          </div>
          <div className="textarea">
            <textarea
              value={value}
              onChange={({ target: { value } }) => this.handleChange(value)}
              onFocus={this.handleFocus}
              onBlur={this.handleFocus}
              placeholder={placeholder}
              onKeyDown={this.handleKeyPress}
              onKeyUp={this.handleKeyPress}
              rows={8}
            />
            <div className="train" onClick={() => this.learn(value)}>
              <i className="ion-erlenmeyer-flask" />
            </div>
            <div className="trash" onClick={() => this.handleChange('')}>
              <i className="ion-trash-a" />
            </div>
          </div>
        </div>
        <footer>
          &copy; Copyright 2017 - Predictr 42 by akpenou & glarivie - All rights reserved
        </footer>
      </div>
    )
  }
}

export default App
