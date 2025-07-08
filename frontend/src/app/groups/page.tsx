"use client";

import { useState, useEffect } from "react";
import { FiFilePlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";
import Card from "@/app/components/Card";
import SearchBar from "@/app/components/SearchBar";

const Groups = () => {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/groups");
        setGroups(response.data.groups);
      }
      catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <main className="page-container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title mb-0">Groups</h1>
        <SearchBar type="groups" />
      </div>
      <section className="card-grid">
        <button
          onClick={() => { router.push("/groups/edit") }}
          className="create-button card"
        >
          <p>Create group</p>
          <FiFilePlus className="create-icon hover-animation" />
        </button>
        {groups.map((item, index) => (
          <Card key={index} item={item} type="groups" />
        ))}
      </section>
    </main>
  );
}

export default Groups;