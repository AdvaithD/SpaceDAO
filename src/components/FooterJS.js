import React from 'react'
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from 'reactstrap'
import './nav.css'

export default class FooterJS extends React.Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }
  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  render () {
    return (
      <div>
        <Navbar color='faded' light toggleable>
          <NavbarToggler right onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className='ml-auto' navbar>
              <NavItem>
                <NavLink href='#'>Open source! Checkout the GitHub repository!</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='#'>Stats</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='#'>Contact</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='#'>TOS</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}
