import React, { Component } from 'react';

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bitcoin: {},
      user: {}
    };
  }

  render() {
    return (
      <header className="App-header">
        <article className="App-header__App-user">
          <div className="App-user-profile">
            <div className="App-user-profile__money">123421$</div>
            <div className="App-user-profile__info">
              <div className="App-user-profile__picture">
                <img src="/avatar.png"/>
              </div>
              <div className="App-user-profile__username">some user</div>
            </div>
          </div>
        </article>
      </header>
    );
  }
}

export default AppHeader;
