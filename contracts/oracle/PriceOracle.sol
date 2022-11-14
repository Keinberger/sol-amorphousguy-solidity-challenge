// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IPriceOracle.sol";

/**
 * @title PriceOracle
 * @author Philipp Keinberger
 * @notice This contract provides a price oracle for a given ERC-20 token and ETH pool contract.
 * The price is determined by the amount of tokens in circulation and the total value of ETH
 * inside of the pool.
 * The price formula is: (amount of ETH inside the pool) / (total Supply of tokens)
 * @dev This contract implements the IPriceOracle interface.
 */
contract PriceOracle is IPriceOracle {
    /**
     * @dev DIVISION_GUARD is a constant that is required for safe divisions.
     * It ensures that the divisor is never greater than the numerator, which would
     * lead to the divsion result being 0.
     */
    uint256 private constant DIVISION_GUARD = 1e18;
    address private immutable i_poolAddress;
    IERC20 private immutable i_token;

    /// @notice sets the ETH pool and ERC-20 token addresses
    constructor(address poolAddress, address tokenAddress) {
        i_poolAddress = poolAddress;
        i_token = IERC20(tokenAddress);
    }

    /**
     * @notice Internal function for calculating the price.
     * The function will return the price determined by the price formula.
     * If the amount of ETH inside the pool or the amount of tokens in circulation is zero, the
     * function will return a price of 1 (starting price 1token = 1eth).
     * @param poolValue is the ETH value of the pool
     * @dev This function gets called by getPrice and getTokenAmountFromEthAmountAtDeposit.
     */
    function _getPrice(uint256 poolValue) internal view returns (uint256) {
        uint256 totalSupply = i_token.totalSupply();
        if (poolValue == 0 || totalSupply == 0) return 1e18;
        return ((poolValue * DIVISION_GUARD) / totalSupply);
    }

    /**
     * @notice Function for retrieving the current price
     * @return price of 1 token in ETH (wei)
     */
    function getPrice() public view override returns (uint256) {
        uint256 poolValue = i_poolAddress.balance;
        return _getPrice(poolValue);
    }

    /**
     * @inheritdoc IPriceOracle
     * @dev This function returns the amount of tokens equivalent to `ethAmount`, while
     * taking into account that `ethAmount` has already been deposited into the pool.
     */
    function getTokenAmountFromEthAmountAtDeposit(uint256 ethAmount)
        external
        view
        override
        returns (uint256)
    {
        uint256 poolValueMinMsgValue = i_poolAddress.balance - ethAmount;

        return
            (ethAmount * ((1e18 * DIVISION_GUARD) / _getPrice(poolValueMinMsgValue))) /
            DIVISION_GUARD;
    }

    /**
     * @inheritdoc IPriceOracle
     * @dev This function returns the amount of tokens equivalent to `ethAmount`.
     */
    function getTokenAmountFromEthAmount(uint256 ethAmount)
        external
        view
        override
        returns (uint256)
    {
        uint256 poolValue = i_poolAddress.balance;

        return (ethAmount * ((1e18 * DIVISION_GUARD) / _getPrice(poolValue))) / DIVISION_GUARD;
    }

    /**
     * @inheritdoc IPriceOracle
     * @dev This function returns the amount of ETH equivalent to `tokenAmount`.
     */
    function getEthAmountFromTokenAmount(uint256 tokenAmount)
        external
        view
        override
        returns (uint256)
    {
        return (getPrice() * tokenAmount) / DIVISION_GUARD;
    }
}
