// @ts-ignore
import { ethers, network } from "hardhat"
import {
    developmentChains,
    FUNCTION,
    MIN_DELAY,
    NEW_STORE_VAL,
    PROPOSAL_DESCRIPTION,
    VOTING_DELAY,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTimes } from "../utils/move-times"

export async function queueExecute() {
    const args = [NEW_STORE_VAL]
    const box = await ethers.getContract("Box")
    const encodedFunction = box.interface.encodeFunctionData(FUNCTION, args)
    //    const descriptionHash = ethers.utils.id(PROPOSAL_DESCRIPTION)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))

    const governor = await ethers.getContract("GovernorContract")
    console.log("Queueing")
    
    const queueTransaction = await governor.queue(
        [box.address],
        [0],
        [encodedFunction],
        descriptionHash
    )
    await queueTransaction.wait(1)
    

    if (developmentChains.includes(network.name)) {
        await moveTimes(MIN_DELAY + 1)
        await moveBlocks(VOTING_DELAY + 1)
    }

    console.log("Execution started")
    const executeTx = await governor.execute([box.address], [0], [encodedFunction], descriptionHash)
    await executeTx.wait(1)

    const boxNewValue = await box.retrieve()
    console.log(`New box val: ${boxNewValue.toString()}`)
}

queueExecute()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
