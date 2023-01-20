import React, { useState, useEffect } from "react";
import "./User.scss";
import { Button, Spinner } from "react-bootstrap";
import BasicLayout from "../../layout/BasicLayout";
import { useParams } from "react-router-dom";
import { getUserApi } from "../../api/user";
import { toast } from "react-toastify";
import BannerAvatar from "../../components/User/BannerAvatar/BannerAvatar";
import useAuth from "../../hooks/useAuth";
import InfoUser from "../../components/User/InfoUser/InfoUser";
import { getUserTweetsApi } from "../../api/tweet";
import ListTweets from "../../components/ListTweets/ListTweets";

export default function User(props) {
  const { setRefreshCheckLogin } = props;

  const params = useParams();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingTweets, setLoadingTweets] = useState(false);
  const loggerUser = useAuth();

  useEffect(() => {
    getUserApi(params.id)
      .then((response) => {
        setUser(response);

        if (!response) {
          toast.error("El usuario que has visitado no existe");
        }
      })
      .catch(() => {
        toast.error("El usuario que has visitado no existe");
      });
  }, [params.id]);

  useEffect(() => {
    getUserTweetsApi(params.id, 1)
      .then((response) => {
        setTweets(response);
      })
      .catch(() => {
        setTweets([]);
      });
  }, [params]);

  const moreData = () => {
    const pageTemp = page + 1;
    setLoadingTweets(true);

    getUserTweetsApi(params.id, pageTemp).then((response) => {
      if (!response) {
        setLoadingTweets(0);
      } else {
        setTweets([...tweets, ...response]);
        setPage(pageTemp);
        setLoadingTweets(false);
      }
    });
  };

  return (
    <BasicLayout className="user" setRefreshCheckLogin={setRefreshCheckLogin}>
      <div className="user__title">
        <h2>
          {user
            ? `${user.nombre} ${user.apellidos} `
            : "Este usuario no existe"}
        </h2>
      </div>
      <BannerAvatar user={user} loggerUser={loggerUser} />
      <InfoUser user={user} />
      <div className="user__tweets">
        <h3>Tweets</h3>
        {tweets && <ListTweets tweets={tweets} />}
        <Button onClick={moreData}>
          {!loadingTweets ? (
            loadingTweets !== 0 && "Obtener mas tweets"
          ) : (
            <Spinner
              as="span"
              animation="grow"
              size="status"
              arian-hidden="true"
            />
          )}
        </Button>
      </div>
    </BasicLayout>
  );
}
