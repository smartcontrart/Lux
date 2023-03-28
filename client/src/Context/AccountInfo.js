import React, { Component, createContext } from 'react';

export const AccountInfoContext = createContext();

class AccountInfoProvider extends Component {
    state = {
        LuxAddress: process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS,
        LuxMintAddress: process.env.REACT_APP_MAINNET_LUXMINT_ADDRESS,
        LuxAuctionAddress: process.env.REACT_APP_MAINNET_LUXAUCTION_ADDRESS,
        account: null,
        networkId: null,
        transactionInProgress: false,
        userFeedback: null,
        contractNetwork: process.env.REACT_APP_MAINNET_NETWORK,
        walletETHBalance: 0,
        loadedNFTs: false,
        connectWallet: null,
        hasMinted: null,

        // BELLUM
        currentBellumTopBid: 0,
        bellumDropOpened: false,
        minBid: 0,
        highestBidder: null,

        // NOX
        signedMessage: null,
        noxMintPrice: 0,
        hasMintedNox: false,
        noxDropOpened: false,
        devotedBalance: null,
        certitudeBalance: null,
        eternalBalance: null,
        surrenderBalance: null,
        brokenBalance: null,
        isApprovedForAll: false,


        // MOX
        moxMintPrice: 0,
        moxDropOpened: false,
        
        //LUX
        currentLuxTopBid: 0,
        luxDropOpened: false,
    }

    updateAccountInfo = (updatedData) =>{
        for (const [key, value] of Object.entries(updatedData)) {
            this.setState(prevState=>({
                ...prevState,
                [key]: value
            }))
        }
    }

    render(){
        return(
            <AccountInfoContext.Provider 
                value={{
                    ...this.state, 
                    updateAccountInfo: this.updateAccountInfo,
                    }}>
                {this.props.children}
            </AccountInfoContext.Provider>
        )
    }

}
export default AccountInfoProvider;