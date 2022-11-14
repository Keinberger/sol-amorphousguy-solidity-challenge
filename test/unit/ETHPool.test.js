const { expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { networkConfig, constants } = require("../../helper-hardhat-config")

const chainId = network.config.chainId
const testContracts = networkConfig[chainId].forTests
const contractName = networkConfig[chainId].contracts.ETHPool.name

!constants.developmentChains.includes(network.name)
    ? describe.skip
    : describe(contractName, () => {
          let contract, token, priceOracle, A, deployer, depositAmount

          beforeEach(async () => {
              deployer = await ethers.getSigner((await getNamedAccounts()).deployer)
              A = await ethers.getSigner((await getNamedAccounts()).A)
              await deployments.fixture(["forTests"])
              contract = await ethers.getContract(contractName, A.address)

              const tokenAddress = await contract.getTokenAddress()
              const priceOracleAddress = await contract.getPriceOracleAddress()

              token = await ethers.getContractAt(
                  testContracts[0].name,
                  tokenAddress,
                  deployer.address
              )
              priceOracle = await ethers.getContractAt(
                  testContracts[2].name,
                  priceOracleAddress,
                  deployer.address
              )

              depositAmount = ethers.utils.parseEther("4")
          })

          describe("constructor", () => {
              it("sets team as owner", async () => {
                  const teamAddress = deployer.address
                  const owner = await contract.owner()

                  expect(owner).not.to.equal(constants.NULL_ADDRESS)
                  expect(owner).to.equal(teamAddress)
              })
          })

          describe("deposit", () => {
              it("mints correct token amount to caller", async () => {
                  const amountToMint = await priceOracle.getTokenAmountFromEthAmount(depositAmount)

                  await expect(() =>
                      contract.deposit({ value: depositAmount })
                  ).to.changeTokenBalance(token, A, amountToMint.toString())
              })
          })

          describe("withdraw", () => {
              let tokenAmount
              beforeEach(async () => {
                  tokenAmount = ethers.utils.parseEther("2")
                  await contract.deposit({ value: depositAmount })
              })
              it("reverts if tokenAmount exceeds balance", async () => {
                  await expect(contract.withdraw(depositAmount.add(1))).to.be.revertedWith(
                      "ETHPool__NotEnoughTokens()"
                  )
              })
              it("burns tokens", async () => {
                  await expect(() => contract.withdraw(tokenAmount)).to.changeTokenBalance(
                      token,
                      A,
                      "-" + tokenAmount.toString()
                  )
              })
              it("transfers correct amount of eth to caller", async () => {
                  const ethAmountToTransfer = await priceOracle.getEthAmountFromTokenAmount(
                      tokenAmount
                  )
                  await expect(() => contract.withdraw(tokenAmount)).to.changeEtherBalances(
                      [contract, A],
                      ["-" + ethAmountToTransfer.toString(), ethAmountToTransfer.toString()]
                  )
              })
          })

          describe("receive", () => {
              describe("allows owner (team) to deposit rewards", () => {
                  it("does not call deposit", async () => {
                      const tokenAmounToBeMinted = await priceOracle.getTokenAmountFromEthAmount(
                          depositAmount
                      )

                      await expect(() =>
                          deployer.sendTransaction({ to: contract.address, value: depositAmount })
                      ).to.not.changeTokenBalance(token, deployer, tokenAmounToBeMinted.toString())

                      const balanceRetrieved = await token.balanceOf(deployer.address)
                      expect(balanceRetrieved.toString()).to.equal("0")
                  })
              })
          })
      })
