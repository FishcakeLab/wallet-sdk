import {Interface} from '@ethersproject/abi';
import {FeeMarketEIP1559Transaction, Transaction} from '@ethereumjs/tx'
import Common from '@ethereumjs/common'
const ethers = require('ethers');
const BigNumber = require('bignumber.js');

export function numberToHex(value: any) {
    const number = BigNumber(value);
    const result = number.toString(16);
    return '0x' + result;
}

export function createAddress (seedHex: string, addressIndex: string) {
    const hdNode = ethers.utils.HDNode.fromSeed(Buffer.from(seedHex, 'hex'));
    const {
        privateKey,
        publicKey,
        address
    } = hdNode.derivePath("m/44'/60'/0'/0/" + addressIndex + '');
    return JSON.stringify({
        privateKey,
        publicKey,
        address
    });
}

export function signTransaction(params: { privateKey: string; nonce: number; from: string; to: string; gasLimit: number; amount: string; gasPrice: number; decimal: number; chainId: any; tokenAddress: string; maxPriorityFeePerGas?: number; maxFeePerGas?: number; }) {
    let { privateKey, nonce, from, to, gasPrice, gasLimit, amount, tokenAddress, decimal, maxPriorityFeePerGas, maxFeePerGas, chainId } = params;
    const transactionNonce = numberToHex(nonce);
    const gasLimits = numberToHex(gasLimit);
    const chainIdHex = numberToHex(chainId);
    let newAmount = BigNumber(amount).times((BigNumber(10).pow(decimal)));
    const numBalanceHex = numberToHex(newAmount);
    let txData: any = {
        nonce: transactionNonce,
        gasLimit: gasLimits,
        to,
        from,
        chainId: chainIdHex,
        value: numBalanceHex
    }
    if (maxFeePerGas && maxPriorityFeePerGas) {
        txData.maxFeePerGas = numberToHex(maxFeePerGas);
        txData.maxPriorityFeePerGas = numberToHex(maxPriorityFeePerGas);
    } else {
        txData.gasPrice = numberToHex(gasPrice);
    }
    if (tokenAddress && tokenAddress !== "0x00") {
        const ABI = [
            "function transfer(address to, uint amount)"
        ];
        const iface = new Interface(ABI);
        txData.data = iface.encodeFunctionData("transfer", [to, numBalanceHex]);
        txData.to = tokenAddress;
        txData.value = 0;
    }
    let common: any, tx: any;
    if (txData.maxFeePerGas && txData.maxPriorityFeePerGas) {
        common = (Common as any).custom({
            chainId: chainId,
            defaultHardfork: "london"
        });
        tx = FeeMarketEIP1559Transaction.fromTxData(txData, {
            common
        });
    } else {
        common = (Common as any).custom({ chainId: chainId })
        tx = Transaction.fromTxData(txData, {
            common
        });
    }
    const privateKeyBuffer = Buffer.from(privateKey, "hex");
    const signedTx = tx.sign(privateKeyBuffer);
    const serializedTx = signedTx.serialize();
    if (!serializedTx) {
        throw new Error("sign is null or undefined");
    }
    return `0x${serializedTx.toString('hex')}`;
}


export function verifyAddress (params: any) {
    const { address } = params;
    return ethers.utils.isAddress(address);
}

export function importAddress (privateKey: string) {
    const wallet = new ethers.Wallet(Buffer.from(privateKey, 'hex'));
    return JSON.stringify({
        privateKey,
        address: wallet.address
    });
}
