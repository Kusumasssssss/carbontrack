import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Activities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);
  const deleteActivity = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/activity/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      fetchActivities();

      alert("Activity deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to delete activity.");
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/activity");
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch activities.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#F1F5F9",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          marginLeft: "270px",
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            color: "#0F172A",
            marginBottom: "10px",
          }}
        >
          🌱 Activities
        </h1>

        <p
          style={{
            color: "#64748B",
            marginBottom: "30px",
          }}
        >
          All your recorded carbon activities.
        </p>

        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 5px 15px rgba(0,0,0,.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#E2E8F0" }}>
                <th style={th}>Category</th>
                <th style={th}>Activity</th>
                <th style={th}>Quantity</th>
                <th style={th}>Unit</th>
                <th style={th}>Date</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "25px",
                      color: "#64748B",
                    }}
                  >
                    No activities found.
                  </td>
                </tr>
              ) : (
                activities.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      background: "#FFFFFF",
                    }}
                  >
                    <td style={td}>{item.category}</td>
                    <td style={td}>{item.activity}</td>
                    <td style={td}>{item.quantity}</td>
                    <td style={td}>{item.unit}</td>
                    <td style={td}>{item.date}</td>

                    <td style={td}>
                      <button
                        style={{
                          background: "#3B82F6",
                          color: "white",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          marginRight: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => deleteActivity(item.id)}
                        style={{
                          background: "#EF4444",
                          color: "white",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const th = {
  padding: "15px",
  textAlign: "left",
  color: "#0F172A",
  fontWeight: "bold",
};

const td = {
  padding: "15px",
  borderBottom: "1px solid #E2E8F0",
  color: "#1E293B",
  fontWeight: "500",
};

export default Activities;