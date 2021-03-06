var React = require('react'),
	$ = require('jquery'),
    Metrics = require("../components/metrics.jsx").Metrics;

var Resources = React.createClass({
  getInitialState: function() {
    return {app: null};
  },
  appInfo: function(url) {
	$.ajax({
	  type: 'GET',
	  url: this.props.url,
	  success: function(data) {
        this.setState({app: data.app});
	  }.bind(this)
	});
  },
  componentDidMount: function() {
    this.appInfo();
  },
  render: function() {
    return (
      <div className="resources">
        {this.state.app === null ? "" : <Process app={this.state.app} />}
      </div>
    );
  }
});

var ProcessTab = React.createClass({
  onClick: function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.active)
      return;

    this.props.setActive(this.props.process);
  },
  render: function() {
    return (
      <li className={this.props.active ? "active" : ''}>
        <a href="#" onClick={this.onClick}>{this.props.process}</a>
      </li>
    );
  }
});

var ProcessTabs = React.createClass({
  getInitialState: function() {
    return {active: ""}; 
  },
  setActive: function(process) {
    this.setState({active: process});
    this.props.setActive(process);
  },
  componentDidUpdate: function() {
    var keys = Object.keys(this.props.process);
    if ((this.state.active === "") && keys.length > 0) {
      this.setActive(keys[0]);
    }
  },
  render: function() {
    var processList = [];
    for (process in this.props.process) {
      processList.push(<ProcessTab key={process}
                                   process={process}
                                   active={process === this.state.active}
                                   setActive={this.setActive} />);
    };
    return (
      <ul className="nav nav-pills">
        {processList}
      </ul>
    );
  }
});

var Tr = React.createClass({
  render: function() {
    var unit = this.props.unit;
    return (
      <tr>
        <td>{unit.ID}</td>
        <td>{unit.HostAddr}</td>
        <td>{unit.HostPort}</td>
      </tr>
    );
  }
});

var Trs = React.createClass({
  render: function() {
    var units = this.props.units;
    var trs = [];
    for (i in units) {
      trs.push(<Tr key={i} unit={units[i]} />);
    }
    return (
      <tbody>{trs}</tbody>
    );
  }
});

var ProcessInfo = React.createClass({
  getInitialState: function() {
    return {hide: true};
  },
  onClick: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({hide: !this.state.hide});
  },
  render: function() {
    var units = this.props.process;
    var kind = this.props.kind;
    var classNames = "table containers-app";
    if (this.state.hide) 
      classNames += " hide";
    return (
      <div className="units-toggle" onClick={this.onClick}>
        <p><a href="#">&#x25BC;</a> {units.length} {kind} units</p>
        <table className={classNames}>
          <Trs units={units} />
        </table>
      </div>
    );
  }
});

var ProcessContent = React.createClass({
  processByStatus: function() {
    var status = {};
    for (i in this.props.process) {
      var unit = this.props.process[i]; 
      if (!(unit.Status in status)) {
        status[unit.Status] = [];
      }
      status[unit.Status].push(unit);
    };
    return status;
  },
  render: function() {
    var info = [];
    var process = this.processByStatus()
    for (i in process) {
        info.push(<ProcessInfo key={i} process={process[i]} kind={i} />);
    };
    var processName = this.props.process[0].ProcessName;
    return (
      <div className='resources-content' id="metrics-container">
        {info}
        <Metrics appName={this.props.appName} processName={processName} />
      </div>
    );
  }
});

var Process = React.createClass({
  getInitialState: function() {
    return {process: {}, active: null}; 
  },
  setActive: function(process) {
    this.setState({active: this.state.process[process]});
  },
  unitsByProcess: function() {
    var process = {};
    for (index in this.props.app.units) {
      var unit = this.props.app.units[index];
      if (!(unit.ProcessName in process)) {
        process[unit.ProcessName] = [];
      }
      process[unit.ProcessName].push(unit);
    }
    this.setState({process: process});
  },
  componentDidMount: function() {
    this.unitsByProcess();
  },
  render: function() {
    return (
      <div>
        <ProcessTabs process={this.state.process} setActive={this.setActive} />
        {this.state.active === null ? "" : <ProcessContent process={this.state.active} appName={this.props.app.name} />}
      </div>
    );
  }
});

module.exports = Resources;
