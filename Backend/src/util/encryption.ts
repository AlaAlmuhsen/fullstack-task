import bcrypt from 'bcrypt'

const encryptPassword = async (password : string) : Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword : string = await bcrypt.hash(password, salt);

    return hashedPassword as string;
};

const decryptPassword = async (password : string, hashedPassword : string) => {
    return await bcrypt.compare(password, hashedPassword);
};

export default {
    encryptPassword, decryptPassword
}