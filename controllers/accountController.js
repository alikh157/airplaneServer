import Account from "../models/accounts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import JoiError from "../exceptions/validationError";
import {Serializer} from "jsonapi-serializer";

export const loginAccount = (req, res, next) => {
    try {
        console.log("-------loginAccount-------");
        const {accountPhoneNumber, accountPlainPassword} = req.body;
        Account.findOne({accountPhoneNumber: req.body.accountPhoneNumber}, ((error, account) => {
            error ? next(error) : account ? bcrypt.compare(req.body.accountPlainPassword, account.accountHashedPassword, (error, result) => {
                error ? next(error) : result ? jwt.sign({_id: account._id}, process.env.HASHED, {expiresIn: '3h'}, (error, token) => {
                    error ? next(error) : token ? res.header("auth-token", token).send(token) : next(token)
                }) : res.status(401).send("your username or password isn't correct")
            }) : res.status(401).send("you are not authorized!")
        }))
    } catch (e) {
        next(e);
    }
}
export const signupAccount = (req, res, next) => {
    try {
        console.log("-------signupAccount-------");
        const {accountPhoneNumber, accountEmail, accountPlainPassword} = req.body;
        Account.create({
            accountPhoneNumber,
            accountEmail,
            accountPlainPassword
        }, (error) => {
            error ? next(error) : res.status(200).send()
        });
    } catch (e) {
        next(e);
    }
}
export const readAccount = (req, res, next) => {
    try {
        console.log("-------readAccount-------");
        const {accountId} = req.user;
        Account.findOne({_id: accountId}, (error, account) => {
            error ? next(error) : account ? res.json(new Serializer('account', {
                attributes: [
                    'accountPhoneNumber',
                    'accountEmail',
                    'accountPlainPassword'
                ]
            })) : next(new JoiError("NoAccountError", "We don't have this account.", 44, 404))
        });
    } catch (e) {
        next(e);
    }
}
export const updateAccount = (req, res, next) => {
    try {
        console.log("-------updateAccount-------");
        const {accountId} = req.user;
        const {accountPhoneNumber, accountEmail, accountPlainPassword} = req.body;
        Account.findOneAndUpdate({_id: accountId}, {
            accountPhoneNumber,
            accountEmail,
            accountPlainPassword
        }, (error, account) => {
            error ? next(error) : account ? res.json(new Serializer('account', {
                attributes: [
                    'accountPhoneNumber',
                    'accountEmail',
                    'accountPlainPassword'
                ]
            })) : next(new JoiError("NoAccountError", "We don't have this account.", 44, 404))
        });
    } catch (e) {
        next(e);
    }
}