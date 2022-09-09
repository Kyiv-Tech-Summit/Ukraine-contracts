//@ts-ignore
module.exports = async ({getNamedAccounts, deployments, getChainId}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    await deploy('RidneMistoProxyAdmin', {
      from: deployer,
    });
  };
  module.exports.tags = ['RidneMistoProxyAdmin']
    