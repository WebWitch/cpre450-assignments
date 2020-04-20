// Dependencies
const StellarSdk = require('stellar-sdk');
const fetch = require('node-fetch');
const prompt = require('prompt-sync')({sigint:true});
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


/**
 * Defines a global error syntax for other internal errors to derive from.
 */
class AppError extends Error {
    constructor(message, context) {
        super(message);
        this.context = context;
    }

    log() {
        console.error(`${Object.getPrototypeOf(this).constructor.name}: ${this.message}`, this.context);
    }
}

/**
 * Extends the global error syntax for errors specifically with wallet creation.
 */
class CreationError extends AppError {}


/**
 * Extends the global error syntax for errors specifically with transaction handling.
 */
class TransactionError extends AppError {}

/**
 * Handles user login. Prompts for a new account, login, or use debug mode.
 * Debug mode is a shortcut that has two built-in wallet secrets to make it easy to test the application.
 */
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

/**
 * Create a new wallet with a public key
 * @param {string} publicKey 
 */
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

/**
 * Handles the application running.
 */
(async function inputLoop() {
    console.log("Welcome user.");
    try {
        // Retrieve a wallet keypair
        const pair = await loginPrompt();

        // Input loop
        while (true) {
            console.log("What would you like to do?");
            console.log("1) Transfer lumens");
            console.log("2) Show my ID");
            console.log("3) Get account balance");
            console.log("4) Get transaction history");
            console.log("q) Exit");
            const res = prompt();
            if (res == 'q') break;
            switch (res) {
                // handle transferring lumens
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

                // handle printing user info
                case '2': 
                    console.log("Secret:     ", pair.secret());
                    console.log("Public Key: ", pair.publicKey());
                    break;

                // handle getting wallet balances
                case '3':
                    (await server.loadAccount(pair.publicKey()))
                        .balances
                        .forEach(balance => console.log(`Type: ${balance.asset_type}, Balance: ${balance.balance}`));
                    break;

                // handle getting transaction history
                case '4':
                        await server.transactions()
                            .forAccount(pair.publicKey())
                            .call()
                            .then(r => r.records
                                    .filter(record => new Date(record.created_at) > new Date().setDate((new Date()).getDate() - 1))
                                .forEach((record, i) => console.log(`Record ${i}:`, record)));
                            
                    break;
                
                // handle error case
                default:
                    console.warn("Invalid entry: " + res);
                    continue;
            }
        }
    } catch (e) {
        // catch errors
        if (e instanceof AppError) e.log();
        else console.error("Error: ", e);
    } finally {
        console.log("Goodbye.");
    }
})();
