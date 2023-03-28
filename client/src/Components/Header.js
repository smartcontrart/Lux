import React, {useState, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import {Link} from  'react-router-dom'
import star from "../images/Star.png"
import logo from "../images/Lux_Logo.png"

import '../App.css'

function Header() {
    return ( 
        <Container className="mb-5">
            <Row>
                <Col>
                    <Link to="/">
                        <img className="star mb-2" src={star}/>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to="/">
                        <img className="logo m-3" src={logo}/>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col style={{fontSize: '0.7em'}}>
                    A PHOTOGRAPHY COLLECTION BY DK
                </Col>
            </Row>
        </Container>
     );
}

export default Header;


