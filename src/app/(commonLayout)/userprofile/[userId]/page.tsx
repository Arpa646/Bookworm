"use client";
import React, { useState } from "react";
import {
  useGetSingleUserQuery,
  useGetAllUserQuery,
  useFollowRequestMutation,
  useUnfollowRequestMutation,
} from "@/GlobalRedux/api/api";
import { useUser } from "@/services";

const UserProfilePage = ({ params }) => {
  const userId = params.userId;
  const { userId: currentUserId } = useUser();
  const { data: userData, isLoading: userLoading } = useGetSingleUserQuery(userId);
  const { data: allUsersData } = useGetAllUserQuery();

  const profileUser = userData?.data; // User profile data
  const allUsers = allUsersData?.data; // All users in the database
  const [followRequest] = useFollowRequestMutation();
  const [unFollowRequest] = useUnfollowRequestMutation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (userLoading) return <p>Loading...</p>;

  const handleFollow = async () => {
    try {
      await followRequest({
        currentUserId: currentUserId,
        targetUserId: profileUser?._id,
      });
      console.log("Follow request successful");
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  // Check if the current user is already following the profile user
  const isFollowing = profileUser?.followers?.includes(currentUserId);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleUnfollow = async () => {
    try {
      await unFollowRequest({
        currentUserId: currentUserId,
        targetUserId: profileUser?._id,
      });
      console.log("Unfollow request successful");
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-8">
      {/* Left section: User Info */}
      <div className="col-span-1 md:col-span-3">
        {/* User Info */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            <div className="mb-4">
              <img
                className="rounded-full w-32 h-32 md:w-44 md:h-44"
                src={profileUser?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"}
                alt="Profile Picture"
              />
            </div>
            <div className="text-center font-bold space-y-3">
              <h2 className="text-lg font-semibold">
                {profileUser?.name || "Unknown User"}
              </h2>
              <div className="flex gap-3 md:gap-5">
                <div>
                  <p>{profileUser?.followers?.length || 0}</p>
                  <p>Followers</p>
                </div>
                <div>
                  <p>{profileUser?.following?.length || 0}</p>
                  <p>Following</p>
                </div>
              </div>
              {isFollowing ? (
                <div className="relative inline-block">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Following
                    <svg
                      className={`ml-2 w-4 h-4 transform transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                      <button
                        onClick={handleUnfollow}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Unfollow
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleFollow}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right section: All Users */}
      <div className="col-span-1 bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">All Users</h3>
        <div className="grid grid-cols-1 gap-2 mt-4">
          {allUsers?.map((user) => (
            <div
              key={user._id}
              className="bg-gray-200 p-2 flex items-center justify-between rounded-lg shadow-md"
            >
              <div className="flex items-center">
                <img
                  src={user?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <p>{user.name}</p>
              </div>
              <button className="bg-blue-500 text-white px-2 py-1 rounded">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
