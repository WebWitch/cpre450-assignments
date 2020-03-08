# Usage

> $ orbd -ORBInitialPort 1050 -ORBInitialHost localhost&
> $ idlj -fall Auction.idl
> $ javac AuctionClient.java AuctionServer.java
> $ java AuctionServer -ORBInitialPort 1050 -ORBInitialHost localhost&
> $ java AuctionClient -ORBInitialPort 1050 -ORBInitialHost localhost

# System Design Document

## Introduction

### Purpose of the System

In a distributed auction, it is necessary to communicate between a client and server to bid on the auction and sell when an acceptable bid has been placed.

### Design Goals

This system should have the ability to request details and bid on an auction from one to many bidders to one auction. 

### Overview

## Proposed Software Architecture

### Overview

Comprised of an AuctionClient.java file, an AuctionServer.java file, and an Auction.idl file; the client and server will define interactions of the individual functions, and the idl file defines the contract of the API.

### Subsystem Decomposition

- AuctionClient.java:
  - main: Connects to the server and prompts the client to select a role of either buyer or seller. It is also responsible for generating a unique user ID for the session.
  - Buyer: Prompts a user for information on bidding on an existing auction.
  - Seller: Prompts a user for information on selling a new auction or monitoring the existing auction.
  - CreateAuction: Helper function to receive input on creating a new auction from the Seller.
  - PrintAuctionStatus: Two overloads exist for this, and they simply print information about an existing auction.
- AuctionServer.java
  - class AuctionServer
    - main: Initializes the server namespaces and collects API information to map to paths.
  - class AuctionImpl
    - OfferItem: Offer-Item implementation from assignment documentation.
    - SellItem: Sell implementation from assignment documentation.
    - PlaceBid: bid implementation from assignment documentation.
    - GetSellerAuctionStatus: view_auction_status implementation from assignment documentation, exclusively for the Seller.
    - GetBuyerAuctionStatus: A combination of view_auction_status for the buyer and view_bid_status implementation from assignment documentation.

## Measurements

- Connection time was consistently 0ms as it was a localhost application. 
- Round trip time for server functions was approximately 0ms as well, since all of the server functions were relatively non-complex and it was localhosted.