import { RangoDeHoraPorReserva, Reserva } from "../models/models.js";

export const postReservas = async (req, res) => {
    const { 
        id_cliente, id_restaurante, id_mesa,
        fecha, cantidad, rangos_de_hora,
    } = req.body

    const reserva = await Reserva.create({ 
        id_cliente,
        id_restaurante,
        id_mesa,
        fecha,
        cantidad,
    })

    for (const rango_hora of rangos_de_hora) {
        RangoDeHoraPorReserva.create({
            id_reserva: reserva.dataValues.id,
            hora: rango_hora
        })
    }
    
    res.json(reserva)
}

export const getReservas = async (req, res) => {
    const reservas = await Reserva.findAll()
    const rangos_de_hora = await RangoDeHoraPorReserva.findAll()

    for (const reserva of reservas) {
        const rangos_horas = rangos_de_hora.filter(rangoHora => rangoHora.id_reserva === reserva.id)
        reserva.dataValues.rangos_horas = []
        for (const index of Object.keys(rangos_horas)) {
            let hora = rangos_horas[index].hora
            reserva.dataValues.rangos_horas.push(hora)
        }
    }

    res.json(reservas)
}

export const putReservas = async (req, res) => {
    const { id } = req.params
    const { 
        id_restaurante, id_mesa, fecha,
        id_cliente, cantidad, rangos_de_hora,
    } = req.body

    const reserva = await Reserva.update(
        { 
            id_cliente,
            id_restaurante,
            id_mesa,
            fecha,
            cantidad,
        },
        { where: { id } }
    )

    await RangoDeHoraPorReserva.destroy({
        where: { id_reserva: id }
    })
        
    for (const rango_hora of rangos_de_hora) {
        RangoDeHoraPorReserva.create({
            id_reserva: id,
            hora: rango_hora
        })
    }

    res.json(reserva)
}

export const deleteReservas = async (req, res) => {
    const { id } = req.params
    
    await RangoDeHoraPorReserva.destroy({
        where: { id_reserva: id }
    })

    await Reserva.destroy(
        { where: { id } }
    )

    res.json(Reserva)
}
