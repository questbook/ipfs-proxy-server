import { ethers } from 'ethers'
import { Pool } from 'pg'
import ApplicationRegistryAbi from './abi/ApplicationRegistryAbi.json'
import WorkspaceRegistryAbi from './abi/WorkspaceRegistryAbi.json'
import { APPLICATION_REGISTRY_ADDRESS, WORKSPACE_REGISTRY_ADDRESS } from './addresses'
import { jsonRpcProviders } from './chains'

const pool = new Pool({
	user: '',
	database: '',
	password: '',
	host: '',
	port: 5432,
})

export const getWorkspacesHashes = async() => {
	await pool.query('CREATE TABLE IF NOT EXISTS hashes (hash VARCHAR(100) PRIMARY KEY, is_uploaded INTEGER, timestamp TIMESTAMP DEFAULT NOW())')

	for(const chain in WORKSPACE_REGISTRY_ADDRESS) {
		const workspaceContract = new ethers.Contract(
			WORKSPACE_REGISTRY_ADDRESS[chain],
			WorkspaceRegistryAbi,
			jsonRpcProviders[chain]
		)

		const workspaces = await workspaceContract.workspaceCount()

		console.log(chain, workspaces.toBigInt())
		for(let i = 0;i < workspaces.toBigInt();i++) {
			const workspace = await workspaceContract.workspaces(i)
			const hash = workspace.metadataHash

			if(i % 20 === 0) {
				console.log('Step', i)
			}

			try {
			    await pool.query('INSERT INTO hashes (hash, is_uploaded) VALUES ($1, $2) ON CONFLICT (hash) DO NOTHING', [hash, 0])
			} catch{
				console.log(`Was not able to insert ${hash}`)
			}
		}
	}
}

export const getApplicationsHashes = async() => {
	await pool.query('CREATE TABLE IF NOT EXISTS hashes (hash VARCHAR(100) PRIMARY KEY, is_uploaded INTEGER, timestamp TIMESTAMP DEFAULT NOW())')

	for(const chain in APPLICATION_REGISTRY_ADDRESS) {
		const applicationContract = new ethers.Contract(
			APPLICATION_REGISTRY_ADDRESS[chain],
			ApplicationRegistryAbi,
			jsonRpcProviders[chain]
		)

		const applications = await applicationContract.applicationCount()

		console.log(chain, applications.toBigInt())
		for(let i = 0;i < applications.toBigInt();i++) {
			const application = await applicationContract.applications(i)
			const hash = application.metadataHash

			if(i % 20 === 0) {
				console.log('Step', i)
			}

			try {
			    await pool.query('INSERT INTO hashes (hash, is_uploaded) VALUES ($1, $2) ON CONFLICT (hash) DO NOTHING', [hash, 0])
			} catch{
				console.log(`Was not able to insert ${hash}`)
			}
		}
	}
}

