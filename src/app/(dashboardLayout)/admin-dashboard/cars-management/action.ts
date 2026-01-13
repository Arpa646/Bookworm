/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import nexiosInstance from "@/config/nexios.config";
import { revalidateTag } from "next/cache";

export const createCar = async (_pre: any, formData: any): Promise<any> => {
  try {
    console.log(formData, "formData");

    const newFormData = {
      ...Object.fromEntries(formData),
      rating: Number(Object.fromEntries(formData).rating),
      passengerCapacity: Number(Object.fromEntries(formData).passengerCapacity),
    };

    const res = await nexiosInstance.post("/cars", newFormData);

    revalidateTag("carsTable");

    console.log(res.data, "res.data");

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function to update an existing car
export const updateCar = async (carId: string, formData: any): Promise<any> => {
  try {
    console.log(formData, "formData");

    const updatedFormData = {
      ...Object.fromEntries(formData),
      rating: Number(Object.fromEntries(formData).rating),
      passengerCapacity: Number(Object.fromEntries(formData).passengerCapacity),
    };

    const res = await nexiosInstance.put(`/cars/${carId}`, updatedFormData);

    // Revalidate the cars table after updating
    revalidateTag("carsTable");

    console.log(res.data, "updated car data");

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
