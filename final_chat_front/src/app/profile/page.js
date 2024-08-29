"use client";

import React, { useEffect, useRef, useState } from 'react';
import useAuthStore from '@/stores/authStore';
import http from '@/plugins/http';
import { useRouter } from 'next/navigation';
import { checkLoginStatus } from "@/plugins/login";
import ErrorPopup from "@/components/ErrorPopup";
import ChangeNamePopup from "@/components/ChangeNamePopup";
import ChangeEmailPopup from "@/components/ChangeEmailPopup";
import ChangePasswordPopup from "@/components/ChangePasswordPopup";
import DeleteUserPopup from "@/components/DeleteUserPopup";

const ProfilePage = () => {
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');
    const [joined, setJoined] = useState('');
    const [online, setOnline] = useState('');
    const router = useRouter();
    const { setIsLoggedIn, setChange } = useAuthStore();
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isBioChanged, setIsBioChanged] = useState(false);
    const [showChangeName, setShowChangeName] = useState(false);
    const [showChangeEmail, setShowChangeEmail] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false); // New state
    const [showDeleteUser, setShowDeleteUser] = useState(false); // New state

    const handleBioChange = (e) => {
        setBio(e.target.value);
        setIsBioChanged(true);
    };

    const handleBioSubmit = async () => {
        await updateBio(bio);
        setIsBioChanged(false);
    };

    async function updateBio(bio) {
        try {
            checkCookies()
            const res = await http.post("/private/change-bio", { bio }, false);
            if (res.error) return setError(res.error);
            setBio(res.data.bio);
        } catch (error) {
            console.error("Error :", error);
        }
    }

    const handleClose = () => {
        setError(null);
    };

    const loadingGif =
        "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWtsZWNwb2MzcXd6Zmw4NDM5NW9oNTMwZXpnNW92bTc0czM0eTZ0dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.webp";

    const imageRef = useRef();
    const changeImage = () => {
        if (imageRef.current) {
            imageRef.current.click();
        }
    };

    const validateFile = (event) => {
        checkCookies()
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
            if (validImageTypes.includes(file.type)) {
                changeAvatar(file);
            } else {
                alert("Please upload a valid file type: JPEG, PNG, or GIF");
            }
        }
    };

    async function changeAvatar(image) {
        const formData = new FormData();
        formData.append("avatar", image);
        try {
            checkCookies()
            setChange(false);
            const res = await http.post("/private/change-avatar", formData, true);
            if (res.error) return setError(res.error);
            setChange(true);
            setAvatar(res.avatarUrl);
            setOnline(new Date(Date.now()).toLocaleString());
        } catch (error) {
            console.error("Error uploading avatar:", error);
        }
    }
    const handleNameChange = async (newName, password) => {
        try {
            checkCookies()
            const res = await http.post('/private/change-username', { username: newName, password }, false);
            if (res.error) return setError(res.error);
            setUsername(res.data);
            setShowChangeName(false);
        } catch (error) {
            console.error("Error changing name:", error);
        }
    };
    const handleEmailChange = async (newEmail, password) => {
        try {
            checkCookies()
            const res = await http.post('/private/change-email', { email: newEmail, password }, false);
            if (res.error) return { error: res.error };
            return {};  // Return an empty object to indicate success
        } catch (error) {
            console.error("Error changing email:", error);
            return { error: 'Failed to change email. Please try again.' };
        }
    };

    const handleEmailVerification = async (verificationCode) => {
        try {
            checkCookies()
            const res = await http.post('/private/verify-email-code', { code: verificationCode }, false);
            if (res.error) return { error: res.error };
            setEmail(res.data.email);
            return {};  // Return an empty object to indicate success
        } catch (error) {
            console.error("Error verifying email:", error);
            return { error: 'Failed to verify email. Please try again.' };
        }
    };
    const handlePasswordChange = async (newPassword, password) => {
        try {
            checkCookies()
            const res = await http.post('/private/change-password', {newPassword, password }, false);
            if (res.error) return setError(res.error);
            setShowChangePassword(false)
        } catch (error) {
            console.error("Error changing password:", error);
        }
    };
    const handlePasswordVerification = async (password) => {
        try {
            checkCookies()
            const res = await http.post('/private/delete-user', { password }, false);
            if (res.error) return { error: res.error };
            return {};  // Return an empty object to indicate success
        } catch (error) {
            console.error("Error verifying password:", error);
            return { error: 'Failed to verify password. Please try again.' };
        }
    };

    const handleDeleteUser = async (verificationCode) => {
        try {
            checkCookies()
            const res = await http.post('/private/delete-user-code', { code: verificationCode }, false);
            if (res.error) return { error: res.error };
            setShowDeleteUser(false);
            checkCookies()
        } catch (error) {
            console.error("Error deleting user:", error);
            return { error: 'Failed to delete user. Please try again.' };
        }
    };

    function checkCookies(){
        if (!checkLoginStatus()) {
            setIsLoggedIn(false);
            router.push('/login');
        }
    }

    useEffect(() => {
       checkCookies()
    }, [setIsLoggedIn, router]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await http.get('/private/get-user', true);
                if (res.error) return setError(res.error);

                setUsername(res.data.username);
                setEmail(res.data.email);
                setAvatar(res.data.avatar);
                setBio(res.data.bio || 'Not set');
                setJoined(res.data.joined ? new Date(res.data.joined).toLocaleDateString() : 'N/A');
                setOnline(res.data.online ? new Date(res.data.online).toLocaleString() : 'N/A');
            } catch (error) {
                console.error('Error fetching protected data:', error);
            }
        };

        getUser();
    }, []);

    return (
        <div className="bg-gray-100 flex pt-5 pb-52 justify-center">
            <div className="bg-white text-black shadow-md rounded-lg p-6 max-w-md w-full">
                {error && <ErrorPopup message={error} onClose={handleClose} />}
                {showChangeName && <ChangeNamePopup onClose={() => setShowChangeName(false)} onSubmit={handleNameChange} />}
                {showChangeEmail && (<ChangeEmailPopup onClose={() => setShowChangeEmail(false)} onSubmitEmailChange={handleEmailChange} onSubmitEmailVerification={handleEmailVerification}/>)}
                {showChangePassword && <ChangePasswordPopup onClose={() => setShowChangePassword(false)} onSubmit={handlePasswordChange} />}
                {showDeleteUser && (
                    <DeleteUserPopup
                        onClose={() => setShowDeleteUser(false)}
                        onSubmitPasswordVerification={handlePasswordVerification}
                        onSubmitDelete={handleDeleteUser}
                    />
                )}

                {/* Avatar Section */}
                <div className="relative flex flex-col items-center">
                    <div onClick={changeImage} className="relative">
                        <img
                            className="w-44 h-44 rounded-full shadow-lg"
                            src={avatar || "https://via.placeholder.com/150"}
                            alt="User avatar"
                        />
                        <div
                            className="w-44 h-44 group hover:bg-gray-200 opacity-60 rounded-full absolute top-0 left-0 flex justify-center items-center cursor-pointer transition duration-500">
                            <img
                                className="hidden group-hover:block w-10"
                                src="https://www.svgrepo.com/show/33565/upload.svg"
                                alt="Upload icon"
                            />
                        </div>
                    </div>
                    <input
                        ref={imageRef}
                        type="file"
                        id="file-input"
                        className="hidden"
                        onChange={validateFile}
                    />
                </div>

                {/* User Information Section */}
                <div className="text-center mt-4">
                    <div className="flex justify-center items-center">
                        <h1 className="text-xl font-semibold">{username || 'Username'}</h1>
                        <img
                            onClick={() => setShowChangeName(true)}
                            src="https://res.cloudinary.com/dayly4g5u/image/upload/v1724914401/eqaummtl6heb3ycsb1zk.png"
                            alt="Edit"
                            className="ml-2 w-5 h-5 cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-center items-center">
                        <p className="text-gray-600">{email || 'user@example.com'}</p>
                        <img
                            onClick={() => setShowChangeEmail(true)}
                            src="https://res.cloudinary.com/dayly4g5u/image/upload/v1724914401/eqaummtl6heb3ycsb1zk.png"
                            alt="Edit"
                            className="ml-2 w-5 h-5 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-4 space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Joined:</span>
                        <span>{joined}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Last seen:</span>
                        <span>{online}</span>
                    </div>

                    {/* Bio Section */}
                    <div className="flex flex-col">
                        <label htmlFor="bio" className="font-medium">Bio:</label>
                        <textarea
                            id="bio"
                            className="mt-2 p-2 border rounded h-24 resize-none"
                            value={bio}
                            onChange={handleBioChange}
                            placeholder="Enter your bio"
                        />
                        {isBioChanged && (
                            <button
                                className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                                onClick={handleBioSubmit}
                            >
                                Submit
                            </button>
                        )}
                    </div>
                    {/* New Buttons */}
                    <div className="mt-6 flex gap-2 items-center justify-center">
                        <button
                            className="button-62 bg-yellow-500 text-white py-1 px-4 rounded mr-2"
                            onClick={() => setShowChangePassword(true)}
                        >
                            Change Password
                        </button>
                        <button
                            className="button-62 text-white text-sm py-0.5 px-3 rounded"
                            onClick={() => setShowDeleteUser(true)}
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
