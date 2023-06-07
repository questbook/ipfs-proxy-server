import dotenv from 'dotenv'

export default () => {
	const env = 'development' //process.env.NODE_ENV || 'development'
	dotenv.config({ path: `.env.${env}` })
}
