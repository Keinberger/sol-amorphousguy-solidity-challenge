require("dotenv").config()

require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("solidity-coverage")
require("hardhat-deploy")
require("@primitivefi/hardhat-dodoc")

const GOERLI_RPC_URL =
    process.env.RPC_URL !== undefined ? process.env.RPC_URL.replace("network", "goerli") : ""
const GOERLI_PRIVATE_KEY =
    process.env.GOERLI_PRIVATE_KEY !== undefined ? process.env.GOERLI_PRIVATE_KEY : ""
const A_GOERLI_PRIVATE_KEY =
    process.env.A_GOERLI_PRIVATE_KEY !== undefined ? process.env.A_GOERLI_PRIVATE_KEY : ""
const B_GOERLI_PRIVATE_KEY =
    process.env.B_GOERLI_PRIVATE_KEY !== undefined ? process.env.B_GOERLI_PRIVATE_KEY : ""

const EXPLORER_API_KEY = process.env.EXPLORER_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const REPORT_GAS = process.env.REPORT_GAS

module.exports = {
    solidity: {
        version: "0.8.9",
        defaultNetwork: "hardhat",
        // compilers: [{ version: "0.8.13", settings: { optimizer: { enabled: true, runs: 200 } } }],
        settings: {
            optimizer: {
                // => optimizer makes contract sizes smaller
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        localhost: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        goerli: {
            chainId: 5,
            blockConfirmations: 6,
            url: GOERLI_RPC_URL,
            accounts: [GOERLI_PRIVATE_KEY, A_GOERLI_PRIVATE_KEY, B_GOERLI_PRIVATE_KEY],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        A: {
            default: 1,
        },
        B: {
            default: 2,
        },
    },
    gasReporter: {
        enabled: REPORT_GAS,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        // token: "MATIC",
        excludeContracts: [],
    },
    etherscan: {
        apiKey: EXPLORER_API_KEY,
    },
    dodoc: {
        runOnCompile: false,
        exclude: [],
    },
    mocha: {
        timeout: 300000,
    },
}
