import User from "./user.model";
import encryption from "../../util/encryption";

class UserServices {
    constructor() {
    }

    public async addUser(email: string, password: string, name: string) {

        const hashedPassword : string = await encryption.encryptPassword(password)

        return await User.create({
            email: email, password: hashedPassword, name: name
        } as any)
            .then((user : any) => {
                return user
            })
            .catch(error => {
                throw error
        })
    }

    public async findUser(email: string) {
        return User.findOne({where : {
            email : email
            }})
            .then((user) => {
                return user
            }).catch(error => {
                throw error
            })
    }

    public static async findUserById(id: number) : Promise<User> {
        return User.findOne({where : {
                id : id
            }})
            .then((user) => {
                return user as User
            }).catch(error => {
                throw error
            })
    }

    public async checkPassword(password : string, hash : string) {
        return await encryption.decryptPassword(password, hash)
    }

}

export default UserServices