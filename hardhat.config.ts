import "hardhat-deploy"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import { HardhatUserConfig } from "hardhat/config"
/** @type import('hardhat/config').HardhatUserConfig */

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },

        localhost: {
            chainId: 31337,
        },
    },
    solidity: {
        compilers: [{ version: "0.8.17" }, { version: "0.8.0" }],
    },
    namedAccounts: { deployer: { default: 0 } },
}

export default config
