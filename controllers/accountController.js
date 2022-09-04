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
            error ? next(new JoiError("FindAccountError", error.message, 50, 500)) : account ? bcrypt.compare(req.body.accountPlainPassword, account.accountHashedPassword, (error, result) => {
                error ? next(new JoiError("PassCompareError", "some thing happening with your pass", 50,500)) : result ? jwt.sign({userId: account._id}, process.env.HASHED, {expiresIn: '8h'}, (error, token) => {
                    error ? next(new JoiError("TokenAssignError", "some thing happening in assigning token", 50,500)) : token ? res.status(200).header('auth-token',token).json(new Serializer('token', {
                        attributes:['auth-token']
                    }).serialize({'auth-token': token})) : next(token)
                }) :next(new JoiError("LoginError", "your phoneNumber or password isn't correct", 41, 401))
            }) : next(new JoiError("LoginError", "شما هنوز ثبت نام نکرده اید! لطفا ابتدا ثبت نام کرده و سپس دوباره امتحان کنید.", 41, 401))
            // }) : next(new JoiError("LoginError", "you are not registered yet! please first signup and then try again", 41, 401))
        }))
    } catch (e) {
        next(e);
    }
}
export const signupAccount = async (req, res, next) => {
    try {
        console.log("-------signupAccount-------");
        const {accountPhoneNumber, accountEmail, accountPlainPassword} = req.body;
        const accountHashedPassword = await bcrypt.hash(accountPlainPassword, await bcrypt.genSalt(10));
        Account.create({
            accountPhoneNumber,
            accountEmail,
            accountPlainPassword,
            accountHashedPassword,
        }, (error) => {
            error ? next(new JoiError("CreateAccountError", error.message, 50, 500)) : res.status(200).send()
        });
    } catch (e) {
        next(e);
    }
}
export const readAccount = (req, res, next) => {
    try {
        console.log("-------readAccount-------");
        const {userId} = req.user;
        console.log(userId)
        Account.findOne({_id: userId}, (error, account) => {
            error ? next(new JoiError("ReadAccountError", error.message, 50, 500)) : account ? res.json(new Serializer('account', {
                attributes: [
                    'accountPhoneNumber',
                    'accountEmail',
                    'accountPlainPassword'
                ]
            }).serialize(account)) : next(new JoiError("NoAccountError", "We don't have this account.", 44, 404))
        });
    } catch (e) {
        next(e);
    }
}
export const updateAccount = (req, res, next) => {
    try {
        console.log("-------updateAccount-------");
        const {userId} = req.user;
        const {accountPhoneNumber, accountEmail, accountPlainPassword} = req.body;
        Account.findOneAndUpdate({_id: userId}, {
            accountPhoneNumber,
            accountEmail,
            accountPlainPassword
        }, {
            new: true
        },(error, account) => {
            error ? next(new JoiError("UpdateAccountError", error.message, 50, 500)) : account ? res.json(new Serializer('account', {
                attributes: [
                    'accountPhoneNumber',
                    'accountEmail',
                    'accountPlainPassword'
                ]
            }).serialize(account)) : next(new JoiError("NoAccountError", "We don't have this account.", 44, 404))
        });
    } catch (e) {
        next(e);
    }
}