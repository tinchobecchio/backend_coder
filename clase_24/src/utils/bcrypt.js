import bcrypt from 'bcrypt';

// Hashea la contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))

// Verifica la contraseña
export const validatePassword = (passwordSend, passwordDB) => bcrypt.compareSync(passwordSend,passwordDB)