const { constants, networkConfig } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const isDevelopmentChain = constants.developmentChains.includes(network.name)

    if (!isDevelopmentChain) return

    const contracts = networkConfig[chainId].forTests
    for (let i = 0; i < contracts.length; i++) {
        const contractConfig = contracts[i]
        let constructorArguments = contractConfig.args

        switch (contractConfig.name) {
            case "ETHPool":
                constructorArguments = [deployer]
                break
            case "PriceOracle":
                const pool = await ethers.getContract("ETHPool")
                const poolToken = await ethers.getContract("PoolToken")
                constructorArguments = [pool.address, poolToken.address]
                break
        }

        log(`Deploying ${contractConfig.name} to ${network.name}`)
        const deployedContract = await deploy(contractConfig.name, {
            from: deployer,
            args: constructorArguments,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        log(`${contractConfig.name} (${deployedContract.address}) deployed at (${network.name})`)
    }

    log("------------------------------")
}

module.exports.tags = ["forTests"]
