const { network, ethers } = require("hardhat")
const { scriptsConfig, networkConfig } = require("../helper-hardhat-config")

const main = async () => {
    const chainId = network.config.chainId
    const contractName = networkConfig[chainId].contracts.ETHPool.name
    const contract = await ethers.getContract(contractName)

    const balance = await ethers.provider.getBalance(contract.address)
    console.log("Total Balance of ETHPool: ", ethers.utils.formatEther(balance))
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
