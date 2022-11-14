# PriceOracle

*Philipp Keinberger*

> PriceOracle

This contract provides a price oracle for a given ERC-20 token and ETH pool contract. The price is determined by the amount of tokens in circulation and the total value of ETH inside of the pool. The price formula is: (amount of ETH inside the pool) / (total Supply of tokens)

*This contract implements the IPriceOracle interface.*

## Methods

### getEthAmountFromTokenAmount

```solidity
function getEthAmountFromTokenAmount(uint256 tokenAmount) external view returns (uint256)
```

Function for retrieving the eth amount for given amount of tokens

*This function returns the amount of ETH equivalent to `tokenAmount`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenAmount | uint256 | is the amount of tokens |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | amount of ETH in wei |

### getPrice

```solidity
function getPrice() external view returns (uint256)
```

Function for retrieving the current price




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | price of 1 token in ETH (wei) |

### getTokenAmountFromEthAmount

```solidity
function getTokenAmountFromEthAmount(uint256 ethAmount) external view returns (uint256)
```

Function for getting the amount of tokens for a given amount of ETH `ethAmount`

*This function returns the amount of tokens equivalent to `ethAmount`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| ethAmount | uint256 | is the amount of ETH in wei |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | amount of tokens in wei |

### getTokenAmountFromEthAmountAtDeposit

```solidity
function getTokenAmountFromEthAmountAtDeposit(uint256 ethAmount) external view returns (uint256)
```

Function for getting the amount of tokens for a given amount of ETH `ethAmount` at deposit

*This function returns the amount of tokens equivalent to `ethAmount`, while taking into account that `ethAmount` has already been deposited into the pool.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| ethAmount | uint256 | is the amount of ETH in wei |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | tokenAmount amount of tokens in wei |




