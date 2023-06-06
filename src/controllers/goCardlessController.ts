const express = require('express')
import { Request, Response, NextFunction } from "express";
const Member = require('../models/member')


// 
exports.goCardlessWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {


res.status(200).json("Hello from GoCardless");

}


