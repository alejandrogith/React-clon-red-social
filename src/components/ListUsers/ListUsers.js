import { map } from "lodash";
import React from "react";
import User from "./User";

import "./ListUsers.scss";

export default function ListUsers(props) {
  const { users } = props;

  if (users.length === 0) {
    return <h2>No hay resultados</h2>;
  }

  return (
    <ul className="list-users">
      {users.map((user) => {
        return <User key={user.id} user={user} />;
      })}
    </ul>
  );
}
