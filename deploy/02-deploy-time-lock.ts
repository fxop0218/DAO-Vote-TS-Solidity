import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { MIN_DELAY } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying timeLocker...")

    const timeLockContract = await deploy("TimeLock", {
        from: deployer,
        log: true,
        args: [MIN_DELAY, [], []],
    })
}

export default deployTimeLock
