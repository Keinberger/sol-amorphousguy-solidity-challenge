// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IPoolToken.sol";

/**
 * @title PoolToken
 * @author Philipp Keinberger
 * @notice This contract is an ERC20 with additional minting and burning functionality restricted
 * to the owner.
 * @dev This contract inherits from Openzeppelins ERC20 contract to implement ERC20 functionality.
 * This contracts inherits from Openzeppelins Ownable contract to allow for controlled
 * minting and burning of tokens by the owner.
 *
 * PoolToken implements the IPoolToken interface to extend its ERC20 functionality to
 * allow for minting and burning of tokens
 */
contract PoolToken is ERC20, Ownable, IPoolToken {
    constructor() ERC20("PoolToken", "PT") {}

    /**
     * @inheritdoc IPoolToken
     * @dev This function reverts if caller is not the owner
     */
    function mint(address to, uint256 amount) public override onlyOwner {
        _mint(to, amount);
    }

    /**
     * @inheritdoc IPoolToken
     * @dev This function reverts if caller is not the owner
     */
    function burn(address from, uint256 amount) public override onlyOwner {
        _burn(from, amount);
    }
}
