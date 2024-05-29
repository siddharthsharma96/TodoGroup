import React, { useCallback } from "react";

const Group = React.memo(({ group, onDelete, onChange, index }) => {
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      onChange(group.id, name, value);
    },
    [group.id, onChange]
  );

  const handleDelete = useCallback(() => {
    onDelete(group.id);
  }, [group.id, onDelete]);

  return (
    <div className="todoListItem">
      <div className="todo">
        <svg className="trash" viewBox="0 0 512 512" width="512" height="512">
          <g>
            <path d="M448,85.333h-66.133C371.66,35.703,328.002,0.064,277.333,0h-42.667c-50.669,0.064-94.327,35.703-104.533,85.333H64   c-11.782,0-21.333,9.551-21.333,21.333S52.218,128,64,128h21.333v277.333C85.404,464.214,133.119,511.93,192,512h128   c58.881-0.07,106.596-47.786,106.667-106.667V128H448c11.782,0,21.333-9.551,21.333-21.333S459.782,85.333,448,85.333z    M234.667,362.667c0,11.782-9.551,21.333-21.333,21.333C201.551,384,192,374.449,192,362.667v-128   c0-11.782,9.551-21.333,21.333-21.333c11.782,0,21.333,9.551,21.333,21.333V362.667z M320,362.667   c0,11.782-9.551,21.333-21.333,21.333c-11.782,0-21.333-9.551-21.333-21.333v-128c0-11.782,9.551-21.333,21.333-21.333   c11.782,0,21.333,9.551,21.333,21.333V362.667z M174.315,85.333c9.074-25.551,33.238-42.634,60.352-42.667h42.667   c27.114,0.033,51.278,17.116,60.352,42.667H174.315z" />
          </g>
        </svg>
        <div>
          <label className="odd">Group {index + 1} </label>
          <input name="from" value={group.from} onChange={handleInputChange} />
          <span>
            <svg
              className="arrow odd"
              id="Outline"
              viewBox="0 0 24 24"
              width="512"
            >
              <path d="M23.12,9.91,19.25,6a1,1,0,0,0-1.42,0h0a1,1,0,0,0,0,1.41L21.39,11H1a1,1,0,0,0-1,1H0a1,1,0,0,0,1,1H21.45l-3.62,3.61a1,1,0,0,0,0,1.42h0a1,1,0,0,0,1.42,0l3.87-3.88A3,3,0,0,0,23.12,9.91Z" />
            </svg>
          </span>
          <input name="to" value={group.to} onChange={handleInputChange} />
          <i class="fi fi-ss-check-circle"></i>
        </div>
      </div>

      {group.status && (
        <div className="todoStatus">
          {group.status.map((item) => (
            <div key={item.id}>
              ({item.id}){item.completed ? "True" : "False"},
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Group;
