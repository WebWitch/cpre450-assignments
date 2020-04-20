# Usage

- Requires: Node.js, NPM

```
$ npm i
$ node app.js
```

# [2020.04.20] Assignment 03: System Design Document

## Introduction

### Purpose of the System

To demonstrate knowledge of the use and function of the Stellar network in creating accounts, viewing balances & transactions, and sending/receiving lumens.

### Design Goals

This system should have the ability to create a user or log in as an existing one, print out information about the user, view balance of the wallet and transaction history, and send lumens to another user via their wallet's public key.

## Proposed Software Architecture

### Overview

Comprised of an app.js file and a package.json file, the latter being the NPM dependencies of the project allowing it to run. The app.js file will define the interactions and capabilities of the program.

### Subsystem Decomposition

app.js:
- class AppError: Defines a global error handling routine
- class CreationError, TransactionError: Extend AppError for more specific errors
- function loginPrompt: Async function that prompts for a user's keypair to begin using the application. This provides the ability to create a new wallet, log in with an existing secret, or with debug mode.
  - Debug mode has two options for picking between existing wallets that were useful for testing.
- function createAccount: Creates a wallet using a provided publicKey
- function inputLoop: An IIF used to loop during user input to work with the application. Provides the bulk of application utility