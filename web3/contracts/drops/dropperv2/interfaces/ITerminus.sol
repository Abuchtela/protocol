// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// Interface generated by solface: https://github.com/moonstream-to/solface
// solface version: 0.1.0
// Interface ID: dbbee324
interface ITerminus {
    // structs

    // events
    event ApprovalForAll(address account, address operator, bool approved);
    event PoolMintBatch(uint256 id, address operator, address from, address[] toAddresses, uint256[] amounts);
    event TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values);
    event TransferSingle(address operator, address from, address to, uint256 id, uint256 value);
    event URI(string value, uint256 id);

    // functions
    // Selector: 85bc82e2
    function approveForPool(uint256 poolID, address operator) external;
    // Selector: 00fdd58e
    function balanceOf(address account, uint256 id) external view returns (uint256);
    // Selector: 4e1273f4
    function balanceOfBatch(address[] memory accounts, uint256[] memory ids) external view returns (uint256[] memory);
    // Selector: f5298aca
    function burn(address from, uint256 poolID, uint256 amount) external;
    // Selector: e8a3d485
    function contractURI() external view returns (string memory);
    // Selector: 3bad2d82
    function createPoolV1(uint256 _capacity, bool _transferable, bool _burnable) external returns (uint256);
    // Selector: 84fa03a1
    function createPoolV2(
        uint256 _capacity,
        bool _transferable,
        bool _burnable,
        string memory poolURI
    ) external returns (uint256);
    // Selector: b507ef52
    function createSimplePool(uint256 _capacity) external returns (uint256);
    // Selector: e985e9c5
    function isApprovedForAll(address account, address operator) external view returns (bool);
    // Selector: 027b3fc2
    function isApprovedForPool(uint256 poolID, address operator) external view returns (bool);
    // Selector: 731133e9
    function mint(address to, uint256 poolID, uint256 amount, bytes memory data) external;
    // Selector: 1f7fdffa
    function mintBatch(address to, uint256[] memory poolIDs, uint256[] memory amounts, bytes memory data) external;
    // Selector: 3013ce29
    function paymentToken() external view returns (address);
    // Selector: 8925d013
    function poolBasePrice() external view returns (uint256);
    // Selector: 3c50a3c5
    function poolIsBurnable(uint256 poolID) external view returns (bool);
    // Selector: 69453ce9
    function poolIsTransferable(uint256 poolID) external view returns (bool);
    // Selector: 21adca96
    function poolMintBatch(uint256 id, address[] memory toAddresses, uint256[] memory amounts) external;
    // Selector: 2eb2c2d6
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external;
    // Selector: f242432a
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external;
    // Selector: a22cb465
    function setApprovalForAll(address operator, bool approved) external;
    // Selector: 938e3d7b
    function setContractURI(string memory _contractURI) external;
    // Selector: 92eefe9b
    function setController(address newController) external;
    // Selector: 6a326ab1
    function setPaymentToken(address newPaymentToken) external;
    // Selector: 78cf2e84
    function setPoolBasePrice(uint256 newBasePrice) external;
    // Selector: 2365c859
    function setPoolBurnable(uint256 poolID, bool burnable) external;
    // Selector: dc55d0b2
    function setPoolController(uint256 poolID, address newController) external;
    // Selector: f3dc0a85
    function setPoolTransferable(uint256 poolID, bool transferable) external;
    // Selector: 862440e2
    function setURI(uint256 poolID, string memory poolURI) external;
    // Selector: 01ffc9a7
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
    // Selector: 366e59e3
    function terminusController() external view returns (address);
    // Selector: 5dc8bdf8
    function terminusPoolCapacity(uint256 poolID) external view returns (uint256);
    // Selector: d0c402e5
    function terminusPoolController(uint256 poolID) external view returns (address);
    // Selector: a44cfc82
    function terminusPoolSupply(uint256 poolID) external view returns (uint256);
    // Selector: ab3c7e52
    function totalPools() external view returns (uint256);
    // Selector: 1fbeae86
    function unapproveForPool(uint256 poolID, address operator) external;
    // Selector: 0e89341c
    function uri(uint256 poolID) external view returns (string memory);
    // Selector: 0e7afec5
    function withdrawPayments(address toAddress, uint256 amount) external;

    // errors
}
