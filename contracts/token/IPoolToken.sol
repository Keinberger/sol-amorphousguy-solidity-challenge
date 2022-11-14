// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev This interface adds additional mint and burn functionality to standard ERC20 tokens
 * defined by the IERC20 interface of Openzeppelin.
 */
interface IPoolToken is IERC20 {
    /**
     * @notice Function for minting new tokens
     * @param to is the address the new tokens be minted to
     * @param amount is the amount of new tokens to be minted
     */
    function mint(address to, uint256 amount) external;

    /**
     * @notice Function for burning tokens
     * @param from is the address tokens will be burnt from
     * @param amount is the amount of tokens to be burnt
     */
    function burn(address from, uint256 amount) external;
}
