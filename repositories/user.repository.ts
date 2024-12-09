import type { Insertable, Updateable } from 'kysely';
import { db } from "./../db/db.ts";
import type { AuthUser } from "../types.ts";
import { httpErrors } from "@oak/mod.ts";
import type { Users } from "../db/db.d.ts";

/**
 * Get all users list
 */
const getUsers =  async() => {
    const query = db.selectFrom('users')
 
    return await query.selectAll().execute()
  }

/**
 * get user by user id , email, firstname , lastname
 */
const getUser = async(criteria: Partial<AuthUser>) => {
  let query = db.selectFrom('users')

  if (criteria.id) {
    query = query.where('id', '=', criteria.id) // Kysely is immutable, you must re-assign!
  }

  if (criteria.email) {
    query = query.where('email', '=', criteria.email)
  }

  if (criteria.last_name !== undefined) {
    query = query.where(
      'first_name', criteria.last_name === null ? 'is' : '=', criteria.last_name
    )
  }
return await query.selectAll().execute()
}

/**
 * Create user
 */
const createUser = async function insertUser(user: Insertable<Users>) {
  const check = await db.selectFrom('users').where('email','=', user.email! ).selectAll().execute()
  if (check.length == 0 ){
  user.is_active =1
  return await db
    .insertInto('users')
    .values(user)
    .executeTakeFirstOrThrow();
  // ^ Selectable<User>
  } else {
    // Error such email exists
     throw new httpErrors.Unauthorized("email_unique")
  }
}
// const createUser = async(user: NewPerson) => {
//   const { insertId } = await db.insertInto('users')
//     .values(user)
//     .executeTakeFirstOrThrow()

//   return await getUser(Number(insertId!))
// }

/**
 * Update user
 */
const updateUser = async function updateUser(user: Updateable<Users>) {
  if(user.id != null && user.id != undefined) {
  return await db
    .updateTable('users')
    .set(user)
    .where( 'id', "=", user.id )
    // .returning(['email', 'id'])
    .executeTakeFirstOrThrow();
  // ^ { email: string; id: number; }
  } else{
    throw new Error('user id not defined on update')
  }
}

/**
 * Delete user
 */
const  deleteUser = async( id : number) => {
  const user = db.selectFrom('users').where('id','=', id ).selectAll().execute()

  // const user = await getUser( id )
  if (user != null) {
    await db.deleteFrom('users').where('id', '=', id ).execute()
  }
  return user
}


export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
