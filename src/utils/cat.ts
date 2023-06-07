import axios from 'axios'
import logger from './logger'

const INFURA_IPFS_ENDPOINT_1 = 'https://subgraph-ipfs-endpoint-1.infura-ipfs.io/ipfs/'
const INFURA_IPFS_ENDPOINT_2 = 'https://subgraph-ipfs-endpoint-2.infura-ipfs.io/ipfs/'
const INFURA_IPFS_ENDPOINT_3 = 'https://subgraph-ipfs-endpoint-3.infura-ipfs.io/ipfs/'
const INFURA_IPFS_ENDPOINT_4 = 'https://subgraph-ipfs-endpoint-4.infura-ipfs.io/ipfs/'
const THE_GRAPH_IPFS_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/cat?arg='

const IPFS_ENDPOINTS = [
	INFURA_IPFS_ENDPOINT_1,
	INFURA_IPFS_ENDPOINT_2,
	INFURA_IPFS_ENDPOINT_3,
	INFURA_IPFS_ENDPOINT_4,
	THE_GRAPH_IPFS_ENDPOINT
]

const cat = async(hash: string) => {
	const shuffledEndpoints = IPFS_ENDPOINTS.sort((a, b) => 0.5 - Math.random())

	for(const endpoint of shuffledEndpoints) {
		try {
			const response = await axios.get(endpoint + hash, { timeout: 3000 })
			if(response.status === 200) {
				return response.data
			}
		} catch(error) {
			logger.error(`Failed to cat ${hash} from ${endpoint} with error ${error}`)
		}
	}

	throw new Error('All requests failed')
}

export default cat
