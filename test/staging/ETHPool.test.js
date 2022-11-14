const { expect, assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { networkConfig, constants } = require("../../helper-hardhat-config")

const chainId = network.config.chainId

const contracts = networkConfig[chainId].contracts
const contractConfig = contracts.ETHPool
const contractName = contractConfig.name

!constants.testNetChains.includes(network.name)
    ? describe.skip
    : describe(contractName + " - Staging", () => {
          let ethPool_T, ethPool_A, ethPool_B, T, A, B, priceOracle, depositAmount, waitForBlocks

          beforeEach(async () => {
              T = await ethers.getSigner((await getNamedAccounts()).deployer)
              A = await ethers.getSigner((await getNamedAccounts()).A)
              B = await ethers.getSigner((await getNamedAccounts()).B)

              ethPool_T = await ethers.getContract(contractName, T.address)
              ethPool_A = await ethers.getContract(contractName, A.address)
              ethPool_B = await ethers.getContract(contractName, B.address)

              const priceOracleAddress = await ethPool_T.getPriceOracleAddress()
              priceOracle = await ethers.getContractAt("PriceOracle", priceOracleAddress)

              depositAmount = ethers.utils.parseEther("0.01")
              blockConfirmations = 1
          })

          describe("A, B and T example", () => {
              it("lets A and B deposit and withdraw their correct amounts", async () => {
                  const aDeposit = ethers.utils.parseEther("0.01")
                  const bDeposit = ethers.utils.parseEther("0.04")
                  const tRewardDeposit = ethers.utils.parseEther("0.02")

                  const mintedToA = await priceOracle.getTokenAmountFromEthAmount(aDeposit)
                  assert(
                      mintedToA.toString() == aDeposit.toString(),
                      "mint amount to A is not correct"
                  )
                  const aDepositTx = await ethPool_A.deposit({ value: aDeposit })
                  await aDepositTx.wait(blockConfirmations)
                  console.log("A deposit sucessful")

                  const rewardsTx = await T.sendTransaction({
                      to: ethPool_T.address,
                      value: tRewardDeposit,
                  })
                  await rewardsTx.wait(blockConfirmations)
                  console.log("Sent rewards to contract")

                  const mintedToB = await priceOracle.getTokenAmountFromEthAmount(bDeposit)
                  assert(
                      mintedToB.toString() != bDeposit.toString(),
                      `mint amount to B is not correct\nexpected: ${mintedToB.toString()} not to equal ${bDeposit.toString()}`
                  )

                  const bDepositTx = await ethPool_B.deposit({ value: bDeposit })
                  await bDepositTx.wait(blockConfirmations)
                  console.log("B deposit sucessful")

                  const aWithdrawalAmount = aDeposit.add(tRewardDeposit).toString()
                  await expect(() => ethPool_A.withdraw(mintedToA)).to.changeEtherBalances(
                      [ethPool_A, A],
                      ["-" + aWithdrawalAmount, aWithdrawalAmount]
                  )
                  console.log("A withdrawal sucessful")

                  const bWithdrawalAmount = bDeposit.sub(1).toString()
                  await expect(() => ethPool_B.withdraw(mintedToB)).to.changeEtherBalances(
                      [ethPool_B, B],
                      ["-" + bWithdrawalAmount, bWithdrawalAmount]
                  )
                  console.log("B withdrawal successful")
              })
          })
      })
