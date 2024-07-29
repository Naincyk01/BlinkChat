
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from '../axiosInstance.jsx';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('/groups/findone');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await axios.get('/groups/findgroup');
      setGroups(response.data.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }, []);

  const refetchData = useCallback(() => {
    console.log("hello2")
    fetchUsers();
    fetchGroups();
  }, [fetchUsers, fetchGroups]);

  return (
    <ChatContext.Provider value={{ users, groups, refetchData }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
