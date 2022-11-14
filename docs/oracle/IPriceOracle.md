# IPriceOracle







*This is an interface defining standard functions of the price oracle for the PoolToken.*

## Methods

### getEthAmountFromTokenAmount

```solidity
function getEthAmountFromTokenAmount(uint256 tokenAmount) external view returns (uint256)
```

Function for retrieving the eth amount for given amount of tokens



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

Function for retrieving the price of the token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | price of token in wei |

### getTokenAmountFromEthAmount

```solidity
function getTokenAmountFromEthAmount(uint256 ethAmount) external view returns (uint256)
```

Function for getting the amount of tokens for a given amount of ETH `ethAmount`



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



#### Parameters

| Name | Type | Description |
|---|---|---|
| ethAmount | uint256 | is the amount of ETH in wei |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | tokenAmount amount of tokens in wei |




