"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import EditButtons from "@/app/components/EditButtons";

const EditGroup = () => {
  const router = useRouter();
  const [group, setGroup] = useState({
    "name": "",
    "color": "#999999",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroup({ ...group, [name]: value });
  };
  const createGroup = async () => {
    try {
      await axiosInstance.post("/new-group", group);
      router.push("/groups");
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="page-container">
      <EditButtons 
        editMode={true} 
        submit={createGroup}
        cancel={() => router.back()}
      />
      <div className="sheet" style={{ background: group.color }}>
        <form method="POST" onSubmit={(e) => {e.preventDefault(); createGroup();}}>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Group name"
            aria-label="Group name"
            className="sheet-input sheet-name"
          />
          <br />
          <label className="sheet-input color-input">
            Group color
            <input
              type="color"
              name="color"
              onChange={handleChange}
              value={group.color}
            />
          </label>
        </form>
      </div>
    </div>
  );
}
export default EditGroup;