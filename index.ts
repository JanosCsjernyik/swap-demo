import { assetAmount, assetFromString, assetToBase } from "@xchainjs/xchain-util";
import {
  CryptoAmount,
  EstimateSwapParams,
  SwapEstimate,
  ThorchainQuery,
  TxDetails,
} from "@xchainjs/xchain-thorchain-query";
import { BigNumber } from "bignumber.js";

// Helper function for printing out the returned object
function print(estimate: SwapEstimate, input: CryptoAmount) {
  const expanded = {
    input: input.formatedAssetString(),
    totalFees: {
      inboundFee: estimate.totalFees.inboundFee.formatedAssetString(),
      swapFee: estimate.totalFees.swapFee.formatedAssetString(),
      outboundFee: estimate.totalFees.outboundFee.formatedAssetString(),
      affiliateFee: estimate.totalFees.affiliateFee.formatedAssetString(),
    },
    slipPercentage: estimate.slipPercentage.toFixed(),
    netOutput: estimate.netOutput.formatedAssetString(),
    waitTimeSeconds: estimate.waitTimeSeconds.toFixed(),
    canSwap: estimate.canSwap,
    errors: estimate.errors,
  };
  return expanded;
}
function printTx(txDetails: TxDetails, input: CryptoAmount) {
  const expanded = {
    memo: txDetails.memo,
    expiry: txDetails.expiry,
    toAddress: txDetails.toAddress,
    txEstimate: print(txDetails.txEstimate, input),
  };
  console.log(expanded);
}
// Swap code
const main = async () => {
  const thorchainQuery = new ThorchainQuery();

  let amountToSwap; // amount in source asset
  let fromAsset;
  let toAsset;
  let toDestinationAddress;

  // Single Swap Example
  amountToSwap = 0.1;
  fromAsset = assetFromString(`BNB.BNB`);
  toAsset = assetFromString(`THOR.RUNE`);
  toDestinationAddress = `thorabc`;

  const singleSwapParams: EstimateSwapParams = {
    input: new CryptoAmount(assetToBase(assetAmount(amountToSwap)), fromAsset!),
    destinationAsset: toAsset!,
    destinationAddress: toDestinationAddress,
    interfaceID: 999, // optional
    affiliateFeePercent: 0.0, //optional
    affiliateAddress: "thorxxx", // optional
    slipLimit: new BigNumber("0.03"), //optional
  };
  let estimate: TxDetails = await thorchainQuery.estimateSwap(singleSwapParams);
  //printTx(estimate, singleSwapParams.input)

  // Double Swap Example
  amountToSwap = 1;
  fromAsset = assetFromString(`BTC.BTC`);
  toAsset = assetFromString(`ETH.USDC`);
  toDestinationAddress = `0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48`;

  const doubleSwapParams: EstimateSwapParams = {
    input: new CryptoAmount(assetToBase(assetAmount(amountToSwap)), fromAsset!),
    destinationAsset: toAsset!,
    destinationAddress: toDestinationAddress,
    interfaceID: 123, // optional
    affiliateFeePercent: 0.0, //optional
    affiliateAddress: "thorxxx", // optional
    slipLimit: new BigNumber("0.1"), //optional
  };
  estimate = await thorchainQuery.estimateSwap(doubleSwapParams);
  printTx(estimate, doubleSwapParams.input);
};

main()
  .then(() => process.exit(0))
  .catch((err) => console.error(err));
