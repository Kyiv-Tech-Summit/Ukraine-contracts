import { hexStripZeros } from "ethers/lib/utils";
import { ethers, run } from "hardhat";
import * as fs from "fs"
//@ts-ignore
const delay = ms => new Promise(res => setTimeout(res, ms));

//@ts-ignore
module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  //PLACEHOLDERS
  const metadata = ["ipfs://Qmc1UF28WCMTp2g33v59dgQrrhN6RmqVY8dBNLBAYEbP5z/1.json", "ipfs://Qmc1UF28WCMTp2g33v59dgQrrhN6RmqVY8dBNLBAYEbP5z/2.json"]
  const funds = ["0x62F650c0eE84E3a1998A2EEe042a12D9E9728843", "0x22f60E6BD7973c226979B6F57BC92C2d66a8c151", "0xf673BFf185bcbA7c97Ed33f66afC46cB31bC301D"]

  //name,sumbol,mint price, initial tokens and unrestricted funds
  const constructor = [
    'name',
    'symbol',
    "20000000000000000",
    metadata,
    funds
  ]
  let erc = await deploy('RidneMisto', {
    from: deployer,
    args: constructor,
    log: true
  })
  await delay(10000)
  try {
    await run("verify:verify", {
      address: erc.address,
      constructorArguments: constructor
    })
  } catch (error) {
    console.log(error)
  }

};
module.exports.tags = ['RidneMisto']

