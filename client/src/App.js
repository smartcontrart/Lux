import React, {useContext} from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
// import Connect from './Components/Connect';
import Header from './Components/Header';
import Home from './Components/Home';
import Bellum from './Components/Bellum';
import Nox from './Components/Nox';
import Mox from './Components/Mox';
import Lux from './Components/Lux';
import ComingSoon from './Components/ComingSoon';
import ConnexionStatus from './Components/ConnexionStatus';
import AccountInfoProvider from './Context/AccountInfo';
import ContractInfoProvider from './Context/ContractInfo';
import DropConfigProvider from './Context/DropConfig.js';
import {Routes,Route} from "react-router-dom";
import background from './images/LUX-GraniteBackground.jpg'
import './App.css'

function App() {
  return (
    <DropConfigProvider>
        <AccountInfoProvider>
          <ContractInfoProvider>
            <div className="App d-flex align-items-center justify-content-center">
              <div className="background d-flex align-items-center justify-content-center" style={{backgroundImage: `url(${background})`,}}>
                <Container>
                  <Row  className="h-25 d-inline-block" style={{height:'auto'}}>
                    <Header/>
                  </Row >
                    <Row id='App_row' className="d-flex align-items-center justify-content-center" style={{minHeight:'60vh'}}>
                      <Col className="d-flex align-items-center justify-content-center m-3">
                        <Routes>
                          <Route path="/" element={<Home/>} />
                          <Route path="/bellum" element={<Bellum />}/>
                          <Route path="/nox" element={<Nox />} />
                          <Route path="/mox" element={<Mox />} />
                          <Route path="/lux" element={<ComingSoon />} />
                        </Routes>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <ConnexionStatus/>
                      </Col>
                    </Row>
                </Container>
              </div>
            </div>
          </ContractInfoProvider>
        </AccountInfoProvider>
      </DropConfigProvider>
  );
}

export default App;