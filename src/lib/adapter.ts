// import { fetcher } from "./axios";

// export function MyAdapter() {
//   return {
//     async getUser(id) {
//       const user = await fetcher.get(`/api/users/${id}`);
//       return user.data;
//     },
//     async getUserByEmail(email) {
//       const user = await fetcher.get(`/api/users/email/${email}`);
//       return user.data;
//     },
//     async createUser({ name, email }) {
//       const newUser = await fetcher.post(`/api/users`, { name, email });
//       return newUser.data;
//     },
//     async updateUser({ id, name, email }) {
//       const updatedUser = await fetcher.put(`/api/user/${id}`, {
//         name,
//         email,
//       });
//       return updatedUser.data;
//     },

//     async createSession(session) {
//       try {
//         const sessionData = await fetcher.post(`/api/sessions`, session);
//         sessionData.data.expires = new Date(sessionData.data.expires);
//         return sessionData.data;
//       } catch (error) {
//         console.error("Error creating session:", error);
//         throw error;
//       }
//     },

//     async getSessionAndUser(sessionToken) {
//       const sessionAndUser = await fetcher.get(`/api/sessions/${sessionToken}`);
//       return sessionAndUser.data;
//     },

//     async updateSession({ sessionToken, ...session }) {
//       const updatedSession = await fetcher.put(
//         `/api/sessions/${sessionToken}`,
//         session,
//       );
//       return updatedSession.data;
//     },

//     async deleteSession(sessionToken) {
//       const deletedSession = await fetcher.delete(
//         `/api/sessions/${sessionToken}`,
//       );
//       return deletedSession.data;
//     },

//     async getUserByAccount(data) {
//       try {
//         const user = await fetcher.post(`/api/accounts/user`, data);
//         return user.data;
//       } catch (error) {
//         console.error(error);
//       }
//     },

//     async linkAccount(account) {
//       const linkedAccount = await fetcher.post(`/api/accounts/link`, account);
//       return linkedAccount.data;
//     },
//   };
// }
