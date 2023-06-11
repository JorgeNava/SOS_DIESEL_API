const MODULE_ID = 'airtable-client-provider-controllers-users';

const bcrypt = require('bcryptjs');

const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const airtableClient = require('../airtableInstance');
const { USERS_TABLE_NAME } = require('../utils/constants');
const UsersTable = airtableClient.getBase()(USERS_TABLE_NAME);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword;
}

function base64ToFile(base64String, fileName) {
  const fileData = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(fileData, 'base64');
  fs.writeFileSync(fileName, buffer, 'base64');
}

async function createUser(email, username, password, notes, role, rawProfileImage) {
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

    const hashedPassword = await hashPassword(password);

    const FILENAME = `user_${username}_image`;
    const filePath = `server/temp/${FILENAME}.jpg`;
    base64ToFile(rawProfileImage, filePath);
    const res = await cloudinary.uploader.upload(filePath, { public_id: FILENAME });
    const ASSET_URL = res.secure_url;

    const newUser = await UsersTable.create({
      Email: email,
      Username: username,
      Password: hashedPassword,
      Notes: notes,
      Status: 'Active',
      Role: role,
      ProfileImage: [{ url: ASSET_URL }]
    })

    fs.unlink(filePath, (err) => {
      if (err) {
        return;
      }
    });

    return newUser
  } catch (error) {
    console.error(error)
    return error
  }
}


async function updateUser(email, username, password, notes, status, rawProfileImage) {
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
    if (rawProfileImage) {
      const FILENAME = `user_${username}_image`;
      const filePath = `server/temp/${FILENAME}.jpg`;
      base64ToFile(rawProfileImage, filePath);
      const res = await cloudinary.uploader.upload(filePath, { public_id: FILENAME });
      const ASSET_URL = res.secure_url;
  
      fs.unlink(filePath, (err) => {
        if (err) {
          return;
        }
      });

      fieldsToUpdate.ProfileImage = [{ url: ASSET_URL }];
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
    const filterByFormula = `{Email} = "${email}"`
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

async function deleteManyUsersByEmail(emails) {
  try {
    const filterByFormula = `OR(${emails.map(email => `SEARCH("${email}", {Email}) > 0`).join(',')})`
    const users = await UsersTable.select({ filterByFormula }).all()
    if (users.length === 0) {
      throw new Error(`No users found with emails: ${emails.join(', ')}`)
    } else {
      const deletedUsers = []
      for (const user of users) {
        const deletedUser = await UsersTable.destroy(user.id)
        deletedUsers.push(deletedUser)
      }
      return deletedUsers
    }
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
  const filterByFormula = `SEARCH("${email}", {Email}) > 0`
  const users = await UsersTable.select({ filterByFormula }).all()
  if (users.length === 0) {
    throw new Error(`User with email ${email} not found`)
  } else if (users.length > 1) {
    throw new Error(`Found multiple users with email ${email}`)
  }
  const user = users[0]
  return user
}


module.exports = {
  createUser,
  updateUser,
  deleteUserByEmail,
  deleteManyUsersByEmail,
  getUserByEmail,
  getAllUsers
}
