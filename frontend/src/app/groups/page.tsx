"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axiosInstance from "@/app/axiosInstance";
import Card from "@/app/components/Card";

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
      <h1 className="page-title">Groups</h1>
      <section className="card-grid">
        <button
          onClick={() => { router.push("/groups/edit") }}
          className="create-button card"
        >
          <p>Create group</p>
          <Image src="/mdi_add-bold.svg" alt="plus icon" width={30} height={30} />
        </button>
        {groups.map((item, index) => (
          <Card key={index} item={item} type="groups" />
        ))}
      </section>
    </main>
  );
}

export default Groups;