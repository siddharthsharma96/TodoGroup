const fetchStatus = async (id) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch status");
  }
  const data = await response.json();
  return data;
};

export const fetchStatuses = async (groups) => {
  try {
    const updatedGroups = await Promise.all(
      groups.map(async (group) => {
        const from = parseInt(group.from, 10);
        const to = parseInt(group.to, 10);

        const statuses = await Promise.all(
          Array.from({ length: to - from + 1 }, (_, i) => {
            const itemId = from + i;
            return fetch(
              `https://jsonplaceholder.typicode.com/todos/${itemId}`
            ).then((response) => response.json());
          })
        );
        return { ...group, status: statuses };
      })
    );
    return updatedGroups;
  } catch (error) {
    throw new Error("Error fetching statuses:", error);
  }
};
