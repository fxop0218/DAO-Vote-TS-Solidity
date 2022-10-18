import { ethers, network } from "hardhat"
import {
    FUNCTION,
    NEW_STORE_VAL,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalDir,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs"
export async function porpose(args: any[], functionToCall: string, proposalDescription: string) {
    console.log("vote script started")
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    console.log(`Proposing ${encodedFunctionCall} to ${box.address} with ${args}`)

    console.log(`Proposal description: ${PROPOSAL_DESCRIPTION}`)
    const propeoseTransaction = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        PROPOSAL_DESCRIPTION
    )

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }
    const proposeReceipt = await propeoseTransaction.wait(1)
    const proposalId = proposeReceipt.events[0].args.proposalId
    let proposals = JSON.parse(fs.readFileSync(proposalDir, "utf8"))
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalDir, JSON.stringify(proposals))
}

// Script setup
porpose([NEW_STORE_VAL], FUNCTION, "")
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
