import React, { Component } from 'react'
import { Link } from 'react-router'
import SpaceDAOContract from '../build/contracts/SpaceDAO.json'
import getWeb3 from './util/getWeb3'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'
// card and  nav
import SingleCard from './components/SingleCard'
import NavbarJS from './components/NavbarJS'
import FooterJS from './components/FooterJS'
import { CardDeck } from 'reactstrap'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      /*
      results.web3.eth.getAccounts((error, accounts) => {
        results.web3.eth.defaultAccount = accounts[0];
        results.web3.eth.getBalance(accounts[0], (err, balance) => {
          console.log(balance.toNumber());
        });

      })*/

      this.setState({
        web3: results.web3
      })
      // Instantiate contract once web3 provided.
      this.instantiateContract();

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    var that = this;

    const contract = require('truffle-contract')
    const spaceDAO = contract(SpaceDAOContract)
    spaceDAO.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var spaceDAOInstance;
    var initialized = false;


    spaceDAO.deployed().then((instance) => {
      if (initialized) {
        return;
      }
      initialized = true;

      spaceDAOInstance = instance;
      this.reloadData.bind(this);
      this.reloadData(spaceDAOInstance);

      return that.setState({ contract: spaceDAOInstance })
    })
  }

  reloadData(spaceDAOInstance) {
      var that = this;
      var members = [];
      spaceDAOInstance.getUserVoteCount().then((count) => {
        console.log("User Vote Count" + count);
        this.setState({userVoteCount: count.toNumber()});
      })

      spaceDAOInstance.getCommitteeMemberCount().then((count) => {
        for (var i = 0; i < count ; i++) {
          spaceDAOInstance.getCommitteeMember(i).then((m) => {
            members.push({
              name: m[0],
              title: m[1],
              avatar: m[2],
              skills: m[3],
              votes: m[4] ? m[4].toNumber() : 0,
              memberId: m[5]
            });
            this.setState({members: members});
          });
        }
      });
      return that.setState({committeeMembers: members })
  }

  vote(candidateIndex) {
    var that = this;
    console.log(this.state.committeeMembers);
    this.state.contract.voteForCommitteeMember(candidateIndex, {from: this.state.web3.eth.accounts[0]}).then((result) =>
      setTimeout(function() {
        that.reloadData(that.state.contract)
      }, 4000)
    );
    console.log("Voting for " + candidateIndex);
  }
  inGroupsOf(array, number, fillWith) {
      fillWith = fillWith || null;
      var index = -number, slices = [];

      if (number < 1) return array;

      while ((index += number) < array.length) {
          var s = array.slice(index, index + number);
          while(s.length < number)
              s.push(fillWith);
          slices.push(s);
      }
      return slices;
  }
  render() {
    var members = [{name: "Loading..."}];
    var voteCount = this.state.userVoteCount ? this.state.userVoteCount : 0;
    if (this.state.contract) {
      console.log(this.state.contract.getCommitteeMemberCount());
    }
    if (this.state.committeeMembers && this.state.committeeMembers.length > 0) {
      members = this.state.committeeMembers;
    }
    var groupedMembers = this.inGroupsOf(members, 3, {});
    console.log("Grouped members");
    console.log(groupedMembers);

    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <LoginButtonContainer />
      </span>
    )


    return (

      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">SpaceDAO</Link>
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </ul>
        </nav>

        {this.props.children}
        {/* <NavbarJS /> */}

        <p>My Vote Count: {voteCount}</p>
        <h1>Vote for Space Council Members</h1>
        { groupedMembers.map((group, i1) =>
              <CardDeck key={i1}>
                {group.map((member, i2) => {
                  return (<SingleCard handler={this.vote.bind(this, member.memberId)} key={member.memberId} name={member.name} title={member.title} avatar={member.avatar} skills={member.skills} votes={member.votes} />)
                })}
              </CardDeck>
          )}
      </div>
    );
  }
}

export default App
