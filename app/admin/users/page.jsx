"use client"
import React from 'react'
import Header from '../../../dashbord/common/Header'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../../../components/ui/table'
import { useEffect ,useState } from 'react'
import axiosInstance from '../../config/axiosInstance'
const page = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users')
        setUsers(response.data.data)
      }
      catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }
  , [])
  

  return (
    <>
    <Header title="Users" titledesc="Manage all users here" link='/admin/register' linkname='Register User' />
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Index</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead> Date</TableHead>
       
            </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>

            </TableRow>
          ))}
        </TableBody>

      </Table>
      
    </div>
    </>
  )
}

export default page
