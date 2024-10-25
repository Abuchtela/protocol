import { useState } from 'react'
import { ALL_NETWORKS } from '../../../../constants'
import styles from './TokenSelector.module.css'
import { ethers } from 'ethers'
import { Combobox, Group, InputBase, InputBaseProps, useCombobox } from 'summon-ui/mantine'
import IconCheck from '@/assets/IconCheck'
import IconChevronDown from '@/assets/IconChevronDown'
import { useBlockchainContext } from '@/contexts/BlockchainContext'
import { Token } from '@/utils/tokens'
import { doesContractExist } from '@/utils/web3utils'

type TokenSelectorProps = {
  tokens: Token[]
  selectedToken: Token
  onChange: (token: Token) => void
  onTokenAdded: () => void
  selectedChainId: number
} & InputBaseProps

const TokenSelector = ({ tokens, onChange, selectedToken, onTokenAdded, selectedChainId }: TokenSelectorProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const [tokenAddress, setTokenAddress] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { connectedAccount, selectedHighNetwork, selectedLowNetwork } = useBlockchainContext()

  const handleTokenInput = (tokenAddress: string) => {
    setTokenAddress(tokenAddress)

    let web3Provider
    if (window.ethereum) web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    else throw new Error('Wallet is not installed')

    if (!ethers.utils.isAddress(tokenAddress)) setError('Not an address!')
    else if (!doesContractExist(tokenAddress, web3Provider)) setError(`Contract doesn't exist!`)
    else if (tokens.find((token) => token.address === tokenAddress)) setError('Token already exists')
    else setError('')
  }

  const addToken = (tokenAddress: string) => {
    try {
      if (error !== '') return
      const storageKey = `${connectedAccount}-${selectedChainId}`
      const existingTokens = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const rpc = ALL_NETWORKS.find((network) => network.chainId === selectedChainId)?.rpcs[0]
      const token = {
        name: `${tokenAddress.slice(0, 6)}`,
        symbol: `${tokenAddress.slice(0, 6)}`,
        address: tokenAddress,
        rpc: rpc
      }

      if (tokens.find((token: Token) => token.address === tokenAddress)) {
        setError("Can't add the same token!")
        return
      }
      const updatedTokens = [...existingTokens, token]
      localStorage.setItem(storageKey, JSON.stringify(updatedTokens))
      onTokenAdded()
    } catch (err) {
      console.log(err)
      setError(`` + err)
    }
  }

  return (
    <Combobox
      store={combobox}
      variant='unstyled'
      onOptionSubmit={(val: string) => {
        const newSelection = tokens.find((n: Token) => String(n.address) === val)
        if (newSelection) {
          onChange(newSelection)
        }
        combobox.closeDropdown()
      }}
      classNames={{ options: styles.options, option: styles.option, dropdown: styles.dropdown }}
    >
      <Combobox.Target>
        <InputBase
          component='button'
          className={styles.inputBase}
          pointer
          variant='unstyled'
          leftSection={<selectedToken.Icon />}
          rightSection={tokens && tokens.length > 0 ? <IconChevronDown className={styles.chevron} /> : ''}
          rightSectionPointerEvents='none'
          onClick={() => combobox.toggleDropdown()}
        >
          <span className={styles.inputBaseNetworkName}>{selectedToken.symbol}</span>
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown className='!bg-dark-900 !rounded-md !border-dark-700'>
        <Combobox.Options>
          {tokens.map((n: Token) => {
            const highNetworkChainId = String(selectedHighNetwork.chainId)
            const lowNetworkChainId = String(selectedLowNetwork.chainId)
            const chainIds = Object.keys(n.tokenAddressMap ?? [])
            const isChainIdValid = chainIds.includes(highNetworkChainId) && chainIds.includes(lowNetworkChainId)
            return (
              <Combobox.Option value={String(n.address)} key={n.address} disabled={!isChainIdValid}>
                <Group>
                  <div
                    className={
                      n.address === selectedToken.address ? styles.optionContainerSelected : styles.optionContainer
                    }
                  >
                    <div className={styles.optionLeftSection}>
                      {<n.Icon />}
                      {n.symbol}
                    </div>
                    {n.address === selectedToken.address && <IconCheck />}
                  </div>
                </Group>
              </Combobox.Option>
            )
          })}
        </Combobox.Options>
        <div className={styles.tokenAdderLayout}>
          <div className={styles.tokenAdderContainer}>
            {error && error.length > 0 && (
              <div className={styles.tokenAdderError}>
                <div className={styles.tokenErrorText}>{error}</div>
              </div>
            )}
            <div className={styles.tokenAdder}>
              <input
                className={`${styles.tokenAddressInput} ${error && error.length > 0 ? styles.error : ''}`}
                value={tokenAddress}
                placeholder='Import token address'
                onChange={(e) => {
                  handleTokenInput(e.target.value)
                }}
              />
              <div className={styles.importButton} onClick={() => addToken(tokenAddress)}>
                <div className={styles.importText}>Import</div>
              </div>
            </div>
          </div>
        </div>
      </Combobox.Dropdown>
    </Combobox>
  )
}
export default TokenSelector