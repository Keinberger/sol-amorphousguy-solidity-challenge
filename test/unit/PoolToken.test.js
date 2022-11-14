const { expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { constants } = require("../../helper-hardhat-config")
const contractName = "PoolToken"

!constants.developmentChains.includes(network.name)
    ? describe.skip
    : describe(contractName, () => {
          let contract, aContract, deployer, a

          beforeEach(async () => {
              deployer = await ethers.getSigner((await getNamedAccounts()).deployer)
              a = await ethers.getSigner((await getNamedAccounts()).A)
              await deployments.fixture(["forTests"])
              contract = await ethers.getContract(contractName, deployer.address)
              aContract = await ethers.getContract(contractName, a.address)
          })

          describe("mint", () => {
              let oneEther, ownableError
              before(() => {
                  oneEther = ethers.utils.parseEther("1")
                  ownableError = "Ownable: caller is not the owner"
              })
              it("reverts if not owner", async () => {
                  await expect(aContract.mint(constants.NULL_ADDRESS, oneEther)).to.be.revertedWith(
                      ownableError
                  )
              })
              it("mints new balance to address", async () => {
                  await expect(() => contract.mint(a.address, oneEther)).to.changeTokenBalance(
                      contract,
                      a,
                      oneEther
                  )
              })
          })

          describe("burn", () => {
              let oneEther, ownableError
              before(() => {
                  oneEther = ethers.utils.parseEther("1")
                  ownableError = "Ownable: caller is not the owner"
              })
              it("reverts if not owner", async () => {
                  await expect(aContract.burn(constants.NULL_ADDRESS, oneEther)).to.be.revertedWith(
                      ownableError
                  )
              })
              it("burns balance off address", async () => {
                  await contract.mint(a.address, oneEther)

                  await expect(() => contract.burn(a.address, oneEther)).to.changeTokenBalance(
                      contract,
                      a,
                      "-" + oneEther.toString()
                  )
              })
          })
      })
