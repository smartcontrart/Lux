import React, {useState, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert} from 'react-bootstrap'
import { Link } from "react-router-dom";
import { AccountInfoContext } from "../Context/AccountInfo";
import bellum from '../images/bellum_frame.png'
import nox from '../images/nox_frame.png'
import mox from '../images/mox_frame.png'
import lux from '../images/lux_frame.png'
import frame3 from '../images/Frame 3.png'
import frame4 from '../images/Frame 4.png'
import music from '../images/Lux_DK.mp3'
import play_button from '../images/play.png'
import pause_button from '../images/pause.png'

import '../App.css'

function Home() {
    let accountInfo = useContext(AccountInfoContext)
    let cards=[
        {image: bellum, title: 'BELLUM', link: "https://opensea.io/assets/ethereum/0x85c8add62b48ed0ae69edfe0460758648c25a64a/1", description: ['1/1', 'COLLABORATION WITH BEGONIA CHAN', '24-HOUR AUCTION BEGINS AT 1:00PM PST JULY 24TH', 'LIFETIME ALLOWLIST', 'RESERVE PRICE .1 ETH']},
        {image: nox, title: 'NOX', link: "/nox", description: ['MULTI-EDITION', 'REVEAL ON JULY 31ST', 'SALE BEGIN AUGUST 7TH', '.1 ETH']},
        {image: mox, title: 'MOX', link: "/mox", description: ['MULTI-EDITION', 'REVEAL ON AUGUST 10TH', 'SALE BEGIN ON AUGUST 14TH AT 10:00AM EST', 'TRUST BONUS BURN']},
        {image: lux, title: 'LUX', link: "https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/20120243526926311683519745435316742329827468478987451852585008399843449634817", description: ['1/1', 'REVEAL ON AUGUST 17TH', '24-HOUR AUCTION BEGINS AT 10:00AM PST AUGUST 20TH', 'LIFETIME ALLOWLIST', 'FRAMED PHYSICAL PRINT', 'RESERVE PRICE .1 ETH']}
    ]

    const renderCard  = (card) => {
        if(card.title === 'BELLUM' || card.title === 'LUX' ){
            return(
                <React.Fragment>
                    <div>
                        <a target="_blank" rel='noopener noreferrer' href={card.link}>
                            <img
                                className="card_img"
                                src={card.image}
                                alt={card.title}>
                            </img>
                        </a>
                    </div>
                    <h3 className='m-3'><b>{card.title}</b></h3>
                    <React.Fragment>
                        {mapDescriptions(card.description)}
                    </React.Fragment>
                </React.Fragment>
            )
        }else{
            return(
                <React.Fragment>
                    <div>
                        <Link to={card.link}>
                        <img
                            className="card_img"
                            src={card.image}
                            alt={card.title}>
                        </img>
                        </Link>
                    </div>
                    <h3 className='m-3'><b>{card.title}</b></h3>
                    <React.Fragment>
                        {mapDescriptions(card.description)}
                    </React.Fragment>
                </React.Fragment>
            )
        }
    }

    const mapDescriptions = (descriptions)=>{
        return(
            descriptions.map((description, key)=>{
                return (
                    <div key={key}  style={{fontSize: '0.7em', maxWidth: '50%', marginLeft:'auto', marginRight:'auto', marginBottom: '5px'}}>
                        {description}
                    </div>
                )
            })
        )
    }

    const mapCards = ()=>{
        return(
            cards.map((card, key)=>{
                return (
                    <Col key={key}>
                        {renderCard(card)}
                    </Col>
                )
            })
        )
    }

    function play(){
        document.getElementById('player').play()
    }
    function pause(){
        document.getElementById('player').pause()
    }


    return ( 
        <Container>
            <Row>
                {mapCards()}
            </Row>
            <Row className="d-flex align-items-left justify-content-center mt-3">
                <audio id="player" src={music} type="audio/mpeg">
                    <source src={music} type="audio/mpeg"/>
                </audio>
                <div> 
                    <img src={play_button} onClick={play} height='15' /> 
                    <img src={pause_button} onClick={pause} height='15' className="m-2"/> 
                    <span>MUSIC COMPOSED BY BEGONIA CHAN</span>
                </div>
               {/* <audio controls>
                    <source src={music} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio> */}
            </Row>
        </Container>
     );
}

export default Home;


