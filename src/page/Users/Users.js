import React, { useState, useEffect } from "react";
import BasicLayout from "../../layout/BasicLayout";
import "./Users.scss";
import { Spinner, ButtonGroup, Button } from "react-bootstrap";
import { getFollowsApi } from "../../api/follow";
import {
  useParams,
  useLocation,
  useNavigate,
  redirect,
} from "react-router-dom";
import queryString from "query-string";
import ListUsers from "../../components/ListUsers/ListUsers";
import { useDebouncedCallback } from "use-debounce";

export default function Users(props) {
  const { setRefreshCheckLogin } = props;

  const history = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState(null);
  const params = useUsersQuery(location);
  const [typeUser, setTypeUser] = useState(params.type || "follow");
  const [btnLoading, setBtnLoading] = useState(false);

  const onSearch = useDebouncedCallback((value) => {
    setUsers(null);
    history({
      search: queryString.stringify({ ...params, search: value, page: 1 }),
    });
  }, 1000);

  useEffect(() => {
    getFollowsApi(queryString.stringify(params))
      .then((response) => {
        if (params.page == 1) {
          setUsers(response ? response : []);
        } else {
          if (!response) {
            setBtnLoading(0);
          } else {
            setUsers([...users, ...response]);
            setBtnLoading(false);
          }
        }
      })
      .catch(() => {
        setUsers([]);
      });
  }, [location]);

  const onChangeType = (type) => {
    setUsers(null);
    if (type === "new") {
      setTypeUser("new");
    } else {
      setTypeUser("follow");
    }

    history({
      search: queryString.stringify({ type: type, page: 1, search: "" }),
    });
  };

  const moreData = () => {
    setBtnLoading(true);
    const newPage = parseInt(params.page) + 1;
    history({
      search: queryString.stringify({ ...params, page: newPage }),
    });
  };

  return (
    <BasicLayout
      className="users"
      title="Usuarios"
      setRefreshCheckLogin={setRefreshCheckLogin}
    >
      <div className="users__title">
        <h2>Usuarios</h2>
        <input
          type="text"
          placeholder="Busca un usuario..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <ButtonGroup className="users__options">
        <Button
          className={typeUser === "follow" && "active"}
          onClick={() => onChangeType("follow")}
        >
          Siguiendo
        </Button>
        <Button
          className={typeUser === "new" && "active"}
          onClick={() => onChangeType("new")}
        >
          Nuevos
        </Button>
      </ButtonGroup>

      {!users ? (
        <div className="users__loading">
          <Spinner animation="border" variant="info" />
          Buscando usuarios
        </div>
      ) : (
        <>
          <ListUsers users={users} />
          <Button onClick={moreData} className="load-more">
            {!btnLoading ? (
              btnLoading !== 0 && "Cargar mas usuarios"
            ) : (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        </>
      )}
    </BasicLayout>
  );
}

function useUsersQuery(location) {
  const {
    page = 1,
    type = "follow",
    search,
  } = queryString.parse(location.search);
  return { page, type, search };
}
