import { Response, Request } from "express"

export function sendLogs(req: Request, res: Response){
    console.log(req.body)
    res.json({message: 'success'})
}