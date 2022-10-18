import * as fs from "fs"
import { developmentChains, proposalDir, VOTING_PERIOD } from "../helper-hardhat-config"
import { network, ethers } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"

const index = 0

async function main(proposalIndex: number) {
    const proposal = JSON.parse(fs.readFileSync(proposalDir, "utf8"))
    const proposalId = proposal[network.config.chainId!][proposalIndex]
    const voteWay = 1
    const reason = "I want to be Broly"
    const governor = await ethers.getContract("GovernorContract")
    // https://docs.openzeppelin.com/contracts/4.x/api/governance
    const voteTransactionResponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTransactionResponse.wait(1)
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    console.log("You have successfully voted")
}

main(index)
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
