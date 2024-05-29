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
          return { ...group, to: Math.min(prevTo + 5, 10) };
        }
        return group;
      });
      setGroups(updatedGroups);
      prevGroupsLength.current = updatedGroups.length;
    }
  }, [groups]);

  useEffect(() => {
    if (groups.length > 0) {
      if (groups[0].from !== 1) {
        setError(true);
        setMsg(`Group 1 should start from 1`);
        return;
      }

      for (let i = 1; i < groups.length; i++) {
        const prevTo = parseInt(groups[i - 1].to);
        const currentFrom = parseInt(groups[i].from);

        if (currentFrom !== prevTo + 1) {
          setError(true);
          setMsg(`Group ${i + 1} should start from ${prevTo + 1}`);
          return;
        }
      }
      // If all checks passed, clear the error
      setError(false);
      setMsg("");
    }
  }, [groups]);

  const handleAddGroup = useCallback(() => {
    if (groups.length === 0) {
      setGroups([{ id: Date.now(), from: 1, to: 5, status: null }]);
      return;
    }

    const lastGroup = groups[groups.length - 1];
    const lastTo = parseInt(lastGroup.to);
    const newFrom = lastTo + 1;
    const newTo = Math.min(newFrom + 4, 10);

    if (newFrom > 10) {
      setError(true);
      setMsg("Cannot add more groups outside the range 1-10.");
      return;
    }

    const newGroup = { id: Date.now(), from: newFrom, to: newTo, status: null };
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  }, [groups]);

  const handleDeleteGroup = useCallback((id) => {
    setGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
  }, []);

  const handleChangeGroup = useCallback((id, field, value) => {
    const numValue = parseInt(value);
    if (numValue < 1 || numValue > 10) {
      setError(true);
      setMsg("Values must be between 1 and 10.");
      return;
    }

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === id) {
          const updatedGroup = { ...group, [field]: numValue };

          if (
            field === "from" &&
            (numValue >= updatedGroup.to || numValue < 1)
          ) {
            setError(true);
            setMsg("Invalid 'from' value.");
            return group;
          }

          if (
            field === "to" &&
            (numValue <= updatedGroup.from || numValue > 10)
          ) {
            setError(true);
            setMsg("Invalid 'to' value.");
            return group;
          }

          setError(false);
          return updatedGroup;
        }
        return group;
      })
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
      <p className="addGroup" onClick={handleAddGroup}>
        + Add Group
      </p>
      <button
        onClick={handleShowStatus}
        disabled={
          error && msg !== "Cannot add more groups outside the range 1-10."
        }
      >
        Show Status
      </button>
    </div>
  );
};

export default GroupList;
