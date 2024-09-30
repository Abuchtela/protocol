import { ethers, BigNumber } from 'ethers';
import { networks } from './networks';
import { UnsupportedNetworkError } from './errors';
import { TransactionReceipt } from '@ethersproject/abstract-provider/src.ts';
import {
  ChildToParentMessageReader,
  ChildToParentMessageStatus,
  ChildToParentMessageWriter,
  ChildTransactionReceipt,
} from '@arbitrum/sdk';
import { ChildToParentMessageReaderNitro } from '@arbitrum/sdk/dist/lib/message/ChildToParentMessageNitro';
import { Provider } from '@ethersproject/abstract-provider';
import { getBlockTimeDifference } from './utils/web3Utils';

export type SignerOrProviderOrRpc = ethers.Signer | ethers.providers.Provider | string;

type BridgeReceiptDescription = 'initiating';
export interface BridgeReceipt {
  description: string;
  receipt: TransactionReceipt;
}

export const getProvider = (
  signerOrProviderOrRpc: SignerOrProviderOrRpc,
): ethers.providers.Provider => {
  if (typeof signerOrProviderOrRpc === 'string') {
    return new ethers.providers.JsonRpcProvider(signerOrProviderOrRpc);
  }
  const providerFromSigner = (signerOrProviderOrRpc as ethers.Signer).provider;
  if (providerFromSigner) {
    return providerFromSigner;
  }
  if (typeof signerOrProviderOrRpc.getGasPrice === 'function') {
    return signerOrProviderOrRpc as ethers.providers.Provider;
  }
  throw new Error(
    'Invalid input: expected a Signer with associated provider, Provider, or RPC URL string',
  );
};

export interface CreateBridgeTransferParams {
  txHash: string;
  originSignerOrProviderOrRpc: SignerOrProviderOrRpc;
  destinationSignerOrProviderOrRpc: SignerOrProviderOrRpc;
}

export class BridgeTransfer {
  public readonly originNetworkChainId: number;
  public readonly destinationNetworkChainId: number;
  // public readonly txHash: string;
  public readonly isDeposit: boolean;
  public readonly receipts: BridgeReceipt[] = [];
  public readonly isCompleted: boolean = false;
  public readonly tokenSymbol: string = '';
  public readonly value: BigNumber = BigNumber.from(0);
  private childReceipt: ChildTransactionReceipt | undefined;
  private childProvider: Provider;

  /**
   * Creates an instance of the `BridgeTransfer` class.
   *
   * @param originNetworkChainId - The chain ID of the network where the transaction originates.
   * @param destinationNetworkChainId - The chain ID of the network where the transaction is heading.
   * @param txHash - The transaction hash of the bridge transaction.
   */
  private constructor({
    destinationNetworkChainId,
    originNetworkChainId,
    receipts,
    childReceipt,
    childProvider,
  }: {
    destinationNetworkChainId: number;
    originNetworkChainId: number;
    receipts: BridgeReceipt[];
    childReceipt?: ChildTransactionReceipt;
    childProvider: Provider;
  }) {
    this.originNetworkChainId = originNetworkChainId;
    this.destinationNetworkChainId = destinationNetworkChainId;
    const originNetwork = networks[originNetworkChainId];
    const destinationNetwork = networks[destinationNetworkChainId];
    if (!originNetwork) {
      throw new UnsupportedNetworkError(originNetworkChainId);
    }
    if (!destinationNetwork) {
      throw new UnsupportedNetworkError(destinationNetworkChainId);
    }

    this.isDeposit = originNetwork.chainId === destinationNetwork.parentChainId;
    this.receipts = receipts;
    this.childReceipt = childReceipt;
    this.childProvider = childProvider;
  }

  static async create(params: CreateBridgeTransferParams) {
    const originProvider = getProvider(params.originSignerOrProviderOrRpc);
    const destinationProvider = getProvider(params.destinationSignerOrProviderOrRpc);

    const originNetworkChainId = (await originProvider.getNetwork()).chainId;
    const destinationNetworkChainId = (await destinationProvider.getNetwork()).chainId;
    const originReceipt = await originProvider.getTransactionReceipt(params.txHash);

    const childReceipt = new ChildTransactionReceipt(originReceipt);

    const messages: any = await childReceipt.getChildToParentMessages(destinationProvider);
    const msg: any = messages[0];
    const status: ChildToParentMessageStatus = await msg.status(originProvider);

    console.log(msg, status, childReceipt);
    const msgTimestamp = new Date(msg.nitroReader.event.timestamp.toNumber() * 1000); // multiply by 1000 to convert seconds to milliseconds

    const initReceipt = await originProvider.getTransactionReceipt(params.txHash);
    const block = await originProvider.getBlock(initReceipt.blockNumber);
    const ETAblock = await msg.getFirstExecutableBlock(originProvider);
    if (ETAblock) {
      const interval = await getBlockTimeDifference(ETAblock, destinationProvider);
      console.log(interval);
    }
    console.log({ ETAblock });

    const initTimestamp = new Date(block.timestamp * 1000);
    console.log({ initTimestamp, msgTimestamp });
    const receipts: BridgeReceipt[] = [
      {
        description: 'initiation',
        receipt: initReceipt,
      },
    ];

    return new BridgeTransfer({
      originNetworkChainId,
      destinationNetworkChainId,
      receipts,
      childReceipt,
      childProvider: originProvider,
    });
  }

  public async execute(signer: ethers.Signer) {
    if (!this.childReceipt) {
      throw new Error('Child receipt not found');
    }
    const messages: ChildToParentMessageWriter[] =
      (await this.childReceipt.getChildToParentMessages(signer)) as ChildToParentMessageWriter[];
    const message = messages[0];
    console.log('to execute');
    const res = await message.execute(this.childProvider);
    return await res.wait();
  }
}
