"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import axiosInstance from "../../config/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik } from "formik";
import * as Yup from "yup";
import Header from "../../../dashbord/common/Header"
import Newdeletemodel from "../../../dashbord/common/Newdeletemodel";
const page = () => {
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState(null);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update User Handler
  const handleUpdate = async (values) => {
    try {
      await axiosInstance.put(`/users/updateuser/${editData._id}`, values);
      setEditData(null);
      fetchUsers();
    } catch (error) {
      console.log("Error updating:", error);
    }
  };



  // Validation
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is Required"), 
    email: Yup.string().email().required("Email is Required"),
  });
  const [deleteId, setDeleteId] = useState(null);

  return (
    <>
      <Header title="User Management" titledesc='Manage all registered users and their roles'  linkname = ' Create new user' link = '/admin/register'   />
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => setEditData(user)}>
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(user._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={!!editData} onOpenChange={() => setEditData(null)}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>Update User Details</DialogTitle>
            </DialogHeader>

            <Formik
              initialValues={{
                name: editData?.name || "",
                email: editData?.email || "",
                role: editData?.role || "",
                password: "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleUpdate}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
              }) => (
                <div className="space-y-4">

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Name</label>
                    <Input
                      placeholder="Enter Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      placeholder="Enter Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Role</label>
                    <Select
                      onValueChange={(value) =>
                        handleChange({ target: { name: "role", value } })
                      }
                      value={values.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">
                      Password (optional)
                    </label>
                    <Input
                      placeholder="Enter Password"
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                    />
                  </div>

              

                  {/* Submit Button */}
                  <Button className="mt-2 w-full" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                </div>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>
      <Newdeletemodel  deleteId={deleteId} setDeleteId={setDeleteId} onSuccess={fetchUsers} endpoint="/users" />
    </>
  );
};

export default page;
