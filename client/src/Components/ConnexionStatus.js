import React, { useContext } from "react";
import { AccountInfoContext } from "../Context/AccountInfo";
import Connect from "./Connect";

function ConnexionStatus() {
    let accountInfo = useContext(AccountInfoContext)
    if(accountInfo.account){
        return(
            <React.Fragment>
                <span id='connexion_info'><small>CONNECTED AS <b>{accountInfo.account}</b></small></span><br/>
                <span id='connexion_info'><small>CONTRACT ADDRESS <b><a className="etherscan_link" href={"https://etherscan.io/address/"+process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS}>{process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS}</a></b></small></span>
            </React.Fragment>
        )
    }else return <Connect/>
}

export default ConnexionStatus;