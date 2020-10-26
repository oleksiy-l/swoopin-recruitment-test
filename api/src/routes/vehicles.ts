import Logger from '@harmonyjs/logger'
import VehicleService from 'core/services/vehicle'
import { checkVehicleParam, defineParam } from '../core/helpers/index'

const logger = Logger({
    name: 'AccountLogin',
    configuration: {
        console: true,
    },
})

export const ModifyVehicleParameterRoute = async (server : any, opts : any, next: () => void) => {
  server.route({
      method: 'POST',
      url: '/vehicles/:parameter/:id',
      async preHandler(req: any, res: any) {
        await req.jwtVerify()
        // server.auth([server.authenticateAccount])
      },
      async handler(req: any, res: any) {
          try {
            // TODO validate params
            const {id, parameter , value = 22 } = req.params

            const param = checkVehicleParam(parameter)
            const modifParamRes = VehicleService.modifyVehicleParam(id, parameter, value)
            if(!param || !modifParamRes) {
              return res.code(400).send({
                statusCode: 400,
                message: 'Wrong parameter passed',
                error: 'Bad request',
              })
            }
            const changingStatus = VehicleService.changeVehicleStatus(id, status)
            if (changingStatus) {
              return res.code(200).send({})
            }

            return res.code(500).send({
              statusCode: 500,
              error: 'Internal Server Error',
          })
          } catch(err) {
          console.log(err)
      }
      },
  })
  next()
}

export const ChangeVehicleStatusRoute = async (server : any, opts : any, next: () => void) => {
    server.route({
        method: 'POST',
        url: '/vehicles/:parameter/:id',
        async preHandler(req: any, res: any) {
          await req.jwtVerify()
          // server.auth([server.authenticateAccount])
        },
        async handler(req: any, res: any) {
            try {
              const availableStatuses = ['offline', 'online']
              const { id, status } = req.params
              if (!availableStatuses.find(s => s === status)) {
                return res.code(400).send({
                  statusCode: 400,
                  error: 'Bad request',
                })
              }
              const changingStatus = VehicleService.changeVehicleStatus(id, status)
              if (changingStatus) {
                return res.code(200).send({})
              }

              return res.code(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
            })
            } catch(err) {
            console.log(err)
        }
        },
    })
    next()
}

export const GetVehiclesRoute = async (server : any, opts : any, next: () => void) => {
    server.route({
        method: 'GET',
        url: '/vehicles',
        async preHandler(req: any, res: any) {
          await req.jwtVerify()
          // server.auth([server.authenticateAccount])
        },
        async handler(req: any, res: any) {
            try {
              const vehicles = VehicleService.getCensoredVehicles()

              return res.code(200).send({vehicles})
            } catch(err) {
            console.log(err)
        }
        },
    })
    next()
}
