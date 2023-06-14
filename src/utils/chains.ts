import { ethers } from 'ethers'
import chainInfo from './chainInfo.json'
import SupportedChainId from './SupportedChainId'
import { ChainInfoMap } from './types'

export const CHAIN_INFO = chainInfo as ChainInfoMap

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(CHAIN_INFO)
	.map(({ id }) => id)

export { SupportedChainId }

export const jsonRpcProviders: { [key: string]: ethers.providers.JsonRpcProvider } =
{
	'5': new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/c7FL3Wd0zxt_DtjeN1wqMWtCFVUTV_sP'),
	'137': new ethers.providers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/zcWxjKH0Sif5PLp-b-vxP_M1JYF1aoPG'),
	'10': new ethers.providers.JsonRpcProvider('https://opt-mainnet.g.alchemy.com/v2/8iYVobmm24k85ejRIS0fd8sBzSVbQtZv'),
	'42220': new ethers.providers.JsonRpcProvider('https://forno.celo.org/'),
}
