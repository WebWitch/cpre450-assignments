# [2020.02.16] Assignment 01: System Design Document

## Introduction

### Purpose of the System

### Design Goals

### Overview

## Proposed Software Architecture

### Overview


### Subsystem Decomposition

- Bid:
  - bidderId: string; (UserId)
  - offer: float;
- Seller
  - OfferItem(userId: string, itemDescription: string, initialPrice?: float): boolean
    - Returns If the auction is currently empty, any user can offer an item. 
  - GetHighestBid(): Bid
    - Returns the bid entry of the current highest bidder.
  - Sell()