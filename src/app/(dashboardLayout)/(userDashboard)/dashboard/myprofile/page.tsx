"use client";
import React from "react";
import Link from "next/link";
import { useUser } from "@/services";
import { useGetSingleUserQuery } from "@/GlobalRedux/api/api";
import Image from 'next/image';
export default function RentCar() {



  const { userId } = useUser();
  console.log("useremail", userId);

  // Fetch user data using the query
  const { data, isLoading, error } = useGetSingleUserQuery(userId);
  console.log(data?.data);
  const userData = data?.data;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user data</div>;
 
  return (
    <div className="p-4 rounded-lg">
      <div className="text-center">
        <h1 className="text-3xl m-5">Personal Info</h1>
        <p>Info about you and your preferences across Google services</p>
        <b>Follower : {userData?.followers.length}</b>
        <b className="ms-5">Following : {userData?.following.length}</b>
      </div>
      <div className="flex p-16">
        <div className="w-2/4">
          <h1 className="text-3xl">Your profile info in Google services</h1>
          <p>
            Personal info and options to manage it. You can make some of this
            info, like your contact details, visible to others so they can reach
            you easily. You can also see a summary of your profiles.
          </p>
        </div>
        <div>
          <Image
            src="https://www.gstatic.com/identity/boq/accountsettingsmobile/profile_scene_visible_360x128_18500c161aac04e9279fbb234b7de818.png"
            alt=""
          />
        </div>
      </div>

      <div className="border w-3/4">
        <h1 className="text-2xl m-5">Basic Info</h1>

        <div className="flex w-2/4 m-5 justify-between">
          <p>Profile Picture</p>
          <p>A picture helps personalize your account</p>
        </div>
        <hr />
        <div className="flex w-2/4 m-5 justify-between">
          <p>Name</p>
          <p>{userData.name}</p> {/* Dynamic name */}
        </div>
        <hr />
        <div className="flex w-2/4 m-5 justify-between">
          <p>Birthday</p>
          <p>{userData.birthday || "Not provided"}</p>{" "}
          {/* Adjust if you have birthday data */}
        </div>
        <hr />
        <div className="flex w-2/4 m-5 justify-between">
          <p>Gender</p>
          <p>{userData.gender || "Not specified"}</p>{" "}
          {/* Adjust if you have gender data */}
        </div>
        <hr />
      </div>
      <div className="border w-3/4 mt-5">
        <h1 className="text-2xl m-5">Contact Info</h1>

        <div className="flex w-2/4 m-5 justify-between">
          <p>Email</p>
          <p>{userData.email}</p> {/* Dynamic email */}
        </div>
        <hr />
        <div className="flex w-2/4 m-5 justify-between">
          <p>Phone Number</p>
          <p>{userData.phone}</p> {/* Dynamic phone number */}
        </div>
        <hr />
        <div className="flex w-2/4 m-5 justify-between">
          <p>Address</p>
          <p>{userData.address}</p> {/* Dynamic address */}
        </div>
        <hr />
      </div>

      <div className="flex p-16">
        <div className="w-2/4">
          <h1 className="text-3xl">
            Other info and preferences for Google services
          </h1>
          <p>Ways to verify it’s you and settings for the web</p>
        </div>
        <div>
          <Image
            src="https://www.gstatic.com/identity/boq/accountsettingsmobile/profile_scene_preferences_360x128_f561f5c6f5a938cfe2ab609745eb4867.png"
            alt=""
          />
        </div>
      </div>

      <div>
        <div className="w-1/2 h-[300px] p-5 border">
          <h1 className="text-2xl">Password</h1>
          <p>
            A secure password helps protect your Account. <br />
            You can change your password.
          </p>

          <div className="flex justify-between items-center">
            <p className="text-2xl">........</p>
            <Link href="/dashboard/update-pass">
              <svg
                className="w-5 size-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
           
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
