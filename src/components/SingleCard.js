import React from 'react'
import { Card, CardText, CardBlock, CardTitle, CardSubtitle, Button, CardFooter, Table } from 'reactstrap'
import './SingleCard.css'

class SingleCard extends React.Component {
  render () {
    return (

      <Card>
        <CardBlock>
          <img src={"/avatars/" + this.props.avatar}/>
          <CardTitle>{this.props.name}</CardTitle>
          <CardSubtitle><small>{this.props.title}</small></CardSubtitle>
          <CardSubtitle><small>Votes: {this.props.votes}</small></CardSubtitle>
          <Table>
            <tbody>
              <tr>
                <td colSpan={2}><div className='right'>{this.props.last}</div></td>
              </tr>
              <Button outline  onClick={(e) => this.props.handler()} color="primary">Vote</Button>{' '}

              {/* <tr>
                <td colSpan={2}>Volume(USD) <div className='right'>$ {this.props.usdvolume}</div></td>
              </tr>
              <tr>
                <td colSpan={2}>Volume(BTC) <div className='right'>{this.props.btcvolume} BTC</div></td>
              </tr>

              <tr>
                <td style={{ 'width': '50%'}}>Ask <div className='right'>$ {this.props.ask}</div></td>
                <td style={{ 'width': '50%' }}>Bid <div className='right'>$ {this.props.bid}</div></td>
              </tr> */}

            </tbody>
          </Table>

        </CardBlock>

      </Card>

    )
  }
}

export default SingleCard
