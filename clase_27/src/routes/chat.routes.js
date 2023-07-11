import { Router } from "express";

const chatRouter = Router()

chatRouter.get('/', (req, res, next) => {

    res.render('chat', {
        title: 'Chat comunitario'
    })
})

export default chatRouter