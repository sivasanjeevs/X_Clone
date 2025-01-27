import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			<button
				className="btn btn-outline rounded-full btn-sm"
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id="edit_profile_modal" className="bg-black text-white modal">
				<div className="modal-box border rounded-2xl border-gray-700 shadow-md bg-black p-6 space-y-6">
					<h3 className="font-bold text-lg my-3">Update Profile</h3>
					<form
						className="flex flex-col gap-6"
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className="flex flex-wrap gap-4">
							<input
								type="text"
								placeholder="Full Name"
								className="flex-1 input border border-gray-700 bg-black text-white rounded-xl p-3 input-md"
								value={formData.fullName}
								name="fullName"
								onChange={handleInputChange}
							/>
							<input
								type="text"
								placeholder="Username"
								className="flex-1 input border border-gray-700 bg-black text-white rounded-xl p-3 input-md"
								value={formData.username}
								name="username"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-4">
							<input
								type="email"
								placeholder="Email"
								className="flex-1 input border border-gray-700 bg-black text-white rounded-xl p-3 input-md"
								value={formData.email}
								name="email"
								onChange={handleInputChange}
							/>
							<textarea
								placeholder="Bio"
								className="flex-1 input border border-gray-700 bg-black text-white rounded-xl p-3 input-md"
								value={formData.bio}
								name="bio"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-4">
							<input
								type="password"
								placeholder="Current Password"
								className="flex-1 input border border-gray-700 bg-black text-white rounded-xl p-3 input-md"
								value={formData.currentPassword}
								name="currentPassword"
								onChange={handleInputChange}
							/>
							<input
								type="password"
								placeholder="New Password"
								className="flex-1 input border border-gray-700 bg-black text-white rounded-xl p-3 input-md"
								value={formData.newPassword}
								name="newPassword"
								onChange={handleInputChange}
							/>
						</div>
						<input
							type="text"
							placeholder="Link"
							className="flex-1 input border border-gray-700 bg-black text-white rounded-xl p-3 input-md"
							value={formData.link}
							name="link"
							onChange={handleInputChange}
						/>
						<button
							className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 text-lg font-semibold"
							type="submit"
						>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button className="outline-none text-white">close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;
