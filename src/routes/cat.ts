import catHash from '../utils/cat'
import { Handler } from '../utils/make-api'

const cat: Handler<'cat'> = async(
	{
		arg: ipfsHash
	},
	{ },
	logger
) => {

	const response = await catHash(ipfsHash)

	return response
}

export default cat