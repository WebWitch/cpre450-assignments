/*
The first phase of the project is intended to familiarize you with the Stellar platform and learn the process of building
user accounts. Most distributed applications interact with the Stellar network through Horizon, a RESTful HTTP API server.
The detailed information of Horizon can be learned by following the links in Section VII. In this phase, you will create two
accounts, with which users transfer lumens (funds) to each other. The basic requirements are:

1) Once the account is created, a new User Interface will pop up to allow user to query the account ID and its balance
through that user interface.
2) If the user wishes to initiate a transfer to the targeted account, she can enter the address/accountID and transfer some
amount of funds to the targeted account.
3) When user wants to check the activity history, the system can provide the transaction records within a day.
4) Errors, server exceptions, and invalid user input shall produce reasonably informative error descriptions to the user.
5) Learn the APIs that allow you to program with Stellar.
*/

const StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');
const prompt = require('prompt-sync')({sigint:true});
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

class AppError extends Error {
    constructor(message, context) {
        super(message);
        this.context = context;
    }

    log() {
        console.error(`${Object.getPrototypeOf(this).constructor.name}: ${this.message}`, this.context);
    }
}
class CreationError extends AppError {}

class TransactionError extends AppError {}

async function loginPrompt() {
    console.log("Welcome. What would you like to do?");
    console.log("1) New Account");
    console.log("2) Login with Secret");
    console.log("3) Login with Debug Mode");
    const res = Number(prompt());
    if (!res || isNaN(res) || res > 3 || res < 1) {
        console.warn("Invalid entry.");
        return loginPrompt();
    }
    switch (res) {
        case 1: 
            const pair = StellarSdk.Keypair.random();
            console.log("Generated secret: " + pair.secret());
            await createAccount(pair.publicKey());
            return pair;
        case 2: return StellarSdk.Keypair.fromSecret(prompt("Please enter your secret key: "));
        case 3: 
            switch (prompt("Which user? (1 or 2): ")) {
                case '1': 
                    return StellarSdk.Keypair.fromSecret('SDUBD3LJBKOBXLNUWB6GMLMY6YDPNEJJASY6KEJSCH7BLNAMS4AOT633');
                case '2':
                    return StellarSdk.Keypair.fromSecret('SBXDNTE5QR7DBVTDZJUSPXLSPGHOAGGJVVQS6F6IN4U4OCEHUCZF3IUZ');
                default:
                    return loginPrompt();
            }
    }
}

async function createAccount(publicKey) {
    console.log("Creating account with public key " + publicKey);
    try {
        const response = await (await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`)).json();
        if (!response.hash) throw new CreationError("Account creation failed", response);
        console.log("SUCCESS! You have a new account: \n", response);
    } catch (e) {
        if (e instanceof CreationError) e.log();
        else console.error("ERROR!", e);
    }
}

function lumenTransfer(pair) {

}

function printId(pair) {
    console.log("Secret:     ", pair.secret());
    console.log("Public Key: ", pair.publicKey());
}

async function printAccountBalance(pair) {
    
}

(async function inputLoop() {
    console.log("Welcome user.");
    try {
        const pair = await loginPrompt();
        while (true) {
            console.log("What would you like to do?");
            console.log("1) Transfer lumens");
            console.log("2) Show my ID");
            console.log("3) Get account balance");
            console.log("4) Get transaction history");
            console.log("q) Exit")
            const res = prompt();
            if (res == 'q') break;
            switch (res) {
                case '1': 
                    const destination = prompt("Enter the destination account ID: ");
                    const amount = prompt("Enter the amount to send: ");
                    if (prompt(`You are about to send ${amount} to ${destination}. Confirm? (Y/n)`) == 'n')
                        continue;
                    const account = await server.loadAccount(pair.publicKey());
                    const fee = await server.fetchBaseFee();
                    const transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: StellarSdk.Networks.TESTNET })
                        .addOperation(
                                StellarSdk.Operation.payment({
                                    
                                    destination,
                                    asset: StellarSdk.Asset.native(),
                                    amount
                                }))
                        .setTimeout(30)
                        .build();
                    transaction.sign(StellarSdk.Keypair.fromSecret(pair.secret()));
                    try {
                        const result = await server.submitTransaction(transaction);
                        console.log(result);
                    } catch (e) {
                        throw new TransactionError("Could not process transaction.", e);
                    }
                    break;
                case '2': 
                    printId(pair);
                    break;
                case '3':
                    (await server.loadAccount(pair.publicKey()))
                        .balances
                        .forEach(balance => console.log(`Type: ${balance.asset_type}, Balance: ${balance.balance}`));
                    break;
                case '4':
                        await server.transactions()
                            .forAccount(pair.publicKey())
                            .call()
                            .then(r => r.records
                                    .filter(record => new Date(record.created_at) > new Date().setDate((new Date()).getDate() - 1))
                                .forEach((record, i) => console.log(`Record ${i}:`, record)));
                            
                    break;
                default:
                    console.warn("Invalid entry: " + res);
                    continue;
            }
        }
    } catch (e) {
        if (e instanceof AppError) e.log();
        else console.error("Error: ", e);
    } finally {
        console.log("Goodbye.");
    }
})();
