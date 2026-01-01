"use client";

import { useState, useEffect } from "react";
import { FiFilePlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

import axiosInstance from "@/app/axiosInstance";
import Card from "@/app/components/Card";
import { GSInterface } from "@/app/types/index";

const Groups = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<GSInterface[]>([]);
  // Copy of sheets data to be displayed if a user searches with only whitespace
  const [originalGroups, setOriginalGroups] = useState<GSInterface[]>([]);
  const [pageTitle, setPageTitle] = useState("Groups");

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/groups");
        const result = response.data.groups;
        setGroups(result);
        setOriginalGroups(result);
      }
      catch (error) {
        console.error(error);
      }
    })();
  }, []);

  // If user is searching, change the page title
  useEffect(() => {
    setPageTitle(groups === originalGroups ? "Groups" : "Search Results");
  }, [groups, originalGroups]);

  return (
    <main className="page-container">
      <h1 className="page-title">{pageTitle}</h1>
      <section className="card-grid">
        <button
          onClick={() => { router.push("/groups/create") }}
          className="create-button card hover-animation"
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