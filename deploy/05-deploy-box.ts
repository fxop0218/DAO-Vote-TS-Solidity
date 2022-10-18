import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const deployBox = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre
    const { log, deploy, get } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying box contract")
    const box = await deploy("Box", {
        from: deployer,
        log: true,
        args: [],
    })

    const timeLock = await ethers.getContract("TimeLock")
    // Transfer ownership to timeLock contract
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferOwnerTransaction = await boxContract.transferOwnership(timeLock.address)
    await transferOwnerTransaction.wait(1)
    log("Completed")
}

export default deployBox
