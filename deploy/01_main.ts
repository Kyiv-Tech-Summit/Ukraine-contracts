import { getImplementationAddress } from '@openzeppelin/upgrades-core';
require('dotenv').config();
//@ts-ignore
const delay = ms => new Promise(res => setTimeout(res, ms));

//@ts-ignore
module.exports = async ({ ethers, run, getNamedSigners, deployments, getChainId, upgrades }) => {
    const { deploy } = deployments;
    const [deployer] = await ethers.getSigners();
    const ProxyAdmin = await deployments.get('RidneMistoProxyAdmin');

    //ipfs of initial tokens
    const metadata = ["ipfs://QmfZNctNLkCHn94x6iDq3gkcZZcrcqTkMWuWJbRHoBVGnv", "ipfs://QmfJCFV4ZfiGhjzCALKmrVGNKM6DD4qrGuyuVAzmkayeRu"]
    //name, symbol, mint price, initial tokens and unrestricted funds
    const funds = ["0x5353c7cCDDD1C8EB4341f0EE60927E73f89F4C9c", "0xa1b1bbB8070Df2450810b8eB2425D543cfCeF79b", "0xfc0b52E020223c98a546F814cdA6d7872D74b386"]

    const constructor = [
        'Ridne Misto',
        'RM',
        "20000000000000000",
        metadata,
        funds
    ]
    const factoryContract = await ethers.getContractFactory('RidneMisto');
    let deployedContract = await deployments.getOrNull('RidneMisto');
    let RidneMisto;
    if (deployedContract) {
        RidneMisto = await upgrades.upgradeProxy(deployedContract.address, factoryContract, constructor);
    } else {
        RidneMisto = await upgrades.deployProxy(factoryContract, constructor);
        await RidneMisto.deployed();
    }

    await deployments.save('RidneMisto', RidneMisto)
    let implementation = { address: RidneMisto.address, path: 'contracts/RidneMisto.sol:RidneMisto' }

    //implementation verification
    const currentImplAddress = await getImplementationAddress(ethers.provider, implementation.address);
    console.log(`${implementation.address} => ${currentImplAddress}`)
    await delay(30000)

    try {
        await run('verify:verify', {
            address: currentImplAddress,
            contract: implementation.path
        });
    } catch (error) {
        console.log(error)
    }
    console.log("Contract deployed to:", RidneMisto.address);

};
module.exports.tags = ['RidneMisto']
module.exports.dependencies = ['RidneMistoProxyAdmin']

