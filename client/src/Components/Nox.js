import React, {useState, useContext, useEffect} from "react";
import {Row, Col, Form, Button, Spinner, Alert, Container} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import Timer from './Timer.js'
import nox from '../images/NOX.jpg'
import '../App.css'


function Nox() {
    let accountInfo = useContext(AccountInfoContext)
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

    async function handleMint(){
        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        try{
            await accountInfo.luxMintInstance.methods.ALMint(
                accountInfo.signedMessage.v,
                accountInfo.signedMessage.r,
                accountInfo.signedMessage.s
            ).send({from: accountInfo.account, value: accountInfo.noxMintPrice});
        }
        catch(error){
            setAlert({active: true, content: error.message, variant: "warning"})
        }
        accountInfo.updateAccountInfo({userFeedback: null})
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
        let time = '07 Aug 2022 09:00:00 EST'
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

    function renderUserInterface(){
        if(!accountInfo.account){
            return null
        }else if(!accountInfo.noxDropOpened){
            return renderTimer()
        }else if(!accountInfo.signedMessage){
            return <div className="content_text">You are not on the AL</div>
        }else if(accountInfo.hasMintedNox){
            return <div>Congratulations on minting NOX!</div>
        }else if(accountInfo.walletETHBalance < accountInfo.noxMintPrice){
            return <div className="content_text">Insufficient funds.<br/>You need .1 ETH + gas</div>
        }else{
           return <Button variant='light' style={{maxWidth: '100px'}} className='mx-2' onClick={()=>handleMint()}>Mint</Button>
        }
    }


    return ( 
        <Container className="content align-items-center justify-content-center" >
            <Row className="d-flex align-items-left justify-content-center">
                <Col xs={12} md={8}>
                    <img src={nox} className="NFT_visual"/>
                </Col>
                <Col xs={12} md={4}>
                    <Row className="sm_center mt-sm-0" style={{height: '50%'}}>
                        <div>
                            <h3 className='content_text' ><b>NOX</b></h3>
                            <div className='content_text'>ALLOW LIST ONLY</div>
                            <div className='content_text'>PHOTOGRAPHY BY DK</div>
                        </div>
                    </Row>
                    <Row className="d-flex align_bottom xs_center" style={{height: '50%'}}>
                            <div className='content_text'>PRICE</div>
                            <div className='content_text mb-2'><b>.1 ETH</b></div>
                            {renderUserInterface()}
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
export default Nox;


