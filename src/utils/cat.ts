import axios from 'axios'
import FormData from 'form-data'
import { Pool } from 'pg'
import logger from './logger'

const INFURA_IPFS_ENDPOINT_1 = 'https://subgraph-ipfs-endpoint-1.infura-ipfs.io/ipfs/'
const INFURA_IPFS_ENDPOINT_2 = 'https://subgraph-ipfs-endpoint-2.infura-ipfs.io/ipfs/'
const INFURA_IPFS_ENDPOINT_3 = 'https://subgraph-ipfs-endpoint-3.infura-ipfs.io/ipfs/'
const INFURA_IPFS_ENDPOINT_4 = 'https://subgraph-ipfs-endpoint-4.infura-ipfs.io/ipfs/'
const THE_GRAPH_IPFS_ENDPOINT = 'https://api.thegraph.com/ipfs/api/v0/cat?arg='
const QUESTBOOK_IPFS_ENDPOINT = 'https://ipfs.questbook.app:8080/api/v0/cat?arg='

const UPLOAD_ENDPOINT = 'https://ipfs.questbook.app/api/v0/add?pin=true'

const IPFS_ENDPOINTS = [
	INFURA_IPFS_ENDPOINT_1,
	INFURA_IPFS_ENDPOINT_2,
	INFURA_IPFS_ENDPOINT_3,
	INFURA_IPFS_ENDPOINT_4,
	THE_GRAPH_IPFS_ENDPOINT,
	QUESTBOOK_IPFS_ENDPOINT
]

const cat = async(hash: string) => {
	const shuffledEndpoints = IPFS_ENDPOINTS.sort((a, b) => 0.5 - Math.random())

	for(const endpoint of shuffledEndpoints) {
		try {
			const response = await axios.get(endpoint + hash, { timeout: 3000 })
			if(response.status === 200) {
				logger.info(`Cat ${hash} from ${endpoint}`)
				return response.data
			}
		} catch(error) {
			logger.error(`Failed to cat ${hash} from ${endpoint} with error ${error}`)
		}
	}

	throw new Error('All requests failed')
}

export const upload = async(hash: string) => {

	const data = new FormData()
	const blob = await cat(hash)
	data.append('file', JSON.stringify(blob))

	try {
		const response = await axios.post(UPLOAD_ENDPOINT, data, { timeout: 3000 })
		if(response.status === 200) {
			logger.info(`Uploaded ${JSON.stringify(blob)} with hash ${response.data.Hash} to ${UPLOAD_ENDPOINT}`)
			return response.data
		}
	} catch(error) {
		logger.error(`Failed to upload ${data} to ${UPLOAD_ENDPOINT} with error ${error}`)
	}
}

const pool = new Pool({
	user: '',
	database: '',
	password: '',
	host: '',
	port: 5432,
})

export const reconcile = async() => {
	const rows = await pool.query('SELECT hash FROM hashes WHERE is_uploaded = 1 limit 2')
	const hashes = rows.rows.map((row) => row.hash)

	for(const hash of hashes) {
		try {
			if(hash) {
				const response = await upload(hash)
				if(hash !== response.Hash) {
					throw new Error(`Hash mismatch: ${hash} vs ${response.Hash}`)
				}

				await pool.query('UPDATE hashes SET is_uploaded = 1 WHERE hash = $1', [hash])
				logger.info(`Reconciled ${hash} with response ${response}`)
			}
		} catch(error) {
			logger.error(`Failed to reconcile ${hash} with error ${error}`)
		}
	}
}


const zob = async() => {
	const rows = await pool.query('SELECT hash FROM hashes WHERE is_uploaded = 1')

	const hashes = rows.rows.map((row) => row.hash)
	const filteredHashes = hashes.filter(hash => hash.slice(0, 2) === 'Qm')

	console.log(filteredHashes.length, hashes.length)

}

export default cat
