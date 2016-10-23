import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';

import './App.css';

class App extends Component {
  state = {
    suggests: ['violet', 'éléphant', 'demain'],
    keys: {},
    inputValue: '',
    phamtomStyles: {},
    inputStyles: {},
    suggestStyles: {},
    visibility: 'hidden',
  };

  handleChange = ({ target: { value } }) => {
    this.setState({
      inputValue: value,
      phamtomStyles: findDOMNode(this._phamtom).getBoundingClientRect(),
      inputStyles: findDOMNode(this._input).getBoundingClientRect(),
      suggestStyles: findDOMNode(this._suggests).getBoundingClientRect(),
      visibility: value.length > 2 ? 'visible': 'hidden',
    });
  };

  replaceLastWord = word => {
    let splittedValue = this.state.inputValue.split(' ');
    splittedValue[splittedValue.length - 1] = word;

    this.setState({ inputValue: splittedValue.join(' ') });
  };

  handleKeyPress = async ({ keyCode, type }) => {
    await this.setState({
      keys: {
        ...this.state.keys,
        [keyCode]: type.includes('keydown'),
      }
    });

    const { keys, inputValue, suggests } = this.state;

    if (keys['17'] && keys['49'] && inputValue) {
      this.replaceLastWord(suggests[0]);
    } else if (keys['17'] && keys['50'] && inputValue) {
      this.replaceLastWord(suggests[1]);
    } else if (keys['17'] && keys['51'] && inputValue) {
      this.replaceLastWord(suggests[2]);
    }
  };



  render() {
    const { inputValue, phamtomStyles, inputStyles, suggestStyles, visibility, suggests } = this.state;

    return (
      <main>
        <header>
          <h1>Predictr</h1>
          <p>Try our solution by typing on the field below :</p>
        </header>
        <div className="predictr">
          <div
            className="suggests"
            ref={n => this._suggests = n}
            style={{
              top: `${_.get(inputStyles, 'top', 0) - _.get(phamtomStyles, 'height', 0) - 5}px`,
              left: `${_.get(inputStyles, 'left', 0) + _.get(phamtomStyles, 'width', 0) - (_.get(suggestStyles, 'width', 0) / 2) + 11}px`,
              visibility,
            }}
          >
            {suggests.map((item, index) => (
              <span key={index} className="item">{item}</span>
            ))}
          </div>
          <input
            id="test"
            type="text" name="test"
            className="test-input"
            value={inputValue}
            ref={w => this._input = w}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress}
            onKeyUp={this.handleKeyPress}
          />
          <div
            className="phamtom"
            type="text" name="phamtom"
            ref={c => this._phamtom = c}
          >
            {inputValue}
          </div>
          <small>Click or use Ctrl + (1, 2, 3) to place suggestions</small>
        </div>
      </main>
    );
  }
}

export default App;
