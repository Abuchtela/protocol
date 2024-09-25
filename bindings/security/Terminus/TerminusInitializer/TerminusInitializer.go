// This file was generated by seer: https://github.com/moonstream-to/seer.
// seer version: 0.1.20
// seer command: seer evm generate --package TerminusInitializer --cli --struct TerminusInitializer --output bindings/Security/Terminus/TerminusInitializer/TerminusInitializer.go
// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package TerminusInitializer

import (
	"errors"
	"math/big"
	"strings"

	"context"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"

	// Reference imports to suppress errors if they are not otherwise used.
	"encoding/hex"
	"fmt"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/spf13/cobra"
	"golang.org/x/term"
)

var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// TerminusInitializerMetaData contains all meta data concerning the TerminusInitializer contract.
var TerminusInitializerMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"name\":\"init\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
	Bin: "0x608060405234801561001057600080fd5b50610253806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063e1c7392a14610030575b600080fd5b61003861003a565b005b61004261014e565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131f6020527f845f7f8d885943dffdc1524acbd9538b2923f93aad26d306df3b8982c7f0632d805460017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091821681179092557f0e89341c000000000000000000000000000000000000000000000000000000006000527fcda23395996795f7b8155822fcc6171125c877448c68566f10ccabd60b06eb27805490911690911790557f5b75cffee14646b6a66e69def89545550d8d264a0f3260af2fdc807d91004caf80547fffffffffffffffffffffffff00000000000000000000000000000000000000001633179055565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c6004015473ffffffffffffffffffffffffffffffffffffffff16331461021b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f4c69624469616d6f6e643a204d75737420626520636f6e7472616374206f776e60448201527f6572000000000000000000000000000000000000000000000000000000000000606482015260840160405180910390fd5b56fea2646970667358221220c567a9b562939b215c2b4043d6ddb45b2aa86cbc39b30181510fe761c244ba7d64736f6c63430008180033",
}

// TerminusInitializerABI is the input ABI used to generate the binding from.
// Deprecated: Use TerminusInitializerMetaData.ABI instead.
var TerminusInitializerABI = TerminusInitializerMetaData.ABI

// TerminusInitializerBin is the compiled bytecode used for deploying new contracts.
// Deprecated: Use TerminusInitializerMetaData.Bin instead.
var TerminusInitializerBin = TerminusInitializerMetaData.Bin

// DeployTerminusInitializer deploys a new Ethereum contract, binding an instance of TerminusInitializer to it.
func DeployTerminusInitializer(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *TerminusInitializer, error) {
	parsed, err := TerminusInitializerMetaData.GetAbi()
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	if parsed == nil {
		return common.Address{}, nil, nil, errors.New("GetABI returned nil")
	}

	address, tx, contract, err := bind.DeployContract(auth, *parsed, common.FromHex(TerminusInitializerBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &TerminusInitializer{TerminusInitializerCaller: TerminusInitializerCaller{contract: contract}, TerminusInitializerTransactor: TerminusInitializerTransactor{contract: contract}, TerminusInitializerFilterer: TerminusInitializerFilterer{contract: contract}}, nil
}

// TerminusInitializer is an auto generated Go binding around an Ethereum contract.
type TerminusInitializer struct {
	TerminusInitializerCaller     // Read-only binding to the contract
	TerminusInitializerTransactor // Write-only binding to the contract
	TerminusInitializerFilterer   // Log filterer for contract events
}

// TerminusInitializerCaller is an auto generated read-only Go binding around an Ethereum contract.
type TerminusInitializerCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TerminusInitializerTransactor is an auto generated write-only Go binding around an Ethereum contract.
type TerminusInitializerTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TerminusInitializerFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type TerminusInitializerFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// TerminusInitializerSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type TerminusInitializerSession struct {
	Contract     *TerminusInitializer // Generic contract binding to set the session for
	CallOpts     bind.CallOpts        // Call options to use throughout this session
	TransactOpts bind.TransactOpts    // Transaction auth options to use throughout this session
}

// TerminusInitializerCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type TerminusInitializerCallerSession struct {
	Contract *TerminusInitializerCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts              // Call options to use throughout this session
}

// TerminusInitializerTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type TerminusInitializerTransactorSession struct {
	Contract     *TerminusInitializerTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts              // Transaction auth options to use throughout this session
}

// TerminusInitializerRaw is an auto generated low-level Go binding around an Ethereum contract.
type TerminusInitializerRaw struct {
	Contract *TerminusInitializer // Generic contract binding to access the raw methods on
}

// TerminusInitializerCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type TerminusInitializerCallerRaw struct {
	Contract *TerminusInitializerCaller // Generic read-only contract binding to access the raw methods on
}

// TerminusInitializerTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type TerminusInitializerTransactorRaw struct {
	Contract *TerminusInitializerTransactor // Generic write-only contract binding to access the raw methods on
}

// NewTerminusInitializer creates a new instance of TerminusInitializer, bound to a specific deployed contract.
func NewTerminusInitializer(address common.Address, backend bind.ContractBackend) (*TerminusInitializer, error) {
	contract, err := bindTerminusInitializer(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &TerminusInitializer{TerminusInitializerCaller: TerminusInitializerCaller{contract: contract}, TerminusInitializerTransactor: TerminusInitializerTransactor{contract: contract}, TerminusInitializerFilterer: TerminusInitializerFilterer{contract: contract}}, nil
}

// NewTerminusInitializerCaller creates a new read-only instance of TerminusInitializer, bound to a specific deployed contract.
func NewTerminusInitializerCaller(address common.Address, caller bind.ContractCaller) (*TerminusInitializerCaller, error) {
	contract, err := bindTerminusInitializer(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &TerminusInitializerCaller{contract: contract}, nil
}

// NewTerminusInitializerTransactor creates a new write-only instance of TerminusInitializer, bound to a specific deployed contract.
func NewTerminusInitializerTransactor(address common.Address, transactor bind.ContractTransactor) (*TerminusInitializerTransactor, error) {
	contract, err := bindTerminusInitializer(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &TerminusInitializerTransactor{contract: contract}, nil
}

// NewTerminusInitializerFilterer creates a new log filterer instance of TerminusInitializer, bound to a specific deployed contract.
func NewTerminusInitializerFilterer(address common.Address, filterer bind.ContractFilterer) (*TerminusInitializerFilterer, error) {
	contract, err := bindTerminusInitializer(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &TerminusInitializerFilterer{contract: contract}, nil
}

// bindTerminusInitializer binds a generic wrapper to an already deployed contract.
func bindTerminusInitializer(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := TerminusInitializerMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_TerminusInitializer *TerminusInitializerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _TerminusInitializer.Contract.TerminusInitializerCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_TerminusInitializer *TerminusInitializerRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TerminusInitializer.Contract.TerminusInitializerTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_TerminusInitializer *TerminusInitializerRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _TerminusInitializer.Contract.TerminusInitializerTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_TerminusInitializer *TerminusInitializerCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _TerminusInitializer.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_TerminusInitializer *TerminusInitializerTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TerminusInitializer.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_TerminusInitializer *TerminusInitializerTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _TerminusInitializer.Contract.contract.Transact(opts, method, params...)
}

// Init is a paid mutator transaction binding the contract method 0xe1c7392a.
//
// Solidity: function init() returns()
func (_TerminusInitializer *TerminusInitializerTransactor) Init(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _TerminusInitializer.contract.Transact(opts, "init")
}

// Init is a paid mutator transaction binding the contract method 0xe1c7392a.
//
// Solidity: function init() returns()
func (_TerminusInitializer *TerminusInitializerSession) Init() (*types.Transaction, error) {
	return _TerminusInitializer.Contract.Init(&_TerminusInitializer.TransactOpts)
}

// Init is a paid mutator transaction binding the contract method 0xe1c7392a.
//
// Solidity: function init() returns()
func (_TerminusInitializer *TerminusInitializerTransactorSession) Init() (*types.Transaction, error) {
	return _TerminusInitializer.Contract.Init(&_TerminusInitializer.TransactOpts)
}

func CreateTerminusInitializerDeploymentCommand() *cobra.Command {
	var keyfile, nonce, password, value, gasPrice, maxFeePerGas, maxPriorityFeePerGas, rpc string
	var gasLimit uint64
	var simulate bool
	var timeout uint

	cmd := &cobra.Command{
		Use:   "deploy",
		Short: "Deploy a new TerminusInitializer contract",
		PreRunE: func(cmd *cobra.Command, args []string) error {
			if keyfile == "" {
				return fmt.Errorf("--keystore not specified (this should be a path to an Ethereum account keystore file)")
			}

			return nil
		},
		RunE: func(cmd *cobra.Command, args []string) error {
			client, clientErr := NewClient(rpc)
			if clientErr != nil {
				return clientErr
			}

			key, keyErr := KeyFromFile(keyfile, password)
			if keyErr != nil {
				return keyErr
			}

			chainIDCtx, cancelChainIDCtx := NewChainContext(timeout)
			defer cancelChainIDCtx()
			chainID, chainIDErr := client.ChainID(chainIDCtx)
			if chainIDErr != nil {
				return chainIDErr
			}

			transactionOpts, transactionOptsErr := bind.NewKeyedTransactorWithChainID(key.PrivateKey, chainID)
			if transactionOptsErr != nil {
				return transactionOptsErr
			}

			SetTransactionParametersFromArgs(transactionOpts, nonce, value, gasPrice, maxFeePerGas, maxPriorityFeePerGas, gasLimit, simulate)

			address, deploymentTransaction, _, deploymentErr := DeployTerminusInitializer(
				transactionOpts,
				client,
			)
			if deploymentErr != nil {
				return deploymentErr
			}

			cmd.Printf("Transaction hash: %s\nContract address: %s\n", deploymentTransaction.Hash().Hex(), address.Hex())
			if transactionOpts.NoSend {
				estimationMessage := ethereum.CallMsg{
					From: transactionOpts.From,
					Data: deploymentTransaction.Data(),
				}

				gasEstimationCtx, cancelGasEstimationCtx := NewChainContext(timeout)
				defer cancelGasEstimationCtx()

				gasEstimate, gasEstimateErr := client.EstimateGas(gasEstimationCtx, estimationMessage)
				if gasEstimateErr != nil {
					return gasEstimateErr
				}

				transactionBinary, transactionBinaryErr := deploymentTransaction.MarshalBinary()
				if transactionBinaryErr != nil {
					return transactionBinaryErr
				}
				transactionBinaryHex := hex.EncodeToString(transactionBinary)

				cmd.Printf("Transaction: %s\nEstimated gas: %d\n", transactionBinaryHex, gasEstimate)
			} else {
				cmd.Println("Transaction submitted")
			}

			return nil
		},
	}

	cmd.Flags().StringVar(&rpc, "rpc", "", "URL of the JSONRPC API to use")
	cmd.Flags().StringVar(&keyfile, "keyfile", "", "Path to the keystore file to use for the transaction")
	cmd.Flags().StringVar(&password, "password", "", "Password to use to unlock the keystore (if not specified, you will be prompted for the password when the command executes)")
	cmd.Flags().StringVar(&nonce, "nonce", "", "Nonce to use for the transaction")
	cmd.Flags().StringVar(&value, "value", "", "Value to send with the transaction")
	cmd.Flags().StringVar(&gasPrice, "gas-price", "", "Gas price to use for the transaction")
	cmd.Flags().StringVar(&maxFeePerGas, "max-fee-per-gas", "", "Maximum fee per gas to use for the (EIP-1559) transaction")
	cmd.Flags().StringVar(&maxPriorityFeePerGas, "max-priority-fee-per-gas", "", "Maximum priority fee per gas to use for the (EIP-1559) transaction")
	cmd.Flags().Uint64Var(&gasLimit, "gas-limit", 0, "Gas limit for the transaction")
	cmd.Flags().BoolVar(&simulate, "simulate", false, "Simulate the transaction without sending it")
	cmd.Flags().UintVar(&timeout, "timeout", 60, "Timeout (in seconds) for interactions with the JSONRPC API")

	return cmd
}

func CreateInitCommand() *cobra.Command {
	var keyfile, nonce, password, value, gasPrice, maxFeePerGas, maxPriorityFeePerGas, rpc, contractAddressRaw string
	var gasLimit uint64
	var simulate bool
	var timeout uint
	var contractAddress common.Address

	cmd := &cobra.Command{
		Use:   "init",
		Short: "Execute the Init method on a TerminusInitializer contract",
		PreRunE: func(cmd *cobra.Command, args []string) error {
			if keyfile == "" {
				return fmt.Errorf("--keystore not specified")
			}

			if contractAddressRaw == "" {
				return fmt.Errorf("--contract not specified")
			} else if !common.IsHexAddress(contractAddressRaw) {
				return fmt.Errorf("--contract is not a valid Ethereum address")
			}
			contractAddress = common.HexToAddress(contractAddressRaw)

			return nil
		},
		RunE: func(cmd *cobra.Command, args []string) error {
			client, clientErr := NewClient(rpc)
			if clientErr != nil {
				return clientErr
			}

			key, keyErr := KeyFromFile(keyfile, password)
			if keyErr != nil {
				return keyErr
			}

			chainIDCtx, cancelChainIDCtx := NewChainContext(timeout)
			defer cancelChainIDCtx()
			chainID, chainIDErr := client.ChainID(chainIDCtx)
			if chainIDErr != nil {
				return chainIDErr
			}

			transactionOpts, transactionOptsErr := bind.NewKeyedTransactorWithChainID(key.PrivateKey, chainID)
			if transactionOptsErr != nil {
				return transactionOptsErr
			}

			SetTransactionParametersFromArgs(transactionOpts, nonce, value, gasPrice, maxFeePerGas, maxPriorityFeePerGas, gasLimit, simulate)

			contract, contractErr := NewTerminusInitializer(contractAddress, client)
			if contractErr != nil {
				return contractErr
			}

			session := TerminusInitializerTransactorSession{
				Contract:     &contract.TerminusInitializerTransactor,
				TransactOpts: *transactionOpts,
			}

			transaction, transactionErr := session.Init()
			if transactionErr != nil {
				return transactionErr
			}

			cmd.Printf("Transaction hash: %s\n", transaction.Hash().Hex())
			if transactionOpts.NoSend {
				estimationMessage := ethereum.CallMsg{
					From: transactionOpts.From,
					To:   &contractAddress,
					Data: transaction.Data(),
				}

				gasEstimationCtx, cancelGasEstimationCtx := NewChainContext(timeout)
				defer cancelGasEstimationCtx()

				gasEstimate, gasEstimateErr := client.EstimateGas(gasEstimationCtx, estimationMessage)
				if gasEstimateErr != nil {
					return gasEstimateErr
				}

				transactionBinary, transactionBinaryErr := transaction.MarshalBinary()
				if transactionBinaryErr != nil {
					return transactionBinaryErr
				}
				transactionBinaryHex := hex.EncodeToString(transactionBinary)

				cmd.Printf("Transaction: %s\nEstimated gas: %d\n", transactionBinaryHex, gasEstimate)
			} else {
				cmd.Println("Transaction submitted")
			}

			return nil
		},
	}

	cmd.Flags().StringVar(&rpc, "rpc", "", "URL of the JSONRPC API to use")
	cmd.Flags().StringVar(&keyfile, "keyfile", "", "Path to the keystore file to use for the transaction")
	cmd.Flags().StringVar(&password, "password", "", "Password to use to unlock the keystore (if not specified, you will be prompted for the password when the command executes)")
	cmd.Flags().StringVar(&nonce, "nonce", "", "Nonce to use for the transaction")
	cmd.Flags().StringVar(&value, "value", "", "Value to send with the transaction")
	cmd.Flags().StringVar(&gasPrice, "gas-price", "", "Gas price to use for the transaction")
	cmd.Flags().StringVar(&maxFeePerGas, "max-fee-per-gas", "", "Maximum fee per gas to use for the (EIP-1559) transaction")
	cmd.Flags().StringVar(&maxPriorityFeePerGas, "max-priority-fee-per-gas", "", "Maximum priority fee per gas to use for the (EIP-1559) transaction")
	cmd.Flags().Uint64Var(&gasLimit, "gas-limit", 0, "Gas limit for the transaction")
	cmd.Flags().BoolVar(&simulate, "simulate", false, "Simulate the transaction without sending it")
	cmd.Flags().UintVar(&timeout, "timeout", 60, "Timeout (in seconds) for interactions with the JSONRPC API")
	cmd.Flags().StringVar(&contractAddressRaw, "contract", "", "Address of the contract to interact with")

	return cmd
}

var ErrNoRPCURL error = errors.New("no RPC URL provided -- please pass an RPC URL from the command line or set the TERMINUS_INITIALIZER_RPC_URL environment variable")

// Generates an Ethereum client to the JSONRPC API at the given URL. If rpcURL is empty, then it
// attempts to read the RPC URL from the TERMINUS_INITIALIZER_RPC_URL environment variable. If that is empty,
// too, then it returns an error.
func NewClient(rpcURL string) (*ethclient.Client, error) {
	if rpcURL == "" {
		rpcURL = os.Getenv("TERMINUS_INITIALIZER_RPC_URL")
	}

	if rpcURL == "" {
		return nil, ErrNoRPCURL
	}

	client, err := ethclient.Dial(rpcURL)
	return client, err
}

// Creates a new context to be used when interacting with the chain client.
func NewChainContext(timeout uint) (context.Context, context.CancelFunc) {
	baseCtx := context.Background()
	parsedTimeout := time.Duration(timeout) * time.Second
	ctx, cancel := context.WithTimeout(baseCtx, parsedTimeout)
	return ctx, cancel
}

// Unlocks a key from a keystore (byte contents of a keystore file) with the given password.
func UnlockKeystore(keystoreData []byte, password string) (*keystore.Key, error) {
	key, err := keystore.DecryptKey(keystoreData, password)
	return key, err
}

// Loads a key from file, prompting the user for the password if it is not provided as a function argument.
func KeyFromFile(keystoreFile string, password string) (*keystore.Key, error) {
	var emptyKey *keystore.Key
	keystoreContent, readErr := os.ReadFile(keystoreFile)
	if readErr != nil {
		return emptyKey, readErr
	}

	// If password is "", prompt user for password.
	if password == "" {
		fmt.Printf("Please provide a password for keystore (%s): ", keystoreFile)
		passwordRaw, inputErr := term.ReadPassword(int(os.Stdin.Fd()))
		if inputErr != nil {
			return emptyKey, fmt.Errorf("error reading password: %s", inputErr.Error())
		}
		fmt.Print("\n")
		password = string(passwordRaw)
	}

	key, err := UnlockKeystore(keystoreContent, password)
	return key, err
}

// This method is used to set the parameters on a view call from command line arguments (represented mostly as
// strings).
func SetCallParametersFromArgs(opts *bind.CallOpts, pending bool, fromAddress, blockNumber string) {
	if pending {
		opts.Pending = true
	}

	if fromAddress != "" {
		opts.From = common.HexToAddress(fromAddress)
	}

	if blockNumber != "" {
		opts.BlockNumber = new(big.Int)
		opts.BlockNumber.SetString(blockNumber, 0)
	}
}

// This method is used to set the parameters on a transaction from command line arguments (represented mostly as
// strings).
func SetTransactionParametersFromArgs(opts *bind.TransactOpts, nonce, value, gasPrice, maxFeePerGas, maxPriorityFeePerGas string, gasLimit uint64, noSend bool) {
	if nonce != "" {
		opts.Nonce = new(big.Int)
		opts.Nonce.SetString(nonce, 0)
	}

	if value != "" {
		opts.Value = new(big.Int)
		opts.Value.SetString(value, 0)
	}

	if gasPrice != "" {
		opts.GasPrice = new(big.Int)
		opts.GasPrice.SetString(gasPrice, 0)
	}

	if maxFeePerGas != "" {
		opts.GasFeeCap = new(big.Int)
		opts.GasFeeCap.SetString(maxFeePerGas, 0)
	}

	if maxPriorityFeePerGas != "" {
		opts.GasTipCap = new(big.Int)
		opts.GasTipCap.SetString(maxPriorityFeePerGas, 0)
	}

	if gasLimit != 0 {
		opts.GasLimit = gasLimit
	}

	opts.NoSend = noSend
}

func CreateTerminusInitializerCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "terminus-initializer",
		Short: "Interact with the TerminusInitializer contract",
		Run: func(cmd *cobra.Command, args []string) {
			cmd.Help()
		},
	}

	cmd.SetOut(os.Stdout)

	DeployGroup := &cobra.Group{
		ID: "deploy", Title: "Commands which deploy contracts",
	}
	cmd.AddGroup(DeployGroup)
	ViewGroup := &cobra.Group{
		ID: "view", Title: "Commands which view contract state",
	}
	TransactGroup := &cobra.Group{
		ID: "transact", Title: "Commands which submit transactions",
	}
	cmd.AddGroup(ViewGroup, TransactGroup)

	cmdDeployTerminusInitializer := CreateTerminusInitializerDeploymentCommand()
	cmdDeployTerminusInitializer.GroupID = DeployGroup.ID
	cmd.AddCommand(cmdDeployTerminusInitializer)

	cmdTransactInit := CreateInitCommand()
	cmdTransactInit.GroupID = TransactGroup.ID
	cmd.AddCommand(cmdTransactInit)

	return cmd
}
