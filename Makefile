.PHONY: clean generate regenerate test docs redocs hardhat bindings test-graffiti test-web3 clean-web3 deepclean

build: hardhat bindings bin/game7 bin/graffiti

rebuild: clean generate build

bin/game7:
	mkdir -p bin
	go build -o bin/game7 ./cmd/game7

bin/graffiti:
	mkdir -p bin
	go build -o bin/graffiti ./cmd/graffiti

bindings/ERC20/ERC20.go: hardhat
	mkdir -p bindings/ERC20
	seer evm generate --package ERC20 --output bindings/ERC20/ERC20.go --hardhat web3/artifacts/contracts/token/ERC20.sol/ERC20.json --cli --struct ERC20

bindings/TokenFaucet/TokenFaucet.go: hardhat
	mkdir -p bindings/TokenFaucet
	seer evm generate --package TokenFaucet --output bindings/TokenFaucet/TokenFaucet.go --hardhat web3/artifacts/contracts/faucet/TokenFaucet.sol/TokenFaucet.json --cli --struct TokenFaucet

bindings/WrappedNativeToken/WrappedNativeToken.go: hardhat
	mkdir -p bindings/WrappedNativeToken
	seer evm generate --package WrappedNativeToken --output bindings/WrappedNativeToken/WrappedNativeToken.go --hardhat web3/artifacts/contracts/token/WrappedNativeToken.sol/WrappedNativeToken.json --cli --struct WrappedNativeToken

bindings/Staker/Staker.go: hardhat
	mkdir -p bindings/Staker
	seer evm generate --package Staker --output bindings/Staker/Staker.go --hardhat web3/artifacts/contracts/staking/Staker.sol/Staker.json --cli --struct Staker

bindings/PositionMetadata/PositionMetadata.go: hardhat
	mkdir -p bindings/PositionMetadata
	seer evm generate --package PositionMetadata --output bindings/PositionMetadata/PositionMetadata.go --hardhat web3/artifacts/contracts/staking/PositionMetadata.sol/PositionMetadata.json --cli --struct PositionMetadata

bindings/MockERC20/MockERC20.go: hardhat
	mkdir -p bindings/MockERC20
	seer evm generate --package MockERC20 --output bindings/MockERC20/MockERC20.go --hardhat web3/artifacts/contracts/mock/tokens.sol/MockERC20.json --cli --struct MockERC20

bindings/MockERC721/MockERC721.go: hardhat
	mkdir -p bindings/MockERC721
	seer evm generate --package MockERC721 --output bindings/MockERC721/MockERC721.go --hardhat web3/artifacts/contracts/mock/tokens.sol/MockERC721.json --cli --struct MockERC721

bindings/MockERC1155/MockERC1155.go: hardhat
	mkdir -p bindings/MockERC1155
	seer evm generate --package MockERC1155 --output bindings/MockERC1155/MockERC1155.go --hardhat web3/artifacts/contracts/mock/tokens.sol/MockERC1155.json --cli --struct MockERC1155

bindings/Diamond/Diamond.go: hardhat
	mkdir -p bindings/Diamond
	seer evm generate --package Diamond --output bindings/Diamond/Diamond.go --hardhat web3/artifacts/contracts/drops/diamond/Diamond.sol/Diamond.json --cli --struct Diamond
	mkdir -p bindings/Diamond/facets/DiamondCutFacet
	seer evm generate --package DiamondCutFacet --output bindings/Diamond/facets/DiamondCutFacet/DiamondCutFacet.go --hardhat web3/artifacts/contracts/drops/diamond/facets/DiamondCutFacet.sol/DiamondCutFacet.json --cli --struct DiamondCutFacet
	mkdir -p bindings/Diamond/facets/DiamondLoupeFacet
	seer evm generate --package DiamondLoupeFacet --output bindings/Diamond/facets/DiamondLoupeFacet/DiamondLoupeFacet.go --hardhat web3/artifacts/contracts/drops/diamond/facets/DiamondLoupeFacet.sol/DiamondLoupeFacet.json --cli --struct DiamondLoupeFacet
	mkdir -p bindings/Diamond/facets/OwnershipFacet
	seer evm generate --package OwnershipFacet --output bindings/Diamond/facets/OwnershipFacet/OwnershipFacet.go --hardhat web3/artifacts/contracts/drops/diamond/facets/OwnershipFacet.sol/OwnershipFacet.json --cli --struct OwnershipFacet

bindings/Terminus/Terminus.go: hardhat
	mkdir -p bindings/Terminus/ERC1155WithTerminusStorage
	seer evm generate --package ERC1155WithTerminusStorage --output bindings/Terminus/ERC1155WithTerminusStorage/ERC1155WithTerminusStorage.go --hardhat web3/artifacts/contracts/drops/terminus/ERC1155WithTerminusStorage.sol/ERC1155WithTerminusStorage.json --cli --struct ERC1155WithTerminusStorage
	mkdir -p bindings/Terminus/TerminusFacet
	seer evm generate --package TerminusFacet --output bindings/Terminus/TerminusFacet/TerminusFacet.go --hardhat web3/artifacts/contracts/drops/terminus/TerminusFacet.sol/TerminusFacet.json --cli --struct TerminusFacet
	mkdir -p bindings/Terminus/TerminusInitializer
	seer evm generate --package TerminusInitializer --output bindings/Terminus/TerminusInitializer/TerminusInitializer.go --hardhat web3/artifacts/contracts/drops/terminus/TerminusInitializer.sol/TerminusInitializer.json --cli --struct TerminusInitializer

bindings/Dropper/DropperV2.go: hardhat
	mkdir -p bindings/Dropper/DropperV2
	seer evm generate --package DropperFacet --output bindings/Dropper/DropperV2/DropperFacet.go --hardhat web3/artifacts/contracts/drops/dropperv2/DropperFacet.sol/DropperFacet.json --cli --struct DropperFacet	

bindings/Dropper/DropperV3.go: hardhat
	mkdir -p bindings/Dropper/DropperV3
	seer evm generate --package DropperV3Facet --output bindings/Dropper/DropperV3/DropperV3Facet.go --hardhat web3/artifacts/contracts/drops/dropper-V3/DropperV3Facet.sol/DropperV3Facet.json --cli --struct DropperV3Facet	
	


bindings: bindings/ERC20/ERC20.go bindings/TokenFaucet/TokenFaucet.go bindings/WrappedNativeToken/WrappedNativeToken.go bindings/Staker/Staker.go bindings/MockERC20/MockERC20.go bindings/MockERC721/MockERC721.go bindings/MockERC1155/MockERC1155.go bindings/PositionMetadata/PositionMetadata.go bindings/Diamond/Diamond.go bindings/Terminus/Terminus.go bindings/Dropper/DropperV2.go bindings/Dropper/DropperV3.go

test-web3:
	cd web3 && npx hardhat test

test-graffiti:
	go test ./cmd/graffiti -v

test: test-web3 test-graffiti

clean:
	rm -rf bindings/ERC20/* bin/* bindings/TokenFaucet/* bindings/WrappedNativeToken/* bindings/Staker/* bindings/MockERC20/* bindings/MockERC721/* bindings/MockERC1155/* bindings/Diamond/* bindings/Terminus/* bindings/Dropper bindings/PositionMetadata/*

clean-web3:
	rm -rf web3/node_modules web3/artifacts

deepclean: clean clean-web3

hardhat:
	cd web3 && npm install && npx hardhat compile
