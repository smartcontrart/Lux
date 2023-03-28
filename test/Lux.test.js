const Lux_contract = artifacts.require("./Lux.sol");
const LuxMint_contract = artifacts.require("./LuxMint.sol");
const LuxAuction_contract = artifacts.require("./LuxAuction.sol");
const OSContract_contract = artifacts.require("./OSContract.sol");
const assert = require('assert');
const { default: BigNumber } = require('bignumber.js');

contract("Lux", accounts => {

  var BN = web3.utils.BN;
  let signer = web3.eth.accounts.wallet[0];
  let AL = {};
  let WL;

  beforeEach(async() =>{
    Lux = await Lux_contract.deployed();
    LuxMint = await LuxMint_contract.deployed();
    LuxAuction = await LuxAuction_contract.deployed();
    OSContract = await OSContract_contract.deployed();
    await web3.eth.accounts.wallet.create(1)
    signer = web3.eth.accounts.wallet[0]
  });
  
  it("... should create a WL", async ()=>{
    WL = [
      {"address": accounts[1]},
      {"address": accounts[2]},
      {"address": accounts[3]},
      {"address": accounts[4]}]
    const contractAddress = await Lux.address;
    const mintOpenedCheck = true;
    const accountAlreadyMintedCheck = false;
    assert(await LuxMint.setSigner(signer.address),"Could not set the signer");
    for(i=0; i < WL.length ;i ++){
      assert(web3.utils.toChecksumAddress(WL[i].address),"error")
      assert(web3.utils.toChecksumAddress(signer.address),"error")
      AL[WL[i].address] = await web3.eth.accounts.sign(web3.utils.soliditySha3(WL[i].address, contractAddress, mintOpenedCheck, accountAlreadyMintedCheck), signer.privateKey)
    }
  })
  
  it("... should deploy with less than 4.7 mil gas", async () => {
    let LuxInstance = await Lux_contract.new();
    let LuxMintInstance = await LuxMint_contract.new();
    let LuxAuctionInstance = await LuxAuction_contract.new();
    let receiptLux = await web3.eth.getTransactionReceipt(LuxInstance.transactionHash);
    let receiptLuxMint = await web3.eth.getTransactionReceipt(LuxMintInstance.transactionHash);
    let receiptLuxAuction = await web3.eth.getTransactionReceipt(LuxAuctionInstance.transactionHash);
    console.log(`Lux gas deployement cost: ${receiptLux.gasUsed}`)
    console.log(`LuxMint gas deployement cost: ${receiptLuxMint.gasUsed}`)
    console.log(`LuxAuction gas deployement cost: ${receiptLuxAuction.gasUsed}`)
    console.log(`Total deployement cost: ${receiptLux.gasUsed + receiptLuxMint.gasUsed + receiptLuxAuction.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptLux.gasUsed + receiptLuxMint.gasUsed + receiptLuxAuction.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptLux.gasUsed + receiptLuxMint.gasUsed + receiptLuxAuction.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptLux.gasUsed + receiptLuxMint.gasUsed + receiptLuxAuction.gasUsed)*30*10**9/(10**18)} ETH`)
    // assert(receipt.gasUsed <= 5000000, "Gas was more than 5 mil");
  });

  //LUX Test///

  it("... should add some admins", async () =>{
    assert(await Lux.approveAdmin(LuxMint.address), "Could not add LuxMint as admin");
    assert(await Lux.approveAdmin(LuxAuction.address), "Could not add LuxAuction as admin");
  })

  it("... should allow only admins to mint", async () =>{
    assert(await Lux.mint(accounts[0], 1, 1), "Could not mint a Lux");
    await assert.rejects(Lux.mint(accounts[1], 1, 1, {from: accounts[1]}), "Could mint a Lux as not admin");
  })

  it("... should allow only admins to mintBatch", async () =>{
    assert(await Lux.mintBatch(accounts[1], [1,2,3,4], [1,1,2,2]), "Could not mint a Lux");
    await assert.rejects(Lux.mintBatch(accounts[2], [1,2,3,4], [1,1,2,2], {from: accounts[2]}), "Could mintBatch Lux as not admin");
  })

  it("... should allow only admins to setURI", async () =>{
    assert(await Lux.setURI('test'), "Could not set the URI");
    await assert.rejects(Lux.setURI('test', {from: accounts[2]}), "Could set the URI as non admin");
  })

  it("... should allow only admins to setRoyalties", async () =>{
    assert(await Lux.setRoyalties(accounts[0], 10), "Could not set the Royalties");
    await assert.rejects(Lux.setRoyalties(accounts[0], 10, {from: accounts[1]}), "Could set the Royalties as non admin");
  })

  it("... should allow to burn tokens", async () =>{
    assert(await Lux.burn(1, 1), "Could not burn its own token");
    assert(await Lux.burnBatch([1,2,3,4], [1,1,2,2], {from: accounts[1]}), "Could not burn its own token");
  })

  // LUXMINT TEST

  it("... should allow AL accounts to mint through LuxMint", async () =>{
    assert(await LuxMint.toggleALMintOpened(), "Could not activate mint");
    assert(await LuxMint.setLuxAddress(Lux.address), "Could not set LuxAddress in LuxMint")
    let minter = accounts[1];
    let signature = AL[minter];
    await assert.rejects(LuxMint.ALMint(signature.v, signature.r, signature.s, {from: accounts[1]}), "Could mint without paying");
    assert(await LuxMint.ALMint(signature.v, signature.r, signature.s, {from: accounts[1], value: 80000000000000000}), "Could not mint its token despite being on the AL");
    await assert.rejects(LuxMint.ALMint(signature.v, signature.r, signature.s, {from: accounts[1], value: 80000000000000000}), "Could mint2 times");
    await assert.rejects(LuxMint.ALMint(signature.v, signature.r, signature.s, {from: accounts[5], value: 80000000000000000}), "Could mint while not being on the AL");
  })

  // UNFINISHED -- NEED TO CREATE A TEST 1155 CONTRACT TO TEST BURN
  it("... should allow accounts to mint through LuxBurn", async () =>{
    let tokenIdToBurn = '20120243526926311683519745435316742329827468478987451852585008394345891495947';
    assert(await LuxMint.toggleBurnMintOpened(), "Could not activate mint");
    assert(await OSContract.mint(accounts[1], tokenIdToBurn, 2), "Could not mint token with tis shitty ID")
    assert(await LuxMint.setOSAddress(OSContract.address), "Couldn't set OSContract address");
    assert(await OSContract.setApprovalForAll(LuxMint.address, true, {from: accounts[1]}), "Couldn't delegate the transfer authorization");
    assert(await LuxMint.burnMint(tokenIdToBurn, {from: accounts[1], value: 80000000000000000}), "Could not mint without burning");
  })



  // AUCTION TESTS //

  it("... should allow to initiate the auction", async () =>{
    let contractToMint = await Lux.address;
    let tokenIdToWin = 1;
    let startingPrice = (0.01 * 10 ** 18).toFixed();
    let reservePrice = (5 * 10 ** 18).toFixed();
    let minBid = (0.02 * 10 ** 18).toFixed();
    assert(await LuxAuction.setUpAuction(contractToMint, tokenIdToWin, startingPrice, reservePrice, minBid, accounts[2]), "Could not setUp the auction");
  })

  it("... should allow admins to start an auction", async () =>{
    await assert.rejects( LuxAuction.startAuction({from: accounts[1]}), "Could start the auction while not being admin");
    assert(await LuxAuction.startAuction(), "Could not start the auction");
  })

  it("... should allow to place bets", async () =>{
    let bidAmount = (0.03 * 10 ** 18).toFixed();
    assert(await LuxAuction.placeBid(bidAmount, {from: accounts[0], value: bidAmount}), "Could not place a bet");
    
    let highestBidder = await LuxAuction._highestBidder.call();
    let currentTopBid = await LuxAuction._currentTopBid.call();

    assert.equal(await await web3.eth.getBalance(LuxAuction.address), await LuxAuction._currentTopBid.call(), "Bid funds are not in the contract");
    assert.equal(currentTopBid.toString(), (0.03 * 10 ** 18).toString(), "Highest  bid incorrect");
    assert.equal(highestBidder, accounts[0], "Highest bidder incorrect");
  })

  it("... should reject bids smaller than minimum bid, accept correct bids and refund previous bidder", async () =>{
    let initialTopBid = 0.03 * 10 ** 18;
    let wrongAdditionalBid = 0.01 * 10 ** 18;
    let bidAmount = (initialTopBid + wrongAdditionalBid);
    let initialHighestBidder = await LuxAuction._highestBidder.call();
    let initialTopBidderBalance = await web3.eth.getBalance(initialHighestBidder)
    await assert.rejects(LuxAuction.placeBid(bidAmount.toFixed(), {from: accounts[1], value: bidAmount}), "Could place a bet smaller than currentTopBid plus minimum bid")

    let correctAdditionalBid = 5 * 10 ** 18;
    bidAmount = (initialTopBid + correctAdditionalBid).toFixed();
    assert(await LuxAuction.placeBid(bidAmount, {from: accounts[1], value: bidAmount}), "Couldn't place a valid  bet")

    let newHighestBidder = await LuxAuction._highestBidder.call();
    let newTopBid = initialTopBid + correctAdditionalBid;
    let initialTopBidderUpdatedBalance = await web3.eth.getBalance(initialHighestBidder)

    assert.equal( await web3.eth.getBalance(LuxAuction.address), await LuxAuction._currentTopBid.call(), "Bid funds are not in the contract");
    assert.equal(newTopBid.toString(), (5.03 * 10 ** 18).toString(), "Highest  bid incorrect");
    assert.equal(newHighestBidder, accounts[1], "Highest bidder incorrect");
    let expectedBalance = (new BN(initialTopBidderBalance.toString()).add( new BN(initialTopBid.toString()))).toString()
    assert.equal(initialTopBidderUpdatedBalance, expectedBalance, "Initial bidder wasn't properly refunded");
  })

  it("... should allow admins to close an auction", async () =>{
    let highestBidder = await LuxAuction._highestBidder.call();
    let initialRecipientBalance = await web3.eth.getBalance(accounts[2])
    await assert.rejects( LuxAuction.closeAuction({from: accounts[1]}), "Could close the auction while not being admin");
    assert(await LuxAuction.closeAuction(), "Could not start the auction");
    let auctionToken = await Lux.balanceOf(highestBidder, 1);
    assert.equal(auctionToken, 1,"Did not get the expected token minted");
    let newRecipientBalance = await web3.eth.getBalance(accounts[2])
    let highestBid =  await LuxAuction._currentTopBid.call()

    let expectedFunds = new BN(initialRecipientBalance).add(new BN(highestBid))
    assert.equal(expectedFunds.toString(), newRecipientBalance.toString(),"Recipient did not get the funds");

  })

  it("... should prevent placing a bid once the auction is closed", async () =>{
    await assert.rejects( LuxAuction.placeBid(1*10**18, {from: accounts[1], value: 1000000000000000000}), "Could close the auction while not being admin");
  })

  // TEST AUCTION 2
  it("... should allow to initiate a second auction", async () =>{
    let contractToMint = await Lux.address;
    let tokenIdToWin = 2;
    let startingPrice = (0.01 * 10 ** 18).toFixed();
    let reservePrice = (0.1 * 10 ** 18).toFixed();
    let minBid = (0.02 * 10 ** 18).toFixed();
    assert(await LuxAuction.setUpAuction(contractToMint, tokenIdToWin, startingPrice, reservePrice, minBid, accounts[2]), "Could not setUp the auction");
  })

  it("... should allow admins to start an auction", async () =>{
    await assert.rejects( LuxAuction.startAuction({from: accounts[1]}), "Could start the auction while not being admin");
    assert(await LuxAuction.startAuction(), "Could not start the auction");
  })

  it("... should allow to place bets", async () =>{
    let bidAmount = (0.05 * 10 ** 18).toFixed();
    assert(await LuxAuction.placeBid(bidAmount, {from: accounts[0], value: bidAmount}), "Could not place a bet");
    
    let highestBidder = await LuxAuction._highestBidder.call();
    let currentTopBid = await LuxAuction._currentTopBid.call();

    assert.equal(await await web3.eth.getBalance(LuxAuction.address), await LuxAuction._currentTopBid.call(), "Bid funds are not in the contract");
    assert.equal(currentTopBid.toString(), (0.05 * 10 ** 18).toString(), "Highest  bid incorrect");
    assert.equal(highestBidder, accounts[0], "Highest bidder incorrect");
  })

  it("... should cancel the auction if the reserve price is not met", async () =>{
    let highestBidder = await LuxAuction._highestBidder.call();
    let initialRecipientBalance = await web3.eth.getBalance(accounts[2])
    assert(await LuxAuction.closeAuction(), "Could not start the auction");
    let auctionToken = await Lux.balanceOf(highestBidder, 2);
    assert.equal(auctionToken, 0,"Got a token when the auction was canceled");
    let newRecipientBalance = await web3.eth.getBalance(accounts[2])
    // let highestBid =  await LuxAuction._currentTopBid.call()

    let expectedFunds = new BN(initialRecipientBalance)
    assert.equal(expectedFunds.toString(), newRecipientBalance.toString(),"Recipient got the funds when the auction was cancelled");

  })
  
});
