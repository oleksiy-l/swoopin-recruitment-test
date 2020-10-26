import Logger from '@harmonyjs/logger'

function AuthenticationService() {
    const instance = ({

        logger: Logger({ name: 'Authentication', configuration: { console: true } }),

        account: null as any,

        configure(account: any) {
            this.account = account
        },

        async verify(res: any, token: string): Promise<any> {
            // res.verify
        },

        async authenticateAccount(req: any, res: any) {
            try {
                // Decode JSON
                const decoded = await req.jwtVerify()
                console.dir({decoded})

                if (decoded?.payload?.userId) {

                    // Verify account is present
                    if ((!this.account) || (decoded.payload.userId === this.account!.id)) {
                        const user = this.account
                        return Object.assign(req, { user })
                    }
                }

                // Error
                return res.code(500).send({
                    statusCode: 500,
                    error: 'Internal Server Error',
                })
            } catch (e) {                
                console.log(e)
                return res.code(401).send({
                    statusCode: 401,
                    error: 'Credentials invalid',
                    message: e.message,
                })
            }
        },
    })

    return instance
}

export default AuthenticationService()
