"use client";

import React from "react";
import { useGetUserQuery, useUpdateUserStatusMutation, useDeleteUserMutation } from "@/GlobalRedux/api/api"; // Adjust this import

const AllUser: React.FC = () => {
  const { data, error, isLoading } = useGetUserQuery(undefined);
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation(); // Import delete mutation

  const users = (data )?.data;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching users</p>;

  // Function to handle block/unblock
  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    try {
      await updateUserStatus(id);
      console.log(`User with id ${id} has been ${isBlocked ? "unblocked" : "blocked"}.`);
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      console.log(`User with id ${id} has been deleted.`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  interface User {
    _id: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    name: string;
    password: string;
    phone: string;
    role: string;
    isBlock: boolean; // Added isBlock field
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>

      {/* Table for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-center p-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-center p-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-center p-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="text-center p-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="text-center p-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="text-center p-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-center p-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users &&
              users.map((user: User) => (
                <tr key={user._id}>
                  <td className="text-gray-500 shadow-sm p-2">{user.name}</td>
                  <td className="text-gray-500 shadow-sm p-2 whitespace-nowrap">{user.email}</td>
                  <td className="text-gray-500 shadow-sm p-2 whitespace-nowrap">{user.phone}</td>
                  <td className="text-gray-500 shadow-sm p-2 whitespace-nowrap">{user.role}</td>
                  <td className="text-gray-500 shadow-sm p-2 whitespace-nowrap">{user.address}</td>
                  <td className="text-gray-500 shadow-sm p-2 whitespace-nowrap">
                    {user.isBlock ? "Blocked" : "Active"}
                  </td>
                  <td className="text-center p-2">
                    {/* Block/Unblock Button */}
                    <button
                      className={`px-2 py-1 rounded ${user.isBlock ? "bg-green-500" : "bg-red-500"} text-white`}
                      onClick={() => handleToggleBlock(user._id, user.isBlock)}
                    >
                      {user.isBlock ? "Unblock" : "Block"}
                    </button>
                    {/* Delete Button */}
                    <button
                      className="ml-2 px-2 py-1 rounded bg-red-600 text-white"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="block sm:hidden">
        {users &&
          users.map((user: User) => (
            <div key={user._id} className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
              <div className="mb-2">
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Phone: {user.phone}</p>
                <p className="text-gray-600">Role: {user.role}</p>
                <p className="text-gray-600">Address: {user.address}</p>
                <p className="text-gray-600">{user.isBlock ? "Blocked" : "Active"}</p>
              </div>
              <div className="text-right">
                {/* Block/Unblock Button */}
                <button
                  className={`px-2 py-1 rounded ${user.isBlock ? "bg-green-500" : "bg-red-500"} text-white`}
                  onClick={() => handleToggleBlock(user._id, user.isBlock)}
                >
                  {user.isBlock ? "Unblock" : "Block"}
                </button>
                {/* Delete Button */}
                <button
                  className="ml-2 px-2 py-1 rounded bg-red-600 text-white"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllUser;
