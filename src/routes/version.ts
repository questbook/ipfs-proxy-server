import configEnv from '../utils/env'
import { Handler } from '../utils/make-api'

configEnv()

const version: Handler<'version'> = async(
	{},
	{},
	logger

) => {

	return 'v0'
}

export default version