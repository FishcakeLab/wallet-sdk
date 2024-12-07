import {
    generateMnemonic,
    mnemonicToSeed
} from '../wallet/bip/bip';
import {
    createAddress,
    signTransaction,
    importAddress
} from '../wallet';


describe('eth unit test case', () => {
    test('createAddress', () => {
        const mnemonic = generateMnemonic({number: 12, language: 'english'});
        const params_1 = {
            mnemonic: mnemonic,
            password: ""
        }
        const seed = mnemonicToSeed(params_1)
        const account = createAddress(seed.toString("hex"), "0")
        console.log(account)
    });
    // {"privateKey":"0x5088d979256e29bca2a09aca5fe4e8f0a6ed0cbb6bf11b93b638f06d9a641d86","publicKey":"0x02feb8dd8218dbbce681f5b271110f938aa5ee7334d0346be8b461d85084cccd22","address":"0xaC3248CafA1a71b8d9e38428f6004770cbD293eD"}

    test('importAddress', () => {
        const account = importAddress("5088d979256e29bca2a09aca5fe4e8f0a6ed0cbb6bf11b93b638f06d9a641d86")
        console.log(account)
    });

    test('sign polygon', async () => {
        const rawHex = signTransaction({
            "privateKey": "5088d979256e29bca2a09aca5fe4e8f0a6ed0cbb6bf11b93b638f06d9a641d86",
            "nonce": 0,
            "from": "0xaC3248CafA1a71b8d9e38428f6004770cbD293eD",
            "to": "0xBdcbd2e489Dae44FD2774c746B60b14D61Fcf214",
            "gasLimit": 21000,
            "amount": "0.01",
            "maxFeePerGas": 2900000000,
            "maxPriorityFeePerGas": 2600000000,
            "gasPrice": 0,
            "decimal": 18,
            "chainId": 1,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });


    test('sign polygon fcc/usdt', async () => {
        const rawHex = signTransaction({
            "privateKey": "0cbb2ff952da876c4779200c83f6b90d73ea85a8da82e06c2276a11499922720",
            "nonce": 54,
            "from": "0x72fFaA289993bcaDa2E01612995E5c75dD81cdBC",
            "to": "0x35096AD62E57e86032a3Bb35aDaCF2240d55421D",
            "gasLimit": 21000,
            "amount": "0.01",
            "maxFeePerGas": 2900000000,
            "maxPriorityFeePerGas": 2600000000,
            "gasPrice": 0,
            "decimal": 18,
            "chainId": 1,
            "tokenAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        })
        console.log(rawHex)
    });


});
