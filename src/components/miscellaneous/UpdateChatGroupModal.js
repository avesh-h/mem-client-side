import { TurnedInNotRounded } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import {
  addToGroup,
  removeMemberFromGroup,
  renameGroup,
  searchUser,
} from "../../api";
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

const UpdateChatGroupModal = ({
  fetchAgain,
  setFetchAgain,
  fetchMessageHandler,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [renameLoading, setRenameLoading] = React.useState(false);
  const [groupChatName, setGroupChatName] = useState("");

  const { user, selectedChat, setSelectedChat } = ChatState();

  //Remove user from grp
  const handleRemove = async (user1) => {
    if (
      selectedChat?.groupAdmin?._id !== user?.result?._id &&
      user1?._id !== user?.result?._id
    ) {
      enqueueSnackbar("Only Admin can remove member from the group!", {
        variant: "error",
        transitionDuration: "0.5s",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    }
    try {
      setLoading(TurnedInNotRounded);
      const payload = {
        chatId: selectedChat?._id,
        userId: user1?._id,
      };
      const { data } = await removeMemberFromGroup(payload);
      user1?._id === user?.result?._id
        ? setSelectedChat()
        : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      //Fetch messages again after removing someone from grp
      fetchMessageHandler();
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
        transitionDuration: "0.5s",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });

      setLoading(false);
    }
  };

  //Add user in group
  const handleAddUser = async (user1) => {
    if (selectedChat?.users?.find((u) => u?._id === user1?._id)) {
      enqueueSnackbar("User Alerady present in the group!", {
        variant: "error",
        transitionDuration: "0.5s",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    //Error in adding member in grp
    if (selectedChat?.groupAdmin._id !== user?.result?._id) {
      enqueueSnackbar("Only Admin can add member in the group!", {
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
      setLoading(true);
      const payload = {
        chatId: selectedChat?._id,
        userId: user1?._id,
      };
      const { data } = await addToGroup(payload);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      setSearchResult([]);
      setSearch("");
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
        transitionDuration: "0.5s",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      setLoading(false);
    }
  };

  //Rename the group
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const payload = {
        chatId: selectedChat?._id,
        chatName: groupChatName,
      };
      const { data } = await renameGroup(payload);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
        transitionDuration: "0.5s",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  //Search user
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await searchUser(query);
      setSearchResult((prev) => [...prev, ...data?.users]);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Error Occured!", {
        variant: "error",
        transitionDuration: "0.5s",
      });
    }
  };
  return (
    <div>
      <Button endIcon={<RemoveRedEyeIcon />} onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* heading */}
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat?.chatName}
          </Typography>
          {/* body */}
          <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
            {selectedChat?.users?.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={() => handleRemove(user)}
              />
            ))}
          </Box>
          <FormControl sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              type="text"
              placeholder="Chat Name"
              sx={{ mb: 1 }}
              width={"100%"}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Box>
              <Button
                color="primary"
                sx={{ ml: 1 }}
                disabled={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </Box>
          </FormControl>
          <FormControl sx={{ pt: 3 }} fullWidth>
            <TextField
              type="text"
              placeholder="Add User to group"
              sx={{ mb: 1 }}
              onChange={(e) => handleSearch(e.target.value)}
              value={search}
            />
          </FormControl>
          {loading ? (
            <CircularProgress />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
          {/* footer */}
          <Box textAlign={"right"}>
            <Button
              variant="contained"
              onClick={() => handleRemove(user?.result)}
            >
              Leave Group
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateChatGroupModal;
