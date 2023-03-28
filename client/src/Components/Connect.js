import React, { Component } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { Button } from "react-bootstrap";
import { AccountInfoContext } from '../Context/AccountInfo'
import Lux  from "../contracts/Lux.json";
import LuxAuction  from "../contracts/LuxAuction.json";
import LuxMint  from "../contracts/LuxMint.json";
import AL from "../AL/signedList.json"

class Connect extends Component {
  
  static contextType =  AccountInfoContext
  
  // componentDidMount = async () => {

  //   const providerOptions = {
  //     walletconnect: {
  //       package: WalletConnectProvider, // required
  //       options: {
  //         infuraId: process.env.REACT_APP_INFURA_PROJECT_ID1 // required
  //       }
  //     },
  //     coinbasewallet: {
  //       package: CoinbaseWalletSDK, // Required
  //       options: {
  //         appName: "BirdBlotter", // Required
  //         infuraId: process.env.REACT_APP_INFURA_PROJECT_ID1, // Required
  //         rpc: "", // Optional if `infuraId` is provided; otherwise it's required
  //         chainId: process.env.REACT_APP_MAINNET_NETWORK, // Optional. It defaults to 1 if not provided
  //         darkMode: false // Optional. Use dark theme, defaults to false
  //       }
  //     }
  //   };

  //   this.web3Modal = new Web3Modal({
  //     // network: "RINKEBY", // optional
  //     // cacheProvider: true, // optional
  //     providerOptions // required
  //   });

    
  //   // if (window.ethereum) {
  //   //   console.log('here')
  //   //   // this.web3 = new Web3(window.ethereum);
  //   //   // this.web3 = new Web3(this.provider)
  //   //   console.log(this.web3)
  //   // } else 
  //   if (window.web3) {
  //     this.web3  = new Web3(window.web3.currentProvider);
  //   };
  //   if(this.web3){
  //     await this.setNetwork();
  //     await this.getContractsInstances();
  //     await this.setAccount();
  //   }
  // }

  componentDidMount = async () => {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3  = new Web3(window.web3.currentProvider);
    };
    if(this.web3){
      await this.setNetwork();
      await this.getContractsInstances();
      await this.setAccount();
    }
  }

  async getContractsInstances(){
    this.networkId = await this.web3.eth.net.getId();
    this.deployedNetwork = Lux.networks[this.networkId];
    this.luxInstance = new this.web3.eth.Contract(
      Lux.abi,
      parseInt(process.env.REACT_APP_MAINNET_NETWORK) && process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS
    )
    this.luxAuctionInstance = new this.web3.eth.Contract(
      LuxAuction.abi,
      parseInt(process.env.REACT_APP_MAINNET_NETWORK) && process.env.REACT_APP_MAINNET_LUXAUCTION_ADDRESS
    )
    this.luxMintInstance = new this.web3.eth.Contract(
      LuxMint.abi,
      parseInt(process.env.REACT_APP_MAINNET_NETWORK) && process.env.REACT_APP_MAINNET_LUXMINT_ADDRESS
    )
    this.OSContractInstance = new this.web3.eth.Contract(
      Lux.abi,
      parseInt(process.env.REACT_APP_MAINNET_NETWORK) && process.env.REACT_APP_MAINNET_OSCONTRACT_ADDRESS
    )
    this.context.updateAccountInfo({
      luxInstance: this.luxInstance, 
      luxAuctionInstance: this.luxAuctionInstance, 
      luxMintInstance: this.luxMintInstance,
      OSContractInstance: this.OSContractInstance})
    this.getMintInfo();
  }

  async setAccount(){
    if(this.context.networkId !== null){
      let accounts = await this.web3.eth.getAccounts();
      await this.context.updateAccountInfo({account: accounts[0]});
      if(accounts[0]) this.getAccountsData(accounts[0])
    }else{
      this.resetAccountData();
    }
  }

  resetAccountData(){
    this.context.updateAccountInfo({
      account: null,
    })
  }

  async setNetwork(){
    if(this.web3){
      let networkId = await this.web3.eth.net.getId();
      this.context.updateAccountInfo({networkId: networkId})
    }
  }

  async getAccountsData(account){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({walletETHBalance: await this.web3.eth.getBalance(account)});
      this.context.updateAccountInfo({hasMintedNox: await this.luxMintInstance.methods._hasMintedALToken(account).call()})
      this.context.updateAccountInfo({hasMintedMox: await this.luxMintInstance.methods._hasMintedBurnToken(account).call()})
      let signedMessage = await this.findSignedMessage(account);
      this.context.updateAccountInfo({signedMessage: signedMessage})
      this.context.updateAccountInfo({devotedBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '20120243526926311683519745435316742329827468478987451852585008396544914751506').call())})
      this.context.updateAccountInfo({certitudeBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '20120243526926311683519745435316742329827468478987451852585008393246379868164').call())})
      this.context.updateAccountInfo({eternalBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '20120243526926311683519745435316742329827468478987451852585008397644426379284').call())})
      this.context.updateAccountInfo({surrenderBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '20120243526926311683519745435316742329827468478987451852585008395445403123749').call())})
      this.context.updateAccountInfo({brokenBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '20120243526926311683519745435316742329827468478987451852585008394345891495947').call())})
      this.context.updateAccountInfo({isApprovedForAll: await this.OSContractInstance.methods.isApprovedForAll(account, this.luxMintInstance._address).call()})
    }
  }

  async findSignedMessage(account){
    let signedMessage = null
    for(let i=0;i<AL.length;i++){
      let key = Object.keys(AL[i])[0]
      if(key.toLowerCase() === account.toLowerCase()){
        signedMessage = AL[i][key]
      }
    }
    return signedMessage
  }

  async getMintInfo(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      // Bellum
      // this.context.updateAccountInfo({currentBellumTopBid: parseFloat(await this.luxAuctionInstance.methods._currentTopBid().call())})
      // this.context.updateAccountInfo({bellumDropOpened: await this.luxAuctionInstance.methods._isLive().call()})
      // this.context.updateAccountInfo({minBid: parseFloat(await this.luxAuctionInstance.methods._minBid().call())})
      // this.context.updateAccountInfo({highestBidder: parseFloat(await this.luxAuctionInstance.methods._highestBidder().call())})

      // NOX
      this.context.updateAccountInfo({noxMintPrice: parseFloat(await this.luxMintInstance.methods._ALMintPrice().call())})
      this.context.updateAccountInfo({noxDropOpened: await this.luxMintInstance.methods._ALMintOpened().call()})
      // this.context.updateAccountInfo({noxMintOpened: await this.luxMintInstance.methods._ALMintOpened().call()})

      // // MOX
      // this.context.updateAccountInfo({moxMintPrice: parseFloat(await this.luxMintInstance.methods._burnMintPrice().call())})
      this.context.updateAccountInfo({moxDropOpened: await this.luxMintInstance.methods._burnMintOpened().call()})

      // Lux
      // this.context.updateAccountInfo({currentLuxTopBid: parseFloat(await this.luxAuctionInstance.methods._currentTopBid().call())})
      // this.context.updateAccountInfo({luxDropOpened: await this.luxAuctionInstance.methods._isLive().call()})
      // this.context.updateAccountInfo({minBid: parseFloat(await this.luxAuctionInstance.methods._minBid().call())})
      // this.context.updateAccountInfo({highestBidder: parseFloat(await this.luxAuctionInstance.methods._highestBidder().call())})
    }
  }

  // async connectWallet(){
  //   this.context.updateAccountInfo({transactionInProgress: true})
  //   try{
  //     this.provider = await this.web3Modal.connect();
  //     this.web3 = new Web3(this.provider)
  //   }catch(error){
  //     console.log(error)
  //   }
  //   this.context.updateAccountInfo({transactionInProgress: false})
  // }

  async connectWallet(){
    this.context.updateAccountInfo({transactionInProgress: true})
    try{
      window.ethereum.enable()
    }catch(error){
      console.log(error)
    }
    this.context.updateAccountInfo({transactionInProgress: false})
  }

  getAccountStr(account){
    let response = account.slice(0, 5) +  '...' + account.substring(account.length - 2)
    return response
  }

  renderUserInterface(){
    if(!this.context.account){
      return <Button className="m-3" variant="outline-light" onClick={() => this.connectWallet()}>Connect</Button>
    }else if(parseInt(this.context.networkId) !== parseInt(this.context.contractNetwork)){
      return <p style={{color: 'white'}}>Please connect to Ethereum Mainnet</p>
    }else return <Button variant="outline-light">Connected as {this.getAccountStr(this.context.account)}</Button>
  }

  render() {
    if(this.web3){
      window.ethereum.on('accountsChanged', async () => {
        await this.setAccount()
      })
      window.ethereum.on('networkChanged', async () => {
        await this.setNetwork()
        await this.setAccount();
      });
      // window.ethereum.on('chainChanged', async () => {
      //   await this.setNetwork()
      //   await this.setAccount();
      // });
    }
    return this.renderUserInterface()
  }
  
}


export default Connect;
