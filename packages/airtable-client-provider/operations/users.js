const MODULE_ID = 'airtable-client-provider-controllers-users';

const bcrypt = require('bcryptjs');

const airtableClient = require('../airtableInstance');
const { USERS_TABLE_NAME } = require('../utils/constants');
const UsersTable = airtableClient.getBase()(USERS_TABLE_NAME);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

async function createUser(email, username, password, notes) {
  try {
    if (!EMAIL_REGEX.test(email)) {
      throw new Error('Invalid email format')
    }

    const existingUser = await UsersTable.select({
      filterByFormula: `{Email} = "${email}"`
    }).firstPage()

    if (existingUser && existingUser.length > 0) {
      throw new Error('User with email already exists')
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await UsersTable.create({
      Email: email,
      Username: username,
      Password: hashedPassword,
      Notes: notes,
      Status: 'Active'
    })
    return newUser
  } catch (error) {
    console.error(error)
    return error
  }
}


async function updateUser(email, username, password, notes, status) {
  try {
    const fieldsToUpdate = {}
    if (email) {
      if (!EMAIL_REGEX.test(email)) {
        throw new Error('Invalid email format')
      }
      fieldsToUpdate.Email = email
    }
    if (username) fieldsToUpdate.Username = username
    if (password) {
      const hashedPassword = await hashPassword(password)
      fieldsToUpdate.Password = hashedPassword
    }
    if (notes) fieldsToUpdate.Notes = notes
    if (status) {
      if (status !== 'Active' && status !== 'Unactive' && status !== 'Blocked') {
        throw new Error('Invalid status value')
      }
      fieldsToUpdate.Status = status
    }

    const filterByFormula = `SEARCH("${email}", {Email}) > 0`
    const users = await UsersTable.select({ filterByFormula }).all()
    if (users.length === 0) {
      throw new Error(`User with email ${email} not found`)
    } else if (users.length > 1) {
      throw new Error(`Found multiple users with email ${email}`)
    }
    const user = users[0]

    const updatedUser = await UsersTable.update(user.id, fieldsToUpdate)
    return updatedUser
  } catch (error) {
    console.error(error)
  }
}

async function deleteUserByEmail(email) {
  try {
    const filterByFormula = `SEARCH("${email}", {Email}) > 0`
    const users = await UsersTable.select({ filterByFormula }).all()
    if (users.length === 0) {
      throw new Error(`User with email ${email} not found`)
    } else if (users.length > 1) {
      throw new Error(`Found multiple users with email ${email}`)
    }
    const user = users[0]
    return await UsersTable.destroy(user.id)
  } catch (error) {
    console.error(error)
    return error
  }
}


async function getAllUsers() {
  const allUsers = await UsersTable.select().all();
  return allUsers;
}

async function getUserByEmail(email) {
  try {
    const filterByFormula = `SEARCH("${email}", {Email}) > 0`
    const users = await UsersTable.select({ filterByFormula }).all()
    if (users.length === 0) {
      throw new Error(`User with email ${email} not found`)
    } else if (users.length > 1) {
      throw new Error(`Found multiple users with email ${email}`)
    }
    const user = users[0]
    return user
  } catch (error) {
    console.error(error)
    return error
  }
}


module.exports = {
  createUser,
  updateUser,
  deleteUserByEmail,
  getUserByEmail,
  getAllUsers
}
