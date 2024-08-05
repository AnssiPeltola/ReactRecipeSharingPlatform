import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../../../Types/types";

const ModifyUserInfo = () => {
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      const response = await axios.get("/getUserDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div>
      <h1>Modify User Info</h1>
      {userDetails && (
        <div>
          <p>First Name: {userDetails.firstname}</p>
          <p>Last Name: {userDetails.lastname}</p>
          <p>Email: {userDetails.email}</p>
        </div>
      )}
    </div>
  );
};

export default ModifyUserInfo;
