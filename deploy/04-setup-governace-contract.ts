import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { ADDRESS_ZERO } from "../helper-hardhat-config"

const setupGovernanceContract = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre
    const { deployer } = await getNamedAccounts()
    const { deploy, log, get } = deployments

    const timeLocker = await ethers.getContract("TimeLock", deployer)
    const governor = await ethers.getContract("GovernorContract", deployer)

    log("Setting roles")

    const proposeRol = await timeLocker.PROPOSER_ROLE()
    const executorRol = await timeLocker.EXECUTOR_ROLE()
    const timeLockAdminRol = await timeLocker.TIMELOCK_ADMIN_ROLE()
    //const cancellerRol = await timeLocker.CANCELLER_ROLE()

    const proposeTransaction = await timeLocker.grantRole(proposeRol, governor.address)
    await proposeTransaction.wait(1)
    const executorTransaction = await timeLocker.grantRole(executorRol, ADDRESS_ZERO)
    await executorTransaction.wait(1)
    const revokeTransaction = await timeLocker.revokeRole(timeLockAdminRol, deployer)
    await revokeTransaction.wait(1)
}

export default setupGovernanceContract
