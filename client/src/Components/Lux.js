import React, {useState, useContext, useEffect} from "react";
import {Row, Col, Form, Button, Spinner, Alert, Container} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import Timer from './Timer.js'
import bellum from '../images/Bellum.mp4'
import '../App.css'


function Lux() {
    let accountInfo = useContext(AccountInfoContext)
    const [bid, setBid] = useState(0);
    const [alert, setAlert] = useState({active: false, content: null, variant: null})

    function renderUserFeedback(){
        if(accountInfo.userFeedback){
            return(
                <React.Fragment>
                    <div>
                        <Spinner animation="grow" variant="light"/>
                    </div>
                    <div>{accountInfo.userFeedback}</div>
                </React.Fragment>
            )
        }
    }

    async function handleBid(){

        let minimumBid = accountInfo.currentLuxTopBid + accountInfo.minBid
        if(bid < minimumBid){
            setAlert({active: true, content: `Minimum bid of ${minimumBid/10**18} not met.`, variant: "warning"})
        }else if(accountInfo.walletETHBalance < bid){
            setAlert({active: true, content: `Not enough ETH to place the bid`, variant: "warning"})
        }else{
            try{
                await accountInfo.luxAuctionInstance.methods.placeBid(bid.toString()).send({from: accountInfo.account, value: bid})
                accountInfo.updateAccountInfo({currentLuxTopBid: parseFloat(await this.luxAuctionInstance.methods._currentTopBid().call())})
                accountInfo.updateAccountInfo({minBid: parseFloat(await this.luxAuctionInstance.methods._minBid().call())})
                accountInfo.updateAccountInfo({highestBidder: parseFloat(await this.luxAuctionInstance.methods._highestBidder().call())})
            }
            catch(error){
                accountInfo.updateAccountInfo({userFeedback: null})
                setAlert({active: true, content: error.message, variant: "warning"})
            }
        }

    }

    function renderAlert(){
        if(alert.active){
            return(
            <Col className='m-3'>
                <br/><br/>
                <Alert variant={alert.variant}>{alert.content}</Alert>
            </Col>
            )
        }
    }
    
    function renderTimer(){
        let time = '19 Aug 2022 13:00:00 PST'
        if(Date.parse(time) - Date.now() < 0){
            return null
        }else{
            return(
                <React.Fragment>
                    <div className='content_text'>TIME REMAINING</div>
                    <h3 className='content_text mb-2'><b><Timer time={time}/></b></h3>
                </React.Fragment>
            )
        }
    }

    async function handleChange(event){
        if(event.target.value*(10**18) < accountInfo.currentLuxTopBid + accountInfo.minBid){
            setBid(accountInfo.currentLuxTopBid + accountInfo.minBid);
        }else{
            setBid(event.target.value*10**18)
        }

    }

    function renderBidInput(){
        return(
            <Form id='bid_form' style={{maxWidth: '100px'}} className='mx-2'>
            <Form.Group  controlId="bid">
                <Form.Control 
                    type="number" 
                    min="0"
                    step=".01"
                    placeholder={bid/10**18}
                    value={bid/10**18}
                    onChange={(event) => handleChange(event)}/>
            </Form.Group>
        </Form>
        )
    }



    return ( 
        <Container className="content align-items-center justify-content-center" >
            <Row className="d-flex align-items-left justify-content-center">
                <Col xs={12} md={8}>
                <video controls className="NFT_visual" >
                    <source 
                    src={bellum} 
                    type="video/mp4"
                    />
                </video>
                </Col>
                <Col xs={12} md={4}>
                    <Row className="xs_center d-flex mt-3 mt-sm-0">
                            <h3 className='content_text'><b>LUX</b></h3>
                            <div className='content_text'>1/1</div>
                            <div className='content_text my-2'>
                                <span>PHOTOGRAPHY BY DK</span>
                            </div>
                            <div className='content_text mb-2'>
                                LIFETIME ALLOWLIST
                            </div>
                            <div className='content_text mb-2'>
                                RESERVE PRICE .1 ETH
                            </div>
                    </Row>
                    <Row className="d-flex align_bottom xs_center" style={{height: '50%'}} >
                            <div className='content_text'>CURRENT BID</div>
                            <h3 className='content_text mb-2'><b>{accountInfo.currentLuxTopBid/10**18}</b></h3>
                            {renderTimer()}
                            {renderBidInput()}
                            {console.log(accountInfo.luxDropOpened)}
                            {accountInfo.luxDropOpened ? <Button variant='light' style={{maxWidth: '100px'}} className='mx-2' onClick={()=>handleBid()}>BID NOW</Button> : null}
                            {/* <Button variant='light' style={{maxWidth: '100px'}} className='mx-2'>BID NOW</Button> */}
                    </Row>
                </Col>
            </Row>

            <Row className='m-3'>
                {renderUserFeedback()}
            </Row>
            <Row className="Home_row">
                {renderAlert()}
            </Row>
        </Container>
     );
}
export default Lux;


