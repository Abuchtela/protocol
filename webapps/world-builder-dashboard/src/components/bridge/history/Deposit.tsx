import React, { useEffect, useState } from 'react'
import { getHighNetworks, getLowNetworks, getNetworks } from '../../../../constants'
import DepositMobile from './DepositMobile'
import styles from './WithdrawTransactions.module.css'
import { ethers } from 'ethers'
import { BridgeTransferStatus } from 'game7-bridge-sdk'
import { useMediaQuery } from 'summon-ui/mantine'
import IconArrowNarrowDown from '@/assets/IconArrowNarrowDown'
import IconLinkExternal02 from '@/assets/IconLinkExternal02'
import { useBlockchainContext } from '@/contexts/BlockchainContext'
import { useBridgeTransfer } from '@/hooks/useBridgeTransfer'
import { TransactionRecord } from '@/utils/bridge/depositERC20ArbitrumSDK'
import { ETA, timeAgo } from '@/utils/timeFormat'
import { fetchTransactionTimestamp, getBlockExplorerUrl, getCachedTransactions } from '@/utils/web3utils'

interface DepositProps {
  deposit: TransactionRecord
}

const Deposit: React.FC<DepositProps> = ({ deposit }) => {
  const { selectedNetworkType, connectedAccount } = useBlockchainContext()
  const smallView = useMediaQuery('(max-width: 1199px)')
  const depositInfo = {
    from: getLowNetworks(selectedNetworkType)?.find((n) => n.chainId === deposit.lowNetworkChainId)?.displayName ?? '',
    to: getHighNetworks(selectedNetworkType)?.find((n) => n.chainId === deposit.highNetworkChainId)?.displayName ?? ''
  }

  const { returnTransferData, getTransactionInputs } = useBridgeTransfer()
  const { data: transferStatus, isLoading } = returnTransferData({ txRecord: deposit })
  const { data: transactionInputs } = getTransactionInputs({ txRecord: deposit })
  const [highNetworkTimestamp, setHighNetworkTimestamp] = useState<number>(0)

  useEffect(() => {
    const fetchTimestamp = async () => {
      if (deposit) {
        const transactions = getCachedTransactions(connectedAccount ?? '', selectedNetworkType)

        const cachedTransaction = transactions.find((t: any) => t.lowNetworkHash === deposit.lowNetworkHash)

        if (cachedTransaction && cachedTransaction.highNetworkTimestamp) {
          console.log('..')
          setHighNetworkTimestamp(cachedTransaction.highNetworkTimestamp)
          return
        }

        const destinationRpc = getNetworks(selectedNetworkType)?.find((n) => n.chainId === deposit.highNetworkChainId)
          ?.rpcs[0]
        if (transferStatus?.completionTxHash) {
          try {
            const timestamp = await fetchTransactionTimestamp(transferStatus.completionTxHash, destinationRpc ?? '')
            console.log(timestamp)
            if (timestamp) {
              setHighNetworkTimestamp(timestamp)

              const updatedTransactions = transactions.map((t: any) => {
                const isSameHash = t.lowNetworkHash === deposit.lowNetworkHash

                return isSameHash ? { ...t, highNetworkTimestamp: timestamp, lastUpdated: Date.now() } : t
              })

              localStorage.setItem(
                `bridge-${connectedAccount}-transactions-${selectedNetworkType}`,
                JSON.stringify(updatedTransactions)
              )
            }
          } catch (error) {
            console.error('Error fetching timestamp:', error)

            if (cachedTransaction && cachedTransaction.highNetworkTimestamp) {
              setHighNetworkTimestamp(cachedTransaction.highNetworkTimestamp)
            }
          }
        } else {
          console.log('No completion transaction hash found')
        }
      }
    }

    fetchTimestamp()
  }, [transferStatus?.completionTxHash])

  return (
    <>
      {isLoading && smallView ? (
        <div className={styles.gridItem}>
          <div className={styles.loading}>Loading</div>
        </div>
      ) : (
        <>
          {smallView ? (
            <DepositMobile
              deposit={deposit}
              isLoading={isLoading}
              selectedNetworkType={selectedNetworkType}
              transactionInputs={transactionInputs}
              highNetworkTimestamp={highNetworkTimestamp}
              transferStatus={transferStatus}
            />
          ) : (
            <>
              <div className={styles.gridItem}>
                <div className={styles.typeDeposit}>
                  Deposit
                  <IconArrowNarrowDown className={styles.arrowUp} />
                </div>
              </div>
              <div className={styles.gridItem}>{timeAgo(deposit.lowNetworkTimestamp)}</div>
              <div
                className={styles.gridItem}
              >{`${transactionInputs?.tokenSymbol === 'USDC' ? ethers.utils.formatUnits(transactionInputs?.amount, 6) : deposit.amount} ${transactionInputs?.tokenSymbol}`}</div>
              <div className={styles.gridItem}>{depositInfo.from}</div>
              <div className={styles.gridItem}>{depositInfo.to}</div>
              <>
                {/* First column */}
                {isLoading || transferStatus?.status === undefined ? (
                  <div className={styles.gridItem}>
                    <div className={styles.loading}>Loading</div>
                  </div>
                ) : (
                  <a
                    href={`${getBlockExplorerUrl(deposit.lowNetworkChainId, selectedNetworkType)}/tx/${deposit.lowNetworkHash}`}
                    target={'_blank'}
                    className={styles.explorerLink}
                  >
                    <div className={styles.gridItem}>
                      {transferStatus?.status === BridgeTransferStatus.DEPOSIT_ERC20_REDEEMED ||
                      transferStatus?.status === BridgeTransferStatus.DEPOSIT_GAS_DEPOSITED ||
                      transferStatus?.status === BridgeTransferStatus.DEPOSIT_ERC20_FUNDS_DEPOSITED_ON_CHILD ? (
                        <div className={styles.settled}>
                          Completed
                          <IconLinkExternal02 stroke='#fff' />
                        </div>
                      ) : (
                        <div className={styles.pending}>
                          Pending
                          <IconLinkExternal02 className={styles.arrowUp} />
                        </div>
                      )}
                    </div>
                  </a>
                )}

                {/* Second column */}
                {isLoading || transferStatus?.status === undefined || !highNetworkTimestamp ? (
                  <div className={styles.gridItem}>
                    <div className={styles.loading}>Loading</div>
                  </div>
                ) : (
                  <div className={styles.gridItemImportant}>
                    {transferStatus?.status === BridgeTransferStatus.DEPOSIT_ERC20_REDEEMED ||
                    transferStatus?.status === BridgeTransferStatus.DEPOSIT_GAS_DEPOSITED ||
                    transferStatus?.status === BridgeTransferStatus.DEPOSIT_ERC20_FUNDS_DEPOSITED_ON_CHILD ? (
                      <>{timeAgo(highNetworkTimestamp)}</>
                    ) : (
                      <>{ETA(deposit.lowNetworkTimestamp, deposit.retryableCreationTimeout ?? 15 * 60)}</>
                    )}
                  </div>
                )}
              </>
            </>
          )}
        </>
      )}
    </>
  )
}

export default Deposit
