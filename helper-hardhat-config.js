const { ethers } = require("hardhat")

const constants = {
    developmentChains: ["hardhat", "localhost"],
    testNetChains: ["goerli", "localhost"],
    NULL_ADDRESS: ethers.constants.AddressZero,
    FRONTEND_FILE_PATH: "",
}

const scriptsConfig = {
    ETHPool: {},
}

const contractsConfig = {
    ETHPool: {
        name: "ETHPool",
        args: { teamAddress: "0xD3DD405ACfE2F936A989DA9075AAC37AA6176426" },
    },
}

const networkConfig = {
    5: {
        name: "goerli",
        contracts: contractsConfig,
    },
    31337: {
        name: "hardhat",
        contracts: contractsConfig,
        forTests: [
            { name: "PoolToken", args: [] },
            { name: contractsConfig.ETHPool.name, args: [] },
            { name: "PriceOracle", args: [] },
        ],
    },
}

module.exports = {
    constants,
    scriptsConfig,
    networkConfig,
}
