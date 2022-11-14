# ETHPool

*Philipp Keinberger*

> ETHPool

This contract is an ethereum pool allowing users to deposit eth and earn rewards on their deposits. Rewards are manually transferred into the pool by `teamAddress`. The amount of rewards eligible dependends on the individual stake of users inside the pool.

*This contract implements the IPoolToken and IPriceOracle interfaces for its pool token and corresponding token price oracle. This contracts inherits from Openzeppelins Ownable contract to allow for the controlled deposit of rewards by `teamAddress`.*

## Methods

### deposit

```solidity
function deposit() external payable
```

Function for depositing funds into the pool

*This function can not be called by the owner (team) This function will mint new pool tokens to the sender, depending on the current price. This token balance is a representation for the callers stake in the pool. The tokens can then be used for withdrawal.*


### getPriceOracleAddress

```solidity
function getPriceOracleAddress() external view returns (address)
```

Function for getting the price oracle address of the pool




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | address of the price oracle |

### getTokenAddress

```solidity
function getTokenAddress() external view returns (address)
```

Function for getting the ERC20 token address of the pool




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | address of the token |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### withdraw

```solidity
function withdraw(uint256 tokenAmount) external payable
```

Function for withdrawing funds from the pool

*This function burns `tokenAmount` and sends the corresponding amount of ETH (determined by the price) to the user. This functions reverts if `tokenAmount` exceeds the callers balance. This function reverts if the transfer of ETH to the caller fails.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAmount | uint256 | is the amount of tokens the caller exchanges for ETH |



## Events

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |



## Errors

### ETHPool__EthTransferFailed

```solidity
error ETHPool__EthTransferFailed()
```

Thrown when transfer of eth fails




### ETHPool__NotEnoughTokens

```solidity
error ETHPool__NotEnoughTokens()
```

Thrown when caller requests more tokens to be withdrawn than balance




### ETHPool__OwnerNotAllowed

```solidity
error ETHPool__OwnerNotAllowed()
```

Thrown when owner is not allowed to access certain function





