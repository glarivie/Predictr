import React, { Component } from 'react'

class App extends Component {
  state = {
    value: '',
    placeholder: 'Type you text here...',
    keys: {},
    suggests: ['élephant', 'bonjour', 'aujourd\'hui'],
  }

  replaceLastWord = word => {
    let splittedValue = this.state.value.split(' ')
    splittedValue[splittedValue.length - 1] = word

    this.setState({ value: splittedValue.join(' ') })
  };

  handleKeyPress = async ({ keyCode, type }) => {
   await this.setState({
     keys: {
       ...this.state.keys,
       [keyCode]: type === 'keydown',
     }
   })

   const { keys, value, suggests } = this.state

   console.log('handleKeyPress', type, keyCode, keys, value)

   if (keys['17'] && keys['49'] && value) {
     this.replaceLastWord(suggests[0])
   } else if (keys['17'] && keys['50'] && value) {
     this.replaceLastWord(suggests[1])
   } else if (keys['17'] && keys['51'] && value) {
     this.replaceLastWord(suggests[2])
   }
  }

  handleChange = value => this.setState({ value })

  handleFocus = ({ type }) =>
    this.setState({ placeholder: type === 'focus' ? '' : 'Type you text here...' })

  render() {
    const { value, placeholder, suggests } = this.state

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
