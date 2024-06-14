import { Game7Token, StakingTokens } from "../typechain-types";
import { expect } from "chai";
import { ethers } from "hardhat";
import { toWei } from "../helpers/bignumber";
import { latest } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time";

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("StakingTokens contract", function () {
  let token: Game7Token;
  let tokenAddress: string; 
  let staking: StakingTokens;
  let stakingAddress: string;
  let deployer: Awaited<ReturnType<typeof ethers.getSigners>>[0];
  let user1: Awaited<ReturnType<typeof ethers.getSigners>>[0];
  let user2: Awaited<ReturnType<typeof ethers.getSigners>>[0];

  const totalSupply = toWei(1000);

  beforeEach(async function () {
    const TokenFactory = await ethers.getContractFactory("Game7Token");
    token = await TokenFactory.deploy(totalSupply);
    tokenAddress = await token.getAddress();
    const StakingFactory = await ethers.getContractFactory("StakingTokens");
    staking = await StakingFactory.deploy();
    stakingAddress = await staking.getAddress();
    [deployer, user1, user2] = await ethers.getSigners();

    await token.transfer(user1.address, ethers.parseEther("100"));
    await deployer.sendTransaction({to: user1.address, value: toWei(100)});
  });

  describe("Staking ERC20", function () {
    const depositAmount = toWei(2);
    const lockingPeriod = 3600; // 1 hour

    it("should allow deposit/withdraw with no locking period", async function () {
      await token.connect(user1).approve(stakingAddress, toWei(100));

      const initialERC20Balance = await token.balanceOf(user1.address);
      const depositTokenCount = await staking.balanceOf(user1.address);

      await expect(
        staking.connect(user1)["deposit(address,uint256,uint256)"](tokenAddress, depositAmount, 0)
      ).to.emit(staking, "Deposited").withArgs(tokenAddress, user1.address, user1.address, 0, depositAmount);

      const depositTokenID = await staking.tokenOfOwnerByIndex(user1.address, depositTokenCount)
      const lastDeposit = await staking.getDeposit(depositTokenID);

      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const timestamp = block?.timestamp || 0;

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount + BigInt(1));
      expect(lastDeposit.tokenAddress).to.equal(tokenAddress.toString());
      expect(lastDeposit.amount).to.equal(depositAmount);
      expect(lastDeposit.start).to.equal(timestamp);
      expect(lastDeposit.end).to.equal(timestamp);
      expect(await token.balanceOf(user1.address)).to.equal(initialERC20Balance - depositAmount);

      const metadata = JSON.parse(await staking.metadataJSON(depositTokenID));

      expect(metadata.attributes[0].value).to.equal(tokenAddress.toString().toLowerCase());
      expect(metadata.attributes[1].value).to.equal(depositAmount);
      expect(metadata.attributes[2].value).to.equal(timestamp);
      expect(metadata.attributes[3].value).to.equal(timestamp);

      await expect(
        staking.connect(user1)["withdraw(uint256)"](depositTokenID)
      ).to.emit(staking, "Withdrawn").withArgs(depositTokenID, user1.address, user1.address);

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount);
      expect(await token.balanceOf(user1.address)).to.equal(initialERC20Balance);
    });

    it("should allow deposit/withdraw with locking period", async function () {
      await token.connect(user1).approve(stakingAddress, toWei(100));

      const initialERC20Balance = await token.balanceOf(user1.address);
      const depositTokenCount = await staking.balanceOf(user1.address);

      await expect(
        staking.connect(user1)["deposit(address,uint256,uint256)"](tokenAddress, depositAmount, lockingPeriod)
      ).to.emit(staking, "Deposited").withArgs(tokenAddress, user1.address, user1.address, lockingPeriod, depositAmount);

      const depositTokenID = await staking.tokenOfOwnerByIndex(user1.address, depositTokenCount)
      const lastDeposit = await staking.getDeposit(depositTokenID);

      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const timestamp = block?.timestamp || 0;

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount + BigInt(1));
      expect(lastDeposit.tokenAddress).to.equal(tokenAddress.toString());
      expect(lastDeposit.amount).to.equal(depositAmount);
      expect(lastDeposit.start).to.equal(timestamp);
      expect(lastDeposit.end).to.equal(timestamp + lockingPeriod);
      expect(await token.balanceOf(user1.address)).to.equal(initialERC20Balance - depositAmount);

      const metadata = JSON.parse(await staking.metadataJSON(depositTokenID));

      expect(metadata.attributes[0].value).to.equal(tokenAddress.toString().toLowerCase());
      expect(metadata.attributes[1].value).to.equal(depositAmount);
      expect(metadata.attributes[2].value).to.equal(timestamp);
      expect(metadata.attributes[3].value).to.equal(timestamp + lockingPeriod);

      await expect(
        staking.connect(user1)["withdraw(uint256)"](depositTokenID)
      ).to.be.reverted;

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount + BigInt(1));
      expect(lastDeposit.amount).to.equal(depositAmount);
      expect(lastDeposit.start).to.equal(timestamp);
      expect(lastDeposit.end).to.equal(timestamp + lockingPeriod);
      expect(await token.balanceOf(user1.address)).to.equal(initialERC20Balance - depositAmount);

      await ethers.provider.send("evm_increaseTime", [lockingPeriod + 1]);

      await expect(
        staking.connect(user1)["withdraw(uint256)"](depositTokenID)
      ).to.emit(staking, "Withdrawn").withArgs(depositTokenID, user1.address, user1.address);

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount);
      expect(await token.balanceOf(user1.address)).to.equal(initialERC20Balance);
    });

    it("should allow deposit/withdraw on behalf of another account", async function () {
      await token.connect(user1).approve(stakingAddress, toWei(100));
      const initialERC20Balance = await token.balanceOf(user1.address);
      const depositTokenCount = await staking.balanceOf(user2.address);

      await expect(
        staking.connect(user1)["deposit(address,uint256,uint256,address)"](tokenAddress, depositAmount, 0, user2.address)
      ).to.emit(staking, "Deposited").withArgs(tokenAddress, user2.address, user1.address, 0, depositAmount);

      const depositTokenID = await staking.tokenOfOwnerByIndex(user2.address, depositTokenCount)
      const lastDeposit = await staking.getDeposit(depositTokenID);

      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const timestamp = block?.timestamp || 0;

      expect(await staking.balanceOf(user2.address)).to.equal(depositTokenCount + BigInt(1));
      expect(lastDeposit.tokenAddress).to.equal(tokenAddress.toString());
      expect(lastDeposit.amount).to.equal(depositAmount);
      expect(lastDeposit.start).to.equal(timestamp);
      expect(lastDeposit.end).to.equal(timestamp);
      expect(await token.balanceOf(user1.address)).to.equal(initialERC20Balance - depositAmount);

      const metadata = JSON.parse(await staking.metadataJSON(depositTokenID));

      expect(metadata.attributes[0].value).to.equal(tokenAddress.toString().toLowerCase());
      expect(metadata.attributes[1].value).to.equal(depositAmount);
      expect(metadata.attributes[2].value).to.equal(timestamp);
      expect(metadata.attributes[3].value).to.equal(timestamp);

      await expect(
        staking.connect(user2)["withdraw(uint256,address)"](depositTokenID, user1.address)
      ).to.emit(staking, "Withdrawn").withArgs(depositTokenID, user2.address, user1.address);

      expect(await staking.balanceOf(user2.address)).to.equal(depositTokenCount);
      expect(await token.balanceOf(user1.address)).to.equal(initialERC20Balance);
    });
  });


  describe("Staking native token", function () {
    const depositAmount = ethers.parseEther("1.0");
    const lockingPeriod = 3600; // 1 hour

    it("should allow deposit/withdraw with no locking period", async function () {
      const initialNativeBalance = await ethers.provider.getBalance(user1.address);
      const depositTokenCount = await staking.balanceOf(user1.address);

      await expect(
        staking.connect(user1)["deposit(uint256)"](0, {value: depositAmount})
      ).to.emit(staking, "Deposited").withArgs(zeroAddress, user1.address, user1.address, 0, depositAmount);

      const depositTokenID = await staking.tokenOfOwnerByIndex(user1.address, depositTokenCount)
      const lastDeposit = await staking.getDeposit(depositTokenID);

      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const timestamp = block?.timestamp || 0;

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount + BigInt(1));
      expect(lastDeposit.tokenAddress).to.equal(zeroAddress);
      expect(lastDeposit.amount).to.equal(depositAmount);
      expect(lastDeposit.start).to.equal(timestamp);
      expect(lastDeposit.end).to.equal(timestamp);
      // Account for gas fees
      expect(await ethers.provider.getBalance(user1.address)).to.be.closeTo(initialNativeBalance - depositAmount, ethers.parseEther("0.1"));


      const metadata = JSON.parse(await staking.metadataJSON(depositTokenID));

      expect(metadata.attributes[0].value).to.equal(zeroAddress);
      expect(metadata.attributes[1].value).to.equal(depositAmount);
      expect(metadata.attributes[2].value).to.equal(timestamp);
      expect(metadata.attributes[3].value).to.equal(timestamp);

      await expect(
        staking.connect(user1)["withdraw(uint256)"](depositTokenID)
      ).to.emit(staking, "Withdrawn").withArgs(depositTokenID, user1.address, user1.address);

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount);
      // Account for gas fees
      expect(await ethers.provider.getBalance(user1.address)).to.be.closeTo(initialNativeBalance, ethers.parseEther("0.1"));
    });

    it("should allow deposit/withdraw with locking period", async function () {
      const initialNativeBalance = await ethers.provider.getBalance(user1.address);
      const depositTokenCount = await staking.balanceOf(user1.address);

      await expect(
        staking.connect(user1)["deposit(uint256)"](lockingPeriod, {value: depositAmount})
      ).to.emit(staking, "Deposited").withArgs(zeroAddress, user1.address, user1.address, lockingPeriod, depositAmount);

      const depositTokenID = await staking.tokenOfOwnerByIndex(user1.address, depositTokenCount)
      const lastDeposit = await staking.getDeposit(depositTokenID);

      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const timestamp = block?.timestamp || 0;

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount + BigInt(1));
      expect(lastDeposit.tokenAddress).to.equal(zeroAddress);
      expect(lastDeposit.amount).to.equal(depositAmount);
      expect(lastDeposit.start).to.equal(timestamp);
      expect(lastDeposit.end).to.equal(timestamp + lockingPeriod);
      // Account for gas fees
      expect(await ethers.provider.getBalance(user1.address)).to.be.closeTo(initialNativeBalance - depositAmount, ethers.parseEther("0.1"));

      const metadata = JSON.parse(await staking.metadataJSON(depositTokenID));

      expect(metadata.attributes[0].value).to.equal(zeroAddress);
      expect(metadata.attributes[1].value).to.equal(depositAmount);
      expect(metadata.attributes[2].value).to.equal(timestamp);
      expect(metadata.attributes[3].value).to.equal(timestamp + lockingPeriod);

      await expect(
        staking.connect(user1)["withdraw(uint256)"](depositTokenID)
      ).to.be.reverted;

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount + BigInt(1));
      expect(lastDeposit.amount).to.equal(depositAmount);
      expect(lastDeposit.start).to.equal(timestamp);
      expect(lastDeposit.end).to.equal(timestamp + lockingPeriod); 
      // Account for gas fees
      expect(await ethers.provider.getBalance(user1.address)).to.be.closeTo(initialNativeBalance - depositAmount, ethers.parseEther("0.1"));

      await ethers.provider.send("evm_increaseTime", [lockingPeriod + 1]);

      await expect(
        staking.connect(user1)["withdraw(uint256)"](depositTokenID)
      ).to.emit(staking, "Withdrawn").withArgs(depositTokenID, user1.address, user1.address);

      expect(await staking.balanceOf(user1.address)).to.equal(depositTokenCount);
      // Account for gas fees
      expect(await ethers.provider.getBalance(user1.address)).to.be.closeTo(initialNativeBalance, ethers.parseEther("0.1"));
    });

    it("should allow deposit/withdraw on behalf of another account", async function () {
      const initialNativeBalance = await ethers.provider.getBalance(user1.address);
      const depositTokenCount = await staking.balanceOf(user2.address);

      await expect(
        staking.connect(user1)["deposit(uint256,address)"](0, user2.address, {value: depositAmount})
      ).to.emit(staking, "Deposited").withArgs(zeroAddress, user2.address, user1.address, 0, depositAmount);

      const depositTokenID = await staking.tokenOfOwnerByIndex(user2.address, depositTokenCount)
      const lastDeposit = await staking.getDeposit(depositTokenID);

      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      const timestamp = block?.timestamp || 0;

      expect(await staking.balanceOf(user2.address)).to.equal(depositTokenCount + BigInt(1));
      expect(lastDeposit.tokenAddress).to.equal(zeroAddress);
      expect(lastDeposit.amount).to.equal(depositAmount);
      expect(lastDeposit.start).to.equal(timestamp);
      expect(lastDeposit.end).to.equal(timestamp);
      // Account for gas fees
      expect(await ethers.provider.getBalance(user1.address)).to.be.closeTo(initialNativeBalance - depositAmount, ethers.parseEther("0.1"));

      const metadata = JSON.parse(await staking.metadataJSON(depositTokenID));

      expect(metadata.attributes[0].value).to.equal(zeroAddress);
      expect(metadata.attributes[1].value).to.equal(depositAmount);
      expect(metadata.attributes[2].value).to.equal(timestamp);
      expect(metadata.attributes[3].value).to.equal(timestamp);

      await expect(
        staking.connect(user2)["withdraw(uint256,address)"](depositTokenID, user1.address)
      ).to.emit(staking, "Withdrawn").withArgs(depositTokenID, user2.address, user1.address);

      expect(await staking.balanceOf(user2.address)).to.equal(depositTokenCount);

      // Account for gas fees
      expect(await ethers.provider.getBalance(user1.address)).to.be.closeTo(initialNativeBalance, ethers.parseEther("0.1"));
    });
  });

});