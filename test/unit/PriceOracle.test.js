const { expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { networkConfig, constants } = require("../../helper-hardhat-config")

const chainId = network.config.chainId

const testContracts = networkConfig[chainId].forTests
const contractName = "PriceOracle"

!constants.developmentChains.includes(network.name)
    ? describe.skip
    : describe(contractName, () => {
          let contract, pool, token, deployer, amountMinted, poolValue, oneEth

          beforeEach(async () => {
              deployer = await ethers.getSigner((await getNamedAccounts()).deployer)
              await deployments.fixture(["forTests"])
              contract = await ethers.getContract(contractName, deployer.address)
              token = await ethers.getContract(testContracts[0].name)
              pool = await ethers.getContract(testContracts[1].name)

              oneEth = ethers.utils.parseEther("1")
              amountMinted = ethers.utils.parseEther("10")
              poolValue = ethers.utils.parseEther("12")
          })

          describe("getPrice", () => {
              it("returns one eth if pool value is 0", async () => {
                  await token.mint(deployer.address, amountMinted)

                  const priceRetrieved = await contract.getPrice()
                  expect(priceRetrieved.toString()).to.equal(oneEth.toString())
              })
              it("returns one eth if totalSupply is 0", async () => {
                  await deployer.sendTransaction({ to: pool.address, value: poolValue.toString() })

                  const priceRetrieved = await contract.getPrice()
                  expect(priceRetrieved.toString()).to.equal(oneEth.toString())
              })
              it("returns the correct price", async () => {
                  await token.mint(deployer.address, amountMinted)
                  await deployer.sendTransaction({ to: pool.address, value: poolValue.toString() })
                  const priceExpected = poolValue.mul(oneEth).div(amountMinted)

                  const priceRetrieved = await contract.getPrice()
                  expect(priceRetrieved.toString()).to.equal(priceExpected.toString())
              })
          })

          describe("getTokenAmountFromEthAmountAtDeposit", () => {
              beforeEach(async () => {
                  await token.mint(deployer.address, amountMinted)
                  await deployer.sendTransaction({ to: pool.address, value: poolValue.toString() })
              })
              it("returns the correct token amount", async () => {
                  const ethAmount = oneEth
                  const expectedTokenAmount = amountMinted.mul(oneEth).div(poolValue)
                  await deployer.sendTransaction({ to: pool.address, value: ethAmount.toString() })

                  const tokenAmountRetrieved = await contract.getTokenAmountFromEthAmountAtDeposit(
                      ethAmount
                  )
                  expect(tokenAmountRetrieved.toString()).to.equal(expectedTokenAmount.toString())
              })
          })

          describe("getTokenAmountFromEthAmount", () => {
              beforeEach(async () => {
                  await token.mint(deployer.address, amountMinted)
                  await deployer.sendTransaction({ to: pool.address, value: poolValue.toString() })
              })
              it("returns the correct token amount", async () => {
                  const ethAmount = oneEth
                  const expectedTokenAmount = amountMinted.mul(oneEth).div(poolValue)

                  const tokenAmountRetrieved = await contract.getTokenAmountFromEthAmount(ethAmount)
                  expect(tokenAmountRetrieved.toString()).to.equal(expectedTokenAmount.toString())
              })
          })

          describe("getEthAmountFromTokenAmount", () => {
              beforeEach(async () => {
                  await token.mint(deployer.address, amountMinted)
                  await deployer.sendTransaction({ to: pool.address, value: poolValue.toString() })
              })
              it("returns the correct eth amount", async () => {
                  const tokenAmount = amountMinted.mul(oneEth).div(poolValue)
                  const expectedEthAmount = oneEth.sub(1)

                  const ethAmountRetrieved = await contract.getEthAmountFromTokenAmount(tokenAmount)
                  expect(ethAmountRetrieved.toString()).to.equal(expectedEthAmount.toString())
              })
          })
      })
