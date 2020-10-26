import Logger from '@harmonyjs/logger'
import EncryptionService from 'core/services/encryption'

const logger = Logger({
    name: 'AccountLogin',
    configuration: {
        console: true,
    },
})

const LoginRoute = async (server : any, opts : any, next: () => void) => {
    server.route({
        method: 'POST',
        url: '/login',
        async handler(req: any, res: any) {
            try {
            const { id: salt, password, ...accountData } = req.conf.account               
            const body: any = req.body
            // TODO put into AuthenticationServcie
            if (body.login !== accountData.email) {
                return res.code(401).send({
                    statusCode: 401,
                    message: 'user_not_found',
                    error: 'Bad request',
                })
            }
            // TODO put into AuthenticationServcie
            const encrypted = EncryptionService.encryptPassword({password: body.password, salt})
            const compareResult = EncryptionService.comparePassword({password, salt, encrypted} )
            if (!compareResult) {
                return res.code(401).send({
                    statusCode: 401,
                    message: 'wrong_credentials',
                    error: 'Bad request',
                })
            }
            const token = await res.jwtSign({id: salt, ...accountData, isAdmin: false})
            
            return res.code(200).send({token})
            } catch(err) {
            console.log(err)
        }
        },
    })
    next()
}

export default LoginRoute
