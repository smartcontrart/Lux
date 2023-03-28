// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.13;

import "./Lux.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract LuxAuction {

    uint256 public _startingPrice;
    uint256 public _reservePrice;
    uint256 public _minBid;
    uint256 public _currentTopBid;
    uint256 public _tokenIdToWin;

    address public _contractToMint;
    address public _highestBidder;
    address public _auctionBeneficiary;
    
    bool public _isLive;

    mapping(address => bool) _isAdmin;

    event PlacedBid( address bidder, uint256 amount);
    event AuctionEnded (address winner);
    event AuctionCancelled (address _highestBidder, uint256 refundAmount);


    constructor(){
        _isAdmin[msg.sender] = true;
    }

    function setUpAuction(
        address contractToMint, 
        uint256 tokenIdToWin ,
        uint256 startingPrice,
        uint256 reservePrice,
        uint256 minBid,
        address auctionBeneficiary
    )external{
        require(_isAdmin[msg.sender], "Only an admin can start an auction");
        require(contractToMint != address (0), "Invalid contract address");
        _contractToMint = contractToMint;
        _tokenIdToWin = tokenIdToWin;
        _startingPrice = startingPrice;
        _reservePrice = reservePrice;
        _minBid = minBid;
        _currentTopBid = 0;
        _highestBidder = address(0);
        _auctionBeneficiary = auctionBeneficiary;
    }

    function startAuction()external{
        require(_isAdmin[msg.sender], "Only an admin can start an auction");
        require(!_isLive, "Auction is already opened");
        _isLive = true;
    }


    function placeBid(
        uint256 amount
    )external payable{
        require(amount >= _currentTopBid + _minBid, "Bid too small");
        require(msg.value >= amount, "Not enough funds sent");
        require(_isLive, "Auction is closed");
        // payable(address(this)).transfer(amount);
        if(_highestBidder != address(0)){
            returnCurrentBid();
        }
        _highestBidder = msg.sender;
        _currentTopBid = amount;
        emit PlacedBid(msg.sender, amount);
    }

    function closeAuction()external{
        require(_isAdmin[msg.sender], "Only an admin can close an auction");
        require(_isLive, "Auction is already closed");
        require(_auctionBeneficiary != address(0)   , "Auction beneficiary can't be 0 address");
        if(_currentTopBid >= _reservePrice){
            Lux(_contractToMint).mint(_highestBidder, _tokenIdToWin, 1);
            payable(_auctionBeneficiary).transfer(address(this).balance);
            _isLive = false;
            emit AuctionEnded(_highestBidder);
        }else{
            cancelAuction();
        }
    }

    function cancelAuction()public{
        require(_isAdmin[msg.sender], "Only an admin can cancel an auction");
        require(_isLive, "You cannot cancel a closed Auction");
        returnCurrentBid();
        _isLive = false;
        emit AuctionCancelled (_highestBidder, _currentTopBid);
    }

    function withdrawContractFunds(address recipient) external {
        require(_isAdmin[msg.sender], "Only an admin can retrun the funds auction");
        payable(recipient).transfer(address(this).balance);
    }

    function addAdmin(address newAdmin) external{
        require(_isAdmin[msg.sender], "Only an admin can add another one");
        _isAdmin[newAdmin] = true;
    }

    function returnCurrentBid()internal{
        require(_highestBidder != address(0), "Cannot refund the 0 address");
        require(_currentTopBid >= 0, "Cannot refund a bid of 0");
        payable(_highestBidder).transfer(_currentTopBid);
    }

}