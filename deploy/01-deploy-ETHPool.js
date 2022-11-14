const { networkConfig, constants } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")
const { verify } = require("../utils/deployment/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const isDevelopmentChain = constants.developmentChains.includes(network.name)

    const contracts = networkConfig[chainId].contracts
    const contractConfig = contracts.ETHPool
    let constructorArguments = [contractConfig.args.teamAddress]

    log(`Deploying ${contractConfig.name} to ${network.name}`)
    const deployedContract = await deploy(contractConfig.name, {
        from: deployer,
        args: constructorArguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`${contractConfig.name} (${deployedContract.address}) deployed at (${network.name})`)

    if (!isDevelopmentChain && process.env.EXPLORER_API_KEY) {
        await verify(deployedContract.address, constructorArguments, network.name)
    }

    log("------------------------------")
}

module.exports.tags = ["all", "ETHPool"]
