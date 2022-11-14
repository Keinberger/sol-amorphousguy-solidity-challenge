// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @dev This is an interface defining standard functions of the price oracle
 * for the PoolToken.
 */
interface IPriceOracle {
    /**
     * @notice Function for retrieving the price of the token
     * @return price of token in wei
     */
    function getPrice() external view returns (uint256);

    /**
     * @notice Function for getting the amount of tokens for a given amount of ETH `ethAmount`
     * at deposit
     * @param ethAmount is the amount of ETH in wei
     * @return tokenAmount amount of tokens in wei
     */
    function getTokenAmountFromEthAmountAtDeposit(uint256 ethAmount)
        external
        view
        returns (uint256);

    /**
     * @notice Function for getting the amount of tokens for a given amount of ETH `ethAmount`
     * @param ethAmount is the amount of ETH in wei
     * @return amount of tokens in wei
     */
    function getTokenAmountFromEthAmount(uint256 ethAmount) external view returns (uint256);

    /**
     * @notice Function for retrieving the eth amount for given amount of tokens
     * @param tokenAmount is the amount of tokens
     * @return amount of ETH in wei
     */
    function getEthAmountFromTokenAmount(uint256 tokenAmount) external view returns (uint256);
}
