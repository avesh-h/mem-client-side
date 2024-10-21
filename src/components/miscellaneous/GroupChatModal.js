import { FormControl, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { enqueueSnackbar } from "notistack";
import * as React from "react";
import { addGroupMember, searchUser } from "../../api";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [groupChatName, setGroupChatName] = React.useState();
  const [selectedUser, setSelectedUser] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await searchUser(query);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Error Occured!", {
        variant: "error",
        transitionDuration: "0.5s",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      enqueueSnackbar("User already added!", {
        variant: "error",
        transitionDuration: "0.5s",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
    setSearchResult([]);
    setSearch("");
  };

  //Creat group chat
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser?.length) {
      enqueueSnackbar("Please field all the field!", {
        variant: "error",
        transitionDuration: "0.5s",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }
    try {
      const { data } = await addGroupMember({
        name: groupChatName,
        users: JSON.stringify(selectedUser?.map((u) => u._id)),
      });
      setChats([data, ...chats]);
      handleClose();
      enqueueSnackbar("New group chat created!", {
        variant: "success",
        transitionDuration: "0.5s",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    } catch (error) {
      enqueueSnackbar("Failed to create group!", {
        variant: "error",
        transitionDuration: "0.5s",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    }
  };

  //Open
  const handleOpen = () => setOpen(true);

  //Close
  const handleClose = () => setOpen(false);

  const handleRemoveUser = (user) => {
    setSelectedUser((prev) => prev.filter((u) => u._id !== user._id));
  };
  return (
    <>
      <Button onClick={handleOpen}>{children}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Create Group Chat
          </Typography>
          <Box>
            <FormControl fullWidth>
              <TextField
                type="text"
                placeholder="Chat Name"
                sx={{ mb: 3 }}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <TextField
                type="text"
                placeholder="Add Users eg: John,Jane"
                sx={{ mb: 1 }}
                onChange={(e) => handleSearch(e.target.value)}
                value={search}
              />
            </FormControl>
            {/* selected user */}
            <Box width="100%" display={"flex"} flexWrap={"wrap"}>
              {selectedUser.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemoveUser(u)}
                />
              ))}
            </Box>
            {/* render searched user */}
            {loading ? (
              <div>loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                ?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </Box>
          <Box>
            <Button onClick={handleSubmit}>Create Chat</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default GroupChatModal;
