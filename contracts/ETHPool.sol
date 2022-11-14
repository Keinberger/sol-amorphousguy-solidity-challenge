// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./token/PoolToken.sol";
import "./token/IPoolToken.sol";
import "./oracle/PriceOracle.sol";
import "./oracle/IPriceOracle.sol";

/// @notice Thrown when owner is not allowed to access certain function
error ETHPool__OwnerNotAllowed();
/// @notice Thrown when caller requests more tokens to be withdrawn than balance
error ETHPool__NotEnoughTokens();
/// @notice Thrown when transfer of eth fails
error ETHPool__EthTransferFailed();

/**
 * @title ETHPool
 * @author Philipp Keinberger
 * @notice This contract is an ethereum pool allowing users to deposit eth and earn rewards
 * on their deposits. Rewards are manually transferred into the pool by `teamAddress`. The amount
 * of rewards eligible dependends on the individual stake of users inside the pool.
 * @dev This contract implements the IPoolToken and IPriceOracle interfaces for its pool token
 * and corresponding token price oracle.
 *
 * This contracts inherits from Openzeppelins Ownable contract to allow for the controlled
 * deposit of rewards by `teamAddress`.
 */
contract ETHPool is Ownable {
    IPoolToken private immutable i_token;
    IPriceOracle private immutable i_priceOracle;

    /// @notice Checks if caller is not the owner of contract
    modifier notOwner() {
        if (msg.sender == owner()) revert ETHPool__OwnerNotAllowed();
        _;
    }

    /// @notice sets the team address and deploys the pool token and its corresponding price oracle
    constructor(address teamAddress) {
        i_token = new PoolToken();
        i_priceOracle = new PriceOracle(address(this), address(i_token));

        _transferOwnership(teamAddress);
    }

    /// @dev if caller is the owner, the pool will not mint new tokens
    receive() external payable {
        if (msg.sender != owner()) deposit();
    }

    /**
     * @notice Function for depositing funds into the pool
     * @dev This function can not be called by the owner (team)
     * This function will mint new pool tokens to the sender, depending on the current price.
     * This token balance is a representation for the callers stake in the pool. The tokens
     * can then be used for withdrawal.
     */
    function deposit() public payable notOwner {
        uint256 amountToMint = i_priceOracle.getTokenAmountFromEthAmountAtDeposit(msg.value);
        i_token.mint(msg.sender, amountToMint);
    }

    /**
     * @notice Function for withdrawing funds from the pool
     * @param tokenAmount is the amount of tokens the caller exchanges for ETH
     * @dev This function burns `tokenAmount` and sends the corresponding amount
     * of ETH (determined by the price) to the user.
     *
     * This functions reverts if `tokenAmount` exceeds the callers balance.
     * This function reverts if the transfer of ETH to the caller fails.
     */
    function withdraw(uint256 tokenAmount) external payable {
        uint256 ethAmount = i_priceOracle.getEthAmountFromTokenAmount(tokenAmount);

        uint256 balance = i_token.balanceOf(msg.sender);
        if (tokenAmount > balance) revert ETHPool__NotEnoughTokens();

        i_token.burn(msg.sender, tokenAmount);

        (bool success, ) = msg.sender.call{value: ethAmount}("");
        if (!success) revert ETHPool__EthTransferFailed();
    }

    /**
     * @notice Function for getting the ERC20 token address of the pool
     * @return address of the token
     */
    function getTokenAddress() public view returns (address) {
        return (address(i_token));
    }

    /**
     * @notice Function for getting the price oracle address of the pool
     * @return address of the price oracle
     */
    function getPriceOracleAddress() public view returns (address) {
        return (address(i_priceOracle));
    }
}
