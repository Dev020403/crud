import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Users = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const dataFetch = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/getAllUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setData(res.data.users);
        console.log(res.data.users);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (email) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) {
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:3000/api/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { email }
      });
      if (res.status === 204) {
        toast.success("User deleted successfully");
        setData(data.filter(user => user.email !== email));
      }
    } catch (e) {
      console.log(e);
      toast.error("An error occurred");
    }
  };

  const handleUpdate = async (user) => {
    const name = prompt("Enter new name:", user.name);
    const contact = prompt("Enter new contact:", user.contact);

    if (name === null && contact === null) {
      return;
    }

    try {
      const res = await axios.put(`http://localhost:3000/api/update`, {
        email: user.email,
        name: name !== null ? name : user.name,
        contact: contact !== null ? contact : user.contact
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setData(data.map(u => u.email === user.email ? res.data.user : u));
        toast.success("User updated successfully");
      }
    } catch (e) {
      toast.error("An error occurred");
      console.log(e);
    }
  };

  useEffect(() => {
    dataFetch();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Users</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Contact</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user._id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.contact}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleUpdate(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Users;
