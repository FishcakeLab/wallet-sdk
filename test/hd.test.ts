import { generateMnemonic, mnemonicToSeed } from "../wallet/bip/bip";
import { createAddress, signTransaction, importAddress } from "../wallet";
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-rpc.com"
);

describe("eth unit test case", () => {
  // Test address creation
  test("createAddress", () => {
    const mnemonic = generateMnemonic({ number: 12, language: "english" });
    const params = {
      mnemonic: mnemonic,
      password: "",
    };
    const seed = mnemonicToSeed(params);
    const account = createAddress(seed.toString("hex"), "0");
    console.log(account);
  });

  // Test address import
  test("importAddress", () => {
    const account = importAddress("YOUR_PRIVATE_KEY");
    console.log(account);
  });

  // Test Token Transfer
  test("sign and broadcast token transfer", async () => {
    const privateKey = "YOUR_PRIVATE_KEY";
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Transfer parameters
    const transferParams = {
      tokenAddress: "0x84eBc138F4Ab844A3050a6059763D269dC9951c6",  // USDT contract address
      to: "0x15FC368F7F8BfF752119cda045fcE815dc8F053A",          // Recipient address
      amount: "1",                                                 // Transfer amount
      decimal: 6                                                   // USDT decimals
    };

    // Get current gas prices
    const feeData = await provider.getFeeData();
    console.log("Current gas prices:", {
      maxFeePerGas: ethers.utils.formatUnits(feeData.maxFeePerGas || 0, "gwei"),
      maxPriorityFeePerGas: ethers.utils.formatUnits(feeData.maxPriorityFeePerGas || 0, "gwei"),
    });

    // Get current nonce
    const nonce = await provider.getTransactionCount(wallet.address);
    console.log("Current nonce:", nonce);

    // Sign transaction
    const rawHex = signTransaction({
      privateKey: privateKey,
      nonce: Number(nonce),
      from: wallet.address,
      to: transferParams.to,
      gasLimit: 100000,
      maxFeePerGas: Number(ethers.utils.parseUnits("100", "gwei")),
      maxPriorityFeePerGas: Number(ethers.utils.parseUnits("30", "gwei")),
      gasPrice: 0,
      amount: transferParams.amount,
      decimal: transferParams.decimal,
      chainId: 137,
      tokenAddress: transferParams.tokenAddress,
      callData: "",
    });

    // Broadcast transaction
    const tx = await provider.sendTransaction(rawHex);
    console.log("Transaction hash:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait(1);
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Transaction status:", receipt.status === 1 ? "Success" : "Failed");
  }, 60000);

  // Test Contract Call (Activity Creation)
  test("sign and broadcast contract call", async () => {
    const testActivity = {
      businessName: "test1",
      activityContent: '{"activityContentDescription":"test1","activityContentAddress":"test1","activityContentLink":"test1"}',
      latitude: 25.0329636,
      longitude: 121.5654268,
      activityDeadLine: 1735910847,
      totalDropAmts: ethers.utils.parseUnits("1", 6),
      dropType: 1,
      dropNumber: 1,
      minDropAmt: ethers.utils.parseUnits("1", 6),
      maxDropAmt: ethers.utils.parseUnits("1", 6),
      tokenAddress: "0x84eBc138F4Ab844A3050a6059763D269dC9951c6",
    };

    const privateKey = "YOUR_PRIVATE_KEY";
    const wallet = new ethers.Wallet(privateKey, provider);
    const spenderAddress = "0x2CAf752814f244b3778e30c27051cc6B45CB1fc9";

    // Create contract interface
    const activityInterface = new ethers.utils.Interface([
      "function activityAdd(string, string, string, uint256, uint256, uint8, uint256, uint256, uint256, address) public returns(bool, uint256)",
    ]);

    // Encode function call data
    const callData = activityInterface.encodeFunctionData("activityAdd", [
      testActivity.businessName,
      testActivity.activityContent,
      `${testActivity.latitude},${testActivity.longitude}`,
      testActivity.activityDeadLine,
      testActivity.totalDropAmts,
      testActivity.dropType,
      testActivity.dropNumber,
      testActivity.minDropAmt,
      testActivity.maxDropAmt,
      testActivity.tokenAddress,
    ]);

    // Sign transaction
    const rawHex = signTransaction({
      privateKey: privateKey,
      nonce: Number(await provider.getTransactionCount(wallet.address)),
      from: wallet.address,
      to: spenderAddress,
      gasLimit: 500000,
      maxFeePerGas: Number(ethers.utils.parseUnits("100", "gwei")),
      maxPriorityFeePerGas: Number(ethers.utils.parseUnits("30", "gwei")),
      gasPrice: 0,
      amount: "0",
      decimal: 6,
      chainId: 137,
      tokenAddress: testActivity.tokenAddress,
      callData: callData,
    });

    // Broadcast transaction
    const tx = await provider.sendTransaction(rawHex);
    console.log("Transaction hash:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait(1);
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("Transaction status:", receipt.status === 1 ? "Success" : "Failed");
  }, 60000);
});
