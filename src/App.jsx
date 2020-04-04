import React, { Component, Fragment } from 'react';
import Game from './Game.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { showDisclaimer: true };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      showDisclaimer: !state.showDisclaimer
    }));
  }

  render() {
    let page;
    if (this.state.showDisclaimer) {
      page = (
        <div className="disclaimer">
          <h3>Disclaimer</h3>
          <span>
            This is a <strong>GAME</strong>, and it's simulation is ran using parameters to highlight the importance of Social Distancing. <br/>
            <strong>IS NOT</strong> a scientific representation of how viruses react in real life. <br/>
            <a onClick={this.handleClick}>Continue</a>

          </span>
          <h3>Game</h3>
          <span>
            Green subjects will be shown in your screen, some of these will be infected with a virus.<br/>
            <br/>
            Infected subjects will turn red after a few seconds but they can spread the virus at any time while infected. <br/>
            <br/>
            With time, most of the infected subjects will recover and become blue immune subjects.<br/>
            <br/>
            Some will die and disappear from screen.<br/>
            <br/>
            Your goal is to contain the outbreak by clicking and dragging with your mouse to creating barriers to prevent the movement of subjects. <br/>
            <br/>
            Barriers must be constantly created to persuade subjects to stop moving.<br/>
            <br/>
          </span>
        </div>
      );
    } else {
      page = <Game />;
    }

    return (
      <div>
        {page}
      </div>

    );
  }
}

export default App;
