import { Box, Button, Menu, MenuItem, Typography } from "@material-ui/core";
import NotificationsIcon from "@mui/icons-material/Notifications";
import React, { useState } from "react";
import NotificationBadge, { Effect } from "react-notification-badge";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../../utils/ChatLogics";
import SearchDrawer from "./SearchDrawer";

const SideDrawer = () => {
  const { user, notification, setNotification, setSelectedChat } = ChatState();

  //Notification menu
  const [openNotification, setOpenNotification] = useState(null);
  const handleOpenNotification = (event) => {
    setOpenNotification(event.currentTarget);
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "white",
          borderRadius: "5px",
          justifyContent: "space-between",
        }}
      >
        <Button>
          <SearchDrawer />
        </Button>
        <Typography
          style={{
            fontFamily: "serif",
            fontSize: "2rem",
          }}
        >
          Chats
        </Typography>
        <Box>
          {/* Notification  */}
          <Button onClick={handleOpenNotification}>
            <NotificationBadge
              count={notification?.length}
              effect={Effect?.SCALE}
            />
            <NotificationsIcon />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={openNotification}
            open={openNotification}
            onClose={handleCloseNotification}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {!notification?.length ? (
              <>{"No message received!"}</>
            ) : (
              <>
                {notification.map((notf) => (
                  <MenuItem
                    key={notf?._id}
                    onClick={() => {
                      setSelectedChat(notf.chat);
                      setNotification(notification.filter((n) => n !== notf));
                      handleCloseNotification();
                    }}
                  >
                    {notf?.chat?.isGroupChat
                      ? `New message in ${notf.chat.chatName}`
                      : `New message from ${getSender(
                          user,
                          notf?.chat?.users
                        )}`}
                  </MenuItem>
                ))}
              </>
            )}
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default SideDrawer;
