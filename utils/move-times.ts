import { network } from "hardhat"

export async function moveTimes(amount: number) {
    console.log("Moving time...")
    await network.provider.send("evm_increaseTime", [amount])
    console.log(`Moved; ${amount} sec`)
}
