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
			{/* Trigger Button */}
			<button
				className="btn btn-outline rounded-full btn-sm hover:bg-gray-100 hover:shadow-md transition"
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit Profile
			</button>

			{/* Modal */}
			<dialog
				id="edit_profile_modal"
				className="modal bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
				aria-label="Edit Profile Modal"
			>
				<div className="modal-box max-w-xl bg-white p-6 rounded-lg border border-gray-300 shadow-lg">
					<h3 className="text-xl font-semibold text-gray-800 mb-4">Update Profile</h3>

					{/* Form */}
					<form
						className="space-y-4"
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						{/* Full Name and Username */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="text"
								placeholder="Full Name"
								className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition"
								value={formData.fullName}
								name="fullName"
								onChange={handleInputChange}
								aria-label="Full Name"
							/>
							<input
								type="text"
								placeholder="Username"
								className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition"
								value={formData.username}
								name="username"
								onChange={handleInputChange}
								aria-label="Username"
							/>
						</div>

						{/* Email and Bio */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="email"
								placeholder="Email"
								className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition"
								value={formData.email}
								name="email"
								onChange={handleInputChange}
								aria-label="Email"
							/>
							<textarea
								placeholder="Bio"
								className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition resize-none"
								value={formData.bio}
								name="bio"
								onChange={handleInputChange}
								aria-label="Bio"
							/>
						</div>

						{/* Password Fields */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="password"
								placeholder="Current Password"
								className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition"
								value={formData.currentPassword}
								name="currentPassword"
								onChange={handleInputChange}
								aria-label="Current Password"
							/>
							<input
								type="password"
								placeholder="New Password"
								className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition"
								value={formData.newPassword}
								name="newPassword"
								onChange={handleInputChange}
								aria-label="New Password"
							/>
						</div>

						{/* Website/Link */}
						<input
							type="text"
							placeholder="Website/Link"
							className="input w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:outline-none transition"
							value={formData.link}
							name="link"
							onChange={handleInputChange}
							aria-label="Website/Link"
						/>

						{/* Update Button */}
						<button
							className="w-full btn bg-primary text-white rounded-full py-2 hover:bg-primary-dark transition"
							disabled={isUpdatingProfile}
						>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>

				{/* Modal Close */}
				<form method="dialog" className="modal-backdrop">
					<button className="btn bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition">
						Close
					</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal;
