import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });

    const queryClient = useQueryClient();

    const {
        mutate: signUpMutation,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ email, username, fullName, password }) => {
            try {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, username, fullName, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to create account");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            // Refetch the authUser
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        signUpMutation(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-screen-xl mx-auto flex h-screen bg-black">
            <div className="flex-1 hidden lg:flex items-center justify-center">
                <XSvg className="lg:w-2/3 fill-white" />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
                <form className="flex gap-6 flex-col w-80" onSubmit={handleSubmit}>
                    <XSvg className="w-24 lg:hidden fill-white" />
                    <h1 className="text-4xl font-extrabold text-white text-center">Join us.</h1>

                    <label className="input flex items-center gap-2 bg-gray-200 rounded focus-within:outline outline-blue-500 p-2">
                        <MdOutlineMail className="text-gray-600" />
                        <input
                            type="email"
                            className="grow bg-transparent outline-none placeholder-gray-500 text-black"
                            placeholder="Email"
                            name="email"
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>

                    <label className="input flex items-center gap-2 bg-gray-200 rounded focus-within:outline outline-blue-500 p-2">
                        <FaUser className="text-gray-600" />
                        <input
                            type="text"
                            className="grow bg-transparent outline-none placeholder-gray-500 text-black"
                            placeholder="Username"
                            name="username"
                            onChange={handleInputChange}
                            value={formData.username}
                        />
                    </label>

                    <label className="input flex items-center gap-2 bg-gray-200 rounded focus-within:outline outline-blue-500 p-2">
                        <MdDriveFileRenameOutline className="text-gray-600" />
                        <input
                            type="text"
                            className="grow bg-transparent outline-none placeholder-gray-500 text-black"
                            placeholder="Full Name"
                            name="fullName"
                            onChange={handleInputChange}
                            value={formData.fullName}
                        />
                    </label>

                    <label className="input flex items-center gap-2 bg-gray-200 rounded focus-within:outline outline-blue-500 p-2">
                        <MdPassword className="text-gray-600" />
                        <input
                            type="password"
                            className="grow bg-transparent outline-none placeholder-gray-50 text-black"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>

                    <button className="bg-blue-500 font-bold rounded-full text-white py-2">
                        {isPending ? "Loading..." : "Sign up"}
                    </button>
                    {isError && <p className="text-red-500 text-center">{error.message}</p>}
                </form>

                <div className="flex flex-col gap-4 mt-6 items-center">
                    <p className="text-white text-lg">Already have an account?</p>
                    <Link to="/login">
                        <button className="flex gap-4 items-center flex-col w-80 bg-blue-500 font-bold rounded-full text-white py-2">
                            Sign in
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
