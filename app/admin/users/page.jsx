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
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik } from "formik";
import * as Yup from "yup";
import Header from "../../../dashbord/common/Header";
import Newdeletemodel from "../../../dashbord/common/Newdeletemodel";
import { Trash2, SquarePen, MoreVertical, Eye, EyeClosed, ChevronLeft } from "lucide-react";
import { Spinner } from '@/components/ui/spinner'

const Page = () => {
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [details, setDetails] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [password, setPassword] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"
  const [loading, setLoading] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users");
      setUsers(response.data.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create User Handler
  const handleCreate = async (values, { resetForm }) => {
    try {
      setLoading(true);
      await axiosInstance.post("/users/register", values);
      resetForm();
      setCreateOpen(false);
      setPreviewData(null);
      setPassword(false);
      fetchUsers();
    } catch (error) {
      console.log("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };
    if (loading && users.length === 0) {
    return <div className='h-screen justify-center items-center flex '><Spinner /></div>
  }

  // Update User Handler
  const handleUpdate = async (values) => {
    try {
      await axiosInstance.put(`/users/updateuser/${editData._id}`, values);
      setEditData(null);
      setPreviewData(null);
      setIsEditing(false);
      setPassword(false);
      fetchUsers();
    } catch (error) {
      console.log("Error updating:", error);
    }
  };

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is Required"),
    email: Yup.string().email().required("Email is Required"),
    role: Yup.string().required("Role is Required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    address: Yup.string().optional(),
    phone: Yup.string().optional(),
  });

  // Handle Status Toggle
  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axiosInstance.patch(`/users/updateuserstatus/${userId}`, { status: newStatus });
      fetchUsers();
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };



  const PreviewModal = ({ data, onEdit, onConfirm, onCancel, isCreateMode }) => (
    <Dialog open={!!previewData} onOpenChange={onCancel}>
      <DialogContent className="p-6 max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isCreateMode ? "Preview New User" : "Preview Changes"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-base font-medium">{data?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium">{data?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-base font-medium capitalize">{data?.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-base font-medium">{data?.address || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-medium">{data?.phone || "N/A"}</p>
            </div>
            {data?.password && (
              <div>
                <p className="text-sm text-gray-500">Password</p>
                <p className="text-base font-medium">●●●●●●</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Edit
          </Button>
          <Button disabled={loading} className ={loading ? "opacity-50 cursor-not-allowed" : ""} onClick={onConfirm}>
            {loading ? "Submitting..." : (isCreateMode ? "Create User" : "Save Changes")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Header
        title="User Management"
        titledesc="Manage all registered users and their roles"
        linkname="Create new user"
        link="#"
        onClickLink={() => {
          setCreateOpen(true);
          setFormMode("create");
          setIsEditing(false);
        }}
      />

      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
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
                  <Switch checked={user.status === true} onClick={() => handleStatusChange(user._id, !user.status)} />
                </TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4 rotate-90" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditData(user);
                          setFormMode("edit");
                          setIsEditing(false);
                        }}
                      >
                        <SquarePen className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(user._id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDetails(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Create User Dialog */}
        <Dialog open={createOpen && !previewData} onOpenChange={() => {
          setCreateOpen(false);
          setPreviewData(null);
          setPassword(false);
        }}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>

            <Formik
              initialValues={{
                name: "",
                email: "",
                role: "",
                address: "",
                phone: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => setPreviewData(values)}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Name</label>
                    <Input
                      placeholder="Enter Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      placeholder="Enter Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

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
                    {errors.role && touched.role && (
                      <p className="text-red-500 text-sm">{errors.role}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Address</label>
                    <Input
                      placeholder="Enter Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Phone</label>
                    <Input
                      placeholder="Enter Phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative space-y-1">
                    <label className="block text-sm font-medium">Password</label>
                    <Input
                      placeholder="Enter Password"
                      type={password ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-6 -translate-y-1/2 pt-4 text-gray-500"
                      onClick={() => setPassword(!password)}
                    >
                      {password ? (
                        <EyeClosed className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.password && touched.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <Button className="mt-2 w-full" onClick={handleSubmit}>
                    Preview
                  </Button>
                </div>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editData && !previewData && !isEditing} onOpenChange={() => {
          setEditData(null);
          setPreviewData(null);
          setPassword(false);
        }}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>Update User Details</DialogTitle>
            </DialogHeader>

            <Formik
              initialValues={{
                name: editData?.name || "",
                email: editData?.email || "",
                role: editData?.role || "",
                address: editData?.address || "",
                phone: editData?.phone || "",
                password: "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={(values) => setPreviewData(values)}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Name</label>
                    <Input
                      placeholder="Enter Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      placeholder="Enter Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

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
                    {errors.role && touched.role && (
                      <p className="text-red-500 text-sm">{errors.role}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Address</label>
                    <Input
                      placeholder="Enter Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Phone</label>
                    <Input
                      placeholder="Enter Phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative space-y-1">
                    <label className="block text-sm font-medium">
                      Password (optional)
                    </label>
                    <Input
                      placeholder="Enter Password"
                      type={password ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-6 -translate-y-1/2 pt-4 text-gray-500"
                      onClick={() => setPassword(!password)}
                    >
                      {password ? (
                        <EyeClosed className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.password && touched.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <Button className="mt-2 w-full" onClick={handleSubmit}>
                    Preview
                  </Button>
                </div>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog - accessible from both create and edit */}
        {previewData && (
          <PreviewModal
            data={previewData}
            onEdit={() => {
              setIsEditing(true);
            }}
            onConfirm={() => {
              if (formMode === "create") {
                handleCreate(previewData, { resetForm: () => {} });
              } else {
                handleUpdate(previewData);
              }
            }}
            onCancel={() => {
              setPreviewData(null);
              setIsEditing(false);
            }}
            isCreateMode={formMode === "create"}
          />
        )}

        {/* Edit from Preview Dialog */}
        <Dialog open={isEditing && !!previewData} onOpenChange={() => setIsEditing(false)}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>Edit User Details</DialogTitle>
            </DialogHeader>

            <Formik
              initialValues={{
                name: previewData?.name || "",
                email: previewData?.email || "",
                role: previewData?.role || "",
                address: previewData?.address || "",
                phone: previewData?.phone || "",
                password: previewData?.password || "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={(values) => setPreviewData(values)}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Name</label>
                    <Input
                      placeholder="Enter Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      placeholder="Enter Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

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

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Address</label>
                    <Input
                      placeholder="Enter Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Phone</label>
                    <Input
                      placeholder="Enter Phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative space-y-1">
                    <label className="block text-sm font-medium">Password</label>
                    <Input
                      placeholder="Enter Password"
                      type={password ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-6 -translate-y-1/2 pt-4 text-gray-500"
                      onClick={() => setPassword(!password)}
                    >
                      {password ? (
                        <EyeClosed className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Back
                    </Button>
                    <Button onClick={handleSubmit}>
                      Review Changes
                    </Button>
                  </div>
                </div>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={!!details} onOpenChange={() => setDetails(null)}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {details && (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {details.name}
                </p>
                <p>
                  <strong>Email:</strong> {details.email}
                </p>
                <p>
                  <strong>Role:</strong> {details.role}
                </p>
                <p>
                  <strong>Address:</strong> {details.address}
                </p>
                <p>
                  <strong>Phone:</strong> {details.phone}
                </p>
                <p>
                  <strong>Status:</strong> {details.status ? "Active" : "Inactive"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(details.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Newdeletemodel
          deleteId={deleteId}
          setDeleteId={setDeleteId}
          onSuccess={fetchUsers}
          endpoint="/users"
        />
      </div>
    </>
  );
};

export default Page;