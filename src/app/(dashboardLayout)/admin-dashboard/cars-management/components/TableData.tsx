// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableColumn,
//   TableRow,
//   TableCell,
// } from "@nextui-org/table";
// import nexiosInstance from "@/config/nexios.config";
// import { Modal, Input, Button } from "@nextui-org/react";

// const TableData = ({ data }: { data: any[] }) => {
//   const [carData, setCarData] = useState(data);
//   const [editingCar, setEditingCar] = useState<any>(null);
//   const [formValues, setFormValues] = useState<any>({});
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Delete function to handle car deletion
//   const handleDelete = async (id: string) => {
//     try {
//       const response = await nexiosInstance.delete(`/cars/${id}`, {
//         cache: "no-store",
//       });

//       alert("Car deleted successfully");
//     } catch (error) {
//       console.error("Error deleting car:", error);
//       alert("Failed to delete the car");
//     }
//   };

//   // Start editing a car, open modal
//   const handleEdit = (car: any) => {
//     setEditingCar(car);
//     setFormValues(car); // Set initial form values
//     setIsModalOpen(true); // Open modal
//     console.log("Modal should be open:", isModalOpen);
//   };

//   // Handle form changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormValues({ ...formValues, [e.target.name]: e.target.value });
//   };

//   // Submit updated car data
//   const handleUpdate = async () => {
//     try {
//       const response = await nexiosInstance.put(
//         `/cars/${editingCar._id}`,
//         formValues
//       );
//       setCarData((prevData) =>
//         prevData.map((car) => (car._id === editingCar._id ? formValues : car))
//       );
//       setIsModalOpen(false); // Close modal
//       alert("Car updated successfully");
//     } catch (error) {
//       console.error("Error updating car:", error);
//       alert("Failed to update the car");
//     }
//   };

//   return (
//     <>
     
//     </>
//   );
// };

// export default TableData;
// // Car Data Table
// // <Table aria-label="Car management table" bordered>
// //   <TableHeader>
// //     <TableColumn>NAME</TableColumn>
// //     <TableColumn>BRAND</TableColumn>
// //     <TableColumn>MODEL</TableColumn>
// //     <TableColumn>FUEL TYPE</TableColumn>
// //     <TableColumn>PASSENGER CAPACITY</TableColumn>
// //     <TableColumn>COLOR</TableColumn>
// //     <TableColumn>CONDITION</TableColumn>
// //     <TableColumn>ACTIONS</TableColumn>
// //   </TableHeader>
// //   <TableBody>
// //     {carData.map((car: any) => (
// //       <TableRow key={car._id}>
// //         <TableCell>{car.name}</TableCell>
// //         <TableCell>{car.brand}</TableCell>
// //         <TableCell>{car.model}</TableCell>
// //         <TableCell>{car.fuelType}</TableCell>
// //         <TableCell>{car.passengerCapacity}</TableCell>
// //         <TableCell>{car.color}</TableCell>
// //         <TableCell>{car.condition}</TableCell>
// //         <TableCell>
// //           {/* Edit Button */}
// //           <button
// //             onClick={() => handleEdit(car)}
// //             style={{
// //               color: "white",
// //               backgroundColor: "blue",
// //               border: "none",
// //               padding: "5px 10px",
// //               cursor: "pointer",
// //               marginRight: "10px",
// //             }}
// //           >
// //             Edit
// //           </button>

// //           {/* Delete Button */}
// //           <button
// //             onClick={() => handleDelete(car._id)}
// //             style={{
// //               color: "white",
// //               backgroundColor: "red",
// //               border: "none",
// //               padding: "5px 10px",
// //               cursor: "pointer",
// //             }}
// //           >
// //             Delete
// //           </button>
// //         </TableCell>
// //       </TableRow>
// //     ))}
// //   </TableBody>
// // </Table>

// // {/* Edit Modal */}
// // <Modal
// //   closeButton
// //   aria-labelledby="modal-title"
// //   open={isModalOpen} // Modal is shown when this is true
// //   onClose={() => setIsModalOpen(false)}
// // >
// //   <Modal.Header>
// //     <h3>Edit Car: {editingCar?.name}</h3>
// //   </Modal.Header>
// //   <Modal.Body>
// //     {/* Edit Form */}
// //     <Input
// //       clearable
// //       fullWidth
// //       name="name"
// //       label="Car Name"
// //       value={formValues.name || ""}
// //       onChange={handleInputChange}
// //     />
// //     <Input
// //       clearable
// //       fullWidth
// //       name="brand"
// //       label="Brand"
// //       value={formValues.brand || ""}
// //       onChange={handleInputChange}
// //     />
// //     <Input
// //       clearable
// //       fullWidth
// //       name="model"
// //       label="Model"
// //       value={formValues.model || ""}
// //       onChange={handleInputChange}
// //     />
// //     <Input
// //       clearable
// //       fullWidth
// //       name="fuelType"
// //       label="Fuel Type"
// //       value={formValues.fuelType || ""}
// //       onChange={handleInputChange}
// //     />
// //     <Input
// //       clearable
// //       fullWidth
// //       name="passengerCapacity"
// //       label="Passenger Capacity"
// //       value={formValues.passengerCapacity || ""}
// //       onChange={handleInputChange}
// //     />
// //     <Input
// //       clearable
// //       fullWidth
// //       name="color"
// //       label="Color"
// //       value={formValues.color || ""}
// //       onChange={handleInputChange}
// //     />
// //     <Input
// //       clearable
// //       fullWidth
// //       name="condition"
// //       label="Condition"
// //       value={formValues.condition || ""}
// //       onChange={handleInputChange}
// //     />
// //   </Modal.Body>
// //   <Modal.Footer>
// //     <Button auto flat color="error" onClick={() => setIsModalOpen(false)}>
// //       Cancel
// //     </Button>
// //     <Button auto onClick={handleUpdate}>
// //       Save Changes
// //     </Button>
// //   </Modal.Footer>
// // </Modal>