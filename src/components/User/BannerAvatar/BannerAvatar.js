import React, { useState, useEffect } from "react";
import { API_HOST } from "../../../utils/constants";
import "./BannerAvatar.scss";
import AvatarNotFound from "../../../assets/png/avatar-no-found.png";
import { Button } from "react-bootstrap";
import ConfigModal from "../../Modal/ConfigModal";
import EditUserForm from "../EditUserForm/EditUserForm";
import {
  checkFollowApi,
  followUserApi,
  unfollowUserApi,
} from "../../../api/follow";

export default function BannerAvatar(props) {
  const { user, loggerUser } = props;
  const [following, setFollowing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reloadFollow, setReloadFollow] = useState(false);

  const bannerUrl = user?.banner
    ? `${API_HOST}/obtenerBanner?id=${user.id}`
    : null;

  const avatarUrl = user?.avatar
    ? `${API_HOST}/obtenerAvatar?id=${user.id}`
    : AvatarNotFound;

  useEffect(() => {
    if (user) {
      checkFollowApi(user?.id).then((response) => {
        if (response?.status) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }
    setReloadFollow(false);
  }, [user, reloadFollow]);

  const onFollow = () => {
    followUserApi(user.id).then(() => {
      setReloadFollow(true);
    });
  };

  const onUnfollow = () => {
    unfollowUserApi(user.id).then(() => {
      setReloadFollow(true);
    });
  };

  return (
    <div
      className="banner-avatar"
      style={{ backgroundImage: `url('${bannerUrl}')` }}
    >
      <div
        className="avatar"
        style={{ backgroundImage: `url('${avatarUrl}')` }}
      />
      {user && (
        <div className="options">
          {loggerUser._id === user.id && (
            <Button onClick={() => setShowModal(true)}>Editar perfil</Button>
          )}

          {loggerUser._id !== user.id &&
            following !== null &&
            (following ? (
              <Button onClick={onUnfollow} className="unfollow">
                <span>Siguiendo</span>
              </Button>
            ) : (
              <Button onClick={onFollow}>Seguir</Button>
            ))}
        </div>
      )}

      <ConfigModal
        show={showModal}
        setShow={setShowModal}
        title="Editar perfil"
      >
        <EditUserForm user={user} setShowModal={setShowModal} />
      </ConfigModal>
    </div>
  );
}
