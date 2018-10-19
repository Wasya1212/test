// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
//
// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }
//
// export default App;


import React, { Component } from 'react';
import axios from "axios";
import Highcharts from 'highcharts';
import {
  HighchartsChart,
  Chart,
  withHighcharts,
  XAxis, YAxis, Title,
  Legend,
  LineSeries,
  Tooltip
} from 'react-jsx-highcharts';
import { addDataPoint, createDataPoint } from './utils/data-helpers';
import AppHeader from './components/Header';
import './App.css';

const maxTablePoints = 25;

class App extends Component {

  constructor (props) {
    super(props);
    this.updateLiveData = this.updateLiveData.bind(this);
    this.handleStartLiveUpdate = this.handleStartLiveUpdate.bind(this);
    this.handleStopLiveUpdate = this.handleStopLiveUpdate.bind(this);

    const now = Date.now();
    this.state = {
      data: [],
      liveUpdate: false
    };
  }

  componentDidMount () {
    this.handleStartLiveUpdate();
  }

  updateLiveData () {
    const { data } = this.state;
    const time = Date.now();

    // axios
    //   .post('https://ifyouhavemoneyforbitcoin.herokuapp.com', { time: Date.now() })
    //   .then(({ data: bitcoin }) => {
    //     console.log("sdf", bitcoin);
    //     return bitcoin.cost
    //   })
    //   .then(bitcoin => {
    //     this.setState({
    //       data: addDataPoint(data, bitcoin, time)
    //     });
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });

    axios({
      method: 'post', //you can set what request you want to be
      url: 'http://localhost:5000',
      data: { time: Date.now() },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(({ data: bitcoin }) => {
      return bitcoin.cost
    })
    .then(bitcoin => {
      this.setState({
        data: addDataPoint(data, createDataPoint(bitcoin))
      });
    })
    .then(() => {
      if (this.state.data.length > maxTablePoints) {
        this.setState({
          data: this.state.data.slice(1)
        });
      }
    })
    .catch(err => {
      console.error(err);
    });

    // this.setState({
    //   data: addDataPoint(data)
    // });
  }

  handleStartLiveUpdate (e) {
    e && e.preventDefault();
    this.setState({
      liveUpdate: window.setInterval(this.updateLiveData, 2000)
    });
  }

  handleStopLiveUpdate (e) {
    e.preventDefault();
    window.clearInterval(this.state.liveUpdate);
    this.setState({
      liveUpdate: false
    });
  }

  render() {
    const { data, liveUpdate } = this.state;

    return (
      <div className="app">
        <AppHeader />

        <HighchartsChart>
          <Chart />

          <Title>Cryptocurrency course</Title>

          <Legend>
            <Legend.Title>Legend</Legend.Title>
          </Legend>

          <Tooltip valueSuffix=" USD" />

          <XAxis type="datetime">
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>

          <YAxis>
            <YAxis.Title>Pressure (m)</YAxis.Title>
            <LineSeries name="Bitcoin" data={data} />
          </YAxis>
        </HighchartsChart>

        <div>
          {!liveUpdate && (
            <button className="btn btn-success" onClick={this.handleStartLiveUpdate}>Live update</button>
          )}
          {liveUpdate && (
            <button className="btn btn-danger" onClick={this.handleStopLiveUpdate}>Stop update</button>
          )}
        </div>

      </div>
    );
  }
}

export default withHighcharts(App, Highcharts);
