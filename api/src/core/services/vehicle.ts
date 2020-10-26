import polyline from '@mapbox/polyline'
import turf from '@turf/turf'
import moment from 'moment'
import Logger from "@harmonyjs/logger";

const UPDATE_INTERVAL = 1000
const SPEED_VARIATION = 2
const TEMPERATURE_VARIATION = 1

function VehicleService() {
    const instance = ({

        logger: Logger({ name: 'Vehicle', configuration: { console: true } }),

        vehicles: [] as any[],

        configure(vehicles: any) {
            // Initialize vehicles
            this.initializeVehicles(vehicles)

            // Update vehicles
            setInterval( () => this.updateVehicles(), UPDATE_INTERVAL );
        },

        initializeVehicles(vehicles: any[]) {
            this.vehicles = vehicles.map((vehicle: any) => {
                const coordinates = polyline.decode(vehicle.polyline)
                const line = turf.lineString(coordinates)
                const options: any = { units: 'meters' }
                const location: any = turf.along(line, 0, options)

                return {
                    ...vehicle,
                    defaultSpeed: vehicle.speed,
                    defaultTemperature: vehicle.temperature,
                    location: location.geometry.coordinates,
                    line,
                    distance: 0,
                }
            })
        },

        updateVehicles() {
            this.vehicles.forEach((vehicle: any) => {
                // Update only if vehicle is active
                if (vehicle.online) {
                    // Update vehicle position
                    const options: any = { units: 'meters' }
                    const location: any = turf.along(vehicle.line, vehicle.distance, options)
                    vehicle.location = location.geometry.coordinates

                    // Increment traveled distance
                    const metersTraveled = vehicle.defaultSpeed / 3.6
                    vehicle.distance += metersTraveled

                    // Reinitialize position at end of route
                    const routeLength = turf.length(vehicle.line, {units: 'meters'});

                    if (vehicle.distance >= routeLength) {
                        vehicle.distance = 0;
                    }

                    // Random speed
                    const minSpeed = vehicle.defaultSpeed - SPEED_VARIATION
                    const maxSpeed = vehicle.defaultSpeed + SPEED_VARIATION
                    vehicle.speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed)

                    // Random temperature
                    const minTemp = vehicle.defaultTemperature - TEMPERATURE_VARIATION
                    const maxTemp = vehicle.defaultTemperature + TEMPERATURE_VARIATION
                    vehicle.temperature = Math.floor(Math.random() * (maxTemp - minTemp + 1) + minTemp)
                } else {
                    vehicle.speed = 0
                }
            })
        },

        getCensoredVehicles() {
            const vehiclesData = this.vehicles
            console.dir({vehiclesData})
            const censoredVehicleData: any = []
            this.vehicles.forEach(vehicle => {
                const {
                    polyline,
                    defaultSpeed,
                    defaultTemperature,
                    line,
                    distance,
                    ...vehicleData
                } = vehicle
                censoredVehicleData.push({...vehicleData})
            })
            
            return censoredVehicleData
        },

        modifyVehicleParam(id: string, parameter: string, value: string | number) {
            switch (parameter) {
                case 'status':
                    this.changeVehicleStatus(id, parameter) 
                    break;
                case 'plate':
                    this.setVehicleParam(id, parameter, value) 
                    break;
                case 'temperature':
                    this.setVehicleParam(id, parameter, value) 
                    break;
                case 'speed':
                    this.setVehicleParam(id, parameter, value) 
                    break;
            
                default:
                    return true
                    break;
            }
        },

        setVehicleParam(id: string, param: string, value: string | number) {
            let paramModifiyingStatus = false
            this.vehicles.map(( v, i ) => {
                if ( v.id === id ) {
                    this.vehicles[i][param] = value
                    paramModifiyingStatus = true
                    return
            }
            return paramModifiyingStatus
        })
        },

        changeVehicleStatus(id: string, status: string) {
            let statusChanged, vehicleStatus = false
            switch (status) {
                case 'offline':
                    vehicleStatus = false
                    break;
                case 'online':
                    vehicleStatus = true
                    break;
                default:
                    vehicleStatus = false
                    break;
            }
            this.vehicles.map(( v, i ) => {
                if ( v.id === id ) {
                    this.vehicles[i].online = vehicleStatus
                    statusChanged = true
                    return
            }
        })

            return statusChanged ? true : false
        },

        getDrivers() : any[] {
            return this.vehicles
        },
    })

    return instance
}

export default VehicleService()
