import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className="text-white flex-[4_4_0] mx-auto border-r border-gray-700 min-h-screen bg-black max-w-2xl">
				{/* Header */}
				<div className="flex w-full border-b border-gray-700">
					<div
						className={`flex justify-center flex-1 p-3 transition duration-300 cursor-pointer relative ${
							feedType === "forYou" ? "bg-gray-800" : "hover:bg-gray-900"
						}`}
						onClick={() => setFeedType("forYou")}
					>
						<span className="text-white font-medium">For you</span>
						{feedType === "forYou" && (
							<div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-500"></div>
						)}
					</div>
					<div
						className={`flex justify-center flex-1 p-3 transition duration-300 cursor-pointer relative ${
							feedType === "following" ? "bg-gray-800" : "hover:bg-gray-900"
						}`}
						onClick={() => setFeedType("following")}
					>
						<span className="text-white font-medium">Following</span>
						{feedType === "following" && (
							<div className="absolute bottom-0 w-10 h-1 rounded-full bg-blue-500"></div>
						)}
					</div>
				</div>

				{/* CREATE POST INPUT */}
				<div className="p-4 border-b border-gray-700">
					<CreatePost />
				</div>

				{/* POSTS */}
				<div className="p-4">
					<Posts feedType={feedType} />
				</div>
			</div>
		</>
	);
};

export default HomePage;
