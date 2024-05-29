import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchStatuses } from "../utils/api";
import Group from "./Group";

const GroupList = () => {
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [groups, setGroups] = useState([
    { id: 1, from: 1, to: 5, status: null },
  ]);
  const [lastFetchedGroups, setLastFetchedGroups] = useState(null);
  const prevGroupsLength = useRef(groups.length);

  useEffect(() => {
    if (groups.length > 1 && groups.length !== prevGroupsLength.current) {
      const updatedGroups = groups.map((group, index) => {
        if (index !== 0 && group.to === null) {
          const prevTo = groups[index - 1].to;
          return { ...group, to: prevTo + 5 };
        }
        return group;
      });
      setGroups(updatedGroups);
      prevGroupsLength.current = updatedGroups.length;
    }
  }, [groups]);

  useEffect(() => {
    for (let i = 1; i < groups.length; i++) {
      const prevTo = parseInt(groups[i - 1].to);
      const currentFrom = parseInt(groups[i].from);

      if (currentFrom !== prevTo + 1) {
        setError(true);
        setMsg(`Error: Group ${i + 1} should start from ${prevTo + 1}`);
        return;
      }
      setError(false);
    }
  }, [groups]);

  const handleAddGroup = useCallback(() => {
    let newGroup;
    if (groups.length === 0) {
      newGroup = { id: Date.now(), from: 1, to: 5, status: null };
    } else {
      const lastGroup = groups[groups.length - 1];
      const lastTo = parseInt(lastGroup.to);
      const newFrom = lastTo + 1;
      const newTo = newFrom + 4;
      newGroup = { id: Date.now(), from: newFrom, to: newTo, status: null };
    }

    setGroups((prevGroups) => [...prevGroups, newGroup]);
  }, [groups]);

  const handleDeleteGroup = useCallback((id) => {
    setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
  }, []);

  const handleChangeGroup = useCallback((id, field, value) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === id ? { ...group, [field]: value } : group
      )
    );
  }, []);

  const handleShowStatus = useCallback(async () => {
    try {
      const updatedGroups = await fetchStatuses(groups);
      if (JSON.stringify(updatedGroups) !== JSON.stringify(lastFetchedGroups)) {
        setGroups(updatedGroups);
        setLastFetchedGroups(updatedGroups);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  }, [groups, lastFetchedGroups]);

  return (
    <div className="todoConatiner">
      {groups.map((group, index) => (
        <Group
          key={group.id}
          group={group}
          index={index}
          onDelete={handleDeleteGroup}
          onChange={handleChangeGroup}
        />
      ))}
      {error && <p className="errorMsg">{msg}</p>}
      <p onClick={handleAddGroup}>+ Add Group</p>
      <button onClick={handleShowStatus}>Show Status</button>
    </div>
  );
};

export default GroupList;
