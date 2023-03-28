import React, {useState, useContext} from "react";
import {Row, Col, Button, Spinner, Alert, Container, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import Timer from './Timer.js'
import mox from '../images/MOX.jpg'
import '../App.css'


function Mox() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})
    const [tokenToBurn, setTokenToBurn] = useState('')

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

    async function handleBurn(){
        if(tokenToBurn === 'invalid'){
            setAlert({active: true, content: 'Invalid token selection', variant: "warning"})
        }else{
            try{
                if(!accountInfo.isApprovedForAll){
                    accountInfo.updateAccountInfo({userFeedback: 'Approving contract to burn Trust token...'})
                    await accountInfo.OSContractInstance.methods.setApprovalForAll(accountInfo.luxMintInstance._address, 'true').send({from: accountInfo.account})
                    accountInfo.updateAccountInfo({isApprovedForAll: true});
                }
                accountInfo.updateAccountInfo({userFeedback: 'Minting MOX...'})
                await accountInfo.luxMintInstance.methods.burnMint(tokenToBurn).send({from: accountInfo.account});
            }
            catch(error){
                setAlert({active: true, content: error.message, variant: "warning"})
            }
            accountInfo.updateAccountInfo({userFeedback: null})
        }
    }

    async function handleMint(){
        accountInfo.updateAccountInfo({userFeedback: "Minting..."})
        try{
            await accountInfo.luxMintInstance.methods.burnMint(tokenToBurn).send({from: accountInfo.account});
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
        let time = '14 Aug 2022 09:00:00 EST'
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
        }else if(!accountInfo.moxDropOpened){
            return renderTimer()
        }else if(accountInfo.hasMintedMox){
            return <div className='content_text'>Congratulations on minting MOX!</div>
        }else if(accountInfo.devotedBalance === 0 &&
                accountInfo.certitudeBalance === 0 &&
                accountInfo.eternalBalance === 0 &&
                 accountInfo.surrenderBalance === 0 &&
                 accountInfo.brokenBalance === 0    ){
                    console.log(accountInfo.hasMintedMox)
            return <div className='content_text'>Apologies, but you don't have a token eligible to burn...</div>
        }else{
            console.log(accountInfo.devotedBalance)
            console.log(accountInfo.certitudeBalance)
            console.log(accountInfo.eternalBalance)
            console.log(accountInfo.surrenderBalance)
            console.log(accountInfo.brokenBalance)
           return (
            <React.Fragment>
                {renderChoice()}
               <Button variant='light' style={{maxWidth: '100px'}} className='mx-2' onClick={()=>handleBurn()}>Burn</Button>
            </React.Fragment>
           )
        }
    }

    function handleChange(event){
        setTokenToBurn(event.target.value)
    }

    function renderChoice(){
        const options = [
            {name: 'Devoted', image: mox ,quantity: accountInfo.devotedBalance, id:'20120243526926311683519745435316742329827468478987451852585008396544914751506'},
            {name: 'Certitude', image: mox ,quantity: accountInfo.certitudeBalance, id:'20120243526926311683519745435316742329827468478987451852585008393246379868164'},
            {name: 'Eternal', image: mox ,quantity: accountInfo.eternalBalance, id:'20120243526926311683519745435316742329827468478987451852585008397644426379284'},
            {name: 'Surrender', image: mox ,quantity: accountInfo.surrenderBalance, id:'20120243526926311683519745435316742329827468478987451852585008395445403123749'},
            {name: 'Broken', image: mox ,quantity: accountInfo.brokenBalance, id:'20120243526926311683519745435316742329827468478987451852585008394345891495947'}
        ]

        const choices = options.filter(choice => {
            return choice.quantity > 0;
          });

        return(
            <Form.Select className='m-2' onChange={handleChange}>
                <option value='invalid'>Select a token to burn</option>
                {mapAvailablechoices(choices)}
            </Form.Select>
        )
    }

    function mapAvailablechoices(choices){
        return(
            choices.map((choice, key)=>{
                return(
                    <option value={choice.id}>{choice.name}</option>
                )
            })
        )
    }

    return ( 
        <Container className="content align-items-center justify-content-center" >
            <Row className="d-flex align-items-left justify-content-center">
                <Col xs={12} md={8}>
                    <img src={mox} className="NFT_visual"/>
                </Col>
                <Col xs={12} md={4}>
                    <Row className="sm_center mt-sm-0" style={{height: '50%'}}>
                        <div>
                            <h3 className='content_text' ><b>MOX</b></h3>
                            <div className='content_text'>BURN REQUIRED</div>
                            <div className='content_text'>PHOTOGRAPHY BY DK</div>
                        </div>
                    </Row>
                    <Row className="d-flex align_bottom xs_center" style={{height: '50%'}}>
                            <div className='content_text'>PRICE</div>
                            <div className='content_text mb-2'><b>BURN OF ONE TRUST BONUS MINT</b></div>
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
export default Mox;


