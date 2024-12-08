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
    // {"privateKey":"privateKey","publicKey":"0x02feb8dd8218dbbce681f5b271110f938aa5ee7334d0346be8b461d85084cccd22","address":"0xaC3248CafA1a71b8d9e38428f6004770cbD293eD"}

    test('importAddress', () => {
        const account = importAddress("privateKey")
        console.log(account)
    });

    test('sign polygon', async () => {
        const rawHex = signTransaction({
            "privateKey": "privateKey",
            "nonce": 69,
            "from": "0xe189B19Ee1Fd800825863a68ED80843cd3d747Ab",
            "to": "0xAb7a82c767aC2D5F3Db625e91afE553F0Dae25f4",
            "gasLimit": 21000,
            "amount": "0.01",
            "maxFeePerGas": 29000000000,
            "maxPriorityFeePerGas": 25000000000,
            "gasPrice": 0,
            "decimal": 18,
            "chainId": 137,
            "tokenAddress": "0x00"
        })
        console.log(rawHex)
    });


    test('sign polygon fcc/usdt', async () => {
        const rawHex = signTransaction({
            "privateKey": "privateKey",
            "nonce": 72,
            "from": "0xe189B19Ee1Fd800825863a68ED80843cd3d747Ab",
            "to": "0xAb7a82c767aC2D5F3Db625e91afE553F0Dae25f4",
            "gasLimit": 91596,
            "amount": "80",
            "maxFeePerGas": 29000000000,
            "maxPriorityFeePerGas": 25000000000,
            "gasPrice": 0,
            "decimal": 6,
            "chainId": 137,
            "tokenAddress": "0x84eBc138F4Ab844A3050a6059763D269dC9951c6"
        })
        console.log(rawHex)
    });
});
