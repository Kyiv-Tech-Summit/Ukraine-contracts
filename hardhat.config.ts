/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-tracer";
import "hardhat-gas-reporter";
import "hardhat-dependency-compiler";
import "hardhat-deploy";

require('dotenv').config();

let { 
    ETHERSCAN_TOKEN,
    PRIVATE_KEY
} = process.env;

let networks;

if(PRIVATE_KEY) {
    let accounts = [
        PRIVATE_KEY
    ]
    networks = {
        hardhat: {},
        mainnet: {
            url: "https://mainnet.infura.io/v3/f64230346f3e45058e09e5d5e6912e5c",
            accounts
        },
        rinkeby: {
            url: "https://eth-rinkeby.alchemyapi.io/v2/v92DVe9FFvr2lzRB4wjtk-z4DdsQjBhs",
            gasPrice: 5000000000,
            accounts
        },
        ropsten: {
            url: "https://eth-ropsten.alchemyapi.io/v2/v92DVe9FFvr2lzRB4wjtk-z4DdsQjBhs",
            gasPrice: 20000000000,
            accounts
        },
        kovan: {
            url: "https://eth-kovan.alchemyapi.io/v2/v92DVe9FFvr2lzRB4wjtk-z4DdsQjBhs",
            gasPrice: 20000000000,
            accounts
        },
        goerli: {
            url: "https://eth-goerli.alchemyapi.io/v2/v92DVe9FFvr2lzRB4wjtk-z4DdsQjBhs",
            gasPrice: 20000000000,
            accounts
        },
    };
} else {
    networks = {
        hardhat: {},
    };
}

module.exports = {
    defaultNetwork: "hardhat",
    networks: networks,
    etherscan: {
        apiKey: {
            mainnet:ETHERSCAN_TOKEN,
            rinkeby:ETHERSCAN_TOKEN,
            ropsten:ETHERSCAN_TOKEN,
            kovan:ETHERSCAN_TOKEN,
            goerli:ETHERSCAN_TOKEN
        }
    },
    dependencyCompiler: {
    },
    namedAccounts: {
        deployer: 0,
    },
    abiExporter: {
        path: './artifacts/abi',
        clear: true,
        flat: true,
        only: [':RidneMisto'],
        spacing: 2
    },
    solidity: {
        version: "0.8.14",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    typechain: {
        outDir: 'src/types',
        target: 'ethers-v5',
        alwaysGenerateOverloads: false,
        externalArtifacts: ['externalArtifacts/*.json'],
    },
};

