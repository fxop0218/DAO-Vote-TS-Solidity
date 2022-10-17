// https://github.com/wighawag/hardhat-deploy

import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying governance token")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        log: true,
        args: [],
        //waitConfirmations, (ignore in this case)
    })
    log(`Successfully deployed GovernanceToken address:(${governanceToken.address})`)
    await delegate(governanceToken.address, deployer)
    log("Successfully delegated")
}

const delegate = async (governanceTokenAddress: string, delegateAccount: string) => {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const tokenTx = await governanceToken.delegate(delegateAccount)
    tokenTx.wait(1)
    console.log(`Checkpoint ${await governanceToken.numCheckpoints(delegateAccount)}`)
}
export default deployGovernanceToken
